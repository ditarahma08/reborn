import Breadcrumb from '@components/breadcrumb/Breadcrumb';
import { AboutFooter, Footer } from '@components/footer/Footer';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { gambirLocation } from '@utils/Constants';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import MoEngage from '@utils/MoEngage';
import useCar from '@utils/useCar';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from 'otoklix-elements/lib/components/container/Container';
import EmptyState from 'otoklix-elements/lib/components/empty/EmptyState';
import Row from 'otoklix-elements/lib/components/row/Row';
import ContentWrapper from 'otoklix-elements/lib/components/wrapper/ContentWrapper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

const AddCarSheet = dynamic(() => import('@components/sheet/AddCarSheet'));
const CheckCompatibilitySheet = dynamic(() => import('@components/sheet/CheckCompatibilitySheet'));
const FilterDynamicSheet = dynamic(() => import('@components/sheet/FilterDynamicSheet'));
const Tab = dynamic(() => import('@components/tab/Tab'));
const ButtonPagination = dynamic(() => import('@components/button/ButtonPagination'));
const Skeleton = dynamic(() => import('@components/skeleton/Skeleton'));
const Uppersheet = dynamic(() => import('@components/sheet/UpperSheet'));
const ScrollMenu = dynamic(() => import('react-horizontal-scrolling-menu'));
const CardServices = dynamic(() => import('otoklix-elements/lib/components/card/CardServices'));
const SearchHeader = dynamic(() => import('@components/servis/SearchHeader'));

