import { getWorkshopNewList } from '@actions/Workshop';
import ExploreMap from '@components/explore/ExploreMap';
import ExploreHeader from '@components/header/ExploreHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import EditCarModal from '@components/modal/EditCarModal';
import LocationModal from '@components/modal/LocationModal';
import {
  Button,
  CardWorkshopExplore,
  Container,
  Divider,
  Spinner,
  Text
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { monasLocation } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import useCar from '@utils/useCar';
import { unset } from 'lodash';
import assign from 'lodash/assign';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import React from 'react';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import Div100vh from 'react-div-100vh';
import InfiniteScroll from 'react-infinite-scroller';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

sentryBreadcrumb('pages/bengkel/rekomendasi/index');

function Screen(props) {
  const router = useRouter();
  const {
    workshopsInit,
    serviceInit,
    keywords,
    variantCarInit,
    location,
    dataSortings,
    dataFilters
  } = props;

  const tracksRef = useRef(null);
  const defaultServiceInit = serviceInit
    ? serviceInit
    : dataFilters?.service_category[0]
    ? dataFilters?.service_category[0]?.slug
    : 'oli';
  const defaultWsLevel = dataFilters?.workshop[0].slug || 'all';
  const defaultSort = dataSortings[0]?.slug || 'all';

  const { user, isAuthenticated } = useAuth();
  const { car, openModalCar, editCar, closeEditCar } = useCar(user, isAuthenticated);
  const [variantCarId, setVariantCarId] = useState(variantCarInit);

  const [workshops, setWorkshops] = useState(workshopsInit?.data?.workshops);
  const [mapCenter, setMapCenter] = useState(location);
  const [firstCheck, setFirstCheck] = useState(true);
  const [activeTab, setActiveTab] = useState('peta');
  const [hasModalLocation, setHasModalLocation] = useState(false);
  /* eslint-disable no-unused-vars */
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);

  const [hasBottomSheetFilter, setHasBottomSheetFilter] = useState(false);
  const [hasBottomSheetSorting, setHasBottomSheetSorting] = useState(false);

  const [filterCategory, setFilterCategory] = useState(defaultServiceInit);
  const [showFullFilterCategory, setShowFullFilterCategory] = useState(false);
  const [filterWorkshopLevel, setFilterWorkshopLevel] = useState(defaultWsLevel);
  const [filterSorting, setFilterSorting] = useState(defaultSort);
  const [activeServiceInit, setActiveServiceInit] = useState(defaultServiceInit);

  const [geoLocation, setGeoLocation] = useState({
    lat: location.lat,
    lng: location.lng,
    address: ''
  });

  const toggleActiveTab = () => {
    setActiveTab(activeTab === 'peta' ? 'list' : 'peta');
    updateWorkshopList({ restart: true });
  };

  const toggleModalLocation = () => {
    setHasModalLocation(!hasModalLocation);
  };

  const toggleOpenFilter = () => {
    setHasBottomSheetFilter(!hasBottomSheetFilter);
    setHasBottomSheetSorting(false);
  };

  const toggleOpenSorting = () => {
    setHasBottomSheetSorting(!hasBottomSheetSorting);
    setHasBottomSheetFilter(false);
  };

  const onChangeRadio = (item, subData) => {
    if (item === 'category') {
      setFilterCategory(subData?.slug);
    } else if (item === 'wsLevel') {
      setFilterWorkshopLevel(subData?.value);
    } else if (item === 'sort') {
      setFilterSorting(subData?.slug);
    }
  };

  const onChangeFilter = () => {
    gtag('click save', 'clickExploreMapsFilter');
    toggleOpenFilter();
    setHasMoreItems(true);
    setActiveServiceInit(filterCategory);

    updateWorkshopList({ restart: true });

    if (activeTab === 'list') {
      tracksRef?.current?.scrollToTop();
    }
  };

  const onResetFilter = () => {
    setFilterCategory(defaultServiceInit);
    setFilterWorkshopLevel(defaultWsLevel);
  };

  const onChangeSorting = () => {
    toggleOpenSorting();
    setHasMoreItems(true);

    updateWorkshopList({ restart: true });

    if (activeTab === 'list') {
      tracksRef?.current?.scrollToTop();
    }
  };

  const onResetSorting = () => {
    setFilterSorting(defaultSort);
  };

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 55; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setHasModalLocation(!hasModalLocation);

    await getGeocode({ address: suggestion.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setGeoLocation({
          ...geoLocation,
          lat: lat,
          lng: lng,
          address: suggestion.description
        });
        setMapCenter({
          lat: lat,
          lng: lng
        });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const addressLocation = getAddressLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        addressLocation.then((response) => {
          setGeoLocation({
            ...geoLocation,
            lat: response.lat,
            lng: response.lng,
            address: response.address
          });
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        });
      },
      () => {
        const addressLocation = getAddressLocation(location.lat, location.lng);

        addressLocation.then((response) => {
          setGeoLocation({
            ...geoLocation,
            lat: location.lat,
            lng: location.lng,
            address: response.address
          });
          setMapCenter({
            lat: location.lat,
            lng: location.lng
          });
        });
      }
    );
  };

  const handleHighlightWorkshop = (location) => {
    setMapCenter({
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng)
    });
  };

  const handleEditCar = () => {
    const currentPath = router.asPath.split('?')[0];
    if (Helper.isEmptyObj(router.query)) {
      editCar();
    } else {
      editCar(currentPath, router.query);
    }
  };

  const updateRoute = (main) => {
    let paramPushRoute = {
      lat: main?.lat,
      lng: main?.lng,
      variant_car_id: main?.variant_car_id,
      service_category: serviceInit
    };

    if (variantCarId) {
      assign(paramPushRoute, { variant_car_id: variantCarId });
    }

    router.replace(
      {
        pathname: router.pathname,
        query: paramPushRoute
      },
      undefined,
      { shallow: true }
    );

    updateWorkshopList({ restart: true });
  };

  const fetchMoreWorkshops = async (main, extra, restart) => {
    try {
      setIsFetching(true);

      if (restart) {
        if (activeTab === 'list') {
          tracksRef?.current?.scrollToTop();
        }
        setPageIndex(1);
        setHasMoreItems(true);
      }

      getWorkshopNewList(main, extra).then((res) => {
        if (res?.data?.workshops?.length < 4) setHasMoreItems(false);

        if (restart) {
          setWorkshops(res?.data?.workshops);
        } else {
          const workshopsArr = uniqBy([...workshops, ...res?.data?.workshops], 'slug');
          setWorkshops(workshopsArr);
        }

        setIsFetching(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateWorkshopList = (main, extra) => {
    let page;
    if (main.restart) {
      page = 1;
      setWorkshops([]);
    } else {
      page = main?.page ?? pageIndex;
    }

    const mainPayload = {
      keywords: keywords,
      service_category: main?.service_category ?? filterCategory,
      page: page,
      lat: main?.lat ?? geoLocation.lat,
      lng: main?.lng ?? geoLocation.lng,
      show_popularity: true,
      variant_car_id: main?.variant_car_id ?? car?.carVariantId
    };

    let extraFilter = {
      workshop_tier: filterWorkshopLevel
    };

    if (activeTab === 'peta') {
      assign(extraFilter, { sorting: filterSorting });
    } else {
      unset(extraFilter, 'sorting');
    }

    const extraPayload = extra ?? extraFilter;
    if (main.restart) {
      mainPayload.page = 1;
    }
    const restart = main.restart ?? false;
    fetchMoreWorkshops(mainPayload, extraPayload, restart);
  };

  const handleLoadItems = () => {
    setPageIndex(pageIndex + 1);
    setLoading(true);

    updateWorkshopList({ page: pageIndex + 1 });
  };

  const handleOpenWorkshop = (workshop) => {
    gtag('click workshop', 'clickExploreMaps', workshop?.name);

    let query = {
      origin: 'Explore',
      src: 'recommendation'
    };

    if (activeServiceInit) assign(query, { service_category: activeServiceInit });

    if (car) {
      if (car?.carVariantId) {
        assign(query, { variant_car_id: car?.carVariantId });
      }
    }

    if (geoLocation) {
      assign(query, geoLocation);
    }

    router.push({ pathname: `/bengkel/${workshop?.slug}`, query: query });
  };

  const changeMapCenter = (e) => {
    setMapCenter({
      lat: e.lat,
      lng: e.lng
    });

    !isFetching &&
      hasMoreItems &&
      updateWorkshopList({
        lat: e.lat,
        lng: e.lng,
        restart: true
      });
  };

  const convertValue = (item, isPoint) => {
    let value;
    let isShowPrice = isAuthenticated && car;

    const services = item?.service_categories;
    const active = filter(services, (service) => {
      return service?.value === activeServiceInit;
    });

    if (isPoint) {
      value = isShowPrice
        ? Helper.formatMoney(active[0]?.otopoints)
        : Helper.hidePrice(Helper.formatMoney(active[0]?.otopoints));
    } else {
      value = isShowPrice
        ? Helper.formatMoney(active[0]?.minimum_price)
        : Helper.hidePrice(Helper.formatMoney(active[0]?.minimum_price));
    }

    return value;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        const addressLocation = getAddressLocation(lat, lng);

        addressLocation.then((response) => {
          setGeoLocation({
            ...geoLocation,
            lat: response.lat,
            lng: response.lng,
            address: response.address
          });
          setMapCenter({
            lat: response.lat,
            lng: response.lng
          });
        });
      },
      () => {
        const addressLocation = getAddressLocation(location.lat, location.lng);

        addressLocation.then((response) => {
          setGeoLocation({
            ...geoLocation,
            address: response.address
          });
        });
      }
    );
  }, []);

  useEffect(() => {
    gtag('view ws', 'viewSearchWs', serviceInit);
    gtag('view explore maps', 'viewExploreMaps');
  }, []);

  useEffect(() => {
    const lat = geoLocation.lat;
    const lng = geoLocation.lng;

    let needUpdate = false;
    const locationHasDiff = location.lat != lat || location.lng != lng;

    if (locationHasDiff) {
      needUpdate = true;
      setFirstCheck(false);
    } else if (!locationHasDiff && !firstCheck) {
      needUpdate = true;
    } else if (car?.carVariantId && car?.carVariantId !== variantCarId) {
      setVariantCarId(car?.carVariantId);
      needUpdate = true;
    }

    if (needUpdate) {
      updateRoute({
        lat,
        lng,
        variant_car_id: car?.carVariantId
      });
    }

    !isFetching &&
      locationHasDiff &&
      updateWorkshopList({
        variant_car_id: car?.carVariantId ?? variantCarId,
        restart: true,
        lat: lat,
        lng: lng
      });
  }, [geoLocation.lat, geoLocation.lng, car?.carVariantId]);

  const loader = (
    <div className="d-flex justify-content-center p-3 mb-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  return (
    <PrivateLayout
      hasAppBar={true}
      pathName="/bengkel"
      title={Helper.exploreMetaTags('bengkel')?.title}
      description={Helper.exploreMetaTags('bengkel')?.desc}>
      <EditCarModal isOpen={openModalCar} closeHasNewCar={closeEditCar} />

      <Div100vh>
        <div className={activeTab === 'list' ? 'explore-map__active-header' : ''}>
          <ExploreHeader
            serviceInit={activeServiceInit}
            geoLocation={geoLocation}
            toggleModalLocation={toggleModalLocation}
            toggleActiveTab={toggleActiveTab}
            activeTab={activeTab}
            toggleOpenFilter={toggleOpenFilter}
            toggleOpenSorting={toggleOpenSorting}
            handleEditCar={handleEditCar}
            car={car}
          />
        </div>
        {activeTab === 'peta' ? (
          <Scrollbars
            autoHide
            autoHeight
            autoHeightMin="75vh"
            universal={true}
            onUpdate={onScrollUpdate}
            ref={tracksRef}>
            <InfiniteScroll
              threshold={500}
              pageStart={0}
              loadMore={handleLoadItems}
              hasMore={hasMoreItems && !loading}
              useWindow={false}>
              <div className="tracks" style={{ padding: '0' }}>
                <Container className="pb-5">
                  <Text tag="div" className="fw-bold mb-3">
                    Bengkel Rekomendasi
                  </Text>

                  {workshops.length > 0 &&
                    workshops.map((item) => {
                      return (
                        <div
                          className="mb-3 pointer"
                          key={item?.name}
                          onClick={() => handleOpenWorkshop(item)}>
                          <CardWorkshopExplore
                            title={item?.name}
                            tierImage={item?.tier?.image_link}
                            region={item?.kecamatan}
                            distance={item?.distance?.toString() + ' Km'}
                            price={'Rp' + convertValue(item)}
                            pointIcon="/assets/images/bigcoin.png"
                            point={convertValue(item, true)}
                            image={item?.image_link}
                            rating={item?.rating}
                            totalReview={item?.total_review}
                            ratingIcon="/assets/icons/star-orange.svg"
                          />
                        </div>
                      );
                    })}

                  {workshops.length < 1 && !loading && (
                    <div className="d-flex justify-content-center my-3">
                      <h6>Bengkel tidak ditemukan.</h6>
                    </div>
                  )}

                  {hasMoreItems && isFetching ? loader : null}
                </Container>
              </div>
            </InfiniteScroll>
          </Scrollbars>
        ) : (
          <div className="explore-map__wrapper">
            {geoLocation && (
              <ExploreMap
                serviceActive={activeServiceInit}
                mapCenter={mapCenter}
                workshops={workshops}
                geoLocation={geoLocation}
                userCar={car}
                isTracking={false}
                resetLocation={goToCurrentLocation}
                loadMoreWorkshops={handleLoadItems}
                openWorkshop={handleOpenWorkshop}
                onMapCenterChange={changeMapCenter}
                onHighlightWorkshop={handleHighlightWorkshop}
              />
            )}
          </div>
        )}
      </Div100vh>

      <LocationModal
        toggle={() => setHasModalLocation(!hasModalLocation)}
        isOpen={hasModalLocation}
        handleSelectSuggestion={handleSelectSuggestion}
      />

      <BottomSheet
        className="box-mobile-first bottom-sheet-filter"
        open={hasBottomSheetFilter}
        snapPoints={({ maxHeight }) => (showFullFilterCategory ? [maxHeight] : [600])}
        skipInitialTransition
        scrollLocking={false}
        blocking={false}
        onDismiss={toggleOpenFilter}
        header={
          <Container className="d-flex justify-content-between bottom-sheet-filter--header">
            <Text>Filter</Text>
            <Button color="link" className="text-success shadow-none p-0" onClick={onResetFilter}>
              Reset
            </Button>
          </Container>
        }>
        <Scrollbars autoHide universal={true} autoHeight autoHeightMax="87vh">
          <Container className="bottom-sheet-filter--body">
            <div>
              <Text className="title">Servis</Text>
              {dataFilters?.service_category
                ?.slice(0, showFullFilterCategory ? dataFilters?.service_category.length : 4)
                .map((item, key) => (
                  <div className="d-flex justify-content-between flex-row-reverse mt-3" key={key}>
                    <input
                      id={`servis-${item?.slug}`}
                      name="servis"
                      type="radio"
                      value={item?.slug}
                      checked={filterCategory === item.slug}
                      onChange={() => onChangeRadio('category', item)}
                    />
                    <label className="radio-label" htmlFor={`servis-${item?.slug}`}>
                      <div className="radio-text">{item.name}</div>
                    </label>
                  </div>
                ))}

              <div
                className="selengkapnya"
                onClick={() => setShowFullFilterCategory(!showFullFilterCategory)}>
                <Divider />
                <div>
                  {showFullFilterCategory ? (
                    <>
                      <img src="/assets/icons/double-chevron-up.svg" alt="" />
                      <Text>Sedikit</Text>
                    </>
                  ) : (
                    <>
                      <Text>Selengkapnya</Text>
                      <img src="/assets/icons/double-chevron-down.svg" alt="" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Divider />
              <Text className="title">Level Bengkel</Text>
              {dataFilters?.workshop.map((item, key) => (
                <div className="d-flex justify-content-between flex-row-reverse mt-4" key={key}>
                  <input
                    id={`wslevel-${item?.value}`}
                    name="wslevel"
                    type="radio"
                    value={item?.value}
                    checked={filterWorkshopLevel === item.value}
                    onChange={() => onChangeRadio('wsLevel', item)}
                  />
                  <label className="radio-label" htmlFor={`wslevel-${item?.value}`}>
                    <div className="d-flex">
                      <div className="radio-text">{item.name}</div>
                      {item?.image_link && (
                        <img className="ms-2" src={item.image_link} alt="" width={20} height={20} />
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <Button color="primary" block className="mt-3" onClick={() => onChangeFilter()}>
              Terapkan
            </Button>
          </Container>
        </Scrollbars>
      </BottomSheet>

      <BottomSheet
        className="box-mobile-first bottom-sheet-filter"
        open={hasBottomSheetSorting}
        snapPoints={() => [570]}
        skipInitialTransition
        scrollLocking={false}
        blocking={false}
        onDismiss={toggleOpenSorting}
        header={
          <Container className="d-flex justify-content-between bottom-sheet-filter--header">
            <Text>Urutan</Text>
            <Button color="link" className="text-success shadow-none p-0" onClick={onResetSorting}>
              Reset
            </Button>
          </Container>
        }>
        <Container className="bottom-sheet-filter--body p-3">
          {dataSortings.map((item, key) => (
            <div className="d-flex justify-content-between flex-row-reverse mt-4" key={key}>
              <input
                id={`sort-${item?.slug}`}
                name="sort"
                type="radio"
                value={item?.slug}
                checked={filterSorting === item.slug}
                onChange={() => onChangeRadio('sort', item)}
              />
              <label className="radio-label" htmlFor={`sort-${item?.slug}`}>
                <div className="radio-text">{item.name}</div>
              </label>
            </div>
          ))}

          <Button color="primary" block className="mt-3" onClick={() => onChangeSorting()}>
            Terapkan
          </Button>
        </Container>
      </BottomSheet>
    </PrivateLayout>
  );
}

export default Screen;

export async function getServerSideProps({ query }) {
  const { service_category, keywords, lat, lng, variant_car_id } = query;
  const queryLocation = lat && lng;

  let variantCarId;
  if (!isNaN(parseInt(variant_car_id))) {
    variantCarId = parseInt(variant_car_id);
  }

  const location = {
    lat: queryLocation ? Number(lat) : monasLocation.lat,
    lng: queryLocation ? Number(lng) : monasLocation.lng
  };

  const workshopPayload = {
    keywords,
    lat: location.lat,
    lng: location.lng,
    show_popularity: true,
    service_category: service_category,
    variant_car_id: variantCarId
  };

  const [serviceCategoriesRes, workshopsRes, sortingRes, filterRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/search/filter_options/`),
    getWorkshopNewList(workshopPayload),
    fetch(`${process.env.API_URL}v2/search/list-sorting/`),
    fetch(`${process.env.API_URL}v2/search/service-category-workshop/`)
  ]);

  const [services, sortings, filters] = await Promise.all([
    serviceCategoriesRes.json(),
    sortingRes.json(),
    filterRes.json()
  ]);
  const workshopsInit = workshopsRes;
  const servicesInit = services?.data?.service_categories || [];
  const serviceInit = Helper.getServiceInit(service_category, servicesInit);

  return {
    props: {
      keywords: keywords || null,
      serviceInit,
      workshopsInit,
      location,
      variantCarInit: variantCarId || null,
      dataSortings: sortings?.data?.sorting,
      dataFilters: filters?.data
    }
  };
}
