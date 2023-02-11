/* eslint-disable no-unused-vars */
import { getWorkshopServiceList } from '@actions/Workshop';
import Breadcrumb from '@components/breadcrumb/Breadcrumb';
import { AboutFooter } from '@components/footer/Footer';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  Button,
  CardServices,
  Carousel,
  CarouselIndicators,
  CarouselItem,
  Col,
  Container,
  EmptyState,
  Icon,
  Spinner,
  Text
} from '@components/otoklix-elements';
import ScrollSpyWrapper from '@components/wrapper/ScrollSpyWrapper';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { days } from '@utils/Constants';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import MoEngage from '@utils/MoEngage';
import useCar from '@utils/useCar';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import ScrollMenu from 'react-horizontal-scrolling-menu';

const AddCarSheet = dynamic(() => import('@components/sheet/AddCarSheet'));
const ButtonPromo = dynamic(() => import('@components/button/ButtonPromo'));
const FilterBottomsheetSort = dynamic(() => import('@components/filter/FilterBottomsheetSort'));
const RemovePromoModal = dynamic(() => import('@components/modal/RemovePromoModal'));
const FacilityDropdown = dynamic(() => import('@components/workshop-detail/FacilityDropdown'));
const CheckCompatibilitySheet = dynamic(() => import('@components/sheet/CheckCompatibilitySheet'));
const AlertCarInfo = dynamic(() => import('@components/car/AlertCarInfo'));
const MiniDetailWorkshopHeader = dynamic(() =>
  import('@components/header/MiniDetailWorkshopHeader')
);
const GuaranteeCollapse = dynamic(() => import('@components/collapse/GuaranteeCollapse'));
const PackageSheet = dynamic(() => import('@components/sheet/PackageSheet'));
const AboutServices = dynamic(() => import('@components/footer/AboutServices'));
const ReviewFacilityTab = dynamic(() => import('@components/workshop-detail/ReviewFacilityTab'));
const ReviewSection = dynamic(() => import('@components/workshop-detail/ReviewSection'));
const InvisibleNavbar = dynamic(() => import('@components/workshop-detail/InvisibleNavbar'));
const TotalPriceMiniWdp = dynamic(() => import('@components/workshop-detail/TotalPriceMiniWdp'));
const OperatingHoursSheet = dynamic(() =>
  import('@components/workshop-detail/OperatingHoursSheet')
);
const InfoSection = dynamic(() => import('@components/workshop-detail/InfoSection'));
const SearchInput = dynamic(() => import('@components/workshop-detail/SearchInput'));
const OpeningHoursSection = dynamic(() =>
  import('@components/workshop-detail/OpeningHoursSection')
);
const ServiceOptionsSheet = dynamic(() => import('@components/sheet/ServiceOptionsSheet'));
const CarouselFooter = dynamic(() => import('@components/workshop-detail/CarouselFooter'));

