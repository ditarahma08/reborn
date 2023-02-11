import { getWorkshopNewList } from '@actions/Workshop';
import ExploreMap from '@components/explore/ExploreMap';
import ExploreHeader from '@components/header/ExploreHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import EditCarModal from '@components/modal/EditCarModal';
import FlagshipModal from '@components/modal/FlagshipModal';
import LocationModal from '@components/modal/LocationModal';
import RemovePromoModal from '@components/modal/RemovePromoModal';
import {
  Button,
  CardWorkshopExplore,
  Col,
  Container,
  Divider,
  EmptyState,
  Spinner,
  Text
} from '@components/otoklix-elements';
import WatchImpression from '@components/watch-impression/WatchImpression';
import { useAuth } from '@contexts/auth';
import { monasLocation } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import useCar from '@utils/useCar';
import amplitude from 'amplitude-js';
import { unset } from 'lodash';
import assign from 'lodash/assign';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import querystring from 'querystring';
import React from 'react';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import Div100vh from 'react-div-100vh';
import InfiniteScroll from 'react-infinite-scroller';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

sentryBreadcrumb('pages/servis/[slug]');

function Screen(props) {
  const router = useRouter();
  const {
    workshopsInit,
    serviceInit,
    keywords,
    promo,
    promoData,
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
  const [promoIsEligible, setPromoIsEligible] = useState(true);
  const [showChangePromoModal, setShowChangePromoModal] = useState(false);
  const [heightOfHeader, setHeightOfHeader] = useState(0);
  const [heightOfFooter, setHeightOfFooter] = useState(0);
  const [workshopImpression, setWorkshopImpression] = useState([]);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');

  const [geoLocation, setGeoLocation] = useState({
    lat: location.lat,
    lng: location.lng,
    address: ''
  });

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const toggleActiveTab = () => {
    setActiveTab(activeTab === 'peta' ? 'list' : 'peta');
    amplitude.getInstance().logEvent('explore workshop list refined', { refine_type: activeTab });
    updateWorkshopList({ restart: true });
  };

  const toggleModalLocation = () => {
    setHasModalLocation(!hasModalLocation);
  };

  const toggleOpenFilter = () => {
    amplitude.getInstance().logEvent('explore workshop list refined', { refine_type: 'filter' });
    setHasBottomSheetFilter(!hasBottomSheetFilter);
    setHasBottomSheetSorting(false);
  };

  const toggleOpenSorting = () => {
    amplitude.getInstance().logEvent('explore workshop list refined', { refine_type: 'sorting' });
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
      service_category: serviceInit,
      promo: promo,
      promo_id: main?.promo_id
    };

    if (variantCarId) {
      assign(paramPushRoute, { variant_car_id: variantCarId });
    }

    const currentPath = router.asPath.split('?')[0];

    router.replace(
      {
        pathname: currentPath,
        query: paramPushRoute
      },
      undefined,
      { shallow: true }
    );
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

        if (res?.message_code === 'promo_is_not_eligible') {
          setPromoIsEligible(false);
        }

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
      setWorkshopImpression([]);
    } else {
      page = main?.page ?? pageIndex;
    }

    const mainPayload = {
      keywords: keywords,
      service_category: main?.service_category ?? filterCategory,
      page: page,
      lat: main?.lat ?? geoLocation.lat,
      lng: main?.lng ?? geoLocation.lng,
      variant_car_id: main?.variant_car_id ?? car?.carVariantId,
      promo: main.promo ?? promo
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

  const handleOpenWorkshop = (workshop, index) => {
    gtag('click workshop', 'clickExploreMaps', workshop?.name);

    amplitude.getInstance().logEvent('explore workshop list selected', {
      workshop_name: workshop?.name,
      workshop_id: workshop?.id
    });

    let query = {
      origin: 'Explore'
    };

    if (activeServiceInit) assign(query, { service_category: activeServiceInit });

    if (promo) {
      assign(query, { promo });
    }

    if (index + 1) {
      triggeredTrackingWorkshopClick(workshop, index);
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

  const onChangePromo = () => {
    setShowChangePromoModal(false);

    let query = {};

    if (activeServiceInit) {
      assign(query, { service_category: activeServiceInit });
    }

    const params = querystring.stringify(query);

    window.location.href = `/bengkel?${params}`;
  };

  const handlePushWorkshopImpression = (impressionList) => {
    triggeredTrackingWorkshopImpression(impressionList);
  };

  const triggeredTrackingWorkshopImpression = (impressionList) => {
    if (impressionList?.length > 0) {
      const url = new URL(window.location.href);
      GtmEvents.gtmPromoImpressionsServiceServisBengkel(
        impressionList,
        'Workshop',
        'Bengkel Servis',
        url,
        filterCategory,
        dataFilters?.service_category,
        car,
        promo,
        geoLocation
      );
    }
  };

  const triggeredTrackingWorkshopClick = (workshop, index) => {
    const url = new URL(window.location.href);
    workshop.position = index + 1;
    GtmEvents.gtmPromoClickServiceServisBengkel(
      [workshop],
      'Workshop',
      'Bengkel Servis',
      url,
      filterCategory,
      dataFilters?.service_category,
      car,
      promo,
      geoLocation
    );
  };

  const handleChangeMargin = () => {
    if (typeof document !== 'undefined') {
      if (hasBottomSheetFilter || hasBottomSheetSorting) {
        setTimeout(() => {
          setHeightOfFooter(document?.querySelectorAll('[role="dialog"]')[0]?.clientHeight ?? 0);
        }, 300);
      } else {
        setHeightOfHeader(document?.querySelector('#headerService')?.clientHeight ?? 0);
        setHeightOfFooter(document?.querySelector('.appbar')?.clientHeight ?? 0);
      }
    }
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
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

    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'explore',
      screen_category: 'browse',
      page_location: fullPath
    });
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
        variant_car_id: car?.carVariantId,
        promo_id: router?.query?.promo_id
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

  useEffect(() => {
    if (workshopsInit?.message_code === 'promo_is_not_eligible') {
      setPromoIsEligible(false);
    }
  }, []);

  useEffect(() => {
    handleChangeMargin();
  }, [hasBottomSheetFilter, hasBottomSheetSorting]);

  const loader = (
    <div className="d-flex justify-content-center p-3 mb-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  return (
    <PrivateLayout
      hasAppBar={true}
      pathName="/bengkel"
      title={Helper.exploreMetaTags(serviceInit)?.title}
      description={Helper.exploreMetaTags(serviceInit)?.desc}>
      <EditCarModal isOpen={openModalCar} closeHasNewCar={closeEditCar} />

      <RemovePromoModal
        promoCode={promo}
        isOpen={showChangePromoModal}
        toggle={() => setShowChangePromoModal(!showChangePromoModal)}
        onClickYes={() => onChangePromo()}
      />

      <Div100vh>
        <div
          id="headerService"
          className={activeTab === 'list' ? 'explore-map__active-header' : ''}>
          <ExploreHeader
            serviceInit={activeServiceInit || serviceInit}
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
                    {promoData?.name}
                  </Text>

                  {workshops.length > 0 &&
                    workshops.map((item, index) => {
                      return (
                        <div
                          className="mb-3 pointer"
                          key={item?.name}
                          onClick={() => handleOpenWorkshop(item, index)}>
                          <WatchImpression
                            key={index}
                            data={item}
                            index={index}
                            ratioPush={0}
                            primaryKey={item?.slug}
                            impressions={workshopImpression}
                            onChange={setWorkshopImpression}
                            onPush={handlePushWorkshopImpression}
                            useInViewOptions={{
                              rootMargin: `-${heightOfHeader}px 0px -${heightOfFooter}px 0px`,
                              threshold: [0, 1]
                            }}>
                            <CardWorkshopExplore
                              title={item?.name}
                              tierImage={item?.tier?.image_link}
                              region={item?.kecamatan}
                              distance={item?.distance?.toString() + ' Km'}
                              price={'Rp' + convertValue(item)}
                              pointIcon="/assets/images/bigcoin.png"
                              point={convertValue(item, true)}
                              image={item?.image_link}
                              imgAlt={item?.name}
                              rating={item?.rating}
                              totalReview={item?.total_review}
                              ratingIcon="/assets/icons/star-orange.svg"
                              showFlagship={item?.tier?.name?.includes('Flagship')}
                              flagshipIcon={`/assets/icons/${
                                item?.tier?.name === 'Flagship' ? 'flagship' : 'flagship-plus'
                              }.svg`}
                              isFlagshipPlus={item?.tier?.name?.toLowerCase() === 'flagship plus'}
                              flagshipDetailTarget={() => handleOpenPopUp(item?.tier?.name)}
                            />
                          </WatchImpression>
                        </div>
                      );
                    })}

                  {workshops.length < 1 && !loading && (
                    <Col>
                      {promoIsEligible ? (
                        <EmptyState
                          image="/assets/images/nearest-workshop.png"
                          imgWidth={200}
                          captionAsTitle={true}>
                          <div className="warning-promo-message">
                            <p className="fw-bold mb-1 title">Tidak Ada Bengkel Promo Disekitar</p>
                            <span>Kami tidak dapat menemukan bengkel</span>{' '}
                            <span className="fw-bold">{activeServiceInit}</span>{' '}
                            <span>dengan promo</span> <span className="fw-bold">{promo}</span>{' '}
                            <span>untuk</span> <span className="fw-bold">{car?.carModel}</span>{' '}
                            <span>di sekitarmu</span>{' '}
                            <span
                              className="text-secondary link"
                              onClick={() => router.push(`/promo/${promo}?origin=promopage`)}>
                              kembali ke Detail Promo?
                            </span>
                          </div>
                        </EmptyState>
                      ) : (
                        <EmptyState
                          image="/assets/images/no-voucher.png"
                          imgWidth={200}
                          mainButtonTitle="Ganti Promo"
                          captionAsTitle={true}
                          secondaryButtonTitle="Cari Tanpa Promo"
                          secondaryButtonColor="primary"
                          secondaryButtonOutline={true}
                          onMainButtonClick={() => router.push('/promo')}
                          onSecondaryButtonClick={() =>
                            setShowChangePromoModal(!showChangePromoModal)
                          }>
                          <div className="warning-message">
                            <span>Promo</span> <span className="text-secondary">{promo}</span> Tidak
                            Dapat <br />
                            <span>Digunakan Untuk</span>{' '}
                            <span className="text-secondary">{activeServiceInit} Mobil</span>
                          </div>
                        </EmptyState>
                      )}
                    </Col>
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
                promo={promo}
                serviceActive={activeServiceInit}
                mapCenter={mapCenter}
                workshops={workshops}
                geoLocation={geoLocation}
                userCar={car}
                isTracking={true}
                heightOfHeader={heightOfHeader}
                heightOfFooter={heightOfFooter}
                workshopImpression={workshopImpression}
                resetLocation={goToCurrentLocation}
                loadMoreWorkshops={handleLoadItems}
                openWorkshop={handleOpenWorkshop}
                onMapCenterChange={changeMapCenter}
                onHighlightWorkshop={handleHighlightWorkshop}
                onChangeImpression={setWorkshopImpression}
                onPushImpression={handlePushWorkshopImpression}
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

      <FlagshipModal
        showFlagshipModal={showPopupInfo}
        closeFlagshipModal={() => setShowPopupInfo(false)}
        tier={tier}
      />
    </PrivateLayout>
  );
}

export default Screen;

export async function getServerSideProps({ query }) {
  const { keywords, promo, lat, lng, variant_car_id, slug, promo_id } = query;
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
    promo,
    lat: location.lat,
    lng: location.lng,
    service_category: slug,
    variant_car_id: variantCarId
  };

  const [serviceCategoriesRes, workshopsRes, sortingRes, filterRes, promoRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/search/filter_options/`),
    getWorkshopNewList(workshopPayload),
    fetch(`${process.env.API_URL}v2/search/list-sorting/`),
    fetch(`${process.env.API_URL}v2/search/service-category-workshop/`),
    fetch(`${process.env.API_URL}v2/promo/by_slug/${promo_id || ''}`)
  ]);

  const [services, sortings, filters, promos] = await Promise.all([
    serviceCategoriesRes.json(),
    sortingRes.json(),
    filterRes.json(),
    promoRes.json()
  ]);
  const workshopsInit = workshopsRes;
  const servicesInit = services?.data?.service_categories || [];
  const serviceInit = Helper.getServiceInit(slug, servicesInit);
  const promoData = promos?.data ? promos?.data : null;

  return {
    props: {
      keywords: keywords || ``,
      promo: promo || ``,
      promoData,
      serviceInit,
      workshopsInit,
      location,
      variantCarInit: variantCarId || null,
      dataSortings: sortings?.data?.sorting,
      dataFilters: filters?.data
    }
  };
}
