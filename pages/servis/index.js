/* eslint-disable no-self-assign */
import CardFeature from '@components/card/CardFeature';
import CardUnreview from '@components/card/CardUnreview';
import { AboutFooter, Footer } from '@components/footer/Footer';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  Button,
  CardRecommendService,
  Container,
  ContentWrapper,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from '@components/otoklix-elements';
import ServiceAlertBooking from '@components/servis/ServiceAlertBooking';
import ServiceLocationHeader from '@components/servis/ServiceLocationHeader';
import ServiceTrendingWorkshop from '@components/servis/ServiceTrendingWorkshop';
import Uppersheet from '@components/sheet/UpperSheet';
import Skeleton from '@components/skeleton/Skeleton';
import WatchImpression from '@components/watch-impression/WatchImpression';
import Masonry from '@components/wrapper/Masonry';
import { useAuth } from '@contexts/auth';
import * as Sentry from '@sentry/nextjs';
import MoEngage from '@utils//MoEngage';
import { api, authenticateAPI } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { bannerPromoSettings, gambirLocation, trendingSettings } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import { isBrowser } from '@utils/isBrowser';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import assign from 'lodash/assign';
import isUndefined from 'lodash/isUndefined';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import url from 'url';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const AlertCarInfo = dynamic(() => import('@components/car/AlertCarInfo'));
const NewCar = dynamic(() => import('@components/car/NewCar'));
const FlagshipModal = dynamic(() => import('@components/modal/FlagshipModal'));
const LocationModal = dynamic(() => import('@components/modal/LocationModal'));
const RatingFormBundle = dynamic(() => import('@components/rating-review/RatingFormBundle'));
const AddCarSheet = dynamic(() => import('@components/sheet/AddCarSheet'));
const CheckCompatibilitySheet = dynamic(() => import('@components/sheet/CheckCompatibilitySheet'));

Sentry.addBreadcrumb({
  category: 'pages/index',
  message: `Rendering index page (${isBrowser() ? 'browser' : 'server'})`,
  level: Sentry.Severity.Debug
});