const Index = (props) => {
  const { page, categoryServices, topServices, pageContent, searchProducts } = props;
  const router = useRouter();
  const inputRef = useRef();
  const limit = 16;
  let fullPath = '';

  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const listCategoryServices = [
    'oli',
    'tune-up',
    'rem',
    'cuci',
    'ban',
    'aki',
    'ac',
    'berkala',
    'detailing'
  ];
  const checkCategoryServices = listCategoryServices.indexOf(categoryServices) > -1;
  const checkIndex = () => {
    if (!checkCategoryServices) router.push('/404');
  };

  const { user, isAuthenticated } = useAuth();
  const { car } = useCar(user, isAuthenticated);
  const currentPath = router.pathname;
  const currentQuery = { ...router.query };

  const [query, setQuery] = useState('');
  const [fullInput, setFullInput] = useState(false);
  const [sectionLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCheck, setOpenCheck] = useState(false);
  const [openNewCar, setOpenNewCar] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('most-suitable');
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showMoreContent, setShowMoreContent] = useState(false);
  const [showPagination, setShowPagination] = useState(true);
  const [showSorting, setShowSorting] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [addCarPos, setAddCarPos] = useState('dynamic search page - product');
  const [showUpperSheet, setShowUpperSheet] = useState(true);

  const geoLocation = {
    lat: gambirLocation.lat,
    lng: gambirLocation.lng
  };

  const mapBranchService =
    pageContent?.tags?.length > 0
      ? pageContent?.tags.map((item, index) =>
          Helper.mappingTabBrand(item, index, categoryServices)
        )
      : [];

  const breadcrumbList = [
    { id: 1, name: 'Beranda', path: '/servis' },
    {
      id: 2,
      name: Helper.slugToTitle(categoryServices),
      path: categoryServices
    }
  ];

  const paramsSwr = {
    page: pageIndex,
    limit,
    q: query,
    sorting: selectedFilter,
    variant_car_id: car?.carVariantId ?? ''
  };

  const optionsSwr = {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false
  };

  const { data, mutate, isValidating } = useSWR(
    `${process.env.API_URL}v2/search/products/${categoryServices}/?${Helper.objectToQueryString(
      paramsSwr
    )}`,
    Helper.fetcher,
    optionsSwr
  );

  const onKeyUpSearch = (e) => {
    if (e.keyCode === 8 && e.target.value.length === 0) {
      setQuery('');
      const paramsSwrMutate = {
        page: pageIndex,
        limit,
        q: '',
        sorting: selectedFilter,
        variant_car_id: car?.carVariantId ?? ''
      };
      mutate(
        `${process.env.API_URL}v2/search/products/${categoryServices}/?${Helper.objectToQueryString(
          paramsSwrMutate
        )}`
      );
    }
  };

  const changeHandler = (e) => {
    if (e.target.value) {
      setQuery(e.target.value);
      amplitude.getInstance().logEvent('search performed', {
        search_keyword: e.target.value,
        search_category: categoryServices.toLowerCase(),
        source_search: 'dynamic search'
      });
    }
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 400), []);

  const onClickInputSearch = () => {
    setFullInput(true);
    gtag('click input search', 'clickSearchPage');
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

  const setFirstPage = () => {
    setPageIndex(1);
    pagginationRouteHandler(1);
  };

  const handleFilter = () => {
    setOpenFilter(true);
    amplitude.getInstance().logEvent('sort initiated', {
      sorted_section: 'product',
      position: 'dynamic search'
    });
  };

  const handleApplyFilter = (e) => {
    setSelectedFilter(e);
    setOpenFilter(false);
    setFirstPage();
    amplitude.getInstance().logEvent('sort submitted', {
      sorted_by_value: Helper.getNameSorted(e),
      sorted_section: 'product',
      position: 'dynamic search'
    });
  };

  const checkCompability = async (carId, prdId) => {
    const res = await api.get(
      `v2/product/is-car-recommendation/?variant_car_id=${carId}&product_id=${prdId}`
    );
    return res?.data?.data?.is_car_recommendation;
  };

  const handleSelectCar = () => {
    if (isAuthenticated) {
      router.push('/mobilku');
    } else {
      setAddCarPos('dynamic search page - product');
      setOpenNewCar(true);
    }
  };

  const handleSetNewCar = (e) => {
    checkCompability(e?.value, selectedProduct?.id).then((res) => {
      Cookies.set('product_id_selected', selectedProduct?.id);
      if (!res && Helper.checkCompatibility(categoryServices)) {
        setOpenCheck(true);
      } else {
        const params = {};
        goToWsList(params);
      }
    });
  };

  const goToWsList = (params) => {
    router.push({ pathname: `/cari/pilih-bengkel`, query: params });
  };

  const handleClickProduct = (item, car) => {
    setSelectedProduct(item);
    Cookies.set('product_id_selected', item?.id);
    amplitude.getInstance().logEvent('search result selected', {
      search_category: item?.service_category?.slug,
      source_list: 'dynamic search',
      search_result: item?.name
    });
    if (isUndefined(car)) {
      setAddCarPos('dynamic search page - product');
      setOpenNewCar(true);
    }
    if (!isUndefined(car) && !Helper.checkCompatibility(categoryServices)) {
      const params = {
        lat: geoLocation?.lat,
        lng: geoLocation?.lng
      };
      goToWsList(params);
    }
    if (!isUndefined(car) && item?.compatibility) {
      const params = {
        lat: geoLocation?.lat,
        lng: geoLocation?.lng
      };
      goToWsList(params);
    }
    if (!isUndefined(car) && !item?.compatibility && Helper.checkCompatibility(categoryServices)) {
      setOpenCheck(true);
    }
  };

  const forceOrder = () => {
    Cookies.set('product_id_selected', selectedProduct?.id);
    const params = {};
    goToWsList(params);
  };

  const scrollToTop = () => {
    const elm = document.getElementById('breadrumbDynamicSearch');
    elm.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRecommend = () => {
    setPageIndex(1);
    setSelectedFilter('most-suitable');
    setOpenCheck(false);
    scrollToTop();
  };

  const handleButtonPagination = (e) => {
    setPageIndex(e);
    pagginationRouteHandler(e);
    scrollToTop();
  };

  const handleClickBanner = () => {
    amplitude.getInstance().logEvent('banner selected', {
      cta_location: 'top',
      banner_caption: pageContent?.banner?.caption,
      page_location: fullPath
    });
  };

  const handleClickTab = (subCategory) => {
    setFirstPage();
    amplitude.getInstance().logEvent('service sub category selected', {
      service_category: categoryServices.toLowerCase(),
      service_sub_category: subCategory.toLowerCase(),
      page_location: fullPath
    });
  };

  const renderProduct = () => {
    const dataList = data?.data?.products;
    if (dataList?.length > 0) {
      return dataList.map((item) => {
        const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));
        const categoryService = item?.service_category?.name;
        const checkSubPrice =
          item.discount_value !== 0 && `Rp${Helper.formatMoney(item?.original_price)}`;
        const isDiscountPackage = item.discount_value !== 0 && `${item?.discount_value}%`;
        const isLiter = item?.product_unit;
        return (
          <div className="mx-2 my-3 pointer" key={item.id}>
            <CardServices
              image={item.image_link}
              title={item.name}
              categoryLabel={categoryService}
              price={`Rp${Helper.formatMoney(item?.price)}${
                isLiter && !getCarId?.car_details?.id ? '/liter' : ''
              }`}
              detailPrice={
                isLiter &&
                getCarId?.car_details?.id &&
                `Rp${Helper.formatMoney(item?.product_price)}/${isLiter}`
              }
              subPrice={checkSubPrice}
              discountLabel={isDiscountPackage}
              showStartPrice={true}
              data-automation="cari_workshop_service_card"
              quantity={
                isLiter &&
                getCarId?.car_details?.id &&
                item?.product_quantity &&
                `${item?.product_quantity} liter`
              }
              isRecommended={Helper.labelRecommend(item?.compatibility)}
              onCardClick={() => handleClickProduct(item, getCarId)}
              showUsp={item?.service_category?.slug === 'oli' && item?.is_fbo}
              guaranteeIcon={'/assets/icons/guarantee-blue.svg'}
              discountIcon={'/assets/icons/discount.svg'}
              bookmarkIcon={'/assets/icons/bookmark.svg'}
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

  useEffect(() => {
    scrollToTop();
    checkIndex();
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'dynamic search',
      screen_category: 'browse',
      page_location: fullPath
    });
    MoEngage.trackEvent('screen viewed', {
      screen_name: 'dynamic search',
      page_location: fullPath
    });
  }, [categoryServices]);

  useEffect(() => {
    if (!isEmpty(pageContent?.bottom_content?.content)) {
      setShowMoreContent(false);
    } else {
      setShowMoreContent(true);
    }
  }, [pageContent]);

  useEffect(() => {
    if (page) {
      setPageIndex(page);
      pagginationRouteHandler(page);
    }
  }, [page]);

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
      amplitude.getInstance().logEvent('product list viewed', {
        service_category_name: categoryServices.toLowerCase(),
        total_product_viewed: data?.data?.products?.length,
        source_list: 'dynamic search',
        page_location: fullPath,
        workshop_name: 'none',
        product_list_type: categoryServices.toLowerCase()
      });
    }
  }, [data]);

  useEffect(() => {
    const paramsSwrMutate = {
      page: pageIndex,
      limit,
      q: '',
      sorting: selectedFilter,
      variant_car_id: car?.carVariantId ?? ''
    };
    mutate(
      `${process.env.API_URL}v2/search/products/${categoryServices}/?${Helper.objectToQueryString(
        paramsSwrMutate
      )}`
    );

    BranchTracker('SEARCH', { name_of_pages: 'dynamic search product' });
  }, []);

  const jsonDataProduct = () =>
    searchProducts?.data?.products?.map((product, index) => {
      return (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: product?.name,
              productID: product?.id,
              image: product?.image_link,
              keywords: product?.service_category?.name,
              brands: product?.brand_product,
              offers: {
                '@type': 'offer',
                availability: 'https://schema.org/InStock',
                priceSpecification:
                  product?.service_category?.name === 'Oli'
                    ? {
                        '@type': 'UnitPriceSpecification',
                        price: product?.price,
                        priceCurrency: 'IDR',
                        referenceQuantity: {
                          '@type': 'QuantitativeValue',
                          value: '1',
                          unitCode: 'LTR'
                        }
                      }
                    : {
                        '@type': 'UnitPriceSpecification',
                        price: product?.price,
                        priceCurrency: 'IDR'
                      }
              }
            })
          }}
        />
      );
    });

  return (
    <>
      <Head>{jsonDataProduct()}</Head>
      <PrivateLayout
        hasAppBar={false}
        hasOtobuddy
        title={pageContent?.meta_title}
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
            handleBack={() => router.back()}
          />
        </Container>
        <Container>
          <Breadcrumb list={breadcrumbList} />
          {pageContent?.banner?.image_link ? (
            <Link href={pageContent?.banner?.page_url ?? '#'}>
              <div
                className="banner-dynamic cursor-pointer"
                id="bannerDynamic"
                onClick={() => handleClickBanner()}>
                <img
                  className="cursor-pointer"
                  src={pageContent?.banner?.image_link ?? `/assets/images/noimage.png`}
                  alt="banner"
                  width="100%"
                  height={75}
                />
              </div>
            </Link>
          ) : (
            ''
          )}
          {mapBranchService.length > 0 ? (
            <ScrollMenu
              alignCenter={false}
              data={mapBranchService.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    active={item?.isActive}
                    item={item}
                    onTabClick={() => handleClickTab(item?.name)}
                  />
                );
              })}
            />
          ) : (
            ''
          )}
          <ContentWrapper
            title={
              <div style={{ maxWidth: '75%' }}>
                <h1>{pageContent?.header}</h1>
              </div>
            }
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
            {car?.carModel && (
              <div className="d-flex box-label">
                <span className="label-select-car">Mobilmu:</span>
                <span className="selected-car" onClick={() => handleSelectCar()}>
                  {car?.carName} {car?.carModel} - {car?.carVariant}
                  <img
                    src="/assets/icons/chevron-down-primary.svg"
                    className="chevron-down-icon"
                    alt="chevron-down"
                  />
                </span>
              </div>
            )}
            <div id="containerProductList">{renderProduct()}</div>
            {isValidating || isUndefined(data)
              ? [...Array(limit).keys()].map((value) => (
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
          </ContentWrapper>
        </Container>
        <Footer title={pageContent?.bottom_content?.header} />
        <Container className="container-content pb-30">
          <div
            className="content-title"
            dangerouslySetInnerHTML={{ __html: pageContent?.bottom_content?.title }}></div>
          {!showMoreContent ? (
            <>
              {pageContent?.bottom_content?.content ? (
                <p>{Helper.shortHtmlContent(pageContent?.bottom_content?.content)}</p>
              ) : (
                ''
              )}
              <Row className="position-relative otoklix-footer">
                <div className="divider-gray" />
                <div className="show-more mb-3" onClick={() => setShowMoreContent(true)}>
                  Selengkapnya{' '}
                  <img
                    src="/assets/icons/arrow-down-gray.svg"
                    alt="arrow-down-gray"
                    loading="lazy"
                  />
                </div>
              </Row>
            </>
          ) : (
            <div
              className={!showMoreContent ? 'content' : ''}
              dangerouslySetInnerHTML={{ __html: pageContent?.bottom_content?.content }}></div>
          )}
        </Container>
        <AboutFooter topServices={topServices} />
        <FilterDynamicSheet
          openSheet={openFilter}
          filterPromo={selectedFilter}
          handleOnClose={() => setOpenFilter(false)}
          handleOnApply={(e) => handleApplyFilter(e)}
        />
        <AddCarSheet
          fullPath={fullPath}
          page={addCarPos}
          openSheet={openNewCar}
          buttonType={'order'}
          onDismiss={() => setOpenNewCar(false)}
          onSetNewCar={(e) => handleSetNewCar(e)}
        />
        <CheckCompatibilitySheet
          openSheet={openCheck}
          forceOrder={() => forceOrder()}
          handleRecommend={() => handleRecommend()}
          onDismiss={() => setOpenCheck(false)}
        />
      </PrivateLayout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { categoryServices, page } = query;

  let params = {
    page: 1,
    limit: 16,
    q: ''
  };

  let apiSearchProducts = `${
    process.env.API_URL
  }v2/search/products/${categoryServices}/?${JSON.stringify(params)}`;

  const [pageContentRes, topServicesRes, searchProductsRes] = await Promise.all([
    fetch(`${process.env.API_URL}v2/search/products/${categoryServices}/?initial=true`),
    fetch(`${process.env.API_URL}v2/product/tags/top-services`),
    fetch(apiSearchProducts)
  ]);
  const [pageContent, topServices, searchProducts] = await Promise.all([
    pageContentRes.json(),
    topServicesRes.json(),
    searchProductsRes.json()
  ]);

  return {
    props: {
      page: page || 1,
      categoryServices,
      pageContent: pageContent?.data ?? {},
      topServices: topServices || [],
      searchProducts: searchProducts || []
    }
  };
}

export default Index;
