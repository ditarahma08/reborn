import { Appbar as BottomBar, AppbarItem } from '@components/otoklix-elements';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import assign from 'lodash/assign';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Appbar({ path }) {
  const router = useRouter();
  const getUserCar = Cookies.get('user_car', { path: '/' });

  const [userCar, setUserCar] = useState({});

  const hasActiveLink = (activeLink) => {
    return path === activeLink;
  };

  const goToPage = (url, label) => {
    gtag('click navbar icon', 'clickHomePage', label);
    GtmEvents.gtmNavigationMenuClick(new URL(window.location.href), label);
    amplitude.getInstance().logEvent('navigation menu selected', { menu_nav: label });
    let query = {};

    if (label === 'explore' && userCar?.car_details?.id) {
      assign(query, { variant_car_id: userCar?.car_details?.id });
    }

    router.push({ pathname: url, query: query });
  };

  const handleOpenChat = () => {
    amplitude.getInstance().logEvent('navigation menu selected', { menu_nav: 'help' });
    Helper.openOtobuddy();
  };

  useEffect(() => {
    if (getUserCar) {
      setUserCar(JSON.parse(getUserCar));
    }
  }, [getUserCar]);

  return (
    <BottomBar>
      <BottomBar tabs>
        <AppbarItem
          tag="a"
          href="/servis"
          title="Beranda"
          active={hasActiveLink('/servis')}
          onClick={() => goToPage('/servis', 'home')}
          image={
            hasActiveLink('/servis')
              ? '/assets/icons/home-new-active.svg'
              : '/assets/icons/home-new.svg'
          }
          data-automation="appbar_home_button"
        />

        <AppbarItem
          tag="a"
          href="/order"
          active={hasActiveLink('/order')}
          title="Order"
          onClick={() => goToPage('/order', 'order')}
          image={
            hasActiveLink('/order')
              ? '/assets/icons/buy-new-active.svg'
              : '/assets/icons/buy-new.svg'
          }
          data-automation="appbar_order_button"
        />

        <AppbarItem
          tag="a"
          href="#"
          title="Bantuan"
          active={hasActiveLink('/chat')}
          onClick={() => handleOpenChat()}
          image={
            hasActiveLink('/chat')
              ? '/assets/icons/chat-new-active.svg'
              : '/assets/icons/chat-new.svg'
          }
          data-automation="appbar_bantuan_button"
        />

        <AppbarItem
          tag="a"
          href="/account"
          active={hasActiveLink('/account')}
          title="Akun"
          image={
            hasActiveLink('/account')
              ? '/assets/icons/profile-new-active.svg'
              : '/assets/icons/profile-new.svg'
          }
          onClick={() => goToPage('/account', 'akun')}
          data-automation="appbar_akun_button"
        />
      </BottomBar>
    </BottomBar>
  );
}

export default Appbar;
