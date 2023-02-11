import Breadcrumb from '@components/breadcrumb/Breadcrumb';
import { AboutFooter, Footer } from '@components/footer/Footer';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { useAuth } from '@contexts/auth';
import AmplitudeEvent from '@utils/AmplitudeEvent';
import { BranchTracker } from '@utils/BranchTracker';
import { faqsWorkshop, gambirLocation, tabListServiceCategory } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import MoEngage from '@utils/MoEngage';
import useCar from '@utils/useCar';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CardImg from 'otoklix-elements/lib/components/card/CardImg';
import CardWorkshopExplore from 'otoklix-elements/lib/components/card/CardWorkshopExplore';
import Container from 'otoklix-elements/lib/components/container/Container';
import EmptyState from 'otoklix-elements/lib/components/empty/EmptyState';
import Row from 'otoklix-elements/lib/components/row/Row';
import ContentWrapper from 'otoklix-elements/lib/components/wrapper/ContentWrapper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const FilterBottomsheetSort = dynamic(() => import('@components/filter/FilterBottomsheetSort'));
const FlagshipModal = dynamic(() => import('@components/modal/FlagshipModal'));
const LocationModal = dynamic(() => import('@components/modal/LocationModal'));
const ButtonPagination = dynamic(() => import('@components/button/ButtonPagination'));
const ListLocation = dynamic(() => import('@components/list/LocationList'));
const Tab = dynamic(() => import('@components/tab/Tab'));
const Skeleton = dynamic(() => import('@components/skeleton/Skeleton'));
const ServiceLocation = dynamic(() => import('@components/location/ServiceLocation'));
const Uppersheet = dynamic(() => import('@components/sheet/UpperSheet'));
const ScrollMenu = dynamic(() => import('react-horizontal-scrolling-menu'));
const SearchHeader = dynamic(() => import('@components/bengkel/SearchHeader'));

