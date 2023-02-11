import { gtm } from '@utils/Gtm';
import Helper from '@utils/Helper';
import { find } from 'lodash';
import moment from 'moment';

export default class GtmEvents {
  /* 
    event function, call from trigerred page / action
  */

  static gtmPdpBengkel(
    detailActive,
    cartDetail,
    packageActive,
    quickFilters,
    serviceActive,
    packageDetailActive,
    workshopDetail
  ) {
    const paramsData = {
      ecommerce: {
        detail: {
          products: this.getProductsPdpAddToCartBengkel(
            detailActive,
            cartDetail,
            packageActive,
            quickFilters,
            serviceActive,
            packageDetailActive,
            workshopDetail,
            'pdp'
          )
        }
      }
    };

    gtm(
      'pdp_view',
      'Detail Pageview',
      Helper.shortenName(Helper.removeDoubleSpace(packageDetailActive?.name)),
      '',
      '',
      paramsData
    );
  }

  static gtmAddToCartBengkel(
    detailActive,
    cartDetail,
    packageActive,
    quickFilters,
    serviceActive,
    packageDetailActive,
    workshopDetail
  ) {
    const paramsData = {
      ecommerce: {
        add: {
          products: this.getProductsPdpAddToCartBengkel(
            detailActive,
            cartDetail,
            packageActive,
            quickFilters,
            serviceActive,
            packageDetailActive,
            workshopDetail,
            'add_to_cart'
          )
        }
      }
    };

    gtm(
      'add_to_cart',
      'Add to Cart',
      Helper.shortenName(Helper.removeDoubleSpace(packageDetailActive?.name)),
      '',
      '',
      paramsData
    );
  }

  static gtmPdpOrderSheet(activePkg, cartPkg) {
    const paramsData = {
      ecommerce: {
        detail: {
          products: this.getProductsPdpAddToCartOrderSheet(activePkg, cartPkg, 'pdp')
        }
      }
    };

    gtm(
      'pdp_view',
      'Detail Pageview',
      Helper.shortenName(Helper.removeDoubleSpace(activePkg?.name)),
      '',
      '',
      paramsData
    );
  }

  static gtmAddToCartOrderSheet(activePkg, cartPkg) {
    const paramsData = {
      ecommerce: {
        add: {
          products: this.getProductsPdpAddToCartOrderSheet(activePkg, cartPkg, 'add_to_cart')
        }
      }
    };

    gtm(
      'add_to_cart',
      'Add to Cart',
      Helper.shortenName(Helper.removeDoubleSpace(activePkg?.name)),
      '',
      '',
      paramsData
    );
  }

  static gtmCheckoutKonfirmasiOrder(dataOrderConfirmation) {
    const paramsData = {
      ecommerce: {
        checkout: {
          actionField: {
            step: 1
          },
          products: this.getProductsCheckoutKonfirmasiOrder(dataOrderConfirmation)
        }
      }
    };

    gtm(
      'checkout',
      'Checkout Step 1',
      dataOrderConfirmation?.packages?.length > 0 && dataOrderConfirmation?.packages[0]?.name
        ? Helper.shortenName(Helper.removeDoubleSpace(dataOrderConfirmation.packages[0].name))
        : '',
      '',
      '',
      paramsData
    );
  }

