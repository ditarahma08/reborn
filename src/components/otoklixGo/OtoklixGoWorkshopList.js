import { fetchSearchWorkshopList } from '@actions/Search';
import CoachMark from '@components/coach-mark/CoachMark';
import FilterBottomsheetSort from '@components/filter/FilterBottomsheetSort';
import { LottieSearching } from '@components/lottie/lottie';
import FlagshipModal from '@components/modal/FlagshipModal';
import OtoklixGOLandingModal from '@components/modal/OtoklixGOLandingModal';
import {
  CardWorkshopExplore,
  Container,
  EmptyState,
  Icon,
  Spinner,
  Text
} from '@components/otoklix-elements';
import LocationCard from '@components/otoklixGo/LocationCard';
import OtoklixGoFeature from '@components/otoklixGo/OtoklixGoFeature';
import { useAuth } from '@contexts/auth';
import { coachMarkLocale, coachMarkPickupSteps, coachMarkStyles } from '@utils/Constants';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { isEmpty, map as lodashMap } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Joyride from 'react-joyride';

const OtoklixGoWorkshopList = (props) => {
  const {
    location,
    variantCarId,
    productId,
    isOtoklixGoFetching,
    isPaginationLoading,
    updatePaginationLoading,
    updateOtoklixGoFetching,
    validationList,
    handleCardClickSelected,
    handleWorkshopDetailClick,
    locationDetail,
    handleChangeTab,
    fullPath,
    promoCode = ''
  } = props;
  const router = useRouter();
  const [openSorting, setOpenSorting] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ sorting: 'closest' });
  // const [showModalLocation, setShowModalLocation] = useState(false);
  const [items, setItems] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const { isAuthenticated } = useAuth();
  const [hasWelcomeOtoklixGO, setHasWelcomeOtoklixGO] = useState(false);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');

  const [showCoachMark, setShowCoachMark] = useState(false);

  const renderLoading = () => (
    <div className="empty-state-container">
      <LottieSearching />
      <span className="title text-dark">Memuat Hasil...</span>
    </div>
  );

  const onChangeSort = (value) => {
    setFilterOptions({
      ...filterOptions,
      sorting: value
    });
    updateWorkshopList({ restart: true }, validationList, { sorting: value });
    setOpenSorting(false);
  };

  const updateWorkshopList = (main, validation, extra) => {
    let page;
    let extraPayload;
    let restart = main?.restart;

    if (main?.restart) {
      page = 1;
      restart = true;
      extraPayload = extra || { sorting: filterOptions?.sorting, promo_code: promoCode };
    } else {
      page = main?.page || pageIndex;
      extraPayload = extra || { sorting: filterOptions?.sorting, promo_code: promoCode };
    }

    const mainPayload = {
      page: page,
      product_id: productId,
      lat: locationDetail?.latitude || location?.lat,
      lng: locationDetail?.longitude || location?.lng,
      variant_car_id: variantCarId,
      is_pudo: validation?.is_eligible
    };

    fetchWorkshopList(mainPayload, extraPayload, restart);
  };

  async function fetchWorkshopList(main, extra, restart) {
    updateOtoklixGoFetching(true);
    updatePaginationLoading(true);
    if (restart) {
      setSectionLoading(true);
      setPageIndex(1);
    }

    const response = await fetchSearchWorkshopList(main, extra);

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

    updateOtoklixGoFetching(false);
  }

  const handleLoadItems = () => {
    setPageIndex(pageIndex + 1);
    updateWorkshopList(
      {
        page: pageIndex + 1
      },
      validationList
    );
  };

  const renderEmptyItems = () => {
    if (!items?.length) {
      return renderNoData();
    } else {
      return null;
    }
  };

  const loader = (
    <div className="d-flex justify-content-center p-3 mb-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  const handleAddAddress = () => {
    amplitude.getInstance().logEvent('location prompt initiated', {
      page_location: fullPath
    });

    router.push('/tambah-alamat');
  };

  const handleClickLocationCard = () => {
    amplitude.getInstance().logEvent('user address setup initiated', {
      user_address_label: locationDetail?.label || 'not selected'
    });

    if (isAuthenticated && !isEmpty(locationDetail)) {
      router.push({
        pathname: `/daftar-alamat`,
        query: router.query
      });
    } else {
      router.push({
        pathname: `/tambah-alamat`,
        query: {
          product_id: productId,
          variant_car_id: variantCarId
        }
      });
    }
  };

  const handleJoyrideCallback = (params) => {
    if (
      (params?.action === 'next' && params?.type === 'step:after') ||
      (params?.action === 'close' && params?.type === 'step:after')
    ) {
      amplitude
        .getInstance()
        .logEvent(params?.action === 'next' ? 'coach mark initiated' : 'coach mark skipped', {
          page_location: fullPath,
          steps: params?.step?.title
        });
    }

    if (params?.lifecycle === 'complete') {
      if (params?.action === 'close') {
        setShowCoachMark(false);
      }
    }
  };

  const triggerCoachMark = () => {
    const getCoachMarkPickup = Cookies.get('coachmark_pickup');

    if (!getCoachMarkPickup) {
      setShowCoachMark(true);
      Cookies.set('coachmark_pickup', true, { expires: 1 });
    } else {
      setShowCoachMark(false);
    }
  };

  const handleToggleOtoklixGoLanding = () => {
    amplitude.getInstance().logEvent('coach mark initiated', {
      page_location: fullPath,
      steps: 'Otoklix Pick Up Sudah Hadir, Nih!'
    });
    setHasWelcomeOtoklixGO(!hasWelcomeOtoklixGO);
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
  };

  const Tooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps
  }) => (
    <CoachMark
      step={step}
      index={index}
      continuous={continuous}
      backProps={backProps}
      closeProps={closeProps}
      primaryProps={primaryProps}
      tooltipProps={tooltipProps}
      totalSteps={coachMarkPickupSteps.length}
    />
  );

  const renderNoData = () => {
    return (
      <EmptyState
        image="/assets/images/no-servis-available.png"
        title={`Ups! Lokasimu di Luar Jangkauan`}
        imgHeight={140}
        imgAlt="Otoklix Pick Up WS"
        mainButtonTitle="Cari Bengkel Lain"
        mainButtonColor="primary"
        onMainButtonClick={() => handleChangeTab(1)}>
        <>Servis yang kamu butuhkan belum tersedia di bengkel Otoklix Pick Up area ini</>
      </EmptyState>
    );
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
          onCardClick={() => handleCardClickSelected(item, true)}
          detailButtonTarget={() => handleWorkshopDetailClick(item, true)}
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

  useEffect(() => {
    if (validationList?.is_eligible && !isEmpty(locationDetail)) {
      updateWorkshopList({ restart: true }, validationList);
    } else {
      setSectionLoading(false);
      setHasMoreItems(false);
    }
  }, [validationList, locationDetail]);

  useEffect(() => {
    if (!hasWelcomeOtoklixGO) {
      const isHasShowingModal = Cookies.get('_WOG', true, { path: '/' });
      if (isHasShowingModal) {
        triggerCoachMark();
      }
    }
  }, [hasWelcomeOtoklixGO]);

  useEffect(() => {
    let hasWOG = Cookies.get('_WOG');
    if (!hasWOG) {
      setHasWelcomeOtoklixGO(true);
      Cookies.set('_WOG', true, { path: '/' });
    }
  }, []);

  return (
    <>
      <Container className="py-3">
        <div className="text-start" data-automation="otopickup_desc">
          <img src="/assets/icons/logo-orange.svg" height="26" alt="pickup" />
          <Text color="dark" className="d-block text-xs mt-3">
            Layanan servis antar-jemput mobil buat kamu yang sibuk & malas antre di bengkel
          </Text>
        </div>
        <OtoklixGoFeature />

        <div className="pt-3">
          <div id="coachMarkPickupStep1">
            <LocationCard address={locationDetail} handleOnClick={handleClickLocationCard} />
          </div>
        </div>

        {isEmpty(locationDetail) ? (
          <EmptyState
            dataAutoContainer="otoklix_pickup_empty_address"
            image="/assets/icons/map-point.svg"
            title="Masukkan Alamat Kamu, Yuk!"
            imgHeight={140}
            imgAlt="location not active"
            mainButtonTitle="Tambah Alamat"
            mainButtonColor="primary"
            dataAutoMainButton="cari_address_empty_add"
            onMainButtonClick={handleAddAddress}>
            <span className="text-xs" data-automation="pilih_bengkel_empty_location_desc">
              Bantu kami menemukan alamatmu
              <br /> dengan klik tombol “Tambah Alamat” ya
            </span>
          </EmptyState>
        ) : (
          <>
            <InfiniteScroll
              loadMore={handleLoadItems}
              hasMore={!sectionLoading && !isPaginationLoading && hasMoreItems}
              useWindow={false}>
              <div className="tracks pt-2">
                {sectionLoading && renderLoading()}
                {!sectionLoading && items?.length > 0 && (
                  <section className="overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center ms-1 mt-1">
                      <Text weight="semi-bold" className="text-md">
                        Bengkel Sesuai Produk
                      </Text>
                      <div
                        id="coachMarkPickupContentStep1"
                        className="d-flex align-items-center pointer me-1"
                        onClick={() => setOpenSorting(true)}>
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
                    </div>

                    {renderItems()}
                  </section>
                )}
                {!sectionLoading && hasMoreItems && loader}
                {!isOtoklixGoFetching && renderEmptyItems()}
              </div>
            </InfiniteScroll>
          </>
        )}

        <FilterBottomsheetSort
          open={openSorting}
          value={filterOptions?.sorting}
          isWorkshop
          onClose={() => setOpenSorting(false)}
          onApply={onChangeSort}
          isPilihBengkel
          filterSource="otoklix pick up"
          pageName="Otoklix Pick Up section"
        />
      </Container>

      <OtoklixGOLandingModal
        isOpen={hasWelcomeOtoklixGO}
        toggle={() => handleToggleOtoklixGoLanding()}
      />

      <Joyride
        continuous={true}
        disableOverlay={false}
        disableScrollParentFix={true}
        disableOverlayClose={true}
        disableScrolling={true}
        run={showCoachMark}
        steps={coachMarkPickupSteps}
        styles={coachMarkStyles}
        locale={coachMarkLocale}
        callback={handleJoyrideCallback}
        tooltipComponent={Tooltip}
      />

      <FlagshipModal
        showFlagshipModal={showPopupInfo}
        closeFlagshipModal={() => setShowPopupInfo(false)}
        tier={tier}
      />
    </>
  );
};

export default OtoklixGoWorkshopList;
