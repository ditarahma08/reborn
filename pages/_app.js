import '@styles/base.scss';
import '@utils/Sentry';

import { AuthProvider, ProtectRoute } from '@contexts/auth';
import * as Sentry from '@sentry/nextjs';
import Helper from '@utils/Helper';
import { isBrowser } from '@utils/isBrowser';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import get from 'lodash/get';
import LogRocket from 'logrocket';
import Router from 'next/router';
import NProgress from 'nprogress';
import React, { Component } from 'react';
import TagManager from 'react-gtm-module';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());

const tagManagerArgs = {
  gtmId: process.env.GTM_ID,
  auth: process.env.GTM_AUTH,
  preview: process.env.GTM_PREVIEW
};

LogRocket.init(process.env.LOGROCKET_KEY);

const getToken = Cookies.get('token', { path: '/' });

class App extends Component {
  componentDidMount() {
    TagManager.initialize(tagManagerArgs);

    amplitude.getInstance().init(process.env.AMPLITUDE_API_KEY, null, {
      includeReferrer: true,
      includeUtm: true,
      includeGclid: true,
      includeFbclid: true,
      logAttributionCapturedEvent: true,
      unsetParamsReferrerOnNewSession: true,
      saveParamsReferrerOncePerSession: true
    });

    if (!getToken) {
      amplitude.getInstance().setUserId(null);
    } else {
      const tokenDecoded = Helper.decodeJwt(getToken);
      amplitude.getInstance().setUserId(tokenDecoded?.user_id.toString());
    }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, router } = this.props;

    Sentry.configureScope((scope) => {
      scope.setContext('router', {
        route: router.route,
        pathname: router.pathname,
        query: router.query,
        asPath: router.asPath
      });
    });

    Sentry.addBreadcrumb({
      category: 'pages/_app',
      message: `Rendering app for Component "${get(Component, 'name', 'unknown')}" (${
        isBrowser() ? 'browser' : 'server'
      })`,
      level: Sentry.Severity.Debug
    });

    return (
      <AuthProvider>
        <ProtectRoute>
          <Component {...pageProps} />
        </ProtectRoute>
      </AuthProvider>
    );
  }
}

export default App;
