import { fetchSearching } from '@actions/Search';
import CardSearchExplore from '@components/card/CardSearchExplore';
import InputGlobalSearch from '@components/input/InputGlobalSearch';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { LottieSearching } from '@components/lottie/lottie';
import { Container, ContentWrapper, EmptyState, Row, Text } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { keywords, monasLocation } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import useCar from '@utils/useCar';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';

sentryBreadcrumb('pages/cari/index');

const ExploreSearch = () => {
  const router = useRouter();

  const inputRef = useRef();
  const [query, setQuery] = useState('');
  const [fullInput, setFullInput] = useState(false);
  const [items, setItems] = useState([]);
  const [initialState, setInitialState] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const { user, isAuthenticated, token, authenticate } = useAuth(); //eslint-disable-line
  const { car, openModalCar, editCar, closeEditCar } = useCar(user, isAuthenticated); //eslint-disable-line

  const [serviceSuggestion, setServiceSuggestion] = useState([]);

  /* Section: Input Box */
  const changeHandler = (e) => {
    if (e.target.value) {
      setQuery(e.target.value);
    }
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 400), []);

  useEffect(() => {
    if (query) {
      setInitialState(false);
      updateSearchCriteria({
        query: query
      });
    }
  }, [query]);

  const onClickInputSearch = () => {
    setFullInput(true);
  };

  /* Section: Edit Location and Car */
  const [geoLocation, setGeoLocation] = useState({
    lat: monasLocation.lat,
    lng: monasLocation.lng
  });

  const initPushRoute = (location) => {
    router.push(
      {
        pathname: router.pathname,
        query: location
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation({
        ...geoLocation,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      initPushRoute({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);

  useEffect(() => {
    if (car?.carVariantId) {
      updateSearchCriteria({
        variant_car_id: car?.carVariantId
      });
    } else {
      updateSearchCriteria({
        lat: geoLocation.lat,
        lng: geoLocation.lng
      });
    }
  }, [geoLocation.lat, geoLocation.lng, car?.carVariantId]);

  const updateSearchCriteria = (main) => {
    const mainPayload = {
      query: encodeURI(main?.query) ?? encodeURI(query),
      variant_car_id: main?.variant_car_id || car?.carVariantId,
      lat: main?.lat ?? geoLocation.lat,
      lng: main?.lng ?? geoLocation.lng,
      limit: 3
    };

    fetchSearchRes(mainPayload);
    getSuggest(mainPayload);
  };

  async function fetchSearchRes(main) {
    if (main?.q?.length == 0) return;

    setServiceSuggestion([]);
    setIsFetching(true);
    setSectionLoading(true);

    const response = await fetchSearching(main);

    const result = {
      workshops: response?.workshops || []
    };

    setItems(result);
    setSectionLoading(false);
    setIsFetching(false);
  }

  const getSuggest = async (suggest) => {
    const response = await api.get(`v2/search/suggest/?limit=5&q=${suggest?.query || ''}`);
    setServiceSuggestion(response?.data?.data);
  };

  /* Section: Selecting Cards Function */
  const handleCardClick = async (section, item) => {
    if (section == 'workshop') {
      handleWorkshopClick(item);
    }
  };

  const handleWorkshopClick = (item) => {
    const params = {
      service_category: 'oli'
    };

    router.push({ pathname: `/bengkel/${item?.slug}`, query: params });
  };

  const renderLoading = () => (
    <div className="empty-state-container">
      <LottieSearching />
      <span className="title text-dark">Memuat Hasil...</span>
    </div>
  );

  const renderStartSearching = () => (
    <EmptyState
      image="/assets/images/search-start-state.png"
      title="Cari Kebutuhan Mobilmu?"
      imgHeight={140}
      imgAlt="Otoklix Search">
      Cari apapun yang mobilmu butuhkan lebih mudah dengan Otoklix. Silahkan masukan kata apapun ke
      dalam kotak pencarian
    </EmptyState>
  );

  const renderItems = () => {
    return renderCards();
  };

  const renderCards = () => {
    return (
      <>
        {items?.workshops?.length > 0 && (
          <ContentWrapper
            title="Bengkel"
            className="mb-2"
            classNameTitle="m-0 mx-3"
            classNameSubtitle="text-decoration-underline">
            {renderItemWorkshop(items?.workshops)}
          </ContentWrapper>
        )}
        {serviceSuggestion?.predictive_word?.length > 0 && (
          <ContentWrapper
            className="mb-2"
            classNameTitle="m-0 mx-3"
            classNameSubtitle="text-decoration-underline">
            {renderItemSuggestion(serviceSuggestion?.predictive_word)}
          </ContentWrapper>
        )}
      </>
    );
  };

  const renderEmptyItems = () => {
    const isEmpty = !items?.workshops?.length && !serviceSuggestion?.predictive_word?.length;

    if (isEmpty) {
      return renderNoData();
    } else {
      return null;
    }
  };

  const renderNoData = () => {
    const image = '/assets/images/logout.png';
    const message = (
      <>
        Coba masukkan lagi nama
        <br />
        bengkel atau jenis servis yang
        <br />
        Anda inginkan ya.
      </>
    );
    return (
      <div className="empty-search-explore">
        <EmptyState
          image={image}
          title={`Duh! Pencarian tidak ditemukan.`}
          imgHeight={200}
          imgAlt="Otoklix Search">
          {message}
        </EmptyState>
      </div>
    );
  };

  const renderItemWorkshop = (data) => {
    return data?.map((item, index) => {
      return (
        <CardSearchExplore
          id={`card_ws_${index}`}
          key={index}
          className="mx-3 mt-3 search-explore"
          title={item?.name || ''}
          rating={item?.rating > 0 && item?.rating}
          ratingImage="/assets/icons/star-orange.svg"
          tierImage={
            item?.tier?.value !== 'non_verified'
              ? item?.tier?.image_link
              : '/assets/icons/non-verified.svg'
          }
          distance={item?.distance && `${item?.distance} km`}
          onClick={() => handleCardClick('workshop', item)}
          data-automation="explore_workshop_name"
        />
      );
    });
  };

  const renderItemSuggestion = (data) => {
    return data?.map((item, index) => {
      return (
        <div
          key={index}
          className="mx-3 mt-3 pointer"
          data-automation="explore_suggestion"
          onClick={() => handleSuggestionClick(item)}>
          <Text color="label" className="otoklix-font-size-sm">
            {item}
          </Text>
        </div>
      );
    });
  };

  const handleSuggestionClick = (values) => {
    const searchStrings = values.split(' ');
    let keywordFound = '';

    for (let index = 0; index < searchStrings.length; index++) {
      const found = keywords.find((keyword) =>
        searchStrings[index].toLowerCase().includes(keyword)
      );
      if (found) {
        keywordFound = generateKeyword(found, searchStrings[index + 1]);
      }

      if (keywordFound) {
        break;
      }
    }

    const params = {
      service_category: generateServiceParams(keywordFound)
    };

    router.push({ pathname: `/bengkel`, query: params });
  };

  const generateKeyword = (key, nextString) => {
    if (key === 'tune' || key === 'body') {
      if (key === 'tune' && nextString?.toLowerCase().includes('up')) {
        return 'tune-up';
      } else if (key === 'body' && nextString?.toLowerCase().includes('repair')) {
        return 'body-repair';
      }
    } else {
      return key;
    }
  };

  const generateServiceParams = (key) => {
    if (key === 'bodyrepair') {
      return 'body-repair';
    } else if (key === 'tuneup') {
      return 'tune-up';
    } else {
      return key;
    }
  };

  useEffect(() => {
    if (query) {
      setQuery(query);
      inputRef.current.value = query;
    }
  }, [query]);

  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full">
      <Container className="global-search-header">
        <Row>
          <div className="d-flex flex-row pointer pt-3">
            <div
              className="me-2 back-search-icon"
              style={{ display: fullInput ? 'none' : 'block' }}
              role="presentation"
              onClick={() => router.back()}
              data-automation="explore_back_button">
              <img src="/assets/icons/back.svg" alt="" />
            </div>

            <div className="w-100">
              <InputGlobalSearch
                innerRef={inputRef}
                onChange={debouncedChangeHandler}
                data-automation="explore_input_search"
                onClick={() => onClickInputSearch()}
                onBlur={() => setFullInput(false)}
              />
            </div>
          </div>
        </Row>
      </Container>
      <Container className="home-content px-0">
        <div>
          {initialState && renderStartSearching()}
          {!initialState && sectionLoading && renderLoading()}
          {!initialState && !sectionLoading && renderItems()}
          {!initialState && !isFetching && renderEmptyItems()}
        </div>
      </Container>
    </PrivateLayout>
  );
};

export default ExploreSearch;
