import { api } from '@utils/API';

const PAGINATION_LIMIT = 4;

export const getWorkshopList = async (payload, extraPayload) => {
  try {
    const params = {
      page: payload?.page || 1,
      variant_car_id: payload?.variant_car_id,
      service_category: payload?.service_category || `oli`,
      promo_code: payload?.promo,
      latitude: payload?.lat,
      longitude: payload?.lng,
      q: payload?.keywords,
      limit: PAGINATION_LIMIT,
      ...extraPayload
    };

    const res = await api.get('v2/search/workshops', { params });
    return res.data;
  } catch (error) {
    throw Error('Failed to Get Workshops List');
  }
};

export const getWorkshopNewList = async (payload, extraPayload) => {
  try {
    const params = {
      page: payload?.page || 1,
      variant_car_id: payload?.variant_car_id,
      service_category: payload?.service_category || `oli`,
      promo_code: payload?.promo,
      latitude: payload?.lat,
      longitude: payload?.lng,
      show_popularity: payload?.show_popularity,
      q: payload?.keywords,
      limit: payload?.limit || PAGINATION_LIMIT,
      sorting: 'all',
      workshop_tier: 'all',
      ...extraPayload
    };

    const res = await api.get('v2/search/workshops-new', { params });
    return res.data;
  } catch (error) {
    throw Error('Failed to Get Workshops List');
  }
};

export const getVehicleOptions = async (query, slice) => {
  try {
    let url = `/v2/md/search-car/?q=${query}`;
    const response = await api.get(url);
    return [
      response.data.data
        .map((item) => ({
          value: item.id.toString(),
          name: item.car_model.model_name,
          car_details: item
        }))
        .slice(0, `${slice || 5}`),
      null
    ];
  } catch (e) {
    return [[], 'error'];
  }
};

export const getWorkshopPackageList = async (slug, payload) => {
  const params = {
    service_category: payload?.service_category,
    variant_car_id: payload?.variant_car_id,
    page: payload?.page || 1,
    promo_code: payload?.promo || ''
  };

  const res = await api.get(`v2/workshops/${slug}/packages/`, { params });
  return res.data.data;
};

export const getWorkshopServiceList = async (slug, payload, extra) => {
  const params = {
    service_category: payload?.service_category,
    variant_car_id: payload?.variant_car_id,
    page: payload?.page || 1,
    promo_code: payload?.promo || '',
    limit: payload?.limit || 20,
    sorting: payload?.sorting || '',
    filter: 1,
    q: payload?.keyword || '',
    ...extra
  };

  const res = await api.get(`v2/workshops/${slug}/inventory/products`, { params });
  return res.data;
};

export const getPackageDetails = (slug, payload) => {
  const params = {
    service_category: payload?.service_category || `oli`,
    package_id: payload?.package_id,
    variant_car_id: payload?.variant_car_id
  };

  const response = new Promise((resolve, reject) => {
    api
      .get(`v2/workshops/${slug}/package_details`, { params })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((e) => {
        reject(e.response.data);
      });
  });

  return response;
};

export const getFaqList = async (category) => {
  const params = {
    faq_type: category
  };

  const res = await api.get(`v2/faq/`, { params });
  return res.data.data;
};
