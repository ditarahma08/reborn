import { api } from '@utils/API';
import Cookies from 'js-cookie';

const getCarId = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));

export const getFilterOptions = (slug) => {
  const response = new Promise((resolve, reject) => {
    api
      .get(`v2/search/search-filter-options/?type=${slug}`)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((e) => {
        reject(e.response.data);
      });
  });

  return response;
};

export const fetchSearching = (mainPayload, extraPayload) => {
  const params = {
    page: mainPayload?.page || 1,
    filter_search: mainPayload?.section || 'all',
    q: mainPayload?.query,
    limit: mainPayload?.limit || 5,
    variant_car_id: mainPayload?.variant_car_id,
    latitude: mainPayload?.lat,
    longitude: mainPayload?.lng,
    ...extraPayload
  };

  const response = new Promise((resolve, reject) => {
    api
      .get('v2/search/new/', { params })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((e) => {
        reject(e.response.data);
      });
  });

  return response;
};

export const fetchNewSearching = (mainPayload, extraPayload) => {
  const params = {
    page: mainPayload?.page || 1,
    expected: mainPayload?.section || 'all',
    q: mainPayload?.query,
    limit: mainPayload?.limit || 5,
    variant_car_id: mainPayload?.variant_car_id,
    location: mainPayload?.lat + ',' + mainPayload?.lng,
    sorting: mainPayload?.sorting || getCarId ? '' : 'price-low',
    ...extraPayload
  };

  const response = new Promise((resolve, reject) => {
    api
      .get('v2/search/any/', { params })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((e) => {
        reject(e.response.data);
      });
  });

  return response;
};

export const fetchSearchWorkshopList = (mainPayload, extraPayload) => {
  const params = {
    page: mainPayload?.page || 1,
    limit: mainPayload?.limit || 5,
    location: mainPayload?.lat + ',' + mainPayload?.lng,
    variant_car_id: mainPayload?.variant_car_id,
    product_id: mainPayload?.product_id,
    is_pudo: mainPayload?.is_pudo || false,
    ...extraPayload
  };

  const response = new Promise((resolve, reject) => {
    api
      .get(`v2/workshops/product-related/${mainPayload?.product_id}`, { params })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((e) => {
        reject(e.response.data);
      });
  });

  return response;
};

export const fetchSearchRecommendation = (payload) => {
  const params = {
    latitude: payload?.lat ?? '',
    longitude: payload?.lng ?? '',
    variant_car_id: payload?.variant_car_id ?? ''
  };

  const response = new Promise((resolve, reject) => {
    api
      .get('v2/search/recommendation/', { params })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });

  return response;
};

export const fetchSearchKeyword = () => {
  const response = new Promise((resolve, reject) => {
    api
      .get('v2/account/histories/search-keyword')
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });

  return response;
};
