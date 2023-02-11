import { fetchNewSearching, fetchSearchKeyword, fetchSearchRecommendation } from '@actions/Search';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { LottieSearching } from '@components/lottie/lottie';
import {
  CardServices,
  CardWorkshopExplore,
  Container,
  EmptyState,
  Icon,
  Modal,
  Row,
  Spinner,
  Tags,
  Text
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import Auth from '@pages/auth/index';
import { api, authenticateAPI } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { keywords, OtobuddyType } from '@utils/Constants';
import { monasLocation } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import MoEngage from '@utils/MoEngage';
import useCar from '@utils/useCar';
import useOrderSheet from '@utils/useOrderSheet';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import InfiniteScroll from 'react-infinite-scroller';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const AddCarSheet = dynamic(() => import('@components/sheet/AddCarSheet'));
const CheckCompatibilitySheet = dynamic(() => import('@components/sheet/CheckCompatibilitySheet'));
const Uppersheet = dynamic(() => import('@components/sheet/UpperSheet'));
const FlagshipModal = dynamic(() => import('@components/modal/FlagshipModal'));
const LocationModal = dynamic(() => import('@components/modal/LocationModal'));
const InputGlobalSearch = dynamic(() => import('@components/input/InputGlobalSearch'));
const ButtonSubbar = dynamic(() => import('@components/button/ButtonSubbar'));
const AlertCarInfo = dynamic(() => import('@components/car/AlertCarInfo'));
const SearchInitialView = dynamic(() => import('@components/cari/SearchInitialView'));
const FilterBottomsheetSort = dynamic(() => import('@components/filter/FilterBottomsheetSort'));

sentryBreadcrumb('pages/cari/index');

const GlobalSearch = (props) => {
  const { recommendation, serviceCategory, defaultSorting, isRecommendation } = props;

  const router = useRouter();
  const { q, src } = router.query;

  let fullPath = '';

  const inputRef = useRef();
  const [query, setQuery] = useState('');
  const [trackingQuery, setTrackingQuery] = useState('');
  const [workshopType, setWorkshopType] = useState('');
  const [fullInput, setFullInput] = useState(false);
  const [activeFilter, setActiveFilter] = useState(serviceCategory || 'all');
  const [items, setItems] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [firstSearch, setFirstSearch] = useState(true);
  const [initialState, setInitialState] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [openSort, setOpenSort] = useState(false);

  const { user, isAuthenticated, token, authenticate } = useAuth(); //eslint-disable-line
  const { car, openModalCar, editCar, closeEditCar } = useCar(user, isAuthenticated); //eslint-disable-line
  const { activePkg, cartPkg } = useOrderSheet(); //eslint-disable-line
  const [openModalAuth, setOpenModalAuth] = useState(false); //eslint-disable-line

  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ sorting: defaultSorting });
  const [filters, setFilters] = useState([]);
  const [isWsRecommend, setIsWsRecommend] = useState(isRecommendation);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [itemType, setItemType] = useState('workshop');
  const [category, setCategory] = useState('');
  const [workshopRecommendation, setWorkshopRecommendation] = useState(recommendation);
  const [previousQuery, setPreviousQuery] = useState('');
  const [keywordSearch, setKeywordSearch] = useState({});
  const [productSelected, setProductSelected] = useState({});
  const [isShowFilterTab, setIsShowFilterTab] = useState(false);
  const [addCarPos, setAddCarPos] = useState('search page');
  const [openCompatibility, setOpenCompatibility] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [tier, setTier] = useState('');
  const [showUpperSheet, setShowUpperSheet] = useState(true);

  const carName = `${car?.carModel} ${car?.carVariant}`;

  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  /* Section: Input Box */
  const changeHandler = (e) => {
    setQuery(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 400), []);

  const onClickInputSearch = () => {
    setFullInput(true);
    gtag('click input search', 'clickSearchPage');
  };

  /* Section: Edit Location and Car */
  const [geoLocation, setGeoLocation] = useState({});

  const handleEditCar = () => {
    setOpenAlert(true);
    const currentPath = router.asPath.split('?')[0];
    setProductSelected({});
    if (Helper.isEmptyObj(router.query)) {
      editCar();
    } else {
      editCar(currentPath, router.query);
    }

    gtag('click untuk mobil', 'clickSearchPage');
  };

  const handleEditLocation = () => {
    setHasModalLocation(!hasModalLocation);

    gtag('click cari di sekitar', 'clickSearchPage');
  };

  const handleSelectLocation = async (suggestion) => {
    setHasModalLocation(!hasModalLocation);

    await getGeocode({ address: suggestion.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        const location = {
          ...geoLocation,
          lat: lat,
          lng: lng,
          address: suggestion.description
        };
        setGeoLocation(location);
        setFilterOptions({
          ...filterOptions,
          sorting:
            activeFilter === 'workshop'
              ? 'closest'
              : activeFilter !== 'workshop' && car?.carVariantId
              ? ''
              : 'price-low'
        });
        Helper.updateLocation(location);
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const createExtraPayload = (filterOptions) => {
    const extraPayload = {};

    for (const [key, value] of Object.entries(filterOptions)) {
      if (key == 'price_range_filter') {
        for (const [priceKey, priceValue] of Object.entries(value)) {
          const priceInt = parseInt(priceValue);
          if (!isNaN(priceInt) && priceInt > 0) {
            extraPayload[priceKey] = priceValue;
          }
        }
      } else {
        if (value !== 'semua') {
          extraPayload[key] = value;
        }
      }
    }

    return extraPayload;
  };

  const updateSearchCriteria = (main, extra) => {
    if (geoLocation) {
      const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
      let page;
      let extraPayload;
      let restart = main?.restart;
      const carId = main?.variant_car_id ?? '';

      if (main?.restart) {
        page = 1;
        restart = true;
        extraPayload = createExtraPayload(extra || {});
      } else {
        page = main?.page || pageIndex;
        extraPayload = createExtraPayload(extra || {});
      }

      const mainPayload = {
        page: page,
        query: main?.query ?? query,
        section: main?.section || activeFilter,
        variant_car_id: carId || getCarId?.car_details?.id,
        lat: !isUndefined(main?.lat) ? main?.lat : geoLocation.lat,
        lng: !isUndefined(main?.lng) ? main?.lng : geoLocation.lng
      };

      if (isWsRecommend && activeFilter === 'workshop') {
        extraPayload.recommendation = true;
      }

      fetchSearchResult(mainPayload, extraPayload, restart);
    }
  };

  const fetchSearchResult = async (main, extra, restart) => {
    setIsFetching(true);
    setPaginationLoading(true);
    if (restart) {
      setSectionLoading(true);
      setPageIndex(1);
    }

    let searchData = [];

    const response = await fetchNewSearching(main, extra);

    if (response?.workshops) {
      searchData = response?.workshops;
      setCategory('Rekomendasi Bengkel Pilihan');
      setItemType('workshop');
      if (
        !filterOptions.sorting ||
        filterOptions.sorting === 'price-high' ||
        filterOptions.sorting === 'price-low'
      ) {
        setFilterOptions({ ...filterOptions, sorting: 'closest' });
      }
    }

    if (response?.products) {
      searchData = response?.products?.data;
      setCategory(response?.products?.service_category?.name);
      setItemType('products');
      if (filterOptions.sorting === 'closest' || filterOptions.sorting === 'highest-rating') {
        setFilterOptions({ ...setFilterOptions, sorting: car?.carVariantId ? '' : 'price-low' });
      }
    }

    if (restart && searchData.length >= 5) {
      setHasMoreItems(true);
    }

    if (searchData.length < 5) {
      setHasMoreItems(false);
    }

    if (restart) {
      setItems(searchData);
      setSectionLoading(false);
    } else {
      let newItems = [];
      let previousItems = [];
      if (items) {
        previousItems = items;
      }
      if (response) {
        newItems = searchData;
      }

      const finalItems = [...previousItems, ...newItems];

      setItems(finalItems);
    }

    setIsFetching(false);
    setSearchKeyword(main?.query);
  };

  const handleLoadItems = () => {
    setPageIndex(pageIndex + 1);
    updateSearchCriteria(
      {
        filter: activeFilter,
        page: pageIndex + 1
      },
      filterOptions
    );
  };

  const checkCompability = async (carId, prdId) => {
    const res = await api.get(
      `v2/product/is-car-recommendation/?variant_car_id=${carId}&product_id=${prdId}`
    );
    return res?.data?.data?.is_car_recommendation;
  };

  /* Section: Selecting Cards Function */
  const handleCardClick = async (section, item, type, categoryService) => {
    setOpenAlert(false);
    amplitude.getInstance().logEvent('search result selected', {
      search_category: activeFilter,
      search_result: item?.name
    });

    if (section == 'workshop') {
      handleWorkshopClick(item);
    } else if (section == 'product') {
      setWorkshopType(type); //set workshop type for show/hide "pesan sekarang"

      var pkgId = item?.id;
      Cookies.set('product_id_selected', pkgId);
      const params = {};
      if (car?.carVariantId) {
        if (!item?.compatibility && Helper.checkCompatibility(categoryService)) {
          setProductSelected({
            product_id: pkgId
          });
          setOpenCompatibility(true);
        } else {
          router.push({ pathname: `/cari/pilih-bengkel`, query: params });
        }
      } else {
        setProductSelected({
          ...geoLocation,
          product_id: pkgId,
          variant_car_id: car?.carVariantId
        });

        if (section === 'product') {
          initialState
            ? setAddCarPos(`search page - service recomendation`)
            : setAddCarPos(`search page - selected service`);
        }

        editCar();
      }
    }
  };

  const handleApplyNewCar = () => {
    const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));

    setFilterOptions({ ...filterOptions });
    Cookies.set('product_id_selected', productSelected?.id);

    if (!isEmpty(productSelected) && getCarId?.car_details?.id) {
      checkCompability(getCarId?.car_details?.id, productSelected?.product_id).then((res) => {
        if (!res) {
          setOpenCompatibility(true);
        } else {
          const params = {
            ...productSelected
          };
          router.push({ pathname: `/cari/pilih-bengkel`, query: params });
        }
      });
    } else {
      const paramPushRoute = {
        origin: 'homepage'
      };
      router.replace({
        pathname: router.pathname,
        query: paramPushRoute
      });
      setPageIndex(1);
      const mainPayload = {
        page: 1,
        query: query,
        section: activeFilter,
        variant_car_id: getCarId?.car_details?.id,
        lat: geoLocation.lat,
        lng: geoLocation.lng
      };
      const extraPayload = {
        sorting: ''
      };
      fetchSearchResult(mainPayload, extraPayload, true);
    }
  };

  const handleWorkshopClick = (item) => {
    const searchStrings = searchKeyword.split(' ');
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

    router.push({ pathname: `/bengkel/${item?.slug}` });
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

  const changeSection = (section) => {
    const mainParams = { section: section, restart: true };
    if (!inputRef.current.value) {
      inputRef.current.value = query;
    }

    const currentPayload = router?.query;

    setActiveFilter(section);
    setIsWsRecommend(false);
    delete currentPayload.recommendation;

    setFilterOptions({
      ...filterOptions,
      sorting:
        activeFilter === 'workshop'
          ? 'closest'
          : activeFilter !== 'workshop' && car?.carVariantId
          ? ''
          : 'price-low'
    });

    updateRoute({
      ...currentPayload,
      service_category: section,
      sorting: section === 'workshop' ? 'closest' : ''
    });

    updateSearchCriteria(mainParams, {
      ...filterOptions,
      sorting:
        section === 'workshop'
          ? 'closest'
          : activeFilter !== 'workshop' && car?.carVariantId
          ? ''
          : 'price-low'
    });
  };

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 250; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setPaginationLoading(false);
    }
  };

  const clickTabSection = (newSection, nameSection) => {
    GtmEvents.gtmSearchKeywordClickSearchPage(nameSection + ' Tab Click', query);

    if (newSection == activeFilter || isFetching) {
      return;
    }
    // setNeedLoadFilter(true);
    changeSection(newSection);

    amplitude.getInstance().logEvent('search performed', { search_category: newSection });
  };

  const hasActiveFilter = (slug) => {
    return activeFilter === slug;
  };

  /* Section: Quick Order Function */
  const handleCancelAuth = () => {
    setOpenModalAuth(false);
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

  const onChangeSort = (value) => {
    setFilterOptions({ ...filterOptions, sorting: value });
    setOpenSort(false);
    updateRoute({ ...router?.query, sorting: value });
    updateSearchCriteria({ restart: true }, { ...filterOptions, sorting: value });
  };

  const loadDefaultService = (keyword) => {
    const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));

    if (router?.query?.service_category || serviceCategory) {
      setInitialState(false);
    }

    if (keyword === 'workshop') {
      setFilterOptions({ ...filterOptions, sorting: 'closest' });
      setPageIndex(1);
      if (!isUndefined(geoLocation.lng) && !isUndefined(geoLocation.lat)) {
        updateSearchCriteria(
          {
            query: '',
            section: 'workshop',
            restart: true
          },
          { ...filterOptions, sorting: 'closest', recommendation: isRecommendation }
        );
      }
    } else {
      setFilterOptions({ ...filterOptions, sorting: getCarId ? '' : 'price-low' });
    }
  };

  const getFilterList = async () => {
    let newFilter = [
      { name: 'Semua', slug: 'all', icon_link: '/assets/icons/all-filter.svg' },
      { name: 'Bengkel', slug: 'workshop', icon_link: '/assets/icons/disconver-ws.svg' }
    ];

    const response = await api.get('v2/md/service-categories');
    const filterData = response.data.data;

    filterData.forEach((item) => {
      if (item?.is_clickable) {
        newFilter.push(item);
      }
    });

    setFilters(newFilter);

    if (router?.query?.service_category) {
      loadDefaultService(router?.query?.service_category);
    }
  };

  const getSearchHistory = async () => {
    if (token) {
      authenticateAPI(token);
    }

    const response = await fetchSearchKeyword();
    if (!isEmpty(response)) {
      setKeywordSearch(response);
    }
  };

  const loadOnFirstSearch = (keyword) => {
    setFirstSearch(false);
    setActiveFilter(router?.query?.service_category || 'all');
    updateSearchCriteria({
      query: keyword,
      section: activeFilter || 'all',
      restart: true
    });
  };

  const updateRoute = (queryParams) => {
    let paramPushRoute = queryParams;

    setActiveFilter(paramPushRoute?.service_category || activeFilter);

    if (router?.query?.recommendation || router?.query?.service_category) {
      setIsShowFilterTab(true);
    }

    router.replace({
      pathname: router.pathname,
      query: paramPushRoute
    });
  };

  const checkLocationChanges = () => {
    const lat = geoLocation.lat;
    const lng = geoLocation.lng;

    let needUpdate = false;
    const locationHasDiff = location.lat != lat || location.lng != lng;

    if (locationHasDiff) {
      needUpdate = true;
    } else if (!locationHasDiff && !firstSearch) {
      needUpdate = true;
    }

    if (needUpdate) {
      setPageIndex(1);
      updateSearchCriteria({
        lat: geoLocation.lat,
        lng: geoLocation.lng,
        restart: true
      });
    }
  };

  const assignAddressLocation = async (lat, lng, isReplaced = false) => {
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

  const assignDefaultLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      assignAddressLocation(lat, lng, true);
    });
  };

  const trackQueryChanges = (keyword) => {
    const timeOutId = setTimeout(
      () =>
        amplitude.getInstance().logEvent('search performed', {
          search_keyword: keyword,
          search_category: activeFilter
        }),
      300
    );
    return () => clearTimeout(timeOutId);
  };

  const fetchNewRecommendation = async (payload) => {
    setSectionLoading(true);
    const workshopResponse = await fetchSearchRecommendation({
      lat: payload.lat,
      lng: payload.lng,
      variant_car_id: payload?.variant_car_id
    });

    setWorkshopRecommendation(workshopResponse);

    setSectionLoading(false);
  };

  const handleRecommend = () => {
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'rekomendasi'
    });
    onChangeSort('');
    setOpenCompatibility(false);
  };

  const forceOrder = () => {
    amplitude.getInstance().logEvent('car incompatibility accepted', {
      CTA: 'lanjut order'
    });
    Cookies.set('product_id_selected', productSelected?.id);
    const params = {
      ...productSelected
    };
    router.push({ pathname: `/cari/pilih-bengkel`, query: params });
  };

  const handleOpenPopUp = (tier) => {
    setShowPopupInfo(true);
    setTier(tier);
  };

  useEffect(() => {
    const queryLat = router?.query?.lat;
    const queryLng = router?.query?.lng;
    const uppersheet = Cookies.get('car_uppersheet');
    const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));

    setFilterOptions({ ...filterOptions, sorting: getCarId ? '' : 'price-low' });

    if (uppersheet) setShowUpperSheet(false);

    gtag('view search', 'viewSearchPage');
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'search',
      screen_category: 'browse',
      page_location: fullPath
    });
    MoEngage.trackEvent('screen viewed', {
      screen_name: 'search',
      page_location: fullPath
    });

    getFilterList();

    if (!queryLat && !queryLng) {
      assignDefaultLocation();
    } else {
      assignAddressLocation(queryLat, queryLng, true);
    }

    getSearchHistory();
  }, []);

  useEffect(() => {
    if (items?.length > 0 && trackingQuery !== query) {
      setTrackingQuery(query);
      const url = new URL(window.location.href);
      GtmEvents.gtmSearchKeywordClickSearchPage('Search ' + query, url?.href ?? '');
    }
  }, [items]);

  useEffect(() => {
    if (q) {
      setQuery(q);
      inputRef.current.value = q;
    }
  }, [q]);

  useEffect(() => {
    if (router?.query?.service_category || serviceCategory) {
      setInitialState(false);
      setIsShowFilterTab(true);
    }
  }, [router]);

  useEffect(() => {
    if (router?.query?.explore) {
      setQuery(router?.query?.explore);
      inputRef.current.value = router?.query?.explore;
    }
  }, [router?.query?.explore]);

  useEffect(() => {
    checkLocationChanges();
    if (initialState) {
      fetchNewRecommendation({
        lat: geoLocation.lat,
        lng: geoLocation.lng,
        variant_car_id: car?.carVariantId
      });
    }
  }, [geoLocation.lat, geoLocation.lng]);

  useEffect(() => {
    if (car?.carVariantId) {
      if (initialState) {
        fetchNewRecommendation({
          lat: router?.query?.lat || geoLocation.lat,
          lng: router?.query?.lng || geoLocation.lng,
          variant_car_id: car?.carVariantId
        });
      } else {
        if (!productSelected) {
          updateSearchCriteria({
            variant_car_id: car?.carVariantId,
            restart: true
          });
        }
      }
    }
  }, [car?.carVariantId]);

  useEffect(() => {
    if (query && query.length > 0) {
      setPageIndex(1);
      setInitialState(false);
      setPreviousQuery(query);
      setIsShowFilterTab(true);

      setFilterOptions({
        ...filterOptions,
        sorting:
          activeFilter === 'workshop'
            ? 'closest'
            : activeFilter !== 'workshop' && car?.carVariantId
            ? ''
            : 'price-low'
      });

      firstSearch
        ? loadOnFirstSearch(query)
        : updateSearchCriteria({ query: query, restart: true });
      trackQueryChanges(query);
    } else {
      setInitialState(true);
      setPreviousQuery(query);
    }
  }, [query]);

  useEffect(() => {
    const getDataLocation = Helper.getLocation();
    if (getDataLocation !== null) {
      setGeoLocation(getDataLocation);
    } else {
      assignAddressLocation(monasLocation.lat, monasLocation.lng, true);
    }
  }, []);

  const renderLoading = () => (
    <div className="empty-state-container">
      <LottieSearching />
      <span className="title text-dark">Memuat Hasil...</span>
    </div>
  );

  const loader = (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" size="sm" />
    </div>
  );

  const renderCards = () => {
    if (items && itemType == 'products') {
      return renderItemPackage(items);
    } else if (items && itemType == 'workshop') {
      return renderItemWorkshop(items);
    } else {
      return null;
    }
  };

  const renderEmptyItems = () => {
    let isEmpty = false;
    if (itemType == 'products') {
      isEmpty = !items?.length;
    } else if (itemType == 'workshop') {
      isEmpty = !items?.length;
    }
    if (isEmpty) {
      return renderNoData();
    } else {
      return null;
    }
  };

  const renderNoData = () => {
    return (
      <EmptyState
        image="/assets/images/sorry.png"
        title="Ups! Pencarian Tidak Ditemukan"
        imgHeight={140}
        dataAutoContainer="empty_state_pencarian_tidak_ditemukan"
        imgAlt="Otoklix Search">
        Coba ulangi pencarianmu dengan memasukkan kata kunci lain
      </EmptyState>
    );
  };

  const renderItemPackage = (data) => {
    return data.map((item, index) => {
      const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
      const workshopType = item?.workshop?.tier?.value;
      const categoryService = item?.service_category?.slug;
      const checkSubPrice =
        item.discount_value !== 0 && `Rp${Helper.formatMoney(item?.original_price)}`;
      const isDiscountPackage = item.discount_value !== 0 && `${item?.discount_value}%`;
      const isLiter = item?.product_unit;

      return (
        <div className="m-3 pointer" key={item?.id}>
          <CardServices
            discountLabel={isDiscountPackage}
            image={item?.image_link}
            categoryLabel={item?.service_category?.slug}
            price={`Rp${Helper.formatMoney(item?.price)}${
              isLiter && !getCarId?.car_details?.id ? '/liter' : ''
            }`}
            detailPrice={
              isLiter &&
              getCarId?.car_details?.id &&
              `Rp${Helper.formatMoney(item?.product_price)}/${isLiter}`
            }
            subPrice={checkSubPrice}
            title={item?.name}
            onCardClick={() => {
              handleCardClick('product', item, workshopType, categoryService);
              {
                isAuthenticated && handleSaveSearchKeywords();
              }
            }}
            showStartPrice={true}
            dataAutomationCardService={`search_service_card_${index}`}
            dataAutomationCategoryLabel={`search_service_card_${serviceCategory}_${index}`}
            dataAutomationTitle={`search_service_card_title_${index}`}
            dataAutomationOriginalPrice={`search_service_card_original_price_${index}`}
            dataAutomationDiscountPrice={`search_service_card_orange_price_${index}`}
            dataAutomationPrice={`search_service_card_price_${index}`}
            dataAutomationDetailPrice={`search_service_card_detail_price_${index}`}
            quantity={
              isLiter &&
              getCarId?.car_details?.id &&
              item?.product_quantity &&
              `${item?.product_quantity} liter`
            }
            isRecommended={Helper.labelRecommend(item?.compatibility)}
            showUsp={item?.service_category?.slug === 'oli' && item?.is_fbo}
            guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
            discountIcon={'/assets/icons/discount.svg'}
            bookmarkIcon={'/assets/icons/bookmark.svg'}
          />
        </div>
      );
    });
  };

  const renderItemWorkshop = (data) => {
    return data.map((item, index) => {
      return (
        <CardWorkshopExplore
          key={index}
          className="m-3 card-ws-search border-0 pointer"
          isShowDistance
          isShowOtopoints={false}
          isHavePrimaryPrice={false}
          tags={map(item?.service_categories, 'name')}
          region={Helper.shortText(item?.kecamatan, 20)}
          title={Helper.shortText(item?.name, 25)}
          image={item?.image_link}
          imageAlt={item?.name}
          rating={item?.rating}
          ratingIcon="/assets/icons/star-orange.svg"
          totalReview={item?.total_review}
          distance={item?.distance?.toString() + 'Km'}
          estimate={item?.eta + ' menit'}
          data-automation={`search_service_card_workshop_${index}`}
          dataAutomationTitle={`search_service_card_workshop_title_${index}`}
          dataAutomationTags={`search_service_card_workshop_tags_${index}`}
          dataAutomationAddress={`search_service_card_workshop_address_${index}`}
          onCardClick={() => {
            handleCardClick('workshop', item, workshopType);
            {
              isAuthenticated && handleSaveSearchKeywords();
            }
          }}
          showFlagship={item?.tier?.name?.includes('Flagship')}
          flagshipIcon={`/assets/icons/${
            item?.tier?.name === 'Flagship' ? 'flagship' : 'flagship-plus'
          }.svg`}
          isFlagshipPlus={item?.tier?.name?.toLowerCase() === 'flagship plus'}
          flagshipDetailTarget={() => handleOpenPopUp(item?.tier?.name)}
        />
      );
    });
  };

  const renderSearchFilter = () => {
    const filterList = filters?.map((value) => {
      return (
        <Tags
          key={value.slug}
          onClick={() => clickTabSection(value.slug, value.name)}
          className={`tags custom-tags ms-2 ${hasActiveFilter(value.slug) ? '' : 'not-active'}`}
          active={hasActiveFilter(value.slug)}
          size="md"
          color={hasActiveFilter(value.slug) ? 'secondary-light' : 'white'}
          textColor={hasActiveFilter(value.slug) ? 'secondary' : 'title'}
          title={value.name}
          icon={value.icon_link}
          iconClassName={`category-icon-slider ${hasActiveFilter(value.slug) ? '' : 'not-active'}`}
          data-automation={`cari_${value?.name}_category`}
        />
      );
    });
    if (+filters.length > 0) {
      return [...filterList];
    } else {
      return [];
    }
  };

  const handleSaveSearchKeywords = async () => {
    const payload = {
      keyword: previousQuery,
      expected: activeFilter
    };

    const response = await api
      .post('v2/account/histories/search-keyword', payload)
      .catch((error) => {
        console.log(error);
      });

    return response;
  };

  const handleBack = () => {
    initialState || src === 'my_order' ? router.push('/servis') : router.back();
  };

  const handleCloseSheet = () => {
    setShowUpperSheet(false);
    Cookies.set('car_uppersheet', true, { expires: 1 });
  };

  const handleOpenSheet = () => {
    setAddCarPos(`search page - banner`);
    handleEditCar();
  };

  const showCarUppersheet = showUpperSheet && !car?.carVariantId;

  const handleButtonSubbarCar = () => {
    initialState
      ? setAddCarPos(`search page - service recomendation`)
      : setAddCarPos(`search page - selected service`);

    handleEditCar();
  };

  const checkCarModel = (car) => {
    if (car?.carModel) {
      return `${car?.carName} ${car?.carModel} - ${car?.carVariant}`;
    } else {
      return 'Mobil Saya';
    }
  };

  useEffect(() => {
    if (!initialState) {
      BranchTracker('SEARCH', { name_of_pages: 'search' });
    } else {
      BranchTracker('SEARCH', { name_of_pages: 'initiated search' });
    }
  }, [initialState]);

  return (
    <PrivateLayout
      user={user}
      title="Cari Produk atau Bengkel | Otoklix"
      description=""
      metaRobots="noindex"
      hasOtobuddy
      otobuddyType={OtobuddyType.GLOBALSEARCH}
      otobuddySource="cari"
      hasAppBar={false}
      wrapperClassName="wrapper-full"
      handleUpdate={onScrollUpdate}>
      {openModalAuth && (
        <Modal isOpen={openModalAuth} className="wrapper wrapper-xs modal-no-shadow">
          <Auth
            showAsModal
            onBackAction={() => handleCancelAuth()}
            onVerificationSubmit={() => handleSubmitAuth()}
            fromOrder
          />
        </Modal>
      )}

      {hasModalLocation && (
        <LocationModal
          fullPath={fullPath}
          pageName={'search page'}
          toggle={() => setHasModalLocation(!hasModalLocation)}
          isOpen={hasModalLocation}
          handleSelectSuggestion={handleSelectLocation}
        />
      )}

      {showCarUppersheet && (
        <Uppersheet
          buttonText="Tambahkan Mobil"
          desc="Ayo daftarkan mobilmu, biar booking makin praktis!"
          icon="/assets/icons/add-car.svg"
          handleOpen={handleOpenSheet}
          handleCloseSheet={handleCloseSheet}
          page="cari"
        />
      )}

      <Container className="shadow-sm global-search-header">
        <Row>
          <div className="d-flex flex-row pointer pt-3 align-items-center">
            <div
              className="ms-1 me-3 mb-3 back-search-icon"
              style={{ display: fullInput ? 'none' : 'block' }}
              role="presentation"
              onClick={handleBack}
              data-automation="cari_back_button">
              <img src="/assets/icons/arrow-left-thin.svg" alt="arrow-left-thin" />
            </div>

            <div className="w-100">
              <InputGlobalSearch
                disabled={sectionLoading}
                innerRef={inputRef}
                onChange={debouncedChangeHandler}
                onClick={() => onClickInputSearch()}
                onBlur={() => setFullInput(false)}
                data-automation="cari_input_search"
                className="border-1"
              />
            </div>
          </div>
        </Row>
        <div className="d-flex mb-3 mx-1">
          <ButtonSubbar
            onClick={handleButtonSubbarCar}
            className="w-100 mx-2"
            title={checkCarModel(car)}
            image={car?.carImage ? '' : '/assets/icons/no-car-black.svg'}
            imageHeight={16}
            imageAlt="no-car-black"
            data-automation="cari_edit_car"
          />

          <ButtonSubbar
            onClick={handleEditLocation}
            className="w-100 mx-2"
            title={geoLocation?.address || 'Cari di sekitar...'}
            image="/assets/icons/pin-map-grey.svg"
            imageAlt="pin-map-grey"
            data-automation="cari_location"
            useImage
          />
        </div>

        {!initialState && isShowFilterTab && (
          <div id="workshop_filter" className="global-filter mb-3">
            <div className="flex-fill">
              <div className="flex-fill">
                <ScrollMenu alignCenter={false} data={renderSearchFilter()} />
              </div>
            </div>
          </div>
        )}
      </Container>

      <Container className="home-content pt-4 px-0">
        {initialState && !sectionLoading && (
          <SearchInitialView
            car={car?.carVariantId}
            workshops={workshopRecommendation?.workshop}
            services={workshopRecommendation?.service}
            lastSearch={keywordSearch?.search_histories}
            popularSearch={keywordSearch?.popular_search}
            className="mt-3"
            onClickKeyword={(key) => {
              changeHandler({ target: { value: key } });
              inputRef.current.value = key;
            }}
            onClickService={(service) =>
              handleCardClick('product', service, '', service?.category?.slug)
            }
          />
        )}

        {sectionLoading && renderLoading()}

        {!initialState && (
          <InfiniteScroll
            loadMore={handleLoadItems}
            hasMore={!sectionLoading && !paginationLoading && hasMoreItems}
            useWindow={false}>
            <div className="tracks">
              {!sectionLoading && !isEmpty(items) && (
                <Container>
                  <div className="d-flex justify-content-between align-items-center ms-1 mt-1">
                    <Text
                      weight="semi-bold"
                      className="text-md"
                      data-automation="category_title_search">
                      {category}
                    </Text>
                    <div
                      className="d-flex align-items-center pointer me-1"
                      data-automation="sorting_search"
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
                  </div>

                  {renderCards()}
                </Container>
              )}
              {!sectionLoading && hasMoreItems && loader}
              {!isFetching && renderEmptyItems()}
            </div>
          </InfiniteScroll>
        )}
      </Container>

      <FilterBottomsheetSort
        open={openSort}
        value={filterOptions?.sorting}
        isWorkshop={activeFilter === 'workshop' || itemType === 'workshop'}
        pageName="search page"
        onClose={() => setOpenSort(false)}
        onApply={onChangeSort}
        hasCar={car?.carVariantId}
      />

      <AddCarSheet
        isTopCloseButton={true}
        fullPath={fullPath}
        openSheet={openModalCar}
        buttonType="add"
        page={addCarPos}
        onDismiss={closeEditCar}
        onApplyNewCar={handleApplyNewCar}
      />

      <AlertCarInfo carName={carName} hasBottomSheet={openCompatibility} openAlert={openAlert} />

      <CheckCompatibilitySheet
        openSheet={openCompatibility}
        forceOrder={forceOrder}
        handleRecommend={handleRecommend}
        onDismiss={() => setOpenCompatibility(false)}
      />

      {showPopupInfo && (
        <FlagshipModal
          showFlagshipModal={showPopupInfo}
          closeFlagshipModal={() => setShowPopupInfo(false)}
          tier={tier}
        />
      )}
    </PrivateLayout>
  );
};

export default GlobalSearch;

export async function getServerSideProps({ query }) {
  const { service_category, sorting, recommendation } = query;

  const location = {
    lat: monasLocation.lat,
    lng: monasLocation.lng
  };

  let params = {
    lat: location.lat,
    lng: location.lng
  };

  const [recommendationRes] = await Promise.all([fetchSearchRecommendation(params)]);

  return {
    props: {
      recommendation: recommendationRes,
      serviceCategory: service_category || 'all',
      defaultSorting: sorting || '',
      isRecommendation: recommendation || false
    }
  };
}