const Index = ({ serviceCategories, promos, faqs, topServices }) => {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const { lat, lng } = router.query;

  const [address, setAddress] = useState('');
  const [hasNewCar, setHasNewCar] = useState(false);
  const [userCar, setUserCar] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);
  const [alertData, setAlertData] = useState(null);
  const [hideAlerts, setHideAlerts] = useState([]);
  const [packageList, setPackages] = useState([]);
  const [hasPackageList, setHasPackageList] = useState(true);
  const [hasStickyInfo, setHasStickyInfo] = useState(false);
  const [geoLocation, setGeoLocation] = useState();
  const [trendingWorkshop, setTrendingWorkshop] = useState([]);
  const [hasTrendingWs, setHasTrendingWs] = useState(true);
  const [unreviewList, setUnreviewList] = useState([]);
  const [ratingForm, setRatingForm] = useState(false);
  const [activeBookingCode, setActiveBookingCode] = useState('');
  const [heightOfHeader, setHeightOfHeader] = useState(0);
  const [heightOfFooter, setHeightOfFooter] = useState(0);
  const [promoImpression, setPromoImpression] = useState([]);
  const [workshopImpression, setWorkshopImpression] = useState([]);
  const [productImpression, setProductImpression] = useState([]);
  const [skipImpression, setSkipImpression] = useState(false);
  const [widthOfBlockerProductImpression, setWidthOfBlockerProductImpression] = useState('0px');
  const [widthOfBlockerWorkshopImpression, setWidthOfBlockerWorkshopImpression] = useState('0px');
  const [loadingMorePackage, setLoadingMorePackage] = useState(false);
  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [pagePackage, setPagePackage] = useState(1);
  const [totalPackage, setTotalPackage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState();
  const [openCompability, setOpenCompability] = useState(false);
  const [openNewCar, setOpenNewCar] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const [openAlert, setOpenAlert] = useState(true);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');
  const [showUpperSheet, setShowUpperSheet] = useState(true);

  const limitPackage = 4;
  const getUserCar = Cookies.get('user_car', { path: '/' });
  const getHasStickyInfo = Cookies.get('has_info', { path: '/' });
  const carName = `${userCar?.car_details?.car_model?.model_name} ${userCar?.car_details?.variant}`;

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const getQueryWorkshopUrl = () => {
    let query = {};

    if (userCar?.car_details?.id) {
      assign(query, {});
    }

    return query;
  };

  const fetchUserCar = async () => {
    authenticateAPI(token);

    const response = await api.get('v2/account/profile/');
    const responseData = response.data.data;

    setUserCar(responseData?.user_car ? responseData?.user_car : '');
  };

  const fetchUnreviews = async () => {
    authenticateAPI(token);
    const response = await api.get('v2/bookings/unreviewed/?limit=8');
    const responseData = response.data.data;
    const filterResponseData = responseData.filter(
      (item) => item?.workshop?.tier?.value !== 'non_verified'
    );
    setUnreviewList(filterResponseData);
  };

  const showGlobalSearch = () => {
    gtag('click search', 'clickHomePage');
    amplitude.getInstance().logEvent('search initiated', { source_search: 'home page' });

    router.push({
      pathname: '/cari',
      query: {
        origin: 'homepage'
      }
    });
  };

  const goToPromoPage = (item, index) => {
    const promoName = {
      promo_name: item?.redirect_link || item?.name,
      promo_code: item?.promo_code,
      source_banner: 'home'
    };
    const url = new URL(window.location.href);
    item.position = index + 1;

    gtag('click promo', 'clickHomePage', item?.redirect_link || item?.slug);
    GtmEvents.gtmPromoClickWorkshopBannerIndex(
      [item],
      'Banner',
      'Promo buat kamu',
      url,
      userCar,
      geoLocation
    );

    amplitude.getInstance().logEvent('promo banner selected', promoName);

    window.location.href = getPromoUrl(item);
  };

  const getPromoUrl = (item) => {
    if (item?.redirect_link) {
      return item?.redirect_link;
    } else if (item?.slug) {
      return `promo/${item.promo_group_slug}/${item.slug}?origin=homepage`;
    } else {
      return '/';
    }
  };

  const goToCategoryPage = (slug, name) => {
    gtag('click category icon', 'clickHomePage', slug);
    GtmEvents.gtmServiceMenuClickHomePage('Mau cari perawatan apa? - Homepage', name);

    amplitude.getInstance().logEvent('service category menu selected', {
      service_category: slug,
      source_icon: 'home',
      page_location: fullPath
    });

    const query = getQueryWorkshopUrl(slug);
    query.service_category = slug;

    router.push({
      pathname: `/cari`,
      query: { ...query }
    });
  };

  const categoryPage = (slug) => {
    const query = getQueryWorkshopUrl(slug);
    query.service_category = slug;

    return url
      .format({
        pathname: `/cari`,
        query: { ...query }
      })
      .toString();
  };

  const fetchNotifications = async () => {
    authenticateAPI(token);

    api
      .get('v2/notifications/count/')
      .then((res) => {
        setNotificationCount(res?.data?.data?.unread);
      })
      .catch(() => setNotificationCount(0));
  };

  const fetchCustomerWidget = async () => {
    if (isAuthenticated) {
      authenticateAPI(token);
      api
        .get('v2/widget/customer')
        .then((res) => {
          setAlertData(res.data.data);
        })
        .catch((e) => console.log(e));
    }
  };

  const showAlertBooking =
    alertData?.widget_type == 'ongoing_booking' && alertData.bookings.length !== hideAlerts.length;

  const goToWorkshopPage = (trending, index) => {
    const url = new URL(window.location.href);
    trending.position = index + 1;
    let query = {
      origin: 'Bengkel Rekomendasi'
    };
    GtmEvents.gtmPromoClickWorkshopBannerIndex(
      [trending],
      'Workshop',
      'Bengkel Rekomendasi',
      url,
      userCar,
      geoLocation
    );

    amplitude.getInstance().logEvent('recommendation selected', {
      recommendation_type: 'workshop',
      recommendation_location: 'home page',
      recommendation_name: trending?.slug,
      is_fulfilled_by_otoklix: trending?.is_fbo ? true : false
    });

    router.push({ pathname: `/bengkel/${trending.slug}`, query: query });
  };

  const checkCompability = (item) => {
    setSelectedProduct(item);
    setOpenCompability(true);
  };

  const goToNotification = () => {
    gtag('click notifcenter', 'clickHomePage');
    router.push('/notification');
  };

  const goToAuth = () => {
    amplitude
      .getInstance()
      .logEvent('auth initiated', { cta_location: 'top', page_location: fullPath });
    router.push('/auth');
  };

  const goToAllPromo = () => {
    gtag('click all promo', 'clickHomePage');
    GtmEvents.gtmClickAllPromo('Promo buat kamu - Homepage');
    amplitude.getInstance().logEvent('view all selected', {
      source_cta: 'home',
      section: 'promo',
      page_location: fullPath
    });
    router.push('/promo');
  };

  const goToRecommendWs = () => {
    amplitude.getInstance().logEvent('view all selected', {
      source_cta: 'home',
      section: 'recommendation workshop',
      page_location: fullPath
    });
    router.push({
      pathname: '/cari',
      query: {
        service_category: 'workshop',
        sorting: 'closest',
        recommendation: true
      }
    });
  };

  const goToWsList = (params) => {
    router.push({ pathname: `/cari/pilih-bengkel`, query: params });
  };

  const goToSKUdetail = (item, index) => {
    setOpenAlert(false);
    gtag('click sku', 'clickHomePage', item?.name);
    amplitude.getInstance().logEvent('recommendation selected', {
      recommendation_location: 'home page',
      recommendation_type: 'product',
      recommendation_name: item?.name,
      is_fulfilled_by_otoklix: item?.is_fbo ? true : false
    });

    item.position = index + 1;
    GtmEvents.gtmProductClickIndex([item], item?.name ?? '', 'Servis untuk Kamu');
    const id = item?.id;
    const car = userCar?.car_details?.id ?? '';
    Cookies.set('product_id_selected', id);
    if (!car) {
      setSelectedProduct(item);
      setOpenNewCar(true);
    } else {
      if (!item?.compatibility && Helper.checkCompatibility(item?.category?.slug)) {
        checkCompability(item);
      } else {
        const params = {};
        goToWsList(params);
      }
    }
  };

  const closeStickyInfo = () => {
    Cookies.set('has_info', '0', { expires: 1, path: '/' });
    gtag('close otobuddy highlight', 'clickOtoBuddyHighlight');

    setHasStickyInfo(false);
  };

  const openReviewForm = (code) => {
    setActiveBookingCode(code);
    setRatingForm(true);
  };

  const handlePushPromoImpression = (impressions) => {
    triggeredTrackingPromoAndWorkshopImpression(impressions, 'Banner', 'Promo buat kamu');
  };

  const handlePushWorkshopImpression = (impressions) => {
    triggeredTrackingPromoAndWorkshopImpression(impressions, 'Workshop', 'Bengkel Rekomendasi');
  };

  const handlePushProductImpression = (impressions) => {
    triggeredTrackingProductImpression(impressions);
  };

  const triggeredTrackingPromoAndWorkshopImpression = (impressions, category, title) => {
    if (impressions?.length > 0) {
      const url = new URL(window.location.href);
      GtmEvents.gtmPromoImpressionsWorkshopBannerIndex(
        impressions,
        category,
        title,
        url,
        userCar,
        geoLocation
      );
    }
  };

  const triggeredTrackingProductImpression = (impressions) => {
    if (impressions?.length > 0) {
      GtmEvents.gtmProductImpressionsIndex(impressions, 'Servis untuk Kamu');
    }
  };

  const handleChangeMargin = () => {
    if (typeof document !== 'undefined') {
      setHeightOfHeader(document?.querySelector('.header-menu')?.clientHeight ?? 0);
      setHeightOfFooter(document?.querySelector('.appbar')?.clientHeight ?? 0);
    }
  };

  const addMorePackage = async () => {
    amplitude
      .getInstance()
      .logEvent('load more attempted', { load_more_attempt: pagePackage, page_location: fullPath });
    setLoadingMorePackage(true);

    const params = {
      limit: 20,
      page: 1,
      latitude: geoLocation?.lat,
      longitude: geoLocation?.lng,
      variant_car_id: userCar?.car_details?.id
    };
    await api.get(`v2/search/service/recommendation`, { params }).then((res) => {
      const list = res?.data?.data;
      setPackages([...list]);
      setShowMoreButton(false);
      setLoadingMorePackage(false);
    });
  };

  const getAddress = async () => {
    const addressLocation = getAddressLocation(geoLocation?.lat, geoLocation?.lng);
    await addressLocation.then((response) => {
      setAddress(response.address);
    });
  };

  const handleSelectLocation = (suggestion) => {
    setHasModalLocation(!hasModalLocation);
    getGeocode({ address: suggestion.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setGeoLocation({
          ...geoLocation,
          lat: lat,
          lng: lng,
          address: suggestion.description
        });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const handleEditLocation = () => {
    setHasModalLocation(!hasModalLocation);
    gtag('click cari di sekitar', 'clickSearchPage');
  };

  const getTrendingWorkshop = () => {
    setHasTrendingWs(true);
    const params = {
      limit: 4,
      page: 1,
      latitude: geoLocation.lat,
      longitude: geoLocation.lng,
      variant_car_id: userCar?.car_details?.id,
      origin: 'home'
    };
    api
      .get(`v2/search/workshop/recommendation`, { params })
      .then((res) => {
        setTrendingWorkshop(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPackages = () => {
    setHasPackageList(true);
    const params = {
      limit: limitPackage,
      page: 1,
      latitude: geoLocation?.lat,
      longitude: geoLocation?.lng,
      variant_car_id: userCar?.car_details?.id
    };

    api.get(`v2/search/service/recommendation`, { params }).then((res) => {
      setPackages(res?.data?.data);
      setTotalPackage(res?.data?.pagination?.total_rows);
    });
  };

  const getPrice = (price, unit) => {
    let finalPrice;
    if (!isUndefined(userCar?.car_details?.id)) {
      finalPrice = `${Helper.formatMoney(price)}`;
    } else {
      finalPrice = `${Helper.formatMoney(price)} ${unit !== null ? `/${unit}` : ''}`;
    }
    return `Rp${finalPrice}`;
  };

  const getSubprice = (item) => {
    if (
      !isUndefined(userCar?.car_details?.id) &&
      item?.category?.slug === 'oli' &&
      item?.product_unit
    ) {
      return `Rp${Helper.formatMoney(item?.product_price)}/${item?.product_unit}`;
    } else {
      return null;
    }
  };

  const getSubtitle = (item) => {
    if (item?.product_unit && item?.product_quantity !== null) {
      return item?.product_quantity + ' ' + item?.product_unit;
    }
    return '';
  };

  const handleSetNewCar = (e, item) => {
    const productId = item?.id;
    Cookies.set('product_id_selected', productId);
    if (Helper.checkCompatibility(item?.category?.slug)) {
      api
        .get(`v2/product/is-car-recommendation/?variant_car_id=${e?.value}&product_id=${productId}`)
        .then((res) => {
          const compatibility = res?.data?.data?.is_car_recommendation;

          if (!compatibility) {
            checkCompability(item);
          } else {
            const params = {};
            goToWsList(params);
          }
        });
    } else {
      const params = {};
      goToWsList(params);
    }
  };

  const handleCloseAddNewCar = () => {
    amplitude.getInstance().logEvent('add new car skipped', {
      position: `home page`,
      page_location: fullPath
    });
    setOpenNewCar(false);
  };

  const handleRecommend = () => {
    setPagePackage(1);
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'rekomendasi'
    });
    const elm = document.getElementById('content-card-services');
    elm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setOpenCompability(false);
  };

  const forceOrder = () => {
    Cookies.set('product_id_selected', selectedProduct?.id);
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'lanjut order'
    });
    const params = {};
    goToWsList(params);
  };

  const handleCloseCheck = () => {
    setOpenCompability(false);
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
  };

  useEffect(() => {
    if (geoLocation?.lat && geoLocation.lng) {
      getTrendingWorkshop();
      getPackages();
      getAddress();
    }
  }, [geoLocation]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCar();
      fetchCustomerWidget();
      fetchUnreviews();
    } else {
      if (getUserCar) {
        setUserCar(JSON.parse(getUserCar));
      }
    }
  }, [user, getUserCar]);

  useEffect(() => {
    gtag('view home page', 'viewHomePage');

    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation({
        ...geoLocation,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      Helper.updateLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
    MoEngage.trackEvent('screen viewed', {
      screen_name: 'home',
      page_location: fullPath
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (lat && lng) {
      setGeoLocation({
        lat,
        lng
      });
    } else {
      setGeoLocation({
        lat: gambirLocation.lat,
        lng: gambirLocation.lng
      });
    }
  }, [lat, lng, userCar]);

  useEffect(() => {
    if (getHasStickyInfo === undefined) {
      Cookies.set('has_info', '0', { expires: 1, path: '/' });
      setHasStickyInfo(true);
    } else {
      if (getHasStickyInfo === '1') {
        setHasStickyInfo(true);
      } else {
        setHasStickyInfo(false);
      }
    }

    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'home',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  useEffect(() => {
    handleChangeMargin();
  }, [hasStickyInfo]);

  useEffect(() => {
    setSkipImpression(ratingForm ? true : false);
  }, [ratingForm]);

  useEffect(() => {
    setTimeout(() => {
      setWidthOfBlockerProductImpression('-100%');
      setTimeout(() => {
        setWidthOfBlockerProductImpression('0px');
      }, 50);
    }, 50);
    if (+packageList?.length === 0) {
      setHasPackageList(false);
    }
  }, [packageList, totalPackage]);

  useEffect(() => {
    setTimeout(() => {
      setWidthOfBlockerWorkshopImpression('-100%');
      setTimeout(() => {
        setWidthOfBlockerWorkshopImpression('0px');
      }, 50);
    }, 50);
    if (+trendingWorkshop?.length === 0) {
      setHasTrendingWs(false);
    }
  }, [trendingWorkshop]);

  useEffect(() => {
    const authType = Cookies.get('auth');

    if (isAuthenticated) {
      if (authType === 'login') {
        BranchTracker('LOGIN', { name: user?.name, user_id: user?.id });
        Cookies.remove('auth');
      } else if (authType === 'register') {
        BranchTracker('COMPLETE_REGISTRATION', {
          name: user?.name,
          user_id: user?.id,
          join_date: new Date()
        });
        Cookies.remove('auth');
      }
    }
  }, [isAuthenticated]);

  const jsonDataPromo = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: promos?.data?.map((promo, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${process.env.APP_URL}${getPromoUrl(promo)}`
      };
    })
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonDataPromo)
          }}
        />
      </Head>
      <PrivateLayout
        otobuddySource="home"
        isAuthenticated={isAuthenticated}
        hasInfoSticky={false}
        closeStickyInfo={() => closeStickyInfo()}
        notificationCount={notificationCount}
        goToNotification={() => goToNotification()}
        title={Helper.exploreMetaTags('servis')?.title}
        description={Helper.exploreMetaTags('servis')?.desc}>
        <Modal isOpen={hasNewCar} className="wrapper wrapper-xs modal-no-shadow">
          <ModalHeader className="p-0"></ModalHeader>
          <ModalBody className="p-0">
            <NewCar closeHasNewCar={() => setHasNewCar(false)} />
          </ModalBody>
        </Modal>

        <Container className="global-search-header px-0">
          {showUpperSheet && (
            <Uppersheet
              buttonText="Download"
              desc="BONUS 35.000 OtoPoints dengan melengkapi profil di aplikasi Otoklix!"
              icon="/assets/icons/call.png"
              handleOpen={() => router.push(`${process.env.BRANCH_LINK}servis`)}
              handleCloseSheet={() => setShowUpperSheet(false)}
              page="home"
              closeIcon="/assets/icons/close-white.svg"
            />
          )}
          <Row className="p-0 mx-3">
            {/* input search section */}
            <ServiceLocationHeader
              isAuth={isAuthenticated}
              notifCount={notificationCount}
              onShowSearch={showGlobalSearch}
              onClickNotif={goToNotification}
              onSignIn={goToAuth}
            />
          </Row>
        </Container>
        <Container className="home-content content-with-footer">
          <Row>
            {/* location */}
            <div className="address-header-wrapper mb-3 ps-3 w-100">
              <div className="pointer" onClick={handleEditLocation}>
                <img
                  src={`/assets/icons/location.svg`}
                  alt="icon_location"
                  height={13}
                  width={13}
                  className="icon-address"
                  loading="eager"
                />
                <span className="text-address">{Helper.truncateText(address, 50)}</span>
              </div>
            </div>

            {/* service category section */}
            <ContentWrapper className="mb-0">
              <div className="d-flex overflow-auto service-home">
                {serviceCategories?.data.map((menu, index) => {
                  const { name, icon_link, slug, is_clickable } = menu;
                  return (
                    <Icon
                      id={`button_service_category_${index}`}
                      data-automation={`home_button_service_category_${index}`}
                      tag={`${is_clickable ? 'a' : 'div'}`}
                      href={categoryPage(slug)}
                      key={name}
                      imgAlt={name}
                      image={icon_link}
                      title={name}
                      className="box-icon-home"
                      iconClassName="bg-neutral br-075"
                      textClassName="icon-text"
                      lazyLoad={false}
                      onClick={() => {
                        if (is_clickable) {
                          goToCategoryPage(slug, name);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </ContentWrapper>

            <ContentWrapper className="my-2">
              <CardFeature pathSource={fullPath} />
            </ContentWrapper>

            {/* promo carousel section */}
            {+promos?.data?.length > 0 ? (
              <ContentWrapper
                id="all_promo"
                leftPadding
                title="Promo Menarik buat Kamu"
                dataAutomationTitle="home_content_wrapper_title_promo"
                cardTitleProps={{ tag: 'h2' }}
                subtitle={
                  <Link href="/promo/promo-general" passHref>
                    <a href="/promo/promo-general" title="Promo">
                      Lihat Semua
                    </a>
                  </Link>
                }
                dataAutomationSubtitle="home_content_wrapper_lihat_semua_promo"
                subtitleClick={() => goToAllPromo()}
                className="pe-0 px-0 left-slick-container"
                classNameTitle="title-container"
                classNameSubtitle="subtitle-container">
                <Row className="m-0">
                  <Slider {...bannerPromoSettings}>
                    {promos?.data?.map((promo, index) => {
                      return (
                        <WatchImpression
                          key={index}
                          data={promo}
                          index={index}
                          ratioPush={0}
                          primaryKey={promo?.slug}
                          display={'inline-block'}
                          impressions={promoImpression}
                          onChange={setPromoImpression}
                          onPush={handlePushPromoImpression}
                          useInViewOptions={{
                            skip: skipImpression,
                            rootMargin: `-${heightOfHeader}px 0px -${heightOfFooter}px 0px`,
                            threshold: [0, 1]
                          }}>
                          <Link
                            id={`card_promo_${index}`}
                            href={getPromoUrl(promo)}
                            key={index}
                            passHref>
                            <a href={getPromoUrl(promo)}>
                              <img
                                data-automation={`home_card_promo_${index}`}
                                key={promo.name}
                                src={promo.image_link}
                                alt={promo.name}
                                loading="eager"
                                className="rounded-1 img-fluid pointer"
                                onClick={() => goToPromoPage(promo, index)}
                                role="presentation"
                              />
                            </a>
                          </Link>
                        </WatchImpression>
                      );
                    })}
                  </Slider>
                </Row>
              </ContentWrapper>
            ) : (
              ''
            )}

            {unreviewList.length > 0 && (
              <ContentWrapper
                leftPadding
                title="Beri Review"
                cardTitleProps={{ tag: 'h2' }}
                className="pt-3 px-0 left-slick-container small-review-wrapper">
                <Slider {...trendingSettings}>
                  {unreviewList?.map((item, index) => (
                    <div
                      data-automation={`home_card_unreview_${index}`}
                      className="pointer"
                      key={index}
                      onClick={() => openReviewForm(item?.booking_details?.booking_code)}>
                      <CardUnreview
                        wsName={item?.workshop?.name}
                        image={item?.workshop?.image_link}
                        category={item?.booking_details?.service_category}
                        categoryIcon={item?.booking_details?.icon_link}
                        roleName={item?.workshop?.tier?.name}
                        roleIcon={item?.workshop?.tier?.image_link}
                        date={item?.booking_details?.service_date}
                      />
                    </div>
                  ))}
                </Slider>
              </ContentWrapper>
            )}

            {showAlertBooking && (
              <ServiceAlertBooking
                alertData={alertData}
                hideAlert={hideAlerts}
                onHideAlert={setHideAlerts}
              />
            )}

            {/* trending workshop section */}
            {hasTrendingWs ? (
              <>
                {trendingWorkshop && trendingWorkshop?.length > 0 ? (
                  <ServiceTrendingWorkshop
                    heightHeader={heightOfHeader}
                    heightFooter={heightOfFooter}
                    widthBlocker={widthOfBlockerWorkshopImpression}
                    trendingWorkshop={trendingWorkshop}
                    workshopImpression={workshopImpression}
                    onClickSubtitle={goToRecommendWs}
                    onSetWsImpress={setWorkshopImpression}
                    onPushWsImpress={handlePushWorkshopImpression}
                    onClickCard={goToWorkshopPage}
                    openPopUp={handleOpenPopUp}
                  />
                ) : (
                  <div className="card-service-container home">
                    {[...Array(4).keys()].map((value) => (
                      <Skeleton width="100%" height={222} className="br-1 mb-0" key={value} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
            <div id="content-card-services" />
            {/* service recommended service */}
            {hasPackageList ? (
              <>
                <ContentWrapper
                  title="Rekomendasi Servis buat Kamu"
                  dataAutomationTitle="home_content_wrapper_title_rekomendasi_servis"
                  className="mt-2 mb-4 px-2"
                  classNameTitle="title-container"
                  cardTitleProps={{ tag: 'h2' }}>
                  <Masonry column={2} gap="12px">
                    {packageList.length > 0
                      ? packageList.map((item, index) => {
                          const hasDiscount = item?.discount_value > 0;
                          return (
                            <WatchImpression
                              key={index}
                              data={item}
                              index={index}
                              ratioPush={0}
                              primaryKey={item?.id}
                              impressions={productImpression}
                              onChange={setProductImpression}
                              onPush={handlePushProductImpression}
                              useInViewOptions={{
                                rootMargin: `-${heightOfHeader}px 0px -${heightOfFooter}px ${widthOfBlockerProductImpression}`,
                                threshold: [0, 1]
                              }}>
                              <CardRecommendService
                                key={index}
                                className="w-100"
                                title={item?.name}
                                subTitle={getSubtitle(item)}
                                discountLabel={hasDiscount ? `${item.discount_value}%` : ''}
                                category={item?.category?.name}
                                startPrice={
                                  hasDiscount
                                    ? `Rp${Helper.formatMoney(item?.original_price)}`
                                    : null
                                }
                                data-automation={`card_rekomendasi_servis_${index}`}
                                price={getPrice(item?.price, item?.product_unit)}
                                subPrice={getSubprice(item)}
                                image={item?.image_link ?? '/assets/images/default-package.png'}
                                isRecommended={Helper.labelRecommend(item?.compatibility)}
                                onCardClick={() => goToSKUdetail(item, index)}
                                showUsp={item?.category?.slug === 'oli' && item?.is_fbo}
                                guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
                                discountIcon={'/assets/icons/discount.svg'}
                                bookmarkIcon={'/assets/icons/bookmark.svg'}
                              />
                            </WatchImpression>
                          );
                        })
                      : [...Array(4).keys()].map((value) => (
                          <Skeleton width="100%" height={270} className="br-1 mb-0" key={value} />
                        ))}
                  </Masonry>
                  {showMoreButton && (
                    <Button
                      block
                      outline
                      className="text-md mt-3 br-30"
                      color="primary"
                      data-automation="button_rekomendasi_tampil_lebih_banyak"
                      onClick={() => addMorePackage()}
                      disabled={loadingMorePackage}
                      loading={loadingMorePackage}>
                      Tampilkan Lebih Banyak
                    </Button>
                  )}
                </ContentWrapper>
              </>
            ) : (
              <></>
            )}

            {/* footer section */}
            <Footer faqs={faqs?.data} />
          </Row>
        </Container>

        <AlertCarInfo carName={carName} hasBottomSheet={openCompability} openAlert={openAlert} />

        <AboutFooter topServices={topServices} />

        <RatingFormBundle
          open={ratingForm}
          bookingCode={activeBookingCode}
          onClose={() => setRatingForm(false)}
          onOpen={() => setRatingForm(true)}
        />

        <LocationModal
          toggle={() => setHasModalLocation(!hasModalLocation)}
          isOpen={hasModalLocation}
          handleSelectSuggestion={handleSelectLocation}
          fullPath={fullPath}
          pageName={'home page'}
        />

        <CheckCompatibilitySheet
          openSheet={openCompability}
          forceOrder={() => forceOrder()}
          handleRecommend={() => handleRecommend()}
          onDismiss={() => handleCloseCheck()}
        />
        <AddCarSheet
          fullPath={fullPath}
          page={`home page`}
          openSheet={openNewCar}
          buttonType="order"
          onDismiss={handleCloseAddNewCar}
          onSetNewCar={(e) => handleSetNewCar(e, selectedProduct)}
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

export async function getServerSideProps() {
  const [serviceCategoriesRes, promoRes, faqsRes, topServicesRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/md/service-categories`),
    fetch(`${process.env.API_URL}v2/promo/featured`),
    fetch(`${process.env.API_URL}v2/faq/?faq_type=home`),
    fetch(`${process.env.API_URL}v2/product/tags/top-services`)
  ]);

  const [serviceCategories, promos, faqs, topServices] = await Promise.all([
    serviceCategoriesRes.json(),
    promoRes.json(),
    faqsRes.json(),
    topServicesRes.json()
  ]);

  return {
    props: {
      serviceCategories: serviceCategories || [],
      promos: promos || [],
      faqs: faqs || [],
      topServices: topServices || []
    }
  };
}

export default Index;