  static gtmPurchaseOrder(dataOrder) {
    let eventLabel = '';
    let carDetails = [];
    let serviceDateTime =
      dataOrder?.booking_datetime && moment(dataOrder?.booking_datetime).isValid()
        ? moment(dataOrder?.booking_datetime).format('MMM DD YYYY, HH:mm')
        : '';
    carDetails.push(dataOrder?.user_car?.car_details?.car_model?.brand?.name ?? '');
    carDetails.push(dataOrder?.user_car?.car_details?.car_model?.model_name ?? '');
    carDetails.push(dataOrder?.user_car?.car_details?.variant ?? '');
    carDetails.push(
      dataOrder?.user_car?.transmission
        ? Helper.transmissionConverter(dataOrder?.user_car?.transmission)
        : ''
    );
    carDetails.push(
      dataOrder?.user_car?.car_details?.fuel
        ? Helper.fuelConverter(dataOrder?.user_car?.car_details?.fuel)
        : ''
    );
    carDetails.push(dataOrder?.user_car?.license_plate ?? '');

    dataOrder?.packages?.length > 0 &&
      dataOrder?.packages.forEach((value) => {
        if (value?.name) {
          const packageName = Helper.shortenName(Helper.removeDoubleSpace(value?.name));
          eventLabel += eventLabel == '' ? packageName : ', ' + packageName;
        }
      });

    const paramsData = {
      car_detail: Helper.removeDoubleSpace(carDetails.join(' ')),
      service_date_time: serviceDateTime,
      payment_method: dataOrder?.payment_details?.method_name
        ? Helper.removeDoubleSpace(dataOrder?.payment_details?.method_name)
        : '',
      coupon_amount: dataOrder?.discount_promo ?? 0,
      oto_points: dataOrder?.total_point_get ?? 0,
      oto_points_used: dataOrder?.total_point_spent ?? 0,
      ecommerce: {
        currencyCode: 'IDR',
        purchase: {
          actionField: {
            id: dataOrder?.booking_code ? Helper.removeDoubleSpace(dataOrder?.booking_code) : '',
            affiliation: 'Not Available',
            revenue: dataOrder?.total_price ?? 0,
            tax: 0,
            shipping: 0,
            coupon:
              dataOrder?.promo?.promo_code && dataOrder?.promo?.promo_code !== ''
                ? Helper.removeDoubleSpace(dataOrder?.promo?.promo_code)
                : 'Not Available'
          },
          products: this.getProductsPurchaseOrder(dataOrder)
        }
      }
    };

    gtm('purchase', 'Purchase', eventLabel, '', '', paramsData);
  }

