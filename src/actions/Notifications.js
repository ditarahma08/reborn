import { api } from '@utils/API';

export const getAllNotification = (filter = 'all', page = 1, limit = 8) => {
  const response = new Promise((resolve, reject) => {
    api
      .get(`v2/notifications/?page=${page}&limit=${limit}&filter=${filter}`)
      .then((res) => {
        resolve(res?.data);
      })
      .catch((e) => {
        reject(e?.response?.data);
      });
  });

  return response;
};
