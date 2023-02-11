const withTM = require('next-transpile-modules')(['otoklix-elements']);
const withPWA = require('next-pwa');
const path = require('path');

const date = new Date();
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase) => {
  const isLocal = phase === PHASE_DEVELOPMENT_SERVER;
  const isDev = phase === PHASE_PRODUCTION_BUILD && process.env.APP_MODE === 'development';
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.APP_MODE === 'staging';
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.APP_MODE === 'production';

  let customerAppUrl = 'https://proxy-web.stg.otoklix.com/';
  let stagingApiUrl = 'https://api.stg.otoklix.com/';
  let stagingApiServerUrl = 'https://proxy-web.stg.otoklix.com/api';
  let stagingGraphqlUrl = 'https://wp-graphql.stg.otoklix.com/?graphql';

  if (isStaging) {
    if (process.env.PREVIEW_API_URL) {
      stagingApiUrl = process.env.PREVIEW_API_URL;
    }

    if (process.env.CUSTOMER_APP_URL) {
      customerAppUrl = process.env.CUSTOMER_APP_URL;
    }

    if (process.env.PREVIEW_GRAPHQL_URL) {
      stagingGraphqlUrl = process.env.PREVIEW_GRAPHQL_URL;
    }
  }

  console.log(`isLocal: ${isLocal} - isDev:${isDev} - isProd:${isProd} - isStaging:${isStaging}`);

  const env = {
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
    APP_VERSION: process.env.npm_package_version,
    API_URL: (() => {
      if (isLocal) return 'https://api.stg.otoklix.com/';
      if (isDev) return 'https://api.stg.otoklix.com/';
      if (isStaging) return stagingApiUrl;
      if (isProd) return 'https://api.otoklix.com/';
    })(),
    APP_MODE: (() => {
      if (isLocal) return 'local';
      if (isDev) return 'development';
      if (isStaging) return 'staging';
      if (isProd) return 'production';
    })(),
    API_SERVER_URL: (() => {
      if (isLocal) return 'http://localhost:3000/api';
      if (isDev) return 'https://proxy-web.stg.otoklix.com/api';
      if (isStaging) return stagingApiServerUrl;
      if (isProd) return 'https://otoklix.com/api';
    })(),
    GRAPHQL_URL: (() => {
      if (isLocal) return 'https://wp-graphql.stg.otoklix.com/?graphql';
      if (isDev) return 'https://wp-graphql.stg.otoklix.com/?graphql';
      if (isStaging) return stagingGraphqlUrl;
      if (isProd) return 'https://wp-graphql.otoklix.com/?graphql';
    })(),
    GMAP: (() => {
      if (isLocal) return 'AIzaSyCeRinKCSkyUB1WDoCDp7A2xzVgihUjnZc';
      if (isDev) return 'AIzaSyCeRinKCSkyUB1WDoCDp7A2xzVgihUjnZc';
      if (isStaging) return 'AIzaSyCeRinKCSkyUB1WDoCDp7A2xzVgihUjnZc';
      if (isProd) return 'AIzaSyC2pqT6mc7rU9DwBaNUIKnxLNucdahHzFU';
    })(),
    CS_NUMBER: (() => {
      if (isLocal) return '+62811920025';
      if (isDev) return '+62811920025';
      if (isStaging) return '+62811920025';
      if (isProd) return '+62811920025';
    })(),
    CS_EXPERT_NUMBER: (() => {
      if (isLocal) return '+62811920025';
      if (isDev) return '+62811920025';
      if (isStaging) return '+62811920025';
      if (isProd) return '+62811920025';
    })(),
    GA_ID: (() => {
      if (isLocal) return 'UA-156351726-3';
      if (isDev) return 'UA-156351726-3';
      if (isStaging) return 'UA-156351726-4';
      if (isProd) return 'UA-156351726-1';
    })(),
    GOOGLE_AUTH_ID: (() => {
      if (isLocal)
        return '849078079855-hs7q9v4tmqbvqjhn6jqsvobnpqmjpkmt.apps.googleusercontent.com';
      if (isDev) return '13059064270-8k5dirah77dghkc4ul2dmq57b1dcblm8.apps.googleusercontent.com';
      if (isStaging)
        return '13059064270-8k5dirah77dghkc4ul2dmq57b1dcblm8.apps.googleusercontent.com';
      if (isProd) return '780974206085-gssdnl876e7sd17o16c4q36d16p4f8k7.apps.googleusercontent.com';
    })(),
    GTM_ID: (() => {
      if (isLocal) return 'GTM-M5GNBJC';
      if (isDev) return 'GTM-KTRQM2Z';
      if (isStaging) return 'GTM-KTRQM2Z';
      if (isProd) return 'GTM-KTRQM2Z';
    })(),
    GTM_AUTH: (() => {
      if (isLocal) return 'Z0SN9yW1cn8eH0AyRhWNIw';
      if (isDev) return 'Z0SN9yW1cn8eH0AyRhWNIw';
      if (isStaging) return 'Z0SN9yW1cn8eH0AyRhWNIw';
      if (isProd) return '9y6dYFHtYHFNLcuWPrN2xA';
    })(),
    GTM_PREVIEW: (() => {
      if (isLocal) return 'env-64';
      if (isDev) return 'env-64';
      if (isStaging) return 'env-64';
      if (isProd) return 'env-1';
    })(),
    BLOG_URL: (() => {
      if (isLocal) return 'https://blog.otoklix.com/';
      if (isDev) return 'https://blog.otoklix.com/';
      if (isStaging) return 'https://blog.otoklix.com/';
      if (isProd) return 'https://blog.otoklix.com/';
    })(),
    FB_PIXEL: (() => {
      if (isLocal) return '1274843263308993';
      if (isDev) return '1274843263308993';
      if (isStaging) return '1274843263308993';
      if (isProd) return '302452111058145';
    })(),
    SENTRY_DSN: (() => {
      if (isLocal)
        return 'https://c29b8042927e4e37b724f27539bd22bf@o953999.ingest.sentry.io/5902974';
      if (isDev) return 'https://c29b8042927e4e37b724f27539bd22bf@o953999.ingest.sentry.io/5902974';
      if (isStaging)
        return 'https://c29b8042927e4e37b724f27539bd22bf@o953999.ingest.sentry.io/5902974';
      if (isProd)
        return 'https://c29b8042927e4e37b724f27539bd22bf@o953999.ingest.sentry.io/5902974';
    })(),
    APP_URL: (() => {
      if (isLocal) return 'https://proxy-web.stg.otoklix.com/';
      if (isDev) return 'https://proxy-web.stg.otoklix.com/';
      if (isStaging) return customerAppUrl;
      if (isProd) return 'https://otoklix.com/';
    })(),
    AMPLITUDE_API_KEY: (() => {
      if (isLocal) return '9f022c978439fbfa309a49f47520c9c5';
      if (isDev) return '9f022c978439fbfa309a49f47520c9c5';
      if (isStaging) return '9f022c978439fbfa309a49f47520c9c5';
      if (isProd) return '8b8286c7288eb786127d58e3cbc6c078';
    })(),
    BRANCH_SDK: (() => {
      if (isLocal) return 'key_test_je986oh2lsX6b243YG3BeckbDvp9jKMh';
      if (isDev) return 'key_test_je986oh2lsX6b243YG3BeckbDvp9jKMh';
      if (isStaging) return 'key_test_je986oh2lsX6b243YG3BeckbDvp9jKMh';
      if (isProd) return 'key_live_bi7Z5kp1br2Zd9002KWAcbjkCsc5aSy6';
    })(),
    LOGROCKET_KEY: (() => {
      if (isLocal) return 'vxwqqy/otoklix-stg';
      if (isDev) return 'vxwqqy/otoklix-stg';
      if (isStaging) return 'vxwqqy/otoklix-stg';
      if (isProd) return 'vxwqqy/otoklix-stg';
    })(),
    MOENGAGE_DEBUG_LOGS: (() => {
      if (isLocal) return '1';
      if (isDev) return '1';
      if (isStaging) return '1';
      if (isProd) return '1';
    })(),
    BRANCH_LINK: (() => {
      if (isLocal) return 'https://otoklix.test-app.link/';
      if (isDev) return 'https://otoklix.test-app.link/';
      if (isStaging) return 'https://otoklix.test-app.link/';
      if (isProd) return 'https://otoklix.app.link/';
    })(),
    FRESHCHAT_TOKEN: 'db74ed7d-2bd5-4e4e-bcd9-2de231503e75',
    FRESHCHAT_HOST: 'https://wchat.au.freshchat.com',
    HOTJAR_ID: '3249848',
    HOTJAR_SV: '6',
    GOOGLE_OPT: 'OPT-TJGWK2S',
    MOENGAGE_APP_ID: 'AM3FLHCCNTKQXXEYWW2RRHIA'
  };

  return withTM(
    withPWA({
      env,
      pwa: {
        disable: true,
        register: false,
        dest: 'public'
      },
      webpack: (config, { isServer, buildId }) => {
        const APP_VERSION_RELEASE = `${env.APP_VERSION}_${buildId}`;

        if (isServer) {
          config.plugins[1].definitions['process.env.APP_RELEASE'] = JSON.stringify(buildId);
          config.plugins[1].definitions['process.env.APP_VERSION_RELEASE'] = JSON.stringify(
            APP_VERSION_RELEASE
          );
          console.debug(`[webpack] Building release "${APP_VERSION_RELEASE}"`);
        }

        // Fixes npm packages that depend on `fs` module
        config.node = {
          fs: 'empty'
        };

        if (!isServer) {
          if (config.plugins[1]?.definitions) {
            config.plugins[1].definitions['process.env.APP_RELEASE'] = JSON.stringify(buildId);
            config.plugins[1].definitions['process.env.APP_VERSION_RELEASE'] = JSON.stringify(
              APP_VERSION_RELEASE
            );
          }

          if (config.plugins[2]?.definitions) {
            config.plugins[2].definitions['process.env.APP_RELEASE'] = JSON.stringify(buildId);
            config.plugins[2].definitions['process.env.APP_VERSION_RELEASE'] = JSON.stringify(
              APP_VERSION_RELEASE
            );
          }
        }

        config.resolve.modules.push('./pages');

        return config;
      },
      async headers() {
        return [
          {
            source: '/apple-app-site-association',
            headers: [
              {
                key: 'Content-Type',
                value: 'application/json'
              }
            ]
          },
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN'
              }
            ]
          }
        ];
      },
      reactStrictMode: true,
      productionBrowserSourceMaps: false,
      poweredByHeader: false,
      sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
      }
    })
  );
};
