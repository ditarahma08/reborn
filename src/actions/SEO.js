import { apiServer } from '@utils/API';

export const getSEOMeta = async (slug) => {
  try {
    const res = await apiServer.post('/graphql/metaSEO', { slug });
    return res?.data?.data?.seo;
  } catch (err) {
    throw Error('Failed to get SEO Meta');
  }
};
