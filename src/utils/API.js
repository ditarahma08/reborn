import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { isBrowser } from './isBrowser';

const client = axios.create({
  baseURL: process.env.API_URL
});

const server = axios.create({
  baseURL: process.env.API_SERVER_URL
});

const clientQl = axios.create({
  baseURL: process.env.GRAPHQL_URL
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    Sentry.addBreadcrumb({
      category: 'api',
      message: `Call api (${isBrowser() ? 'browser' : 'server'})`,
      level: Sentry.Severity.Debug
    });

    Sentry.captureException(error);

    return Promise.reject(error);
  }
);

export const api = client;
export const graphql = clientQl;
export const apiServer = server;

let authInterceptorID;

export const authenticateAPI = (token) => {
  authInterceptorID = client.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${token}`;

    return config;
  });
};

export const unauthenticateAPI = () => {
  api.interceptors.request.eject(authInterceptorID);
};