function WorkshopDetail(props) {
  const {
    workshopDetail,
    workshopIsOpen,
    slug,
    operatingHours,
    currentOperationHour,
    faqs,
    serviceInit,
    reviewData,
    promo,
    origin,
    productId,
    isPudo,
    location,
    topServices
  } = props;

  const router = useRouter();
  const { user, isAuthenticated, token, authenticate } = useAuth();
  const { car, firstCheck, editCar, openModalCar, closeEditCar } = useCar(user, isAuthenticated);
  const workshopType = workshopDetail?.tier?.value;
  const workshopImages = workshopDetail?.images ? workshopDetail?.images : [];
  const quickFilters = workshopDetail?.service_categories;
  const getUserCar = Cookies.get('user_car', { path: '/' });
  const userCar = user?.user_car ? user?.user_car : getUserCar ? getUserCar : null;
  const showGuaranteeSection = workshopType !== 'non_verified';
  const wdpType = origin === 'search' ? 'mini wdp' : 'full wdp';
  const getCar = getUserCar && JSON.parse(getUserCar);
  const carName = `${getCar?.car_details?.car_model?.model_name} ${getCar?.car_details?.variant}`;

  let { package_id } = router.query;
  if (!package_id && typeof window !== 'undefined') {
    package_id = 0;
  }

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); //set first active image
  const [animating, setAnimating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [showBottomSheetHour, setShowBottomSheetHour] = useState(false);
  const [isTodayOpen, setIsTodayOpen] = useState(false);
  const [serviceActive, setServiceActive] = useState(serviceInit || quickFilters[0]?.slug);
  const [isFetching, setIsFetching] = useState(true);
  const [packageList, setPackageList] = useState([]);
  const [promoDetail, setPromoDetail] = useState({});
  const [promoCheck, setPromoCheck] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [showCarNavbar, setShowCarNavbar] = useState(false);
  const [openFilterBottomSheet, setOpenFilterBottomSheet] = useState(false);
  const [sorting, setSorting] = useState('price-low');
  const [sQuery, setSQuery] = useState('');
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [activeTab, setActiveTab] = useState('review');
  const [openPackageSheet, setOpenPackageSheet] = useState(false);
  const [availablePackageList, setAvailablePackageList] = useState([]);
  const [activePackage, setActivePackage] = useState({});
  const [addCarPos, setAddCarPos] = useState('workshop detail page');
  const [openCompatibility, setOpenCompatibility] = useState(false);
  const [productSelected, setProductSelected] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [openServiceOptions, setOpenServiceOptions] = useState(false);
  const [tempPackage, setTempPackage] = useState({});
  const [previousParams, setPreviousParams] = useState({});
  const [productPagination, setProductPagination] = useState({});
  const [onLoadMore, setOnLoadMore] = useState(false);
  const [isFetchProduct, setIsFetchProduct] = useState(false);
  const [isPromoRemoved, setIsPromoRemoved] = useState(false);

  const breadcrumbList = [
    { id: 1, name: 'Beranda', path: '/servis' },
    {
      id: 2,
      name: 'Bengkel',
      path: '/bengkel'
    },
    {
      id: 3,
      name: workshopDetail?.name,
      path: ''
    }
  ];

  const getCategory = (value) => {
    let category;
    if (value?.category === 'front_view') {
      category = 'Tampak Depan';
    } else if (value?.category === 'inner_view') {
      category = 'Tampak Dalam';
    } else if (value?.category === 'facility') {
      category = 'Fasilitas';
    } else {
      category = '-';
    }

    return category;
  };

  const next = () => {
    if (animating) return;

    const nextIndex = activeIndex === workshopImages.length - 1 ? 0 : activeIndex + 1;
    const category = getCategory(workshopDetail?.images[nextIndex]); //set next category

    setActiveCategory(category);
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;

    const nextIndex = activeIndex === 0 ? workshopImages.length - 1 : activeIndex - 1;
    const category = getCategory(workshopDetail?.images[nextIndex]); //set prev category

    setActiveCategory(category);
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;

    const category = getCategory(workshopDetail?.images[newIndex]); //set new category

    setActiveCategory(category);
    setActiveIndex(newIndex);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const checkCategoryImage = (categoryImage, index) => {
    const indexImg = index % 2 ? 1 : 0;
    switch (categoryImage) {
      case 'front_view':
        return `Depan ${alphabet[indexImg]}`;
      case 'inner_view':
        return `Dalam ${alphabet[indexImg]}`;
      case 'facility':
        return `Fasilitas ${alphabet[indexImg]}`;
      default:
        return;
    }
  };

  const slides = workshopImages.map((item, index) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.id}>
        <img
          src={item.image_link}
          className="ratio ratio-16x9 cover-carousel-ws"
          alt={`${workshopDetail?.name} ${checkCategoryImage(item.category, index)}`}
          title={`${workshopDetail?.name}`}
        />
      </CarouselItem>
    );
  });

  const onScrollPage = (event) => {
    const { scrollTop } = event.target;

    if (scrollTop > 10) {
      setScrolled(true);
    }
    checkServiceHighlight();
  };

  const checkServiceHighlight = () => {
    const serviceEl = document.getElementById('Servis');
    const rect = serviceEl.getBoundingClientRect();

    if (
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
      setShowCarNavbar(true);
    } else {
      setShowCarNavbar(false);
    }
  };

  const setWorkshopIsOpen = (schedules, isOpen) => {
    const today = days[new Date().getDay()];

    const todaySchedule = find(schedules, (schedule) => {
      return schedule.day === today;
    });

    setIsTodayOpen(todaySchedule.is_open && isOpen);
  };

  const setToggleOpenHour = () => setShowBottomSheetHour(!showBottomSheetHour);

  const updateQuery = (service, redirected) => {
    const filteredQuery = Object.fromEntries(
      Object.entries(router.query).filter(([key, value]) => key !== 'slug')
    );

    if (redirected) {
      router.replace(
        {
          pathname: `/bengkel/${slug}`,
          query: { ...filteredQuery, service_category: service }
        },
        undefined,
        { shallow: true }
      );
    } else {
      delete filteredQuery?.service_category;
      router.replace(
        {
          pathname: `/bengkel/${slug}`,
          query: { ...filteredQuery }
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleFilterTagsClick = async (service) => {
    setServiceActive(service);
    fetchWorkshopServiceList({
      service_category: service,
      variant_car_id: car?.carVariantId,
      page: 1,
      promo: promo || '',
      keyword: sQuery
    });

    amplitude.getInstance().logEvent('service category menu selected', {
      source_icon: 'workshop detail',
      service_category: service,
      page_location: fullPath
    });
    const redirected = service !== quickFilters[0]?.slug;
    updateQuery(service, redirected);
  };

  const getPackageList = async (productId, carId) => {
    setIsFetchProduct(true);

    const params = {
      variant_car_id: carId,
      promo_code: isPromoRemoved ? '' : promo
    };

    try {
      const response = await api.get(`v2/workshops/${slug}/product/${productId}/packages`, {
        params
      });
      setAvailablePackageList(response?.data?.data);
      setIsFetchProduct(false);
    } catch (error) {
      console.log('😱 Error: ', error);
      setIsFetchProduct(false);
    }
  };

  const handleOpenPacakgeList = () => {
    setOpenPackageSheet(true);
  };

  const handleClosePackageSheet = () => {
    setOpenPackageSheet(false);
  };

  const fetchWorkshopServiceList = async (values, extra, isLoadMore) => {
    if (!isLoadMore) {
      setIsFetching(true);
    }

    let listData = [];

    const params = {
      service_category: values?.service_category,
      variant_car_id: values?.variant_car_id,
      page: values?.page || 1,
      promo: values?.promo || '',
      keyword: values?.keyword,
      sorting: values?.sorting,
      limit: 16
    };

    setPreviousParams(params);

    getWorkshopServiceList(slug, params, extra)
      .then((res) => {
        if (!isLoadMore) {
          listData = res?.data;
        } else {
          listData = [...packageList, ...res?.data];
        }
        setPackageList(listData);
        setOnLoadMore(false);
        setMessageError(null);
        setProductPagination(res?.pagination);
        setIsFetching(false);
        amplitude.getInstance().logEvent('product list viewed', {
          service_category_name: values?.service_category,
          total_product_viewed: res?.data?.length,
          source_list: 'workshop detail',
          page_location: fullPath,
          workshop_name: workshopDetail?.name,
          product_list_view: 'product list'
        });
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.message;
        if (errorMessage) {
          if (errorMessage.includes('tidak bisa digunakan untuk category servis ini')) {
            setMessageError('PromoError');
          } else if (errorMessage.includes('Tidak tersedia paket')) {
            setMessageError('CarError');
          } else {
            setMessageError(errorMessage);
          }
        } else {
          setMessageError('Something when wrong ..');
        }
        setPackageList([]);
        setIsFetching(false);
      });
  };

  const goToCheckout = (item, packageItem, type) => {
    if (sQuery === '') {
      amplitude.getInstance().logEvent('product selected', {
        service_category_name: packageItem?.service_category?.slug,
        product_name: packageItem?.name,
        workshop_name: workshopDetail?.name,
        promo_code: promoDetail?.promo_code,
        recommended_compatibility: packageItem?.compatibility,
        source_list: 'workshop details',
        page_location: fullPath
      });
    } else {
      amplitude.getInstance().logEvent('search result selected', {
        search_category: 'package',
        search_result: `${workshopDetail?.name} / ${packageItem?.name}`,
        source_list: 'workshop details'
      });
    }

    if (type === 'pudo') {
      router.push({
        pathname: '/tambah-alamat',
        query: {
          package_id: item?.id,
          product_id: packageItem?.id,
          workshop: slug,
          variant_car_id: car?.carVariantId,
          origin: 'wdp'
        }
      });
    } else {
      router.push({
        pathname: '/konfirmasi-order',
        query: {
          package_id: item?.id,
          workshop: slug,
          origin: 'pilih-bengkel'
        }
      });
    }
  };

  const handleCheckoutPackage = (type) => {
    const wsVisitMethod = type === 'pudo' ? 'Otoklix Pick Up' : 'Datang Ke Bengkel';

    amplitude.getInstance().logEvent('workshop visit method selected', {
      workshop_visit_method: wsVisitMethod,
      source_list: 'workshop details'
    });

    if (!isEmpty(tempPackage)) {
      goToCheckout(tempPackage?.availablePackages, tempPackage?.packageItem, type);
    }
  };

  const onClickPackageCard = (packageItem) => {
    setProductSelected(packageItem);
    const availablePackages =
      packageItem?.available_packages?.length === 1 && packageItem?.available_packages[0];

    setTempPackage({
      availablePackages: availablePackages,
      packageItem: packageItem
    });

    if (!isEmpty(userCar)) {
      if (
        !packageItem?.compatibility &&
        Helper.checkCompatibility(packageItem?.service_category?.slug)
      ) {
        setOpenCompatibility(true);
      } else {
        if (availablePackages) {
          if (workshopDetail?.otoklix_go_eligible) {
            handleServiceOptions();
          } else {
            goToCheckout(availablePackages, tempPackage);
          }
        } else {
          handleOpenPacakgeList(true);
          setActivePackage(packageItem);
          getPackageList(packageItem?.id, car?.carVariantId);
        }
      }
    } else {
      if (packageItem) setOpenAlert(false);
      handleEditCar(true);
    }
  };

  const fetchPromoData = async (promo) => {
    try {
      const response = await api.get(`v2/promo/by_slug/${promo}`);
      setPromoDetail(response.data.data);
      setPromoCheck(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExtraFilterClick = () => {
    setOpenFilterBottomSheet(true);
  };

  const handleApplyExtraFilter = (value) => {
    setOpenFilterBottomSheet(false);
    setSorting(value);

    const extraPayload = {
      sorting: value
    };

    fetchWorkshopServiceList(
      {
        service_category: serviceActive,
        variant_car_id: car?.carVariantId,
        page: 1,
        promo: promo || '',
        keyword: sQuery
      },
      extraPayload
    );
  };

  const searchInitited = () => {
    amplitude.getInstance().logEvent('search initiated', { source_search: 'workshop detail' });
  };

  const changeHandler = (e) => {
    setSQuery(e.target.value);

    amplitude.getInstance().logEvent('search performed', {
      search_keyword: e.target.value,
      search_category: 'package'
    });
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 400), []);

  useEffect(() => {
    if (firstCheck) {
      fetchWorkshopServiceList({
        service_category: serviceActive,
        variant_car_id: car?.carVariantId,
        page: 1,
        promo: promo || '',
        keyword: sQuery,
        sorting: sorting
      });
    }
  }, [sQuery]);

  const handleClickPromo = () => {
    setOpenRemoveModal(true);
  };

  const handleRemovePromo = () => {
    setOpenRemoveModal(false);
    setPromoDetail(null);
    setIsPromoRemoved(true);
  };

  const handleBack = () => {
    const params = {
      service_category: 'workshop',
      recommendation: true,
      src: 'my_order'
    };

    const { src } = router.query;
    if (src === 'thank_you' || src === 'my_order') {
      router.push({ pathname: `/cari`, query: params });
    } else {
      router.back();
    }
  };

  const trackWorkshopDetailsExplored = (type) => {
    amplitude.getInstance().logEvent('workshop details explored', {
      details_selected: type,
      workshop_name: workshopDetail?.name,
      wdp_type: wdpType,
      page_location: fullPath,
      workshop_tier: workshopType
    });
  };

  const checkCompability = async (carId, prdId) => {
    const res = await api.get(
      `v2/product/is-car-recommendation/?variant_car_id=${carId}&product_id=${prdId}`
    );
    return res?.data?.data?.is_car_recommendation;
  };

  const handleApplyNewCar = () => {
    const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
    const availablePackages =
      productSelected?.available_packages?.length === 1 && productSelected?.available_packages[0];

    if (productSelected && getCarId?.car_details?.id) {
      checkCompability(getCarId?.car_details?.id, productSelected?.id).then((res) => {
        if (!res) {
          setOpenCompatibility(true);
        } else if (availablePackages) {
          setTempPackage({
            availablePackages: availablePackages,
            packageItem: productSelected
          });
          if (workshopDetail?.otoklix_go_eligible) {
            handleServiceOptions();
          } else {
            goToCheckout(availablePackages, productSelected);
          }
        } else {
          handleOpenPacakgeList(true);
          setActivePackage(productSelected);
          getPackageList(productSelected?.id, getCarId?.car_details?.id);
        }
      });
    }
  };

  const handleRecommend = () => {
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'rekomendasi'
    });
    setOpenCompatibility(false);
    const elm = document.getElementById('boxCategoryList');
    elm.scrollIntoView({ behavior: 'smooth' });
  };

  const forceOrder = () => {
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'lanjut order'
    });
    setOpenCompatibility(false);
    const availablePackages =
      productSelected?.available_packages?.length === 1 && productSelected?.available_packages[0];
    if (availablePackages) {
      if (workshopDetail?.otoklix_go_eligible) {
        handleServiceOptions();
      } else {
        goToCheckout(availablePackages, productSelected);
      }
    } else {
      handleOpenPacakgeList(true);
      setActivePackage(productSelected);
      getPackageList(productSelected?.id, car?.carVariantId);
    }
  };

  useEffect(() => {
    if (token) {
      authenticate(token);
    }

    if (activeTab) {
      trackWorkshopDetailsExplored(activeTab);
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (firstCheck && promoCheck) {
      fetchWorkshopServiceList({
        promo: promoDetail?.promo_code,
        service_category: serviceActive,
        variant_car_id: car?.carVariantId,
        page: 1,
        sorting: car?.carVariantId ? '' : 'price-low'
      });
    }
  }, [firstCheck, promoCheck, promoDetail?.promo_code, car?.carVariantId]);

  useEffect(() => {
    fetchPromoData(promo);
    gtag('view sku', 'viewWsDetailPage', slug);

    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'workshop detail',
      screen_category: 'browse',
      page_location: fullPath
    });
    MoEngage.trackEvent('screen viewed', {
      screen_name: 'workshop detail',
      page_location: fullPath
    });
    MoEngage.trackEvent('workshop detail explored', {
      details_selected: 'all details',
      wdp_type: wdpType,
      workshop_tier: workshopType,
      workshop_name: workshopDetail?.name,
      page_location: fullPath
    });

    BranchTracker('SEARCH', { name_of_pages: 'wdp' });
  }, []);

  useEffect(() => {
    if (isEmpty(messageError)) {
      gtag(
        'view ketersediaan service',
        'viewWsDetailPage',
        packageList?.length > 1 ? 'tersedia' : 'tidak tersedia'
      );
    }
  }, [messageError, packageList]);

  useEffect(() => {
    setWorkshopIsOpen(operatingHours.data, workshopIsOpen);
  }, [operatingHours, workshopIsOpen]);

  useEffect(() => {
    const category = getCategory(first(workshopDetail?.images)); //set first category

    setActiveCategory(category);
    workshopDetail?.tier?.value === 'non_verified'
      ? setActiveTab('facility')
      : setActiveTab('review');
  }, [workshopDetail]);

  useEffect(() => {
    if (car?.carModel && package_id && packageList.length > 0) {
      let packageItem = packageList.find((item) => item.id == package_id);
      if (packageItem) {
        onClickPackageCard(packageItem);
      }
    }
  }, [package_id, packageList, car?.carModel]);

  const categoryName = workshopDetail?.service_categories.find(
    (item) => item.slug == serviceActive
  );
  const showPackage = !isFetching && packageList.length > 0 && !messageError;

  let showPromoWarning, showCarWarning, showCustomWarning;
  if (!isFetching && messageError) {
    if (messageError == 'PromoError') {
      showPromoWarning = true;
    } else if (messageError == 'CarError') {
      showCarWarning = true;
    } else {
      showCustomWarning = true;
    }
  }

  const handleEditCar = (isProductCard) => {
    const positionButton =
      isProductCard && sQuery === ''
        ? `workshop detail page - product - ${workshopDetail?.name}`
        : isProductCard && sQuery !== ''
        ? `workshop detail page - product search result - ${workshopDetail?.name}`
        : `workshop detail page - top - ${workshopDetail?.name}`;

    setAddCarPos(positionButton);
    editCar();
  };

  const handleSelectWorkshop = () => {
    const availablePackages =
      availablePackageList?.available_packages?.length === 1 &&
      availablePackageList?.available_packages[0];

    const cardSource = isPudo ? 'Otoklix Pick Up' : 'Datang ke Bengkel';

    amplitude.getInstance().logEvent('workshop selected', {
      cta_location: 'bottom',
      position: `mini wdp - ${workshopDetail?.name} - ${cardSource}`,
      page_location: fullPath
    });

    if (availablePackages) {
      const params = {
        package_id: availablePackages?.id,
        workshop: slug,
        promo: isPromoRemoved ? '' : promo,
        otoklix_go: isPudo || false,
        location: isPudo ? location?.lat + ',' + location?.lng : ''
      };

      router.push({ pathname: `/konfirmasi-order`, query: params });
    } else {
      handleOpenPacakgeList(true);
    }
  };

  const handleServiceOptions = () => {
    setOpenServiceOptions(true);
  };

  const handleSelectedPackageSheet = (items) => {
    setTempPackage({
      availablePackages: { id: items?.package_id },
      packageItem: activePackage
    });

    setOpenPackageSheet(false);

    if (
      wdpType === 'mini wdp' ||
      (wdpType !== 'mini wdp' && !workshopDetail?.otoklix_go_eligible)
    ) {
      const params = {
        package_id: items?.package_id,
        workshop: slug,
        promo: isPromoRemoved ? '' : promo,
        origin: wdpType === 'mini wdp' ? 'search' : 'pilih-bengkel',
        otoklix_go: isPudo || false,
        location: isPudo ? location?.lat + ',' + location?.lng : ''
      };

      router.push({ pathname: `/konfirmasi-order`, query: params });
    } else {
      handleServiceOptions();
    }
  };

  useEffect(() => {
    if (car?.carVariantId && origin === 'search') {
      getPackageList(productId, car?.carVariantId);
      setSorting('');
    } else if (car?.carVariantId) {
      setSorting('');
    } else {
      setSorting('price-low');
    }
  }, [car?.carVariantId]);

  const handleLoadMorePackages = () => {
    setOnLoadMore(true);
    fetchWorkshopServiceList(
      {
        ...previousParams,
        page: previousParams?.page + 1
      },
      {
        sorting: sorting
      },
      true
    );
  };

  useEffect(() => {
    if (isPromoRemoved) {
      getPackageList(productId, car?.carVariantId);
    }
  }, [isPromoRemoved]);

  return (
    <PrivateLayout
      hasOtobuddy={origin === 'search' ? false : true}
      hasAppBar={false}
      otobuddyType="workshop"
      title={Helper.metaWorkshop(workshopDetail)?.title}
      description={Helper.metaWorkshop(workshopDetail)?.desc}
      metaRobots={workshopType === 'non_verified' && 'noindex'}
      wrapperClassName="wrapper-full workshop-detail-wrapper">
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin="100vh"
        onScroll={origin !== 'search' && onScrollPage}
        renderView={({ style, ...props }) => (
          <div {...props} style={{ ...style, marginRight: '0px' }}></div>
        )}>
        {origin === 'search' ? (
          <MiniDetailWorkshopHeader
            title={workshopDetail?.name}
            titleIcon={workshopDetail?.tier?.icon_link}
            icon="/assets/icons/arrow-left-thin.svg"
            iconOnClick={() => router.back()}
            workshopSlug={slug}
            fullPath={fullPath}
            hasShareButton
            isSticky
          />
        ) : (
          <InvisibleNavbar
            idShare="coachMarkWsStep1"
            showNavbar={scrolled}
            workshopDetail={workshopDetail}
            rating={reviewData?.data?.rating}
            workshopSlug={slug}
            workshopType={workshopType}
            car={car}
            showCar={showCarNavbar}
            onBack={handleBack}
            trackerPath={fullPath}
            editCar={() => handleEditCar()}
          />
        )}

        <ScrollSpyWrapper id="Overview">
          <Container id="coachMarkWsStep2" name="overview-wrapper">
            <Carousel
              className="header-carousel"
              activeIndex={activeIndex}
              next={next}
              previous={previous}>
              <CarouselIndicators
                items={workshopImages}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
              />
              {slides}
            </Carousel>
            <CarouselFooter
              imageCategory={activeCategory}
              totalImage={workshopDetail?.total_images}
              onClick={() => {
                router.push(`/bengkel/${slug}/gallery`);
                trackWorkshopDetailsExplored('gallery');
              }}
            />
          </Container>

          <Container className="workshop-info py-1" id="coachMarkWsStep3">
            <div className="d-flex">
              {workshopDetail?.tier && (
                <Icon
                  textRight
                  size="sm"
                  image={
                    workshopType !== 'non_verified'
                      ? workshopDetail?.tier?.icon_link
                      : '/assets/icons/non-verified.svg'
                  }
                  imageWidth={16}
                  imageHeight={16}
                  imgAlt="workshop-tier"
                  textClassName="ws-info-text-small ps-2 me-3"
                  title={Helper.generateWorkshopLabel(workshopDetail?.tier?.name)}
                />
              )}
            </div>

            {workshopDetail && (
              <InfoSection
                workshopDetail={workshopDetail}
                address={Helper.truncateText(workshopDetail?.street_address)}
                onClickTrack={(val) => trackWorkshopDetailsExplored(val)}
              />
            )}
          </Container>

          <div
            className={`open-hour px-4 mt-3${workshopType === 'non_verified' ? ' no-data' : ''}`}>
            {currentOperationHour && workshopType !== 'non_verified' ? (
              <OpeningHoursSection
                isTodayOpen={isTodayOpen}
                currentOperationHour={currentOperationHour}
                setToggleOpenHour={setToggleOpenHour}
                onTrack={(val) => trackWorkshopDetailsExplored(val)}
              />
            ) : (
              <Icon
                textRight
                size="sm"
                image="/assets/icons/clock.svg"
                imageWidth={16}
                imageHeight={16}
                imgAlt="clock"
                className="py-0"
                textClassName="text fw-bold ps-4"
                title="Jam buka belum tersedia"
              />
            )}
          </div>
        </ScrollSpyWrapper>

        {showGuaranteeSection && serviceActive !== 'cuci' && serviceActive !== 'detailing' && (
          <div className="workshop-sheet">
            <GuaranteeCollapse
              className="guarantee"
              isFlagship={workshopType === 'otoxpress' || workshopType.includes('flagship')}
              onOpen={() => trackWorkshopDetailsExplored('warranty details')}
            />
          </div>
        )}

        {/* promo section */}
        {promoDetail?.promo_code && (
          <div className="p-3">
            <ButtonPromo
              isActive={promoDetail?.promo_code}
              promoCode={promoDetail?.promo_code}
              onClick={handleClickPromo}
              leftImage="/assets/images/voucher.png"
              rightImage="/assets/icons/x-orange.svg"
            />
          </div>
        )}

        {workshopType !== 'non_verified' && (
          <ReviewFacilityTab onClickTab={(tab) => setActiveTab(tab)} />
        )}

        {workshopType !== 'non_verified' && activeTab === 'review' && (
          <ScrollSpyWrapper id="Review">
            <Container
              className={`review-rating pt-4 ${origin === 'search' && 'pb-5 mb-4'}`}
              id={workshopType !== 'non_verified' ? 'coachMarkWsStep4' : ''}>
              <ReviewSection
                slug={slug}
                reviewData={reviewData?.data}
                fullPath={fullPath}
                wsDetail={workshopDetail}
                wdpType={wdpType}
              />
            </Container>
          </ScrollSpyWrapper>
        )}

        {activeTab === 'facilities' && (
          <ScrollSpyWrapper id="Fasilitas">
            <Container
              className={`px-3 ${origin === 'search' && 'pb-5 mb-5'}`}
              name="fasilitas-wrapper">
              <FacilityDropdown
                facilities={workshopDetail?.facilities}
                workshopType={workshopType}
              />
            </Container>
          </ScrollSpyWrapper>
        )}

        {origin !== 'search' && (
          <ScrollSpyWrapper id="Servis">
            <Container className="servis-wrapper mb-2">
              <ScrollSpyWrapper id="service-list">
                <span>Kategori</span>
              </ScrollSpyWrapper>
              <div className="quick-filter mb-1 mt-3" id="boxCategoryList">
                <ScrollMenu
                  alignCenter={false}
                  data={quickFilters.map((value) => {
                    const isActive = value.slug === serviceActive;
                    return (
                      <Icon
                        key={value.slug}
                        className="me-3"
                        imageWidth={20}
                        imageHeight={20}
                        imgAlt="category-filter"
                        bgIconColor={isActive ? 'secondary-light' : 'white-lg'}
                        iconClassName={`border ${isActive ? 'border-secondary' : ''}`}
                        image={value.icon_link}
                        title={value.name}
                        onClick={() => handleFilterTagsClick(value.slug)}
                      />
                    );
                  })}
                />
              </div>
            </Container>

            <FilterBottomsheetSort
              open={openFilterBottomSheet}
              value={sorting}
              onClose={() => setOpenFilterBottomSheet(false)}
              onApply={handleApplyExtraFilter}
              hasCar={car?.carVariantId}
            />

            <SearchInput onChange={debouncedChangeHandler} onFocus={searchInitited} />

            <Container>
              {!isUndefined(serviceActive) && (
                <div className="d-flex justify-content-between ms-1 mb-2">
                  <Text tag="h2" weight="bold" className="mt-2 text-md">{`${serviceActive
                    .charAt(0)
                    .toUpperCase()}${serviceActive.slice(1)}`}</Text>
                  <div
                    className="d-flex align-items-center pointer"
                    onClick={() => handleExtraFilterClick(true)}>
                    <Icon
                      card
                      image="/assets/icons/sort-blue.svg"
                      imageHeight={15}
                      imageWidth={15}
                      imgAlt="icon-sort"
                    />
                    <Text color="primary" className="text-xs">
                      Urutkan
                    </Text>
                  </div>
                </div>
              )}
            </Container>

            <Container className="package-services">
              {isFetching && (
                <div className="d-flex justify-content-center p-3">
                  <Spinner color="primary" />
                </div>
              )}
              <div id="containerProductList"></div>
              {showPackage && (
                <>
                  {packageList?.map((item, index) => {
                    const checkSubPrice =
                      item.discount_value !== 0 && `Rp${Helper.formatMoney(item?.original_price)}`;
                    const isDiscountPackage =
                      item.discount_value !== 0 && `${item?.discount_value}%`;
                    const isLiter = car?.carVariantId && item?.product_unit;
                    const hasNoCar = !car?.carVariantId && item?.product_unit;
                    return (
                      <div className="mx-2 my-3 pointer" key={index}>
                        <CardServices
                          discountLabel={isDiscountPackage}
                          image={item?.image_link}
                          categoryLabel={item?.service_category?.name}
                          subPrice={checkSubPrice}
                          price={`Rp${
                            hasNoCar
                              ? `${Helper.formatMoney(item?.price)}/liter`
                              : Helper.formatMoney(item?.price)
                          }`}
                          detailPrice={
                            isLiter && `Rp${Helper.formatMoney(item?.product_price)}/${isLiter}`
                          }
                          showStartPrice={false}
                          title={item?.name}
                          onCardClick={() => onClickPackageCard(item)}
                          dataAutomationCardService={`card_service_${index}`}
                          quantity={
                            isLiter && item?.product_quantity && `${item?.product_quantity} liter`
                          }
                          isRecommended={Helper.labelRecommend(item?.compatibility)}
                          showUsp={item?.service_category?.slug === 'oli' && item?.is_fbo}
                          guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
                          discountIcon={'/assets/icons/discount.svg'}
                          bookmarkIcon={'/assets/icons/bookmark.svg'}
                        />
                      </div>
                    );
                  })}
                  <div className="d-flex flex-column align-items-center p-3 mb-2">
                    {productPagination?.current_page < productPagination?.total_page && (
                      <Button
                        outline
                        size="sm"
                        onClick={handleLoadMorePackages}
                        disabled={onLoadMore}
                        className="mb-2 mt-4 btn-loadmore">
                        Lebih banyak
                        {onLoadMore && <Spinner color="primary" size="sm" className="ms-2" />}
                      </Button>
                    )}
                  </div>
                </>
              )}

              {/* No Package Available Section */}
              <div className="mt-2">
                {showPromoWarning && router.query?.promo && packageList?.length === 0 && (
                  <Col>
                    <EmptyState image="/assets/images/voucher-lg.png" captionAsTitle={true}>
                      <div className="warning-message">
                        Promo
                        <strong>{` ${promoDetail?.promo_code} `}</strong>
                        tidak bisa dipakai untuk servis <strong>{` ${categoryName?.name}`}</strong>
                      </div>
                    </EmptyState>
                  </Col>
                )}
                {showCarWarning && (
                  <Col>
                    <EmptyState image="/assets/images/nearest-workshop.png" captionAsTitle={true}>
                      <div className="warning-message">
                        Bengkel ini tidak melayani servis{' '}
                        <strong>{` ${categoryName?.name} `}</strong>
                        {car?.carModel && (
                          <>
                            untuk
                            <strong>{` ${car?.carModel} `}</strong>
                          </>
                        )}
                      </div>
                    </EmptyState>
                  </Col>
                )}
                {showCustomWarning && (
                  <Col>
                    <EmptyState image="/assets/images/car-blue.png" captionAsTitle={true}>
                      <div className="warning-message">{messageError}</div>
                    </EmptyState>
                  </Col>
                )}
                {packageList?.length === 0 &&
                  !showCarWarning &&
                  !showPromoWarning &&
                  !showCustomWarning &&
                  !isFetching && (
                    <Col>
                      <EmptyState image="/assets/images/nearest-workshop.png" captionAsTitle={true}>
                        <div className="warning-message">
                          Bengkel ini tidak melayani servis{' '}
                          <strong>{` ${categoryName?.name ?? ''} `}</strong>
                          {car?.carModel && (
                            <>
                              untuk
                              <strong>{` ${car?.carModel}`}</strong>.
                            </>
                          )}
                          <br />
                          Coba telusuri layanan servis serupa di bengkel lainnya.
                        </div>
                      </EmptyState>
                    </Col>
                  )}
              </div>
            </Container>
          </ScrollSpyWrapper>
        )}

        {origin !== 'search' && (
          <Container>
            <Breadcrumb list={breadcrumbList} />
          </Container>
        )}

        {origin !== 'search' && (
          <>
            <Container className="ws-footer pt-2">
              <AboutServices title="Tentang Layanan" faqs={faqs?.data} />
            </Container>

            <AboutFooter topServices={topServices} />
          </>
        )}
      </Scrollbars>

      {origin === 'search' && (
        <TotalPriceMiniWdp
          handleSelectWorkshop={handleSelectWorkshop}
          totalPrice={`Rp${Helper.formatMoney(availablePackageList?.selected_package?.price)}`}
          isFetching={isFetchProduct}
        />
      )}

      <OperatingHoursSheet
        showBottomSheetHour={showBottomSheetHour}
        setToggleOpenHour={setToggleOpenHour}
        operatingHours={operatingHours}
        days={days}
      />

      <AddCarSheet
        isTopCloseButton={true}
        fullPath={fullPath}
        openSheet={openModalCar}
        buttonType="add"
        onDismiss={closeEditCar}
        onApplyNewCar={handleApplyNewCar}
        page={addCarPos}
      />

      {openRemoveModal && (
        <RemovePromoModal
          promoCode={promo}
          isOpen={openRemoveModal}
          label="Servis"
          toggle={() => setOpenRemoveModal(!openRemoveModal)}
          onClickYes={() => handleRemovePromo()}
        />
      )}

      <PackageSheet
        openSheet={openPackageSheet}
        onDismiss={handleClosePackageSheet}
        packageList={availablePackageList}
        wsDetail={workshopDetail}
        fullPath={fullPath}
        slug={slug}
        origin={origin}
        activePackage={activePackage}
        fromWdp={true}
        promoCode={promo}
        otoklixGoLocation={location?.lat + ',' + location?.lng}
        onClickSelectPackage={(items) => handleSelectedPackageSheet(items)}
      />

      <AlertCarInfo carName={carName} hasBottomSheet={openCompatibility} openAlert={openAlert} />

      <CheckCompatibilitySheet
        openSheet={openCompatibility}
        forceOrder={forceOrder}
        handleRecommend={handleRecommend}
        onDismiss={() => setOpenCompatibility(false)}
      />

      <ServiceOptionsSheet
        open={openServiceOptions}
        onClose={() => setOpenServiceOptions(false)}
        handleCheckoutDatangKeBengkel={() => handleCheckoutPackage('datang ke bengkel')}
        handleCheckoutPudo={() => handleCheckoutPackage('pudo')}
      />
    </PrivateLayout>
  );
}

export default WorkshopDetail;