  static gtmPromoImpressionsWorkshopBannerIndex(
    paramData,
    category,
    contentLocation,
    url,
    userCar,
    geoLocation
  ) {
    const paramsData = {
      ecommerce: {
        promoView: {
          promotions: this.getPromoImpressionsClickWorkshopBannerIndex(
            paramData,
            category,
            contentLocation,
            url,
            userCar,
            geoLocation
          )
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'promotion_view',
      'Promotion Impression',
      Helper.removeDoubleSpace(category),
      '',
      '',
      paramsData
    );
  }

  static gtmPromoImpressionsServiceServisBengkel(
    paramData,
    category,
    contentLocation,
    url,
    serviceActive,
    quickFilters,
    userCar,
    promo,
    geoLocation
  ) {
    const selectedCategory = quickFilters?.find((x) => x.slug == serviceActive);
    const categoryService = selectedCategory?.name ?? '';
    const location = contentLocation + ' ' + categoryService;
    const paramsData = {
      ecommerce: {
        promoView: {
          promotions: this.getPromoImpressionsClickServiceServisBengkel(
            paramData,
            location,
            url,
            serviceActive,
            userCar,
            promo,
            geoLocation
          )
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'promotion_view',
      'Promotion Impression',
      Helper.removeDoubleSpace(category),
      '',
      '',
      paramsData
    );
  }

  static gtmPromoClickWorkshopBannerIndex(
    paramData,
    category,
    contentLocation,
    url,
    userCar,
    geoLocation
  ) {
    const paramsData = {
      ecommerce: {
        promoClick: {
          promotions: this.getPromoImpressionsClickWorkshopBannerIndex(
            paramData,
            category,
            contentLocation,
            url,
            userCar,
            geoLocation
          )
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'promotion_click',
      'Promotion Click',
      Helper.removeDoubleSpace(category),
      '',
      '',
      paramsData
    );
  }

  static gtmPromoClickServiceServisBengkel(
    paramData,
    category,
    contentLocation,
    url,
    serviceActive,
    quickFilters,
    userCar,
    promo,
    geoLocation
  ) {
    const selectedCategory = quickFilters?.find((x) => x.slug == serviceActive);
    const categoryService = selectedCategory?.name ?? '';
    const location = contentLocation + ' ' + categoryService;
    const paramsData = {
      ecommerce: {
        promoClick: {
          promotions: this.getPromoImpressionsClickServiceServisBengkel(
            paramData,
            location,
            url,
            serviceActive,
            userCar,
            promo,
            geoLocation
          )
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'promotion_click',
      'Promotion Click',
      Helper.removeDoubleSpace(category),
      '',
      '',
      paramsData
    );
  }

  static gtmProductImpressionsIndex(paramData, contentLocation) {
    const paramsData = {
      ecommerce: {
        impressions: this.getProductImpressionsClickIndex(paramData, 'impression', contentLocation)
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm('product_impression', 'Product Impression', 'All Service Category', '', '', paramsData);
  }

  static gtmProductImpressionsBengkel(
    paramData,
    quickFilters,
    serviceActive,
    contentLocation,
    workshopDetail
  ) {
    const selectedCategory = quickFilters?.find((x) => x.slug == serviceActive);
    const paramsData = {
      ecommerce: {
        impressions: this.getProductImpressionsClickBengkel(
          paramData,
          'impression',
          selectedCategory?.name ?? '',
          contentLocation,
          workshopDetail
        )
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'product_impression',
      'Product Impression',
      selectedCategory?.name ? Helper.removeDoubleSpace(selectedCategory?.name) : '',
      '',
      '',
      paramsData
    );
  }

  static gtmProductImpressionsPromo(paramData, promoName) {
    const paramsData = {
      ecommerce: {
        impressions: this.getProductImpressionsClickPromo(paramData, 'impression', promoName)
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm('product_impression', 'Product Impression', 'All Service Category', '', '', paramsData);
  }

  static gtmProductClickIndex(paramData, productName, contentLocation) {
    const paramsData = {
      ecommerce: {
        click: {
          actionField: {
            list: Helper.removeDoubleSpace(contentLocation)
          },
          products: this.getProductImpressionsClickIndex(paramData, 'click', contentLocation)
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'product_click',
      'Product Click',
      Helper.shortenName(Helper.removeDoubleSpace(productName)),
      '',
      '',
      paramsData
    );
  }

  static gtmProductClickBengkel(
    paramData,
    quickFilters,
    serviceActive,
    productName,
    contentLocation,
    workshopDetail
  ) {
    const selectedCategory = quickFilters?.find((x) => x.slug == serviceActive);
    const workshop = workshopDetail?.name ?? '';
    const paramsData = {
      ecommerce: {
        click: {
          actionField: {
            list:
              Helper.removeDoubleSpace(contentLocation) + ' - ' + Helper.removeDoubleSpace(workshop)
          },
          products: this.getProductImpressionsClickBengkel(
            paramData,
            'click',
            selectedCategory?.name ?? '',
            contentLocation,
            workshopDetail
          )
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'product_click',
      'Product Click',
      Helper.shortenName(Helper.removeDoubleSpace(productName)),
      '',
      '',
      paramsData
    );
  }

  static gtmProductClickPromo(paramData, promoName, productName) {
    const paramsData = {
      ecommerce: {
        click: {
          actionField: {
            list: Helper.removeDoubleSpace(promoName)
          },
          products: this.getProductImpressionsClickPromo(paramData, 'click', promoName)
        }
      }
    };

    gtm('reset_ecommerce', '', '', '', '', {});
    gtm(
      'product_click',
      'Product Click',
      Helper.shortenName(Helper.removeDoubleSpace(productName)),
      '',
      '',
      paramsData
    );
  }

  static gtmNavigationMenuClick(url, menu) {
    const label = url?.href ?? '';
    const strMenu = menu == 'bengkel' ? 'Explore' : menu;
    const action = strMenu ? strMenu.charAt(0).toUpperCase() + strMenu.slice(1) : '';

    gtm('general_event', action, label, 'navigation_click', 'Navigation Click', {});
  }

  static gtmClickAllPromo(label) {
    gtm(
      'general_event',
      'Semua Click',
      Helper.removeDoubleSpace(label),
      'detail_view_intention',
      'Detail View Intention',
      {}
    );
  }

  static gtmSuccessLoginRegister(userData, param) {
    let label = '';
    if (param?.method) {
      label = param.method == 'account' ? 'Google Account' : 'No HP';
    }
    if (param?.type == 'otp' || param?.type == 'login') {
      gtm('general_event', 'Success Login', label, 'login', 'Login', {
        user_id: userData?.id ?? ''
      });
    }
    if (param?.type == 'otp-register' || param?.type == 'register') {
      gtm('general_event', 'Success Registration', label, 'registration', 'Registration', {
        user_id: userData?.id ?? ''
      });
    }
  }

  static gtmServiceMenuClickHomePage(action, label) {
    gtm('general_event', action, label, 'service_menu_click', 'Service Menu Click', {});
  }

  static gtmSearchKeywordClickSearchPage(action, label) {
    gtm('general_event', action, label, 'search_interaction', 'Search Interaction', {});
  }

  static gtmMapsInteractionExplore(label) {
    gtm('general_event', 'Maps Location Click', label, 'explore', 'Explore', {});
  }

  static gtmSuccessAddCar(label) {
    gtm(
      'general_event',
      'Successfully Add Car',
      label,
      'garasi_interaction',
      'Garasi Interaction',
      {}
    );
  }

  static gtmBookingAgainClick(data) {
    let labelArr = [];

    data?.packages?.length &&
      data?.packages.forEach((item) => {
        const product = Helper.shortenName(item?.name);
        const workshop = data?.workshop?.name ?? '';
        const productWorkshop = product + ' by ' + workshop;

        labelArr.push(productWorkshop);
      });

    const label = labelArr.join(', ');

    gtm(
      'general_event',
      'Booking Lagi Click',
      Helper.removeDoubleSpace(label),
      'repeat_booking',
      'Repeat Booking',
      {}
    );
  }

  /* 
    end of event function, call from trigerred page / action
  */

  /* 
    param data function, call from event function to get data product, etc
  */

  static getProductsPdpAddToCartBengkel(
    detailActive,
    cartDetail,
    packageActive,
    quickFilters,
    serviceActive,
    packageDetailActive,
    workshopDetail,
    status
  ) {
    let products = [];
    let price = 0;
    let variantArr = [];

    detailActive?.main?.length &&
      detailActive?.main.forEach((detail) => {
        cartDetail[packageActive] &&
          cartDetail[packageActive].forEach((item) => {
            if (detail?.id && detail?.id == item?.package_detail_id && item?.package_detail_id) {
              const selectedvariant = find(detail?.line_item?.items, { id: item?.line_item_id });
              const variantHeader = detail?.name ?? '';
              const variantDetail = selectedvariant?.name ? ' ' + selectedvariant.name : '';
              const variantPrice = detail?.price ?? 0;
              price += selectedvariant?.price ?? variantPrice;
              variantArr.push(variantHeader + variantDetail);
            }
          });
      });

    const selectedCategory = quickFilters?.find((x) => x.slug == serviceActive);
    const product = {
      name: Helper.shortenName(Helper.removeDoubleSpace(packageDetailActive?.name)),
      id: packageDetailActive?.id ?? '',
      price: price,
      brand: workshopDetail?.name ? Helper.removeDoubleSpace(workshopDetail?.name) : '',
      category: selectedCategory?.name ? Helper.removeDoubleSpace(selectedCategory?.name) : '',
      variant: Helper.removeDoubleSpace(variantArr.join(', '))
    };
    if (status == 'add_to_cart') {
      product.quantity = 1;
    }
    products.push(product);

    return products;
  }

  static getProductsPdpAddToCartOrderSheet(activePkg, cartPkg, status) {
    let products = [];
    let price = 0;
    let variantArr = [];

    activePkg?.detail?.main?.length &&
      activePkg?.detail?.main.forEach((detail) => {
        cartPkg?.length &&
          cartPkg.forEach((item) => {
            if (detail?.id && detail?.id == item?.package_detail_id && item?.package_detail_id) {
              const selectedvariant = find(detail?.line_item?.items, { id: item?.line_item_id });
              const variantHeader = detail?.name ?? '';
              const variantDetail = selectedvariant?.name ? ' ' + selectedvariant.name : '';
              const variantPrice = detail?.price ?? 0;
              price += selectedvariant?.price ?? variantPrice;
              variantArr.push(variantHeader + variantDetail);
            }
          });
      });

    const product = {
      name: Helper.shortenName(Helper.removeDoubleSpace(activePkg?.name)),
      id: activePkg?.id ?? '',
      price: price,
      brand: activePkg?.workshop?.name ? Helper.removeDoubleSpace(activePkg?.workshop?.name) : '',
      category: activePkg?.category_name ? Helper.removeDoubleSpace(activePkg?.category_name) : '',
      variant: Helper.removeDoubleSpace(variantArr.join(', '))
    };
    if (status == 'add_to_cart') {
      product.quantity = 1;
    }
    products.push(product);

    return products;
  }

  static getProductsCheckoutKonfirmasiOrder(dataCheckout) {
    let products = [];
    let variantArr = [];

    dataCheckout?.packages?.length > 0 &&
      dataCheckout?.packages[0]?.package_details.forEach((detail) => {
        const variantHeader = detail?.name ?? '';
        const variantDetail = detail?.line_item?.items?.name
          ? ' ' + detail.line_item.items.name
          : '';
        variantArr.push(variantHeader + variantDetail);
      });

    const product = {
      name:
        dataCheckout?.packages?.length > 0 && dataCheckout?.packages[0]?.name
          ? Helper.shortenName(Helper.removeDoubleSpace(dataCheckout.packages[0].name))
          : '',
      id:
        dataCheckout?.packages?.length > 0 && dataCheckout?.packages[0]?.id
          ? dataCheckout.packages[0].id
          : '',
      price:
        dataCheckout?.packages?.length > 0 && dataCheckout?.packages[0]?.total_price_package
          ? dataCheckout.packages[0].total_price_package
          : 0,
      brand: dataCheckout?.workshop?.name
        ? Helper.removeDoubleSpace(dataCheckout?.workshop?.name)
        : '',
      category:
        dataCheckout?.packages?.length > 0 && dataCheckout?.packages[0]?.category
          ? Helper.removeDoubleSpace(dataCheckout.packages[0].category)
          : '',
      variant: Helper.removeDoubleSpace(variantArr.join(', ')),
      quantity: 1
    };
    products.push(product);

    return products;
  }

  static getProductsPurchaseOrder(dataPurchase) {
    let products = [];

    dataPurchase?.packages?.length > 0 &&
      dataPurchase?.packages.forEach((value) => {
        let variantArr = [];

        value.package_details.forEach((package_detail) => {
          const variantHeader = package_detail?.name ?? '';
          const variantDetail = package_detail?.line_item?.items?.name
            ? ' ' + package_detail.line_item.items.name
            : '';
          variantArr.push(variantHeader + variantDetail);
        });

        const product = {
          name: value?.name ? Helper.shortenName(Helper.removeDoubleSpace(value?.name)) : '',
          id: value?.id ?? '',
          price: value?.total_price ?? 0,
          brand: dataPurchase?.workshop?.name
            ? Helper.removeDoubleSpace(dataPurchase?.workshop?.name)
            : '',
          category: value?.category ? Helper.removeDoubleSpace(value?.category) : '',
          variant: Helper.removeDoubleSpace(variantArr.join(', ')),
          quantity: 1
        };

        products.push(product);
      });

    return products;
  }

  static getPromoImpressionsClickWorkshopBannerIndex(
    paramData,
    category,
    contentLocation,
    url,
    userCar,
    geoLocation
  ) {
    let promotions = [];

    paramData?.length &&
      paramData.forEach((item, index) => {
        let id = '';
        let creative = '';
        let name = '';

        if (category == 'Banner') {
          let nameArr = [];
          let nameStr = item?.name ? item.name.toLowerCase() : '';
          let nameSplit = nameStr.split(' ');

          nameSplit.forEach((convertName) => {
            nameArr.push(
              convertName ? convertName.charAt(0).toUpperCase() + convertName.slice(1) : ''
            );
          });

          id = item?.promo_code ? Helper.removeDoubleSpace(item?.promo_code) : '';
          name = nameArr.join(' ');
          if (item?.redirect_link) {
            creative = item.redirect_link;
          } else if (item?.slug) {
            creative = url.origin + `/promo/${item.promo_group_slug}/${item.slug}?origin=homepage`;
          } else {
            creative = url.origin + `/`;
          }
        } else if (category == 'Workshop') {
          id = item?.slug ?? '';
          name = item?.name ?? '';

          let query = `?origin=Bengkel+Rekomendasi`;
          query += userCar?.car_details?.id ? `&variant_car_id=${userCar.car_details.id}` : '';
          query +=
            geoLocation?.lat && geoLocation?.lng
              ? `&lat=${geoLocation.lat}&lng=${geoLocation.lng}`
              : '';
          creative = url.origin + `/bengkel/${item?.slug}` + query;
        }

        const position = item?.position ?? index + 1;
        const promotion = {
          id: id,
          name: Helper.removeDoubleSpace(name),
          creative: Helper.removeDoubleSpace(creative),
          position: position + ' - ' + Helper.removeDoubleSpace(contentLocation)
        };
        promotions.push(promotion);
      });

    return promotions;
  }

  static getPromoImpressionsClickServiceServisBengkel(
    paramData,
    contentLocation,
    url,
    serviceActive,
    userCar,
    promo,
    geoLocation
  ) {
    let promotions = [];
    let creative = '';

    paramData?.length &&
      paramData.forEach((item, index) => {
        let query = '';
        if (serviceActive) {
          query += `?origin=Explore&service_category=${serviceActive}`;
        }
        if (userCar?.carVariantId) {
          query +=
            query == ''
              ? `?variant_car_id=${userCar.carVariantId}`
              : `&variant_car_id=${userCar.carVariantId}`;
        }
        if (promo) {
          query += query == '' ? `?promo=${promo}` : `&promo=${promo}`;
        }
        if (geoLocation) {
          query +=
            query == ''
              ? `?lat=${geoLocation?.lat}&lng=${geoLocation?.lng}&address=${geoLocation?.address}`
              : `&lat=${geoLocation?.lat}&lng=${geoLocation?.lng}&address=${geoLocation?.address}`;
        }

        creative = url.origin + `/bengkel/${item?.slug}` + query;

        const position = item?.position ?? index + 1;
        const promotion = {
          id: item?.slug ? Helper.removeDoubleSpace(item?.slug) : '',
          name: item?.name ? Helper.removeDoubleSpace(item?.name) : '',
          creative: Helper.removeDoubleSpace(creative),
          position: position + ' - ' + Helper.removeDoubleSpace(contentLocation)
        };
        promotions.push(promotion);
      });

    return promotions;
  }

  static getProductImpressionsClickIndex(paramData, type, contentLocation) {
    let productsImpressionClick = [];

    paramData?.length &&
      paramData.forEach((item, index) => {
        const position = item?.position ?? index + 1;
        const productImpressionClick = {
          name: Helper.shortenName(Helper.removeDoubleSpace(item?.name)),
          id: item?.id ?? '',
          price: item?.price ?? 0,
          brand: item?.workshop?.name ? Helper.removeDoubleSpace(item?.workshop?.name) : '',
          category: item?.category?.name ? Helper.removeDoubleSpace(item?.category?.name) : '',
          variant: 'Not Available',
          position: position
        };
        if (type == 'impression') {
          productImpressionClick.list = Helper.removeDoubleSpace(contentLocation);
        }
        productsImpressionClick.push(productImpressionClick);
      });

    return productsImpressionClick;
  }

  static getProductImpressionsClickBengkel(
    paramData,
    type,
    serviceCategory,
    contentLocation,
    workshopDetail
  ) {
    let productsImpressionClick = [];
    let workshop = workshopDetail?.name ?? '';

    paramData?.length &&
      paramData.forEach((item, index) => {
        const position = item?.position ?? index + 1;
        const productImpressionClick = {
          name: Helper.shortenName(Helper.removeDoubleSpace(item?.name)),
          id: item?.id ?? '',
          price: item?.price ?? 0,
          brand: workshopDetail?.name ? Helper.removeDoubleSpace(workshopDetail?.name) : '',
          category: Helper.removeDoubleSpace(serviceCategory),
          variant: 'Not Available',
          position: position
        };
        if (type == 'impression') {
          productImpressionClick.list =
            Helper.removeDoubleSpace(contentLocation) + ' - ' + Helper.removeDoubleSpace(workshop);
        }
        productsImpressionClick.push(productImpressionClick);
      });

    return productsImpressionClick;
  }

  static getProductImpressionsClickPromo(paramData, type, promoName) {
    let productsImpressionClick = [];
    paramData?.length &&
      paramData.forEach((item, index) => {
        let price = 0;
        if (item?.discount_amount > 0) {
          price = item?.discounted_price ?? 0;
        } else {
          price = item?.package?.original_price ?? 0;
        }
        const position = item?.position ?? index + 1;
        const productImpressionClick = {
          name: Helper.shortenName(Helper.removeDoubleSpace(item?.package?.name)),
          id: item?.package?.id ?? '',
          price: price,
          brand: item?.workshop?.name ? Helper.removeDoubleSpace(item?.workshop?.name) : '',
          category: item?.package?.category?.name
            ? Helper.removeDoubleSpace(item?.package?.category?.name)
            : '',
          variant: 'Not Available',
          position: position
        };
        if (type == 'impression') {
          productImpressionClick.list = Helper.removeDoubleSpace(promoName);
        }
        productsImpressionClick.push(productImpressionClick);
      });

    return productsImpressionClick;
  }

  /* 
    end of param data function, call from event function to get data product, etc
  */
}
