import AlertCarInfo from '@components/car/AlertCarInfo';
import NewCar from '@components/car/NewCar';
import InputRadioGroupPromo from '@components/input/InputRadioGroupPromo';
import PrivateLayout from '@components/layouts/PrivateLayout';
import CustomModal from '@components/modal/CustomModal';
import LocationModal from '@components/modal/LocationModal';
import PromoTncModal from '@components/modal/PromoTncModal';
import {
  Button,
  CardRecommendService,
  Col,
  Container,
  ContentWrapper,
  EmptyState,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Tags,
  Text
} from '@components/otoklix-elements';
import AddCarSheet from '@components/sheet/AddCarSheet';
import OrderSheet from '@components/sheet/OrderSheet';
import WatchImpression from '@components/watch-impression/WatchImpression';
import { useAuth } from '@contexts/auth';
import Auth from '@pages/auth/index';
import { api, authenticateAPI } from '@utils/API';
import { monasLocation } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import useCar from '@utils/useCar';
import useOrderSheet from '@utils/useOrderSheet';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { isUndefined } from 'lodash';
import assign from 'lodash/assign';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { use100vh } from 'react-div-100vh';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

sentryBreadcrumb('pages/promo/[id]');

const PromoProduct = ({ variant_car_id, promo }) => {
  const router = useRouter();
  let { id, origin } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }
  let userCar = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
  const carName = `${userCar?.car_details?.car_model?.model_name} ${userCar?.car_details?.variant}`;

  const height = use100vh();
  const defaultFilterPromo = () => {
    const defaultVal = Cookies.get('filter_promo');
    if (isUndefined(defaultVal)) {
      return userCar ? 'recommended-car' : 'best-seller';
    } else {
      return defaultVal;
    }
  };

  const { user, isAuthenticated, token, authenticate } = useAuth();
  const { car, openModalCar, closeEditCar, firstCheck } = useCar(user, isAuthenticated);
  const { openOrderSheet, activePkg, cartPkg, order, dispatch } = useOrderSheet();

  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [packageLoading, setPackageLoading] = useState(false);
  const [showTncModal, setShowTncModal] = useState(false);
  const [openFilterBottomSheet, setOpenFilterBottomSheet] = useState(false);
  const [openRecommendOrder, setOpenRecommendOrder] = useState(false);
  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [filterPromo, setFilterPromo] = useState(defaultFilterPromo());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePackage, setHasMorePackage] = useState(true);
  const [firstLoadPackage, setFirstLoadPackage] = useState(true);
  const [heightOfFooter, setHeightOfFooter] = useState(0);
  const [productImpression, setProductImpression] = useState([]);
  const [clickAddToCart, setClickAddToCart] = useState(false);
  const [amplitudeCheckoutValue, setAmplitudeCheckoutValue] = useState({});
  const [showModalLocation, setShowModalLocation] = useState(false);
  const [openNewCarBottomSheet, setOpenNewCarBottomSheet] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [buttonType, setButtonType] = useState('add');
  const [openAlert, setOpenAlert] = useState(true);

  const [geoLocation, setGeoLocation] = useState({
    lat: monasLocation.lat,
    lng: monasLocation.lng,
    allowed: false,
    address: null
  });

  async function fetchPromoPackages(promoCode, filterPromo, page = 1) {
    setPackageLoading(true);
    let promoUrl;

    if (car?.carVariantId) {
      promoUrl = `v2/search/promo-products/?page=${page}&variant_car_id=${car?.carVariantId}&limit=8&promo_code=${promoCode}&sort=${filterPromo}`;
    } else {
      promoUrl = `v2/search/promo-products/?page=${page}&limit=8&promo_code=${promoCode}&sort=${filterPromo}`;
    }

    try {
      const responsePackage = await api.get(`${promoUrl}`);
      responsePackage?.data?.data?.length < 8 ? setHasMorePackage(false) : setHasMorePackage(true);
      if (firstLoadPackage || page === 1) {
        setPackages(responsePackage?.data?.data);
        amplitude.getInstance().logEvent('product list viewed', {
          service_category_name: promo?.service_category,
          total_product_viewed: responsePackage?.data?.data?.length,
          source_list: 'promo details',
          workshop_name: 'none',
          page_location: fullPath
        });
      } else {
        const packagesArr = uniqBy([...packages, ...responsePackage.data.data], 'product.id');
        amplitude.getInstance().logEvent('product list viewed', {
          service_category_name: promo?.service_category,
          total_product_viewed: packagesArr?.length,
          source_list: 'promo details',
          workshop_name: 'none',
          page_location: fullPath
        });
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
      !firstLoadPackage && fetchPromoPackages(promo?.promo_code, filterPromo, currentPage + 1);
    }
  };

  const handleExtraFilterClick = () => {
    setOpenFilterBottomSheet(true);
  };

  const handleApplyExtraFilter = (val) => {
    setProductImpression([]);
    setFirstLoadPackage(true);
    setFilterPromo(val);
    Cookies.set('filter_promo', val);
    setOpenFilterBottomSheet(false);
    fetchPromoPackages(promo?.promo_code, val, 1);
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

  const handleClickButtonScroll = (actMenu) => {
    const elm = document.getElementById(actMenu);

    elm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

  const checkCompability = async (carId, prdId, promoCode) => {
    const res = await api.get(
      `v2/product/is-car-recommendation/?variant_car_id=${carId}&product_id=${prdId}&promo_code=${promoCode}`
    );
    return res?.data?.data?.is_car_recommendation;
  };

  const forceOrder = () => {
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'lanjut order'
    });
    const prdId = selectedProduct?.product?.id;
    Cookies.set('product_id_selected', prdId);
    const params = {
      promo: promo?.promo_code
    };
    router.push({ pathname: `/cari/pilih-bengkel`, query: params });
  };

  const handleProductClick = (prd) => {
    setOpenAlert(false);
    setButtonType('order');
    const usersCar = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
    const carId = isAuthenticated ? car?.carVariantId : usersCar?.car_details?.id;
    const prdId = prd?.product?.id;
    Cookies.set('product_selected_id', prdId);
    if (!usersCar?.car_details?.id) {
      setSelectedProduct(prd);
      setOpenNewCarBottomSheet(true);
    } else {
      const prdCategory = prd?.product?.product_category?.name;
      const promoCode = promo?.promo_code;
      if (promo?.service_category === 'oli') {
        checkCompability(carId, prdId, promoCode).then((res) => {
          if (!res) {
            setOpenRecommendOrder(true);
            setSelectedProduct(prd);
          } else {
            setAmplitudeCheckoutValue({
              product_name: prd?.product?.name,
              service_category_name: prdCategory,
              workshop_name: 'none',
              source_list: 'promo details',
              page_location: fullPath
            });

            GtmEvents.gtmProductClickPromo([prd], promo?.name ?? '', prd?.product?.name ?? '');

            amplitude.getInstance().logEvent('product details viewed', {
              service_category_name: prdCategory,
              product_name: prd?.product?.name,
              workshop_name: 'none',
              source_list: 'promo details',
              page_location: fullPath
            });

            const params = {
              promo: promo?.promo_code
            };

            router.push({ pathname: `/cari/pilih-bengkel`, query: params });
          }
        });
      } else {
        GtmEvents.gtmProductClickPromo([prd], promo?.name ?? '', prd?.product?.name ?? '');

        amplitude.getInstance().logEvent('product details viewed', {
          service_category_name: prdCategory,
          product_name: prd?.product?.name,
          workshop_name: 'none',
          source_list: 'promo details',
          page_location: fullPath
        });

        const params = {
          promo: promo?.promo_code
        };

        router.push({ pathname: `/cari/pilih-bengkel`, query: params });
      }
    }
  };

  const handleRecommend = () => {
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'rekomendasi'
    });
    const filterPrm = 'recommended-car';
    setOpenRecommendOrder(false);
    setFilterPromo(filterPrm);
    Cookies.set('filter_promo', filterPrm);
    fetchPromoPackages(promo?.promo_code, filterPrm, 1);
    handleClickButtonScroll('coachMarkPromoStep1');
  };

  const handleSetNewCar = (prd) => {
    handleProductClick(prd);
    setFilterPromo('recommended-car');
    Cookies.set('filter_promo', 'recommended-car');
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

    if (scrollTop > 500) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }

    if (scrollTop + clientHeight >= scrollHeight - 1 && !packageLoading) {
      handleLoadPackages();
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

  const amplitudeDetailExplore = (explore) => {
    amplitude.getInstance().logEvent('promo details explored', {
      details_selected: explore,
      promo_group_name: promo?.promo_group_name,
      promo_code: promo?.promo_code,
      page_location: fullPath
    });
  };

  const handleSyaratDanKetentuan = () => {
    amplitudeDetailExplore('terms & conditions');
    setShowTncModal(!showTncModal);
  };

  const handleCloseAddNewCar = () => {
    setOpenNewCarBottomSheet(false);
  };

  const getSubtitle = (item) => {
    if (item?.product?.unit && item?.car_oil_qty !== null) {
      return item?.car_oil_qty + ' ' + item?.product?.unit;
    }
    return '';
  };

  const selectCar = () => {
    setOpenNewCarBottomSheet(true);
    setOpenAlert(true);
  };

  const classCardRs = () => {
    if (promo?.service_category === 'oli' && userCar !== undefined) {
      return 'card-recommend-service';
    } else {
      return 'card-recommend-service-non';
    }
  };

  const getPrice = (price, unit) => {
    const unitPrice = unit ? `/${unit}` : '';
    if (userCar === undefined && promo?.service_category === 'oli') {
      return `Rp${Helper.formatMoney(price)}${unitPrice}`;
    } else {
      return `Rp${Helper.formatMoney(price)}`;
    }
  };

  useEffect(() => {
    if (firstCheck && promo?.promo_code) {
      fetchPromoPackages(promo?.promo_code, filterPromo);
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

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'promo detail',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  useEffect(() => {
    gtag('view promo detail', 'viewPromoDetail', promo?.name);
    amplitude.getInstance().logEvent('promo detail viewed', {
      promo_group_name: promo?.promo_group_name,
      promo_code: promo?.promo_code,
      page_location: fullPath
    });
  }, []);

  const showNoPackage = !packageLoading && packages.length == 0;

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
        <div className="d-flex p-2 header-promo" id="coachMarkPromoStep1">
          {origin && (
            <Icon
              textRight
              imageWidth={24}
              imageHeight={24}
              size="md"
              bgIconColor="off-white"
              onClick={() => router.back()}
              className="pointer"
              iconClassName="rounded-circle"
              image="/assets/icons/arrow-left-thin.svg"
            />
          )}
          <div className="p-1"></div>
          <Text tag="h1" className="d-flex align-items-center text-title fw-weight-700 fs-6 mt-2">
            {promo?.promo_group_name}
          </Text>
        </div>

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
                  onClick={handleSyaratDanKetentuan}
                  className="tnc-section text-end flex-grow-1">
                  <span>Syarat & Ketentuan</span>
                </div>
              )}
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

            <CustomModal
              show={showModalLocation}
              title="Oops!"
              caption="Lokasimu tidak terdeteksi. Silakan aktifkan lokasi lewat Pengaturan di browser kamu."
              submitButton="Tutup"
              submitButtonColor="secondary"
              onSubmit={() => setShowModalLocation(false)}
            />

            {/* Package Available Section */}
            {!showNoPackage && (
              <ContentWrapper
                id="all_package"
                data-automation="promo_package"
                title="Promo yang tersedia"
                cardTitleProps={{ tag: 'h2' }}
                subtitle={
                  <div>
                    <img src="/assets/icons/swap.svg" className="filter-icon" alt="filter" />
                    <span className="fw-bold mb-0 ml-05">Urutkan</span>
                  </div>
                }
                subtitleClick={() => handleExtraFilterClick()}
                className="pe-0 px-0">
                {car?.carModel && (
                  <div className="d-flex box-label">
                    <span className="label-select-car">Sesuai dengan mobil:</span>
                    <span className="selected-car" onClick={() => selectCar()}>
                      {car?.carModel}
                      <img
                        src="/assets/icons/chevron-down-primary.svg"
                        className="chevron-down-icon"
                        alt="chevron-down"
                      />
                    </span>
                  </div>
                )}
                <div className="card-promo-sku-container">
                  {packages.map((item, index) => {
                    let discount_amount;
                    if (item?.discount_amount) {
                      const calcDisc = +item?.discount_amount * 100;
                      const finalDisc =
                        +calcDisc % 1 === 0 ? calcDisc.toFixed(0) : calcDisc.toFixed(1);
                      discount_amount = `Diskon ${finalDisc}%`;
                    } else {
                      discount_amount = '';
                    }

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
                        <CardRecommendService
                          key={index}
                          className={`w-100 ${classCardRs()}`}
                          classNameTitle="title-service"
                          title={Helper.truncateText(item?.product?.name, 25)}
                          subTitle={getSubtitle(item)}
                          startFrom={userCar !== undefined && promo?.service_category === 'oli'}
                          discountLabel={discount_amount}
                          category={item?.product?.product_category?.name}
                          startPrice={
                            item?.discount_amount > 0
                              ? `Rp${Helper.formatMoney(item?.price)}`
                              : null
                          }
                          price={getPrice(item?.discounted_price, item?.product?.unit)}
                          subPrice={
                            userCar !== undefined && promo?.service_category === 'oli'
                              ? `Rp${Helper.formatMoney(item?.original_price)}/${
                                  item?.product?.unit
                                }`
                              : null
                          }
                          image={item?.product?.image_link ?? '/assets/images/default-package.png'}
                          isRecommended={item?.is_car_recommendation ? 'Sesuai Mobilmu' : ''}
                          onCardClick={() => handleProductClick(item)}
                        />
                      </WatchImpression>
                    );
                  })}
                </div>
              </ContentWrapper>
            )}

            {/* Loading Section */}
            {hasMorePackage && (
              <div className="d-flex justify-content-center p-3 mb-2">
                <Spinner color="primary" size="sm" />
              </div>
            )}
            <div
              className={`otobuddy scroll-top-btn ${showScrollButton ? '' : 'hide-buddy'}`}
              onClick={() => handleClickButtonScroll('coachMarkPromoStep1')}>
              <img src="/assets/icons/arrow-to-top.svg" alt="scroll to top" />
            </div>
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
          amplitudeValue={amplitudeCheckoutValue}
        />

        <AddCarSheet
          fullPath={fullPath}
          page={`promo page - product - ${promo?.promo_code}`}
          openSheet={openNewCarBottomSheet}
          buttonType={buttonType}
          onDismiss={handleCloseAddNewCar}
          onSetNewCar={() => handleSetNewCar(selectedProduct)}
        />

        <BottomSheet
          className="box-mobile-first bottom-sheet-map"
          open={openFilterBottomSheet}
          snapPoints={() => [285]}
          skipInitialTransition
          scrollLocking={false}
          blocking={true}
          onSpringStart={(event) => {
            if (event.type === 'SNAP' && event.source === 'dragging') {
              setOpenFilterBottomSheet(false);
            }
          }}>
          <div
            className="pointer bottom-sheet-close"
            onClick={() => setOpenFilterBottomSheet(false)}>
            <img src="/assets/icons/close.svg" alt="" />
          </div>
          <Scrollbars autoHide autoHeight autoHeightMin={'calc(85vh - 106px)'} universal={true}>
            <Container className="px-2 mt-1">
              <InputRadioGroupPromo defaultValue={filterPromo} onApply={handleApplyExtraFilter} />
            </Container>
          </Scrollbars>
        </BottomSheet>

        <BottomSheet
          className="box-mobile-first bottom-sheet-order"
          open={openRecommendOrder}
          snapPoints={() => [355]}
          skipInitialTransition
          scrollLocking={false}
          blocking={true}
          onSpringStart={(event) => {
            if (event.type === 'SNAP' && event.source === 'dragging') {
              setOpenRecommendOrder(false);
            }
          }}>
          <Scrollbars autoHide autoHeight autoHeightMin={'calc(85vh - 106px)'} universal={true}>
            <Container className="px-2 mt-1">
              <div className="text-center">
                <img src="/assets/images/logout.png" />
                <br />
                <Text className="fs-6 fw-bold">Servis Tidak sesuai Mobilmu, Nih!</Text>
                <Text tag="p" className="my-3 text-sm" color="label">
                  Kamu bisa tetap “Lanjut Order” atau klik “Rekomendasi” untuk temukan servis sesuai
                  mobilmu
                </Text>
              </div>
              <div className="d-flex">
                <Button
                  className="mb-3 mt-auto rounded-pill btn-border-primary"
                  block
                  color="subtle"
                  onClick={() => handleRecommend()}>
                  Rekomendasi
                </Button>
                <div className="p-1"></div>
                <Button
                  className="mb-3 mt-auto rounded-pill"
                  block
                  color="primary"
                  onClick={() => forceOrder()}>
                  Lanjut Order
                </Button>
              </div>
            </Container>
          </Scrollbars>
        </BottomSheet>
      </>

      <AlertCarInfo carName={carName} hasBottomSheet={openRecommendOrder} openAlert={openAlert} />
    </PrivateLayout>
  );
};

export default PromoProduct;

export async function getServerSideProps({ query }) {
  const { variant_car_id, slug } = query;

  let carVariantID = '';
  if (variant_car_id) carVariantID = variant_car_id;

  const [serviceCategoriesRes, promoRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/search/filter_options/`),
    fetch(`${process.env.API_URL}v2/promo/by_slug/${slug}`)
  ]);

  const [services, promoData] = await Promise.all([serviceCategoriesRes.json(), promoRes.json()]);
  const sheetFilters = services?.data;
  const promo = promoData?.data ? promoData?.data : null;

  return {
    props: {
      variant_car_id: carVariantID,
      sheetFilters: sheetFilters || null,
      promo: promo || null
    }
  };
}
