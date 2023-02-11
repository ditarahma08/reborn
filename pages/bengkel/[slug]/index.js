import WorkshopDetail from '@components/pages/workshopDetail';
import WorkshopLocation from '@components/pages/workshopLocation';
import { api } from '@utils/API';
import { day, listLocation, monasLocation } from '@utils/Constants';
import Helper from '@utils/Helper';
import Cookies from 'js-cookie';
import { isUndefined } from 'lodash';
import Head from 'next/head';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';

function Screen(props) {
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
    topServices,
    isWorkshop,
    serviceCategory,
    pageContent,
    page,
    workshopList,
    workshopPackages
  } = props;

  const [userCar, setUserCar] = useState();
  const [userLocation, setUserLocation] = useState();
  const [workshopDetailData, setWorkshopDetailData] = useState(workshopDetail);

  const getUserCar = Cookies.get('user_car', { path: '/' });
  const getDefaultGeolocation = listLocation.filter((data) => data?.slug === slug);

  const getDetailWorkshop = async (location, car) => {
    let params = {
      promo,
      variant_car_id: car,
      latitude: location?.lat ? location.lat : monasLocation.lat,
      longitude: location?.lng ? location.lng : monasLocation.lng,
      category: serviceCategory || 'oli'
    };

    const res = await api.get(`${process.env.API_URL}v2/workshops/${slug}/?${stringify(params)}`);
    if (+res?.status === 200) {
      setWorkshopDetailData(res?.data?.data);
    }
  };

  useEffect(() => {
    if (isWorkshop && !isUndefined(userLocation)) {
      getDetailWorkshop(userLocation, userCar?.car_details?.id);
    }
  }, [userLocation, userCar]);

  useEffect(() => {
    if (getUserCar) {
      setUserCar(JSON.parse(getUserCar));
    }
  }, [getUserCar]);

  useEffect(() => {
    const location = Helper.getLocation();
    if (location) {
      setUserLocation(location);
    }
  }, []);

  const jsonDataWorkshop = {
    '@context': 'http://schema.org/',
    '@type': 'AutoRepair',
    name: workshopDetail?.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviewData?.data?.rating,
      reviewCount: reviewData?.data?.total_reviewer,
      bestRating: 5,
      worstRating: 1
    },
    url: `${process.env.APP_URL}bengkel/${slug}`,
    image: workshopDetail?.image_link,
    address: {
      '@type': 'PostalAddress',
      addressLocality: workshopDetail?.street_address?.split(',')?.[0],
      addressCountry: 'Indonesia',
      addressRegion: workshopDetail?.city,
      streetAddress: workshopDetail?.street_address,
      postalCode: workshopDetail?.postal_code ?? ''
    },
    openingHoursSpecification: operatingHours?.data?.map((ws, index) => {
      return {
        '@type': 'OpeningHoursSpecification',
        closes: `${ws?.closing_hour?.slice(0, 2)}:00:00`,
        dayOfWeek: `https://schema.org/${day[index]}`,
        opens: `${ws?.opening_hour?.slice(0, 2)}:00:00`
      };
    }),
    amenityFeature: workshopDetail?.facilities?.map((facility) => {
      return {
        name: facility?.name?.toLowerCase() === 'non ac' ? 'Ruang Tunggu' : facility?.name,
        value: true,
        '@type': 'LocationFeatureSpecification'
      };
    }),
    keywords: workshopDetail?.service_categories?.map((category) => {
      return category?.name;
    })
  };

  const jsonDataProduct = () =>
    workshopPackages?.data?.map((product, index) => {
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
                        price: product?.product_price,
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
      <Head>
        {isWorkshop && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonDataWorkshop)
            }}
          />
        )}
        {jsonDataProduct()}
      </Head>
      {isWorkshop ? (
        <WorkshopDetail
          workshopDetail={workshopDetailData}
          workshopIsOpen={workshopIsOpen}
          slug={slug}
          operatingHours={operatingHours}
          currentOperationHour={currentOperationHour}
          faqs={faqs}
          serviceInit={serviceInit}
          reviewData={reviewData}
          promo={promo}
          origin={origin}
          productId={productId}
          isPudo={isPudo}
          location={userLocation}
          topServices={topServices}
        />
      ) : (
        <WorkshopLocation
          page={page}
          slug={slug}
          faqs={faqs.data}
          topServices={topServices}
          serviceCategory={serviceCategory}
          pageContent={pageContent}
          workshopList={workshopList}
          defaultGeolocation={getDefaultGeolocation[0]?.geoLocation}
        />
      )}
    </>
  );
}

export default Screen;

