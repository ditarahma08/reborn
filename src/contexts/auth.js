import Auth from '@pages/auth/index';
import { api, authenticateAPI, unauthenticateAPI } from '@utils/API';
import GtmEvents from '@utils/GtmEvents';
import { isBrowser } from '@utils/isBrowser';
import MoEngage from '@utils/MoEngage';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { includes, some } from 'lodash';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userFetched, setUserFetched] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const profileUrl = 'v2/account/profile/';

  const setToken = (token, tokenName) => {
    let p = new Promise((resolve, reject) => {
      try {
        Cookies.set(tokenName, token, { expires: 90, path: '/', secure: true });
        resolve(token);
      } catch {
        reject(false);
      }
    });

    return p;
  };

  const onSuccessAuth = (userData) => {
    if (userData?.user_car === null || userData?.user_car === '') {
      userData.user_car = {};
    }

    Cookies.set('user_car', userData?.user_car, { path: '/' });
    setUser(userData);

    const getLogReg = Cookies.get('log_reg', { path: '/' });

    if (getLogReg) {
      Cookies.remove('log_reg');
      GtmEvents.gtmSuccessLoginRegister(userData, JSON.parse(getLogReg));
    }
  };

  const recallToken = async (refreshToken) => {
    try {
      const response = await api.post('v2/auth/refresh-token/', { refresh_token: refreshToken });
      setToken(response?.data?.data?.refresh_token, 'refresh_token');
      setToken(response?.data?.data?.jwt_token, 'token').then((userToken) => {
        authenticate(userToken);
        setTimeout(() => {
          location.reload();
        }, 1500);
      });
    } catch (error) {
      setTokenExpired(true);
      logout();
      setTimeout(() => {
        router.push('/auth');
      }, 1000);
    }
  };

  const setLoggedInMoEngage = (id) => {
    MoEngage.userLoggedIn(id);
  };

  const fetchUserSafari = async () => {
    const fetchUser = await api.get(profileUrl);
    setUserFetched(true);
    if (fetchUser.status === 200) {
      const userData = fetchUser.data.data;
      setLoggedInMoEngage(userData?.id);
      MoEngage.addUserAttributes(userData);
      onSuccessAuth(userData);
    } else {
      Cookies.remove('log_reg');
      logout();
    }
  };

  const authenticate = async (token) => {
    authenticateAPI(token);
    const refreshToken = Cookies.get('refresh_token', { path: '/' });
    try {
      const fetchUser = await api.get(profileUrl);
      setUserFetched(true);
      if (fetchUser.status === 200) {
        const userData = fetchUser?.data?.data;
        setLoggedInMoEngage(userData?.id);
        MoEngage.addUserAttributes(userData);
        onSuccessAuth(userData);
      } else {
        Cookies.remove('log_reg');
        logout();
      }
    } catch (error) {
      if (refreshToken && error?.response?.status === 401) {
        recallToken(refreshToken);
      } else if (navigator.userAgent.match(/safari/i)) {
        fetchUserSafari();
      } else {
        logout();
      }
    }
  };

  const logout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    Cookies.remove('user_car', { path: '/' });
    Cookies.remove('user_address', { path: '/' });
    amplitude.getInstance().setUserId(null);
    if (isBrowser()) {
      window.fcWidget.user.clear().then(
        function () {
          console.log('cleared');
          window.fcWidget.destroy();
        },
        function () {
          console.log('Not cleared');
        }
      );
    }
    unauthenticateAPI();
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setUserFetched(true);
      return;
    }

    authenticate(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setToken,
        authenticate,
        logout,
        userFetched,
        tokenExpired,
        isAuthenticated: !!user,
        token: Cookies.get('token')
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, userFetched, tokenExpired } = useAuth();

  const needAuthRouter = [
    '/garasi',
    '/undang-teman',
    '/order',
    '/mobilku',
    '/payment-method',
    '/notification'
  ];

  if (!isAuthenticated && some(needAuthRouter, (string) => includes(router.asPath, string))) {
    if (userFetched || tokenExpired) {
      return <Auth routerOrigin={router.asPath} />;
    }

    return null;
  } else {
    return children;
  }
};

export const useAuth = () => useContext(AuthContext);
