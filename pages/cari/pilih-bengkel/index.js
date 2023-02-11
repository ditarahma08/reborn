import { fetchSearchWorkshopList } from '@actions/Search';
import AlertCarInfo from '@components/car/AlertCarInfo';
import FilterBottomsheetSort from '@components/filter/FilterBottomsheetSort';
import MiniDetailWorkshopHeader from '@components/header/MiniDetailWorkshopHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { LottieSearching } from '@components/lottie/lottie';
import FlagshipModal from '@components/modal/FlagshipModal';
import LocationModal from '@components/modal/LocationModal';
import {
  CardWorkshopExplore,
  Container,
  EmptyState,
  Icon,
  Spinner,
  Text
} from '@components/otoklix-elements';
import OtoklixGoWorkshopList from '@components/otoklixGo/OtoklixGoWorkshopList';
import PackageSheet from '@components/sheet/PackageSheet';
import SlidingTwoTab from '@components/tab-menu/SlidingTwoTab';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { monasLocation } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import Helper from '@utils/Helper';
import useCar from '@utils/useCar';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { map as lodashMap } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const ChooseWorkshop = (props) => {
  const { productIdBefore, promoCode, from_address, active_menu } = props;
  const router = useRouter();

  if (productIdBefore) {
    Cookies.set('product_id_selected', productIdBefore);
  }

  const productId = Cookies.get('product_id_selected');

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }
  const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
  const { user, isAuthenticated } = useAuth();
  const { car } = useCar(user, isAuthenticated);
  const carName = `${car?.carModel} ${car?.carVariant}`;

  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [items, setItems] = useState([]);
  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sorting: 'closest',
    promo_code: promoCode || ''
  });
  const [openPackageSheet, setOpenPackageSheet] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const [workshopDetail, setWorkshopDetail] = useState({});
  const [userCarId, setUserCarId] = useState(getCarId); //eslint-disable-line
  const [activeTabMenu, setActiveTabMenu] = useState(active_menu || 1);
  const [locationDetail, setLocationDetail] = useState({});
  const [otoklixGoLoading, setOtoklixGoLoading] = useState(true);
  const [isOtoklixGoFetching, setIsOtoklixGoFetching] = useState(false);
  const [validationList, setValidationList] = useState({});
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');
  const [geoLocation, setGeoLocation] = useState({});

  const updateWorkshopList = (main) => {
    let page;
    let extraPayload;
    let restart = main?.restart;

    if (geoLocation) {
      if (main?.restart) {
        page = 1;
        restart = true;
        extraPayload = createExtraPayload(filterOptions || {});
      } else {
        page = main?.page || pageIndex;
        extraPayload = createExtraPayload(filterOptions || {});
      }

      const mainPayload = {
        page: page,
        product_id: productId,
        lat: !isUndefined(main?.lat) ? main?.lat : geoLocation.lat,
        lng: !isUndefined(main?.lng) ? main?.lng : geoLocation.lng,
        variant_car_id: userCarId?.car_details?.id
      };

      fetchWorkshopList(mainPayload, extraPayload, restart);
    }
  };

  const updateRoute = (main) => {
    let paramPushRoute = {
      promo: main?.promo || '',
      active: main?.activeTab || activeTabMenu
    };

    router.replace(
      {
        pathname: router.pathname,
        query: paramPushRoute
      },
      undefined,
      { shallow: true }
    );
  };

  const getPackageList = async (item) => {
    const params = {
      variant_car_id: userCarId?.car_details?.id,
      promo_code: promoCode
    };

    try {
      const response = await api.get(`v2/workshops/${item?.slug}/product/${productId}/packages`, {
        params
      });
      if (response?.data?.data) {
        setPackageList(response?.data?.data);
        setWorkshopDetail(item);
        setOpenPackageSheet(true);
      }
    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  const fetchWorkshopList = async (main, extra, restart) => {
    let response = [];
    setIsFetching(true);
    setPaginationLoading(true);
    if (restart) {
      setSectionLoading(true);
      setPageIndex(1);
    }

    if (!isUndefined(main?.lat) && !isUndefined(main?.lng)) {
      response = await fetchSearchWorkshopList(main, extra);
    }

    if (restart && response?.length >= 5) {
      setHasMoreItems(true);
    }

    if (response?.length < 5) {
      setHasMoreItems(false);
    }

    if (restart) {
      setItems(response);
      setSectionLoading(false);
    } else {
      let newItems = [];
      let previousItems = [];
      if (items) {
        previousItems = items;
      }
      if (response) {
        newItems = response;
      }

      const finalItems = [...previousItems, ...newItems];

      setItems(finalItems);
    }

    setIsFetching(false);
  };

  const handleLoadItems = () => {
    setPageIndex(pageIndex + 1);
    updateWorkshopList({
      page: pageIndex + 1
    });
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
  };

  const createExtraPayload = (filterOptions) => {
    const extraPayload = {};

    for (const [key, value] of Object.entries(filterOptions)) {
      extraPayload[key] = value;
    }

    return extraPayload;
  };

  const renderItems = () => {
    return items?.map((item, index) => {
      const isLiter = item?.selected_package?.product_unit;
      const isDiscountPackage =
        item?.selected_package?.discount_value !== 0 &&
        `${item?.selected_package?.discount_value}%`;
      return (
        <CardWorkshopExplore
          className="card-ws-search m-3 pointer border-0"
          key={index}
          isShowDistance
          isHaveDetailPrice
          isShowOtopoints={false}
          isHavePrimaryPrice={false}
          tags={lodashMap(item?.service_categories, 'name')}
          region={item?.kecamatan}
          title={item?.name}
          image={item?.image_link}
          imgAlt={item?.name}
          rating={item?.rating}
          ratingIcon="/assets/icons/star-orange.svg"
          totalReview={item?.total_review}
          distance={`${item?.distance}Km`}
          estimate={`${item?.eta} menit`}
          openingTime={`Buka ${item?.general_operating_hours?.opening_hour} - ${item?.general_operating_hours?.closing_hour}`}
          onCardClick={() => handleCardClickSelected(item)}
          detailButtonTarget={() => handleWorkshopDetailClick(item, undefined, true)}
          originalPrice={
            item?.selected_package?.discount_value !== 0 &&
            `Rp${Helper.formatMoney(item?.selected_package?.original_price)}`
          }
          price={`Rp${Helper.formatMoney(item?.selected_package?.price)}`}
          volumePrice={
            isLiter && `Rp${Helper.formatMoney(item?.selected_package?.product_price)}/${isLiter}`
          }
          showFlagship={item?.tier?.name?.includes('Flagship')}
          flagshipIcon={`/assets/icons/${
            item?.tier?.name === 'Flagship' ? 'flagship' : 'flagship-plus'
          }.svg`}
          isFlagshipPlus={item?.tier?.name?.toLowerCase() === 'flagship plus'}
          flagshipDetailTarget={() => handleOpenPopUp(item?.tier?.name)}
          discountLabel={isDiscountPackage}
        />
      );
    });
  };

  const handleWorkshopDetailClick = (item, isPudo, goWs) => {
    amplitude.getInstance().logEvent('workshop details explored', {
      details_selected: 'all details',
      workshop_name: item?.name,
      wdp_type: 'mini wdp',
      page_location: fullPath
    });

    if (goWs) {
      Cookies.set('active_tab', 2);
    } else {
      Cookies.set('active_tab', 1);
    }

    const params = {
      productId,
      origin: 'search',
      promo: promoCode,
      pudo: isPudo || ''
    };

    router.push({
      pathname: `/bengkel/${item?.slug}`,
      query: params
    });
  };

  const handleCardClickSelected = (item, isPudo) => {
    const availablePackages = item?.available_packages[0];
    const cardSource = isPudo ? 'Otoklix Pick Up' : 'Datang Ke Bengkel';

    amplitude.getInstance().logEvent('workshop selected', {
      cta_location: 'on list',
      position: `search page - ${item?.name} - ${cardSource}`,
      page_location: fullPath
    });

    if (availablePackages) {
      amplitude.getInstance().logEvent('package selected', {
        product_name: availablePackages?.name,
        workshop_name: item?.name,
        source_list: 'search page',
        service_category_name: availablePackages?.category?.slug,
        is_fulfilled_by_otoklix: availablePackages?.is_fulfilled_by_otoklix,
        page_location: fullPath
      });

      const params = {
        package_id: availablePackages?.id,
        workshop: item?.slug,
        promo: promoCode,
        origin: 'pilih-bengkel'
      };

      if (isPudo) {
        params.otoklix_go = true;
      }

      router.push({ pathname: `/konfirmasi-order`, query: params });
    } else {
      getPackageList(item);
    }
  };

  const handleClosePackageSheet = () => {
    setOpenPackageSheet(false);
  };

  const renderEmptyItems = () => {
    if (!items?.length) {
      return renderNoData();
    } else {
      return null;
    }
  };

  const renderNoData = () => {
    return (
      <EmptyState
        image="/assets/images/bengkel.png"
        title={`Tidak Dapat Menemukan Apapun`}
        imgHeight={140}
        imgAlt="Otoklix Search">
        <>Sayang sekali kami tidak dapat menemukan bengkel apapun.</>
      </EmptyState>
    );
  };

  const renderLoading = () => (
    <div className="empty-state-container">
      <LottieSearching />
      <span className="title text-dark">Memuat Hasil...</span>
    </div>
  );

  const loader = (
    <div className="d-flex justify-content-center p-3 mb-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  const handleEditLocation = () => {
    setHasModalLocation(!hasModalLocation);
  };

  const handleSelectLocation = (suggestion) => {
    setHasModalLocation(!hasModalLocation);

    getGeocode({ address: suggestion.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        if (lat && lng) {
          const location = {
            ...geoLocation,
            lat: lat,
            lng: lng,
            address: suggestion.description
          };
          setGeoLocation(location);
          Helper.updateLocation(location);
        }
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 250; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setPaginationLoading(false);
    }

    if (activeTabMenu === 2) {
      if (t > 1 && !isOtoklixGoFetching) {
        setOtoklixGoLoading(false);
      }
    }
  };

  const handleSetLoading = (val) => {
    setOtoklixGoLoading(val);
  };

  const handleSetOtoklixGoFetching = (val) => {
    setIsOtoklixGoFetching(val);
  };

  const onChangeSort = (value) => {
    setFilterOptions({
      ...filterOptions,
      sorting: value
    });
    setOpenSort(false);
  };

  const handleAddressLocation = async (lat, lng, isReplaced = false) => {
    let location = { ...geoLocation };
    const response = await getAddressLocation(lat, lng);

    location.address = response.address;

    if (isReplaced) {
      location.lat = response.lat;
      location.lng = response.lng;
    }
    setGeoLocation(location);
    Helper.updateLocation(location);
  };

  useEffect(() => {
    if (locationDetail) {
      const lat = locationDetail?.latitude || geoLocation?.lat;
      const lng = locationDetail?.longitude || geoLocation?.lng;
      updateRoute({
        ...router?.query
      });
      handleAddressLocation(lat, lng, true);
    }
  }, [locationDetail]);

  const handleDefaultLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        handleAddressLocation(lat, lng, true);
      },
      () => {
        handleAddressLocation(geoLocation.lat, geoLocation.lng, false);
      }
    );
  };

  const handleChangeTab = (activeTab) => {
    amplitude.getInstance().logEvent('workshop visit method selected', {
      workshop_visit_method: activeTab === 1 ? 'Datang Ke Bengkel' : 'Otoklix Pick Up',
      source_list: promoCode ? 'promo details' : 'search'
    });

    if (activeTab === 1) {
      const lat = locationDetail?.latitude || geoLocation?.lat;
      const lng = locationDetail?.longitude || geoLocation?.lng;
      updateRoute({
        ...router?.query,
        activeTab: activeTab,
        lat: lat,
        lng: lng
      });
      handleAddressLocation(lat, lng, true);
    } else {
      updateRoute({
        ...router?.query,
        activeTab: activeTab
      });
    }

    setActiveTabMenu(activeTab);
    Cookies.set('active_tab', activeTab);
  };

  const fetchAddress = async () => {
    const getAddress = Cookies.get('user_address');
    let userAddress = getAddress ? JSON.parse(getAddress) : {};

    if (isAuthenticated && isEmpty(userAddress)) {
      try {
        const response = await api.get('v2/account/address/default/');
        setLocationDetail(response?.data?.data);
        userAddress = response?.data?.data;
        Cookies.set('user_address', userAddress, { expires: 1, path: '/' });
      } catch (error) {
        console.log(error);
      }
    } else {
      setLocationDetail(userAddress);
    }

    if (!isEmpty(userAddress)) {
      getValidation(userAddress);
    }
  };

  const getValidation = async (userAddress) => {
    const params = {
      location: userAddress?.latitude + ',' + userAddress?.longitude,
      variant_car_id: userCarId?.car_details?.id,
      product_id: productId
    };

    try {
      const response = await api.get(`v2/pudo/is-workshop-eligible/`, { params });
      setValidationList(response?.data?.data);
    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  const handleSelectedPackageSheet = (items) => {
    setOpenPackageSheet(false);

    const params = {
      package_id: items?.package_id,
      workshop: workshopDetail?.slug,
      promo: promoCode,
      origin: 'search',
      otoklix_go: workshopDetail?.otoklix_go_eligible
    };

    router.push({ pathname: `/konfirmasi-order`, query: params });
  };

  useEffect(() => {
    const queryLat = location?.lat;
    const queryLng = location?.lng;
    updateRoute({ ...router?.query, next: true });
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'choosing workshop',
      screen_category: 'browse',
      page_location: fullPath
    });

    if (!queryLat && !queryLng) {
      handleDefaultLocation();
    } else {
      handleAddressLocation(queryLat, queryLng, true);
    }

    BranchTracker('SEARCH', { name_of_pages: 'choosing workshop' });
  }, []);

  useEffect(() => {
    if (filterOptions) {
      updateWorkshopList({ restart: true }, filterOptions);
    } else {
      !isFetching &&
        updateWorkshopList({
          lat: geoLocation?.lat,
          lng: geoLocation?.lng,
          restart: true
        });
    }
  }, [filterOptions, geoLocation.lat, geoLocation.lng]);

  useEffect(() => {
    if (isEmpty(productId) && isEmpty(userCarId?.car_details?.id)) {
      router.push('/cari');
    }
  }, []);

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    const getDataLocation = Helper.getLocation();
    if (getDataLocation !== null) {
      setGeoLocation(getDataLocation);
    } else {
      setGeoLocation({
        lat: monasLocation.lat,
        lng: monasLocation.lng,
        address: ''
      });
    }
  }, []);

  const handleBackPilihBengkel = () => {
    if (from_address) {
      router.push('/cari');
    } else {
      router.back();
    }
  };

  return (
    <PrivateLayout
      hasOtobuddy
      user={user}
      hasAppBar={false}
      title="Pilih Bengkel | Otoklix"
      description=""
      metaRobots="noindex"
      wrapperClassName="wrapper-full"
      handleUpdate={onScrollUpdate}>
      <MiniDetailWorkshopHeader
        backDataQa="pilih_bengkel_button_back"
        title="Pilih Bengkel"
        icon="/assets/icons/arrow-left-thin.svg"
        iconOnClick={handleBackPilihBengkel}
        isSticky
      />

      <SlidingTwoTab
        handleTabClick={handleChangeTab}
        activeTab={activeTabMenu}
        secondTabName="Otoklix Pick Up"
        firstTabName="Datang Ke Bengkel"
        firstDataQa="pilih_bengkel_tab_otopickup"
        secondDataQa="pilih_bengkel_tab_go_to_workshop"
        hasSparatorComponent
        isSticky
        topSpace={72}
      />
      <Container className="home-content pb-0 pt-4 px-0">
        {activeTabMenu === 2 ? (
          <OtoklixGoWorkshopList
            location={geoLocation?.lat + ',' + geoLocation?.lng}
            variantCarId={userCarId?.car_details?.id}
            productId={productId}
            isOtoklixGoFetching={isOtoklixGoFetching}
            isPaginationLoading={otoklixGoLoading}
            updatePaginationLoading={(val) => handleSetLoading(val)}
            updateOtoklixGoFetching={(val) => handleSetOtoklixGoFetching(val)}
            validationList={validationList}
            handleCardClickSelected={(val, isPudo) => handleCardClickSelected(val, isPudo)}
            handleWorkshopDetailClick={(val, isPudo) =>
              handleWorkshopDetailClick(val, isPudo, false)
            }
            locationDetail={locationDetail}
            handleChangeTab={(val) => handleChangeTab(val)}
            fullPath={fullPath}
            promoCode={promoCode}
          />
        ) : (
          <InfiniteScroll
            loadMore={handleLoadItems}
            hasMore={!sectionLoading && !paginationLoading && hasMoreItems}
            useWindow={false}>
            <Container
              className="d-flex justify-content-start pt-3 pointer"
              onClick={handleEditLocation}>
              <div className="text-truncate">
                <Text color="label" className="text-xxs">
                  Lokasi Saya:
                </Text>
                <Text color="dark" className="text-xxs ms-2 fw-bold">
                  {geoLocation?.address}
                </Text>
              </div>
              <div className="ms-auto ps-2">
                <img src="/assets/icons/chevron-down-blue.svg" alt="location" />
              </div>
            </Container>
            <div className="tracks pt-2">
              {sectionLoading && renderLoading()}
              {!sectionLoading && items?.length > 0 && (
                <section className="overflow-hidden">
                  <Container className="d-flex justify-content-between align-items-center ms-1 mt-1">
                    <Text weight="semi-bold" className="text-md">
                      Bengkel Sesuai Produk
                    </Text>
                    <div
                      className="d-flex align-items-center pointer me-1"
                      onClick={() => setOpenSort(true)}>
                      <Icon
                        card
                        image="/assets/icons/sort-blue.svg"
                        imageHeight={15}
                        imageWidth={15}
                        imgAlt="sort-blue"></Icon>
                      <Text color="primary" className="text-xs">
                        Urutkan
                      </Text>
                    </div>
                  </Container>

                  {renderItems()}
                </section>
              )}
              {!sectionLoading && hasMoreItems && loader}
              {!isFetching && renderEmptyItems()}
            </div>
          </InfiniteScroll>
        )}
      </Container>
      <LocationModal
        toggle={() => setHasModalLocation(!hasModalLocation)}
        isOpen={hasModalLocation}
        handleSelectSuggestion={handleSelectLocation}
        fullPath={fullPath}
        pageName="search page"
      />
      <FilterBottomsheetSort
        open={openSort}
        value={filterOptions?.sorting}
        isWorkshop
        onClose={() => setOpenSort(false)}
        onApply={onChangeSort}
        isPilihBengkel
        filterSource="datang ke bengkel"
        pageName="Datang ke Bengkel section"
      />

      <PackageSheet
        openSheet={openPackageSheet}
        onDismiss={handleClosePackageSheet}
        packageList={packageList}
        wsDetail={workshopDetail}
        fullPath={fullPath}
        promoCode={promoCode}
        origin="pilih-bengkel"
        otoklixGoLocation={locationDetail?.latitude + ',' + locationDetail?.longitude}
        onClickSelectPackage={(items) => handleSelectedPackageSheet(items)}
      />

      <AlertCarInfo carName={carName} />

      <FlagshipModal
        showFlagshipModal={showPopupInfo}
        closeFlagshipModal={() => setShowPopupInfo(false)}
        tier={tier}
      />
    </PrivateLayout>
  );
};

export default ChooseWorkshop;

export async function getServerSideProps({ query }) {
  const { product_id, promo, from_address, active } = query;

  return {
    props: {
      productIdBefore: product_id || '',
      promoCode: promo || '',
      from_address: from_address || '',
      active_menu: +active || 1
    }
  };
}
