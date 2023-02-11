import NewCar from '@components/car/NewCar';
import CoachMark from '@components/coach-mark/CoachMark';
import InputRadioGroup from '@components/input/InputRadioGroup';
import PrivateLayout from '@components/layouts/PrivateLayout';
import LocationModal from '@components/modal/LocationModal';
import PromoTncModal from '@components/modal/PromoTncModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  CardPackage,
  CardVehicle,
  Col,
  Container,
  EmptyState,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Tags,
  Text
} from '@components/otoklix-elements';
import OrderSheet from '@components/sheet/OrderSheet';
import WatchImpression from '@components/watch-impression/WatchImpression';
import { useAuth } from '@contexts/auth';
import Auth from '@pages/auth/index';
import { api, authenticateAPI } from '@utils/API';
import { coachMarkLocale, coachMarkSteps, coachMarkStyles, monasLocation } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import useCar from '@utils/useCar';
import useOrderSheet from '@utils/useOrderSheet';
import Cookies from 'js-cookie';
import assign from 'lodash/assign';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { use100vh } from 'react-div-100vh';
import Joyride from 'react-joyride';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Popover } from 'react-tiny-popover';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

sentryBreadcrumb('pages/promo/[id]');

const DetailPromo = ({ sheetFilters, variant_car_id, promo }) => {
  const router = useRouter();

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  const height = use100vh();

  const { user, isAuthenticated, token, authenticate } = useAuth();
  const { car, openModalCar, editCar, closeEditCar, firstCheck } = useCar(user, isAuthenticated);
  const { openOrderSheet, activePkg, cartPkg, order, dispatch } = useOrderSheet();

  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [showTncModal, setShowTncModal] = useState(false);
  const [openFilterBottomSheet, setOpenFilterBottomSheet] = useState(false);
  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [extraFilter, setExtraFilter] = useState({});
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePackage, setHasMorePackage] = useState(true);
  const [firstLoadPackage, setFirstLoadPackage] = useState(true);
  const [showCoachMark, setShowCoachMark] = useState(false);
  const [heightOfFooter, setHeightOfFooter] = useState(0);
  const [productImpression, setProductImpression] = useState([]);
  const [clickAddToCart, setClickAddToCart] = useState(false);

  const [geoLocation, setGeoLocation] = useState({
    lat: monasLocation.lat,
    lng: monasLocation.lng,
    allowed: false,
    address: null
  });

  const hasCar = car?.carModel;

  async function fetchPromoPackages(promoCode, extraPayload, page = 1) {
    setPackageLoading(true);

    const params = {
      limit: 8,
      page: page,
      latitude: geoLocation.lat,
      longitude: geoLocation.lng,
      car_variant_id: car?.carVariantId,
      promo_code: promoCode,
      ...extraPayload
    };

    try {
      const responsePackage = await api.get(`v2/search/promo-packages/`, { params });
      responsePackage?.data?.data?.length < 8 && setHasMorePackage(false);

      if (firstLoadPackage) {
        setPackages(responsePackage.data.data);
      } else {
        const packagesArr = uniqBy([...packages, ...responsePackage.data.data], 'package.id');
        setPackages(packagesArr);
      }

      setCurrentPage(page);
    } catch (error) {
      firstLoadPackage ? setPackages([]) : setHasMorePackage(false);
    }

    setPackageLoading(false);
  }

  const handleLoadPackages = () => {
    if (hasMorePackage) {
      setFirstLoadPackage(false);
      !firstLoadPackage && fetchPromoPackages(promo?.promo_code, extraFilter, currentPage + 1);
    }
  };

  const handleSearchMore = () => {
    let query = {};

    if (car?.carVariantId) {
      assign(query, { car_variant_id: car?.carVariantId });
    }

    if (promo?.promo_code) {
      assign(query, { promo: promo?.promo_code });
    }

    if (geoLocation.lat) {
      assign(query, { lat: geoLocation.lat });
      assign(query, { lng: geoLocation.lng });
    }

    assign(query, { ref: 'promo', promo_id: router?.query?.id });

    router.push({
      pathname: `/servis/${promo?.service_category}`,
      query: query
    });
  };

  const handleExtraFilterClick = () => {
    setOpenFilterBottomSheet(true);
  };

  const handleApplyExtraFilter = (extraPayload) => {
    setProductImpression([]);
    setExtraFilter(extraPayload);
    setOpenFilterBottomSheet(false);
    fetchPromoPackages(promo?.promo_code, extraPayload);
  };

  const initPushRoute = (query) => {
    router.replace(
      {
        pathname: router.pathname,
        query: query
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSelectSuggestion = (suggestion) => {
    setHasModalLocation(!hasModalLocation);

    getGeocode({ address: suggestion.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setGeoLocation({
          ...geoLocation,
          lat: lat,
          lng: lng,
          allowed: true,
          address: suggestion.description
        });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const handlePackageClick = async (pkg, index) => {
    var pkgId = pkg?.package?.id;
    var pkgCategory = pkg?.package?.category?.slug;
    var workshopSlug = pkg?.workshop?.slug;

    pkg.position = index + 1;
    GtmEvents.gtmProductClickPromo([pkg], promo?.name ?? '', pkg?.package?.name ?? '');

    const url = `v2/workshops/${workshopSlug}/package_details/`;
    const params = {
      service_category: pkgCategory,
      package_id: pkgId,
      variant_car_id: car?.carVariantId,
      promo_code: promo?.promo_code
    };

    const response = await api.get(url, { params });

    dispatch({
      type: 'initActivePkg',
      payload: {
        id: pkgId,
        name: pkg?.package?.name,
        description: pkg?.package?.description || '-',
        image_link: pkg?.package?.image_link,
        category: pkgCategory,
        category_name: pkg?.package?.category?.name,
        workshop: pkg?.workshop,
        detail: response.data.data
      }
    });
  };

  const handleSelectLineItem = (packageDetailId, lineItemValues) => {
    dispatch({
      type: 'editLineItem',
      payload: {
        packageDetailId,
        lineItemValues
      }
    });

    return;
  };

  const handleDismiss = () => {
    dispatch({ type: 'closeSheet' });
  };

  const handleSprintStart = () => {};

  const handleCancelAuth = () => {
    setOpenModalAuth(false);
  };

  const handleSubmit = () => {
    if (isAuthenticated) {
      postNewCarIfNecessary();
    } else {
      setOpenModalAuth(true);
    }
  };

  const handleSubmitAuth = () => {
    postNewCarIfNecessary();
  };

  const postNewCarIfNecessary = async () => {
    authenticateAPI(token);
    if (car?.carId) {
      finalizeBooking(car?.carId);
    } else {
      const params = {
        license_plate: car?.carPlate,
        variant_id: car?.carVariantId,
        transmission: car?.carTransmission,
        year: car?.carYear
      };

      const _createCar = async () => {
        const createCar = await api.post('v2/garage/cars/', params);
        return createCar.data.data;
      };

      _createCar().then((newCar) => {
        const getProfile = async () => {
          authenticate(token);
        };

        getProfile().then(() => finalizeBooking(newCar.id));
      });
    }

    if (!clickAddToCart) {
      GtmEvents.gtmAddToCartOrderSheet(activePkg, cartPkg);

      setClickAddToCart(true);
    }
  };

  const finalizeBooking = async (carId) => {
    const deleteCart = await api.delete('v2/cart/');

    if (deleteCart?.status === 200) {
      const payload = {
        workshop_slug_name: activePkg?.workshop?.slug,
        user_car_id: carId,
        packages: [
          {
            package_id: activePkg.id,
            package_details: cartPkg
          }
        ]
      };

      const createCart = await api.post('v2/cart/', payload);

      if (createCart?.status === 200) {
        router.push({
          pathname: '/konfirmasi-order',
          query: {
            promo: promo?.promo_code,
            workshop: activePkg?.workshop?.slug
          }
        });
      } else {
        alert('terjadi kesalahan, coba ulangi kembali');
      }
    } else {
      alert('failed to remove old cart data');
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleOnScrollUpdate = (pos) => {
    const { scrollTop, clientHeight, scrollHeight } = pos;
    if (scrollTop + clientHeight >= scrollHeight && !packageLoading) {
      handleLoadPackages();
    }
  };

  const handleJoyrideCallback = (params) => {
    if (params?.lifecycle === 'complete') {
      if (params?.action === 'close') {
        setShowCoachMark(false);
      }
    }
  };

  const triggerCoachMark = () => {
    const getCoachMarkPromo = Cookies.get('coachmark_promo');

    if (!getCoachMarkPromo) {
      setShowCoachMark(true);
      Cookies.set('coachmark_promo', true, { expires: 1 });
    } else {
      setShowCoachMark(false);
    }
  };

  const handlePushProductImpression = (impressionList) => {
    triggeredTrackingProductImpression(impressionList);
  };

  const triggeredTrackingProductImpression = (impressionList) => {
    if (impressionList?.length > 0) {
      GtmEvents.gtmProductImpressionsPromo(impressionList, promo?.name ?? '');
    }
  };

  const handleChangeMargin = () => {
    if (typeof document !== 'undefined') {
      if (openFilterBottomSheet || openOrderSheet) {
        setTimeout(() => {
          setHeightOfFooter(document?.querySelectorAll('[role="dialog"]')[0]?.clientHeight ?? 0);
        }, 300);
      } else {
        setHeightOfFooter(0);
      }
    }
  };

  useEffect(() => {
    gtag('view promo detail', 'viewPromoDetail', promo?.name);
    triggerCoachMark();
  }, []);

  useEffect(() => {
    if (firstCheck && promo?.promo_code) {
      fetchPromoPackages(promo?.promo_code, extraFilter);
    }
  }, [firstCheck, promo?.promo_code, car?.carVariantId, geoLocation.lat, geoLocation.lng]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let paramPushRoute = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (variant_car_id) {
          assign(paramPushRoute, { variant_car_id });
        }

        paramPushRoute = {
          ...paramPushRoute,
          ...router.query
        };

        const addressLocation = getAddressLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        addressLocation.then((response) => {
          setGeoLocation({
            ...geoLocation,
            lat: response.lat,
            lng: response.lng,
            allowed: true,
            address: response.address
          });
        });

        initPushRoute(paramPushRoute);
      },
      () => {
        let paramPushRoute = {};
        const addressLocation = getAddressLocation(geoLocation.lat, geoLocation.lng);

        addressLocation.then((response) => {
          setGeoLocation({
            ...geoLocation,
            address: response?.address
          });
        });

        if (variant_car_id) {
          assign(paramPushRoute, { variant_car_id });
          initPushRoute(paramPushRoute);
        }
      }
    );
  }, []);

  useEffect(() => {
    handleChangeMargin();
  }, [openFilterBottomSheet, openOrderSheet]);

  const hasExtraFilter = !Helper.isEmptyObj(extraFilter);

  let headerType;
  if (hasCar) {
    headerType = '1';
  } else if (geoLocation.allowed) {
    headerType = '2';
  } else {
    headerType = '3';
  }

  const showPackage = !packageLoading && packages.length > 0;
  const showNoPackage = !packageLoading && packages.length == 0;

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
      totalSteps={coachMarkSteps.length}
    />
  );

  if (!promo) {
    return (
      <PrivateLayout hasAppBar={false}>
        <div
          className="d-flex align-content-center justify-content-center align-items-center empty-state-page"
          style={{ height: height }}>
          <EmptyState
            image="/assets/images/404.png"
            title="Oops!"
            imgHeight={300}
            imgAlt="Otoklix"
            mainButtonTitle="Lihat Promo Yang Tersedia"
            onMainButtonClick={() => router.push('/promo')}>
            Promo yang kamu cari ga ada nih
          </EmptyState>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout
      hasAppBar={false}
      handleUpdate={handleOnScrollUpdate}
      wrapperClassName="wrapper-full"
      title={promo?.meta?.title}
      description={promo?.meta?.description}>
      <Modal isOpen={openModalCar} className="wrapper wrapper-xs modal-no-shadow">
        <ModalHeader className="p-0"></ModalHeader>
        <ModalBody className="p-0">
          <NewCar closeHasNewCar={closeEditCar} />
        </ModalBody>
      </Modal>

      <Modal isOpen={openModalAuth} className="wrapper wrapper-xs modal-no-shadow">
        <Auth
          showAsModal
          onBackAction={() => handleCancelAuth()}
          onVerificationSubmit={() => handleSubmitAuth()}
          fromOrder
        />
      </Modal>

      <LocationModal
        toggle={() => setHasModalLocation(!hasModalLocation)}
        isOpen={hasModalLocation}
        handleSelectSuggestion={handleSelectSuggestion}
      />

      <PromoTncModal
        isOpen={showTncModal}
        toggle={() => setShowTncModal(!showTncModal)}
        tnc={promo?.promo_tnc}
      />

      <>
        <div className="d-flex p-3" id="coachMarkPromoStep1">
          <Icon
            textRight
            imageWidth={24}
            imageHeight={24}
            size="md"
            bgIconColor="off-white"
            onClick={() => router.back()}
            className="pointer"
            iconClassName="rounded-circle box-shadow-floating-icon"
            image="/assets/icons/arrow-left.svg"
          />

          <CardVehicle
            id="widget_car"
            className="flex-grow-1 ms-3"
            title={car?.carModel}
            subtitle={car?.carPlate}
            placeholder="+ Tambah"
            leftImage={car?.carImage ?? '/assets/images/no-car.png'}
            rightImage={
              car?.carModel
                ? '/assets/icons/chevron-right-orange.svg'
                : '/assets/icons/plus-orange.svg'
            }
            onClick={() => editCar()}
          />
        </div>

        <Joyride
          continuous={true}
          disableOverlay={true}
          disableScrollParentFix={true}
          run={showCoachMark}
          steps={coachMarkSteps}
          styles={coachMarkStyles}
          locale={coachMarkLocale}
          callback={handleJoyrideCallback}
          tooltipComponent={Tooltip}
        />

        <Breadcrumb className="m-3 mt-1">
          <BreadcrumbItem>
            <a href="/promo">Promo</a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Detail Promo</BreadcrumbItem>
        </Breadcrumb>

        <div className="promo-detail-section">
          <Container className="wrapper-content pt-0">
            <img
              src={promo?.image_link ? promo?.image_link : '/assets/images/noimage.png'}
              className="img-fluid rounded"
              alt={promo?.name}
            />

            <Text tag="h1" className="d-flex align-items-center text-title fw-weight-700 fs-6 mt-3">
              {promo?.name}

              {promo?.badge && (
                <Tags
                  pill
                  className="ms-1"
                  color="secondary-light"
                  size="sm"
                  tag="span"
                  title={promo?.badge}
                  textColor="secondary"
                />
              )}
            </Text>

            {promo?.meta?.subheadline && (
              <Text tag="p" className="text-label fs-8 mt-1">
                {promo?.meta?.subheadline}
              </Text>
            )}

            <div className="d-flex mt-3" id="coachMarkPromoStep2">
              <div className="justify-content-center align-items-center">
                <Tags
                  pill
                  className="p-2"
                  color="white-lg"
                  size="sm"
                  tag="span"
                  icon="/assets/icons/calendar.svg"
                  iconClassName="icon-small"
                  title={`${moment(promo?.start_date).format('DD MMM')} - ${moment(
                    promo?.end_date
                  ).format('DD MMM YYYY')}`}
                  textColor="placeholder"
                />
              </div>

              {promo?.promo_tnc && (
                <div
                  onClick={() => setShowTncModal(!showTncModal)}
                  className="tnc-section text-end flex-grow-1">
                  <span>Syarat & Ketentuan</span>
                </div>
              )}
            </div>

            <div className="promo-quick-filter d-flex mt-2" id="coachMarkPromoStep3">
              <Tags
                onClick={() => handleExtraFilterClick()}
                className="tags"
                active={hasExtraFilter}
                size="md"
                color="white-md"
                textColor="title"
                icon={
                  hasExtraFilter
                    ? '/assets/icons/filter-knob-white.svg'
                    : '/assets/icons/filter-knob.svg'
                }
                title="Filter"
              />

              <Tags
                onClick={() => setHasModalLocation(!hasModalLocation)}
                className="tags ms-2 w-100 text-truncate"
                active={true}
                size="md"
                color="white-md"
                textColor="title"
                icon={'/assets/icons/pin-map-white.svg'}
                title={geoLocation?.address}
              />
            </div>
          </Container>

          <div className="m-3 mt-2">
            {/* Warning Section */}
            {showNoPackage && (
              <Col>
                <EmptyState
                  image="/assets/images/nearest-workshop.png"
                  title="Tidak Menemukan Bengkel">
                  Kami tidak menemukan servis
                  <strong>
                    {' '}
                    {promo?.promo_code === 'AKIGS'
                      ? 'Aki'
                      : capitalizeFirstLetter(promo?.service_category)}{' '}
                  </strong>
                  {car?.carModel && (
                    <span>
                      untuk <strong>{car?.carModel} </strong>
                    </span>
                  )}
                  di sekitarmu. Coba cek filter kamu, atau beralih ke mobil maupun promo lainnya.
                </EmptyState>
              </Col>
            )}

            {/* Header Section */}
            {showPackage && (
              <div className="promo-package-heading mb-3">
                {headerType == '1' && (
                  <>
                    <span>Promo untuk</span>
                    <span className="mx-1 text-secondary">{car?.carModel}</span>
                    <Popover
                      isOpen={popoverOpen}
                      onClickOutside={() => setPopoverOpen(false)}
                      positions={['bottom']}
                      content={
                        <div className="popover-info-box p-2">
                          <div>
                            List dibawah ini ditampilkan berdasarkan mobil Kamu yang sedang aktif.
                            Untuk mengganti mobil yang aktif, klik pada gambar mobil di bagian atas
                            layar.
                          </div>
                          <div className="ms-1 pointer" onClick={() => setPopoverOpen(false)}>
                            x
                          </div>
                        </div>
                      }>
                      <span className="pointer" onClick={() => setPopoverOpen(!popoverOpen)}>
                        <img src="/assets/icons/info-circle.svg" width="16" alt="" />
                      </span>
                    </Popover>
                  </>
                )}
                {headerType == '2' && <div>Promo Terdekat</div>}
                {headerType == '3' && <div>Produk promo yang tersedia</div>}
              </div>
            )}

            {/* Package Available Section */}
            <div className="card-promo-sku-container">
              {packages.map((item, index) => {
                let price, original_price;

                if (item?.discount_amount > 0) {
                  price = item?.discounted_price;
                  original_price = item?.package?.original_price;
                } else {
                  price = item?.package?.original_price;
                }

                const showDiscount = hasCar && item?.discount_amount > 0;
                return (
                  <WatchImpression
                    key={index}
                    data={item}
                    index={index}
                    ratioPush={0}
                    primaryKey={item?.package?.id}
                    impressions={productImpression}
                    onChange={setProductImpression}
                    onPush={handlePushProductImpression}
                    useInViewOptions={{
                      rootMargin: `0px 0px -${heightOfFooter}px 0px`,
                      threshold: [0, 1]
                    }}>
                    <CardPackage
                      active={false}
                      size="md"
                      key={index}
                      title={Helper.shortenName(item?.package?.name)}
                      discount={showDiscount && Helper.formatPercentage(item?.discount_amount)}
                      originalPrice={original_price && `Rp${Helper.formatMoney(original_price)}`}
                      price={`Rp${Helper.formatMoney(price)}`}
                      image={item?.package?.image_link ?? '/assets/images/default-package.png'}
                      tagTitle={item?.package?.category?.name}
                      workshopIcon={item?.workshop?.tier?.image_link}
                      workshopTitle={item?.workshop?.name}
                      distanceIcon="/assets/icons/pin-map-blue-xs.svg"
                      distance={item?.distance && `${item?.distance}km`}
                      timeArrival={item?.eta && `- ${item?.eta} mins`}
                      buttonVehicleImage="/assets/icons/add-car-orange-fill.svg"
                      buttonLocationImage="/assets/icons/pin-map-blue-fill-xs.svg"
                      showButtonLocation={!geoLocation.allowed}
                      showButtonVehicle={!hasCar}
                      buttonVehicleClick={() => editCar()}
                      buttonLocationClick={() => setHasModalLocation(true)}
                      showButton={item?.workshop?.tier?.value !== 'non_verified'}
                      buttonId={`button_order_now${index}`}
                      buttonClick={() => handlePackageClick(item, index)}
                      buttonLabel="Pesan Sekarang"
                      className="custom-card-package"
                    />
                  </WatchImpression>
                );
              })}
            </div>
            {/* Loading Section */}
            {hasMorePackage && (
              <div className="d-flex justify-content-center p-3 mb-2">
                <Spinner color="primary" size="sm" />
              </div>
            )}

            {showPackage && (
              <div
                className="btn-promo-search-more my-3"
                color="light"
                outline
                block
                onClick={handleSearchMore}>
                <img src="/assets/icons/explore-active.svg" width={16} alt="" />
                <span className="mx-2">Cek Berdasarkan Lokasi Bengkel</span>
                <img src="/assets/icons/right-arrow-gray.svg" width={16} alt="" />
              </div>
            )}
          </div>
        </div>

        <OrderSheet
          openSheet={openOrderSheet}
          activePkg={activePkg}
          cartPkg={cartPkg}
          order={order}
          onDismiss={handleDismiss}
          onSpringStart={handleSprintStart}
          onSelectLineItem={handleSelectLineItem}
          onSubmit={handleSubmit}
        />

        <BottomSheet
          className="box-mobile-first bottom-sheet-map"
          open={openFilterBottomSheet}
          snapPoints={() => [490]}
          skipInitialTransition
          scrollLocking={false}
          blocking={false}
          onSpringStart={(event) => {
            if (event.type === 'SNAP' && event.source === 'dragging') {
              setOpenFilterBottomSheet(false);
            }
          }}>
          <Scrollbars autoHide autoHeight autoHeightMin={'calc(85vh - 106px)'} universal={true}>
            <Container className="px-2 mt-1">
              <InputRadioGroup
                filterData={sheetFilters}
                defaultValue={extraFilter}
                onApply={handleApplyExtraFilter}
              />
            </Container>
          </Scrollbars>
        </BottomSheet>
      </>
    </PrivateLayout>
  );
};

export default DetailPromo;

export async function getServerSideProps({ query }) {
  const { variant_car_id, id } = query;

  let carVariantID = '';
  if (variant_car_id) carVariantID = variant_car_id;

  const [serviceCategoriesRes, promoRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/search/filter_options/`),
    fetch(`${process.env.API_URL}v2/promo/by_slug/${id}`)
  ]);

  const [services, promoData] = await Promise.all([serviceCategoriesRes.json(), promoRes.json()]);
  const sheetFilters = services?.data;
  const promo = promoData?.data ? promoData?.data : null;

  return {
    props: {
      variant_car_id: carVariantID,
      sheetFilters,
      promo
    }
  };
}
