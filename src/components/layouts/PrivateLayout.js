import 'moment/locale/id';

import Appbar from '@components/appbar/Appbar';
import StickyInfo from '@components/header/StickyInfo';
import { Badge, MobileWrapper, OtobuddyLiveChat } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import Helper from '@utils/Helper';
import LogRocket from 'logrocket';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { use100vh } from 'react-div-100vh';

const defaulTitle = 'Otoklix: Aplikasi Booking Bengkel & Servis Mobil';
const defaultDesc =
  'Booking servis mobil untuk servis berkala, ganti oli, ban, spooring balancing ✔2.000+ bengkel terdekat ✔harga transparan via aplikasi Otoklix.';
const defaultImage = '/assets/logo/icon-96-96.png';

export default function Layout({
  children,
  title = defaulTitle,
  description = defaultDesc,
  image = defaultImage,
  metaRobots = '',
  hasAppBar = true,
  pathName = null,
  handleUpdate,
  wrapperClassName,
  hasOtobuddy = false,
  hasHeader = false,
  isAuthenticated,
  goToNotification,
  notificationCount,
  otobuddyType = 'default',
  hasInfoSticky = false,
  closeStickyInfo,
  isOderOtobuddy,
  otobuddySource = ''
}) {
  const layoutHeight = use100vh();
  const router = useRouter();
  const pathname = pathName ? pathName : router.pathname;

  const [showOtobuddy, setShowOtobuddy] = useState(true);
  const [header, setHeader] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { user } = useAuth();

  if (user) {
    LogRocket.identify(user?.id ? user?.id : '000', {
      name: user?.name ? user?.name : 'Anonymous',
      email: user?.email ? user?.email : 'anonymous@email.com'
    });
  }

  const handleScrollStart = () => {
    setShowOtobuddy(false);
  };

  const handleScrollStop = () => {
    setShowOtobuddy(true);
  };

  const handleOnScroll = (e) => {
    if (e.target.scrollTop >= 25) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  const metaImage = image !== null ? image : defaultImage;
  const metaTitle = title !== null ? title : defaulTitle;
  const metaDesc = description !== null ? description : defaultDesc;

  useEffect(() => {
    const widgetScript = document.createElement('script');
    widgetScript.type = 'text/javascript';
    widgetScript.src = 'https://wchat.au.freshchat.com/js/widget.js';

    document.head.appendChild(widgetScript);
    widgetScript.onload = () => {
      setIsLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (user && hasOtobuddy && isLoaded) {
      window.fcWidget.setExternalId(user?.id?.toString());
      window.fcWidget.user.setProperties({
        firstName: user?.name.split(' ')[0] || '',
        lastName: user?.name.split(' ')[1] || '',
        email: user?.email || '',
        phone: user?.phone_number || '',
        phoneCountryCode: user ? '+62' : ''
      });
    }
  }, [user, isLoaded]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="theme-color" content="#002EB4" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link href="/assets/logo/icon-16-16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/assets/logo/icon-32-32.png" rel="icon" type="image/png" sizes="32x32" />

        <link rel="manifest" href="/manifest.json" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://otoklix.com" />
        <meta name="twitter:image" content={metaImage} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:creator" content="@otoklix" />

        <meta property="og:type" content="website" />
        <meta property="og:image" content={metaImage} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:site_name" content="Otoklix" />
        <meta property="og:url" content="https://otoklix.com" />

        <meta name="application-name" content="Otoklix" />
        <meta name="description" content={metaDesc} />

        <meta
          name="branch:deeplink:backgroundDownloadImage"
          content="url('/assets/images/uppersheet.png')"
        />

        {metaRobots && <meta name="robots" content={metaRobots} />}

        <link rel="canonical" href={`https://otoklix.com${router?.asPath?.split('?')[0]}`} />

        <title>{metaTitle}</title>
      </Head>

      <Scrollbars
        autoHide
        autoHeight
        className="scrollbar-layout"
        autoHeightMin={layoutHeight}
        universal={true}
        onScroll={handleOnScroll}
        onUpdate={handleUpdate}
        onScrollStart={handleScrollStart}
        onScrollStop={handleScrollStop}>
        <MobileWrapper
          size="xs"
          style={{ paddingTop: hasInfoSticky ? '66px' : '0' }}
          className={`shadow-lg ${wrapperClassName ? wrapperClassName : ''}`}>
          {hasHeader && (
            <div
              className={`header-menu d-flex flex-column justify-content-between align-items-center ${
                header ? 'shadow-sm' : ''
              }`}
              style={{ backgroundColor: header ? 'white' : 'transparent' }}>
              {hasInfoSticky && <StickyInfo closeStickyInfo={closeStickyInfo} />}

              <div className="header-top d-flex justify-content-between">
                <div>
                  <img
                    width="90"
                    src={`${
                      header ? '/assets/icons/logo-orange.svg' : '/assets/icons/logo-white.svg'
                    }`}
                    alt="otoklix"
                  />
                </div>

                {isAuthenticated && (
                  <div
                    id="button_notification"
                    data-automation="home_button_notification"
                    role="button"
                    onClick={() => goToNotification()}>
                    <img
                      src={`${
                        header
                          ? '/assets/icons/notification-orange.svg'
                          : '/assets/icons/notification.svg'
                      }`}
                      className="notification-icon"
                    />
                    {notificationCount > 0 && (
                      <Badge color="danger">{Helper.maxCount99(notificationCount)}</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {children}

          {hasAppBar && <Appbar path={pathname} />}

          {hasOtobuddy && !isOderOtobuddy && (
            <OtobuddyLiveChat
              otobuddyType={otobuddyType}
              isVisible={showOtobuddy}
              otobuddySource={otobuddySource}
            />
          )}
        </MobileWrapper>
      </Scrollbars>
    </>
  );
}