const Index = (props) => {
  const { topServices, serviceCategory, page, pageContent, workshopList } = props;

  const listServiceCategory = pageContent?.service_category ?? tabListServiceCategory;
  const router = useRouter();
  const inputRef = useRef();
  const limit = 16;
  const totalWorkshops = workshopList?.pagination?.total_rows;

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const { user, isAuthenticated } = useAuth();
  const { car } = useCar(user, isAuthenticated);

  const getGeolocation = Cookies.get('geoLocation');
  const currentPath = router.pathname;
  const currentQuery = { ...router.query };

  const [query, setQuery] = useState('');
  const [address, setAddress] = useState('');
  const [geoLocation, setGeoLocation] = useState(gambirLocation);
  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [fullInput, setFullInput] = useState(false);
  const [sectionLoading] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('closest');
  const [showSorting, setShowSorting] = useState(false);
  const [showPagination, setShowPagination] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');
  const [showUpperSheet, setShowUpperSheet] = useState(true);

  const categoryServices = 'oli';

  const breadcrumbList = [
    { id: 1, name: 'Beranda', path: '/servis' },
    {
      id: 2,
      name: 'Bengkel',
      path: ''
    }
  ];

  const paramsSwr = {
    initial: false,
    page: pageIndex,
    limit,
    search: query,
    sorting: selectedFilter,
    service_category: serviceCategory,
    latitude: geoLocation?.lat,
    longitude: geoLocation?.lng
  };

  const optionsSwr = {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false
  };

  const { data, mutate, isValidating } = useSWR(
    `${process.env.API_URL}v2/search/workshops/?${Helper.objectToQueryString(paramsSwr)}`,
    Helper.fetcher,
    optionsSwr
  );

  const onKeyUpSearch = (e) => {
    if (e.keyCode === 8 && e.target.value.length === 0) {
      setQuery('');
      const paramsSwrMutate = {
        initial: false,
        page: pageIndex,
        limit,
        search: '',
        sorting: selectedFilter,
        service_category: serviceCategory,
        latitude: geoLocation?.lat,
        longitude: geoLocation?.lng
      };
      mutate(
        `${process.env.API_URL}v2/search/workshops/?${Helper.objectToQueryString(paramsSwrMutate)}`
      );
    }
  };

  const changeHandler = (e) => {
    if (e.target.value) {
      setQuery(e.target.value);
    }
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 400), []);

  const onClickInputSearch = () => {
    setFullInput(true);
    gtag('click input search', 'clickSearchPage');
  };

  const handleFilter = () => {
    setOpenSort(true);
    AmplitudeEvent.track('sort initiated', {
      sorted_section: 'product',
      position: 'dynamic search'
    });
  };

  const setFirstPage = () => {
    setPageIndex(1);
    pagginationRouteHandler(1);
  };

  const handleApplyFilter = (e) => {
    setSelectedFilter(e);
    setFirstPage();
    setOpenSort(false);
    AmplitudeEvent.track('sort submitted', {
      sorted_by_value: Helper.getNameSorted(e),
      sorted_section: 'product',
      position: 'dynamic search'
    });
  };

  const handleWorkshopClick = (item) => {
    AmplitudeEvent.track('search result selected', {
      search_category: activeTab === 'all' ? 'semua' : activeTab,
      source_list: 'dynamic search',
      search_result: item?.name
    });
    router.push({ pathname: `/bengkel/${item?.slug}` });
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
  };

  const scrollToTop = () => {
    const elm = document.getElementById('breadrumbDynamicSearch');
    elm.scrollIntoView({ behavior: 'smooth' });
  };

  const pagginationRouteHandler = (e) => {
    currentQuery.page = e;

    if (+currentQuery.page === 1) {
      delete currentQuery.page;
      router.push(
        {
          pathname: currentPath,
          query: currentQuery
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(
        {
          pathname: currentPath,
          query: currentQuery
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleClickTab = (item) => {
    setActiveTab(item?.slug);
    setFirstPage();
  };

  const handleButtonPagination = (e) => {
    setPageIndex(e);
    pagginationRouteHandler(e);
    scrollToTop();
  };

  const getAddress = async () => {
    const addressLocation = getAddressLocation(geoLocation?.lat, geoLocation?.lng);
    await addressLocation.then((response) => {
      setAddress(response.address);
    });
  };

  const handleSelectLocation = (suggestion) => {
    setHasModalLocation(!hasModalLocation);
    setAddress(suggestion.description);
    getGeocode({ address: suggestion.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setGeoLocation({
          ...geoLocation,
          lat: lat,
          lng: lng,
          address: suggestion.description
        });
        Cookies.set('geoLocation', { lat: lat, lng: lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const handleEditLocation = () => {
    setHasModalLocation(!hasModalLocation);
    gtag('click cari di sekitar', 'clickSearchPage');
  };

  const renderWorkshop = () => {
    const dataList = data?.data?.workshops;
    if (dataList?.length > 0) {
      return dataList.map((item, index) => {
        return (
          <div className="mx-2 my-3 pointer" key={item.id}>
            <CardWorkshopExplore
              className="m-3 card-ws-search border-0 pointer"
              isShowDistance
              isShowOtopoints={false}
              isHavePrimaryPrice={false}
              tags={map(item?.service_categories, 'name')}
              region={Helper.shortText(item?.kecamatan, 20)}
              title={Helper.shortText(item?.name, 25)}
              image={item?.image_link}
              imgAlt={item?.name}
              rating={item?.rating}
              ratingIcon="/assets/icons/star-orange.svg"
              totalReview={item?.total_review}
              distance={item?.distance?.toString() + 'Km'}
              estimate={item?.eta + ' menit'}
              data-automation={`search_service_card_workshop_${index}`}
              onCardClick={() => handleWorkshopClick(item)}
              showFlagship={item?.tier?.name?.includes('Flagship')}
              flagshipIcon={`/assets/icons/${
                item?.tier?.name === 'Flagship' ? 'flagship' : 'flagship-plus'
              }.svg`}
              isFlagshipPlus={item?.tier?.name?.toLowerCase() === 'flagship plus'}
              flagshipDetailTarget={() => handleOpenPopUp(item?.tier?.name)}
            />
          </div>
        );
      });
    }
    if (dataList?.length === 0) {
      return (
        <EmptyState
          image="/assets/images/sorry.png"
          title="Ups! Pencarian Tidak Ditemukan"
          imgHeight={140}
          imgAlt="Otoklix Search">
          Coba ulangi pencarianmu dengan memasukkan kata kunci lain
        </EmptyState>
      );
    }
  };

  const onClickBanner = (caption, location) => {
    AmplitudeEvent.track('banner selected', {
      banner_caption: caption,
      cta_location: location,
      page_location: fullPath
    });
  };

  useEffect(() => {
    if (query) {
      AmplitudeEvent.track('search performed', {
        search_keyword: query,
        search_category: activeTab === 'all' ? 'semua' : activeTab,
        source_search: 'dynamic search'
      });
    }

    if (activeTab) {
      AmplitudeEvent.track('service sub category selected', {
        page_location: fullPath,
        service_category: 'bengkel',
        service_sub_category: activeTab === 'all' ? 'semua' : activeTab
      });
    }

    if (categoryServices) {
      scrollToTop();
      AmplitudeEvent.track('screen viewed', {
        screen_name: 'dynamic search',
        screen_category: 'browse',
        page_location: fullPath
      });
      MoEngage.trackEvent('screen viewed', {
        screen_name: 'dynamic search',
        page_location: fullPath
      });
    }

    if (page) {
      setPageIndex(page);
      pagginationRouteHandler(page);
    }
  }, [query, activeTab, categoryServices, page]);

  useEffect(() => {
    scrollToTop();
  }, [isValidating]);

  useEffect(() => {
    if (data?.pagination?.total_rows > 1) {
      setShowSorting(true);
    } else {
      setShowSorting(false);
    }
    if (data?.pagination?.total_rows <= 16) {
      setShowPagination(false);
    } else {
      setShowPagination(true);
      AmplitudeEvent.track('workshop list viewed', {
        service_category_name: activeTab === 'all' ? 'semua' : activeTab,
        source_list: 'dynamic search',
        total_workshop_viewed: data?.data?.workshops?.length,
        page_location: fullPath
      });
    }
  }, [data]);

  useEffect(() => {
    getAddress();
    navigator.geolocation.getCurrentPosition((position) => {
      const paramsGeoLocation = {
        ...geoLocation,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setGeoLocation(paramsGeoLocation);
      Cookies.set('geoLocation', paramsGeoLocation);
    });
    const paramsSwrMutate = {
      initial: false,
      page: pageIndex,
      limit,
      search: '',
      sorting: selectedFilter,
      service_category: categoryServices,
      latitude: geoLocation?.lat,
      longitude: geoLocation?.lng
    };
    mutate(
      `${process.env.API_URL}v2/search/workshops/?${Helper.objectToQueryString(paramsSwrMutate)}`
    );

    BranchTracker('SEARCH', { name_of_pages: 'dynamic search workshop' });
  }, []);

  useEffect(() => {
    getAddress();
  }, [geoLocation]);

  useEffect(() => {
    if (!isUndefined(getGeolocation)) {
      setGeoLocation(JSON.parse(getGeolocation));
    }
  }, [getGeolocation]);

  useEffect(() => {
    if (!isNull(serviceCategory)) {
      setActiveTab(serviceCategory);
    } else {
      setActiveTab('all');
    }
  }, [serviceCategory]);

  const jsonData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsWorkshop.map((data) => ({
      '@type': 'Question',
      name: data.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: data.answer
      }
    }))
  };

  const jsonDataWorkshop = () =>
    workshopList?.data?.workshops?.map((workshop, index) => {
      if (workshop?.rating > 0 && workshop?.total_review > 0) {
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org/',
                '@type': 'AutoRepair',
                name: workshop?.name,
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: workshop?.rating,
                  reviewCount: workshop?.total_review,
                  bestRating: 5,
                  worstRating: 1
                },
                url: `${process.env.APP_URL}bengkel/${workshop?.slug}`,
                image: workshop?.image_link,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: workshop?.street_address?.split(',')?.[0],
                  addressCountry: 'Indonesia',
                  addressRegion: workshop?.city,
                  streetAddress: workshop?.street_address,
                  postalCode: workshop?.postal_code ?? ''
                },
                keywords: workshop?.service_categories?.map((category) => {
                  return category?.name;
                })
              })
            }}
          />
        );
      } else {
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org/',
                '@type': 'AutoRepair',
                name: workshop?.name,
                url: `${process.env.APP_URL}bengkel/${workshop?.slug}`,
                image: workshop?.image_link,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: workshop?.street_address?.split(',')?.[0],
                  addressCountry: 'Indonesia',
                  addressRegion: workshop?.city,
                  streetAddress: workshop?.street_address,
                  postalCode: workshop?.postal_code ?? ''
                },
                keywords: workshop?.service_categories?.map((category) => {
                  return category?.name;
                })
              })
            }}
          />
        );
      }
    });

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonData)
          }}
        />
        {jsonDataWorkshop()}
      </Head>
      <PrivateLayout
        hasAppBar={false}
        hasOtobuddy
        title={`${totalWorkshops ? `${totalWorkshops} ` : ''}${pageContent?.meta_title}`}
        description={pageContent?.meta_description}
        wrapperClassName="dynamic-search">
        <span id="breadrumbDynamicSearch"></span>
        <Container className="global-search-header px-0" id="globalSearchDynamic">
          {showUpperSheet && (
            <Uppersheet
              buttonText="Download"
              desc="BONUS 35.000 OtoPoints dengan melengkapi profil di aplikasi Otoklix!"
              icon="/assets/icons/call.png"
              handleOpen={() => router.push(`${process.env.BRANCH_LINK}servis`)}
              handleCloseSheet={() => setShowUpperSheet(false)}
              page="dynamic-search"
              closeIcon="/assets/icons/close-white.svg"
            />
          )}
          <SearchHeader
            fullInput={fullInput}
            sectionLoading={sectionLoading}
            inputRef={inputRef}
            debouncedChangeHandler={debouncedChangeHandler}
            onClickInput={onClickInputSearch}
            updateInput={(val) => setFullInput(val)}
            onKeyUpSearch={(val) => onKeyUpSearch(val)}
          />
        </Container>
        <Container>
          {pageContent?.top_banner?.image_link ? (
            <Link href={pageContent?.top_banner?.page_url ?? '#'} passHref>
              <a onClick={() => onClickBanner(pageContent?.top_banner?.caption, 'top')}>
                <CardImg
                  width="100%"
                  height={158}
                  className="mb-3 pointer img-fit"
                  alt={pageContent?.top_banner?.caption}
                  src={pageContent?.top_banner?.image_link}
                />
              </a>
            </Link>
          ) : (
            ''
          )}
          <ContentWrapper className="container-content mb-0">
            <h1>{pageContent?.title}</h1>
            <p className="mb-0 pb-0">{pageContent?.description}</p>
          </ContentWrapper>
        </Container>
        <ScrollMenu
          alignCenter={false}
          data={listServiceCategory.map((item, index) => {
            const redirected = item?.slug !== 'all';
            const newItem = {
              ...item,
              path: !redirected ? `${currentPath}` : `${currentPath}?service_category=${item?.slug}`
            };
            return (
              <Tab
                key={index}
                active={item?.slug === activeTab}
                item={newItem}
                onTabClick={() => handleClickTab(item)}
              />
            );
          })}
        />
        <Container>
          <ContentWrapper
            title={<ServiceLocation address={address} onEditLoc={handleEditLocation} />}
            subtitle={
              showSorting && (
                <div>
                  <img src="/assets/icons/swap.svg" className="filter-icon" alt="filter" />
                  <span className="fw-bold mb-0 ml-05">Urutkan</span>
                </div>
              )
            }
            subtitleClick={() => handleFilter()}
            className="mt-4">
            <div id="containerProductList">{renderWorkshop()}</div>
            {isValidating || isUndefined(data)
              ? [...Array(4).keys()].map((value) => (
                  <Skeleton width="100%" height={152} className="br-05 my-3" key={value} />
                ))
              : ''}
            <div style={!showPagination ? { display: 'none' } : {}}>
              <ButtonPagination
                onClick={(e) => handleButtonPagination(e)}
                page={data?.pagination}
                initialPage={pageIndex}
              />
            </div>
            <Breadcrumb list={breadcrumbList} />
          </ContentWrapper>
          <ListLocation list={pageContent?.area_list} />
        </Container>
        <Container>
          <Row>
            <Footer
              faqs={faqsWorkshop}
              title={`Mengapa Booking ${pageContent?.title} via Otoklix?`}
            />
          </Row>
        </Container>
        <Container className="mb-3">
          {pageContent?.bottom_banner?.image_link ? (
            <Link href={pageContent?.bottom_banner?.page_url ?? '#'} passHref>
              <a>
                <div
                  className="banner-dynamic cursor-pointer"
                  onClick={() => onClickBanner(pageContent?.bottom_banner?.caption, 'bottom')}>
                  <img
                    className="cursor-pointer"
                    src={pageContent?.bottom_banner?.image_link}
                    alt={pageContent?.bottom_banner?.caption}
                    width="100%"
                    height={75}
                  />
                </div>
              </a>
            </Link>
          ) : (
            ''
          )}
        </Container>
        <AboutFooter topServices={topServices} />
        <FilterBottomsheetSort
          open={openSort}
          value={selectedFilter}
          isWorkshop
          pageName="search page"
          onClose={() => setOpenSort(false)}
          onApply={(e) => handleApplyFilter(e)}
          hasCar={car?.carVariantId}
        />
        <LocationModal
          toggle={() => setHasModalLocation(!hasModalLocation)}
          isOpen={hasModalLocation}
          handleSelectSuggestion={handleSelectLocation}
          fullPath={fullPath}
          pageName={'home page'}
        />
        <FlagshipModal
          showFlagshipModal={showPopupInfo}
          closeFlagshipModal={() => setShowPopupInfo(false)}
          tier={tier}
        />
      </PrivateLayout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { service_category, page } = query;

  const paramsSwr = {
    initial: false,
    page: page ?? 1,
    limit: 16,
    search: '',
    sorting: 'closest',
    service_category: service_category
  };

  const [pageContentRes, topServicesRes, workshopListRes] = await Promise.all([
    fetch(
      `${process.env.API_URL}v2/search/workshops/?service_category=${
        service_category ?? ''
      }&initial=true`
    ),
    fetch(`${process.env.API_URL}v2/product/tags/top-services`),
    fetch(`${process.env.API_URL}v2/search/workshops/?${Helper.objectToQueryString(paramsSwr)}`)
  ]);
  const [pageContent, topServices, workshopList] = await Promise.all([
    pageContentRes.json(),
    topServicesRes.json(),
    workshopListRes.json()
  ]);

  return {
    props: {
      pageContent: pageContent?.data || null,
      page: page || 1,
      serviceCategory: service_category || null,
      topServices: topServices || [],
      workshopList: workshopList || []
    }
  };
}

export default Index;