export async function getServerSideProps({ query }) {
  const {
    slug,
    keywords,
    promo,
    lat,
    lng,
    service_category,
    variant_car_id,
    origin,
    productId,
    pudo,
    page
  } = query;
  const queryLocation = lat && lng;

  const location = {
    lat: queryLocation ? Number(lat) : monasLocation.lat,
    lng: queryLocation ? Number(lng) : monasLocation.lng
  };

  let params = {
    promo,
    variant_car_id,
    latitude: location.lat,
    longitude: location.lng,
    category: service_category || 'oli'
  };

  if (pudo) {
    params = {
      ...params,
      is_pudo: pudo
    };
  }

  // Workshop Info and Quick Filters
  let apiWorkshopDetailUrl = `${process.env.API_URL}v2/workshops/${slug}/?${stringify(params)}`;

  const [workshopDataRes, faqsRes, topServicesRes] = await Promise.all([
    fetch(apiWorkshopDetailUrl),
    fetch(`${process.env.API_URL}v2/faq/?faq_type=home`),
    fetch(`${process.env.API_URL}v2/product/tags/top-services`)
  ]);
  const [workshopData, faqs, topServices] = await Promise.all([
    workshopDataRes.json(),
    faqsRes.json(),
    topServicesRes.json()
  ]);

  if (!isUndefined(workshopData?.data)) {
    const [
      operationHourRes,
      reviewDataRes,
      filterRes,
      sortingRes,
      workshopPackagesRes
    ] = await Promise.all([
      fetch(`${process.env.API_URL}v2/workshops/${slug}/operating_hours`),
      fetch(`${process.env.API_URL}v2/workshops/${slug}/reviews/?limit=3`),
      fetch(`${process.env.API_URL}v2/packages/filter-opt`),
      fetch(`${process.env.API_URL}v2/packages/sorting-opt`),
      fetch(
        `${
          process.env.API_URL
        }v2/workshops/${slug}/inventory/products?limit=20&page=1&service_category=${
          service_category ?? 'oli'
        }&promo_code=${promo ?? ''}&variant_car_id=${variant_car_id}`
      )
    ]);

    const [
      operatingHours,
      reviewData,
      filterData,
      sortingData,
      workshopPackages
    ] = await Promise.all([
      operationHourRes.json(),
      reviewDataRes.json(),
      filterRes.json(),
      sortingRes.json(),
      workshopPackagesRes.json()
    ]);

    const workshopDetail = workshopData?.data;
    const serviceInit = Helper.getServiceInit(
      service_category || workshopDetail?.service_categories[0]?.slug,
      workshopDetail?.service_categories,
      'slug'
    );
    const dataFilters = filterData?.data;
    const dataSortings = sortingData?.data;

    // Operating Hours
    let workshopIsOpen = false;
    let openingData = workshopDetail.current_operation_hour;

    const today = new Date().toLocaleDateString('en-US');
    const timeOpen = new Date(`${today} ${openingData.opening_hour}:00 GMT+0700`).getTime();
    const timeClose = new Date(`${today} ${openingData.closing_hour}:00 GMT+0700`).getTime();
    const timeNow = new Date().getTime();
    const currentOperationHour = openingData;

    if (timeOpen < timeNow && timeNow < timeClose) {
      workshopIsOpen = true;
    }

    return {
      props: {
        keywords: keywords || ``,
        promo: promo || ``,
        serviceInit,
        workshopDetail,
        slug,
        workshopIsOpen,
        operatingHours,
        currentOperationHour,
        faqs,
        reviewData,
        dataFilters,
        dataSortings,
        origin: origin || '',
        productId: productId || '',
        isPudo: pudo || '',
        topServices: topServices || [],
        isWorkshop: true,
        workshopPackages: workshopPackages || []
      }
    };
  } else {
    const paramsSwr = {
      initial: false,
      page: page ?? 1,
      limit: 16,
      search: '',
      sorting: 'closest',
      service_category: service_category
    };

    const [pageContentRes, workshopListRes] = await Promise.all([
      fetch(
        `${process.env.API_URL}v2/search/workshops/${slug}/?service_category=${
          service_category ?? ''
        }&initial=true`
      ),
      fetch(
        `${process.env.API_URL}v2/search/workshops/${slug}/?${Helper.objectToQueryString(
          paramsSwr
        )}`
      )
    ]);
    const [pageContent, workshopList] = await Promise.all([
      pageContentRes.json(),
      workshopListRes.json()
    ]);

    return {
      props: {
        page: page || 1,
        pageContent: pageContent?.data || null,
        slug,
        faqs,
        topServices,
        serviceCategory: service_category || null,
        isWorkshop: false,
        workshopList: workshopList || []
      }
    };
  }
}
