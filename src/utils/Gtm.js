import find from 'lodash/find';
import TagManager from 'react-gtm-module';

const gtagManager = (paramsDataLayer) => {
  TagManager.dataLayer({
    dataLayer: paramsDataLayer
  });
};

const gtagEventsEcommerce = (event, action, label, paramsData) => {
  const gtagEventsData = [
    {
      event: 'pdp_view',
      event_category: 'Ecommerce',
      event_action: 'Detail Pageview',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'add_to_cart',
      event_category: 'Ecommerce',
      event_action: 'Add to Cart',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'checkout',
      event_category: 'Ecommerce',
      event_action: 'Checkout Step 1',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'purchase',
      event_category: 'Ecommerce',
      event_action: 'Purchase',
      event_label: label,
      car_detail: paramsData?.car_detail ?? '',
      service_date_time: paramsData?.service_date_time ?? '',
      payment_method: paramsData?.payment_method ?? '',
      coupon_amount: paramsData?.coupon_amount ?? 0,
      oto_points: paramsData?.oto_points ?? 0,
      oto_points_used: paramsData?.oto_points_used ?? 0,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'promotion_view',
      event_category: 'Ecommerce',
      event_action: 'Promotion Impression',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'promotion_click',
      event_category: 'Ecommerce',
      event_action: 'Promotion Click',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'product_impression',
      event_category: 'Ecommerce',
      event_action: 'Product Impression',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    },
    {
      event: 'product_click',
      event_category: 'Ecommerce',
      event_action: 'Product Click',
      event_label: label,
      ecommerce: paramsData?.ecommerce ?? {}
    }
  ];

  return find(gtagEventsData, { event: event, event_action: action });
};

const gtagEventsGeneral = (action, label, name, category, paramsData) => {
  const gtagEventsData = [
    {
      event: 'generalEvent',
      event_category: 'Navigation Click',
      event_action: action,
      event_label: label,
      event_name: 'navigation_click'
    },
    {
      event: 'generalEvent',
      event_category: 'Detail View Intention',
      event_action: action,
      event_label: label,
      event_name: 'detail_view_intention'
    },
    {
      event: 'generalEvent',
      event_category: 'Login',
      event_action: action,
      event_label: label,
      event_name: 'login',
      user_id: paramsData?.user_id ?? ''
    },
    {
      event: 'generalEvent',
      event_category: 'Registration',
      event_action: action,
      event_label: label,
      event_name: 'registration',
      user_id: paramsData?.user_id ?? ''
    },
    {
      event: 'generalEvent',
      event_category: 'Service Menu Click',
      event_action: action,
      event_label: label,
      event_name: 'service_menu_click'
    },
    {
      event: 'generalEvent',
      event_category: 'Search Interaction',
      event_action: action,
      event_label: label,
      event_name: 'search_interaction'
    },
    {
      event: 'generalEvent',
      event_category: 'Explore',
      event_action: action,
      event_label: label,
      event_name: 'explore'
    },
    {
      event: 'generalEvent',
      event_category: 'Garasi Interaction',
      event_action: action,
      event_label: label,
      event_name: 'garasi_interaction'
    },
    {
      event: 'generalEvent',
      event_category: 'Repeat Booking',
      event_action: action,
      event_label: label,
      event_name: 'repeat_booking'
    }
  ];

  return find(gtagEventsData, { event_category: category, event_name: name });
};

export const gtm = (
  event = '',
  action = '',
  label = '',
  name = '',
  category = '',
  paramsData = {}
) => {
  if (event == 'reset_ecommerce') {
    gtagManager({ ecommerce: null });
  } else if (event == 'general_event') {
    gtagManager(gtagEventsGeneral(action, label, name, category, paramsData));
  } else {
    gtagManager(gtagEventsEcommerce(event, action, label, paramsData));
  }
};
