import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';
import get from 'lodash/get';

import { isBrowser } from './isBrowser';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV !== 'test',
  environment: process.env.APP_MODE,
  release: process.env.APP_VERSION_RELEASE,
  tracesSampleRate: 0.3,
  ignoreErrors: [
    'cancelled',
    'Failed to fetch',
    'privateSpecialRepair is not defined',
    'Request failed with status code 401',
    'Request aborted',
    'You have included the Google Maps JavaScript API multiple times on this page. This may cause unexpected errors.'
  ],
  integrations: [
    new Integrations.BrowserTracing(),
    new CaptureConsole({
      levels: ['error']
    })
  ]
});

if (!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-console
  console.error('Sentry DSN not defined');
}

Sentry.configureScope((scope) => {
  if (!isBrowser()) {
    scope.setTag('nodejs', process.version);
  }

  scope.setTag('runtimeEngine', isBrowser() ? 'browser' : 'server');
  scope.setTag('buildTime', process.env.BUILD_TIME);
});

export const configureReq = (req) => {
  Sentry.configureScope((scope) => {
    scope.setTag('host', get(req, 'headers.host'));
    scope.setTag('url', get(req, 'url'));
    scope.setTag('method', get(req, 'method'));
    scope.setContext('query', get(req, 'query'));
    scope.setContext('cookies', get(req, 'cookies'));
    scope.setContext('body', get(req, 'body'));
    scope.setContext('headers', get(req, 'headers'));
  });
};

export default Sentry;
