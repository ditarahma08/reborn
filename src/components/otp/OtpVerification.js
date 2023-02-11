import { Button, Container, Form, FormText, Header } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { gtag } from '@utils/Gtag';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import OtpInput from 'react-otp-input';

import OtpTimer from './OtpTimer';

function OtpVerification({
  phoneNumber,
  email,
  token,
  origin = 'auth',
  handleChangeToken,
  closeOtp,
  openNewPhoneNumber,
  queryOptions,
  onVerificationSubmit,
  fromOrder,
  formState,
  isSocialAccount,
  fullPath,
  userData
}) {
  const router = useRouter();
  const { authenticate, setToken } = useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [hasLoading, setHasLoading] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [hasError, setHasError] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [authAttempt, setAuthAttempt] = useState(1);

  const handleChange = (otp) => {
    setHasError(false);
    setErrorMessage('');
    setOtpCode(otp);
  };

  const resendOtp = async () => {
    amplitude.getInstance().logEvent('click resend otp', { auth_attempt: authAttempt });
    setAuthAttempt(authAttempt + 1);
    setHasError(false);
    setErrorMessage('');
    setOtpTimer(60);

    let params = {};
    if (formState === 'otp-register') {
      params = { ...userData };
    } else {
      params = {
        phone_number: phoneNumber
      };
    }

    await api
      .post('v2/auth/send-otp-number/', params)
      .then()
      .catch(() => {
        setHasError(true);
        setErrorMessage('Request melampaui batas maksimal OTP');
      });
  };

  const redirectToLogin = (jwt_token, receivedPoint = null) => {
    setToken(jwt_token, 'token')
      .then((userToken) => {
        authenticate(userToken);

        if (queryOptions) {
          window.location.href = queryOptions;
        } else if (router.pathname === '/auth') {
          receivedPoint && Cookies.set('otopoints_collected', receivedPoint);
          window.location.href = '/servis';
        } else if (router.pathname === '/forgot-auth') {
          window.location.href = '/servis';
        } else {
          closeOtp();
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const throwErrorAuthentication = () => {
    setHasError(true);
    otpTimer > 0
      ? setErrorMessage('OTP salah, periksa kembali kode OTP yang terkirim ke nomor kamu ya.')
      : setErrorMessage(
          'OTP kamu sudah kadaluarsa nih. Minta kode OTP yang baru dengan klik tombol di bawah.'
        );
    setHasLoading(false);
    setDisableSubmitButton(false);
  };

  const onValidateLogin = (data, logReg) => {
    gtag('click lanjutkan', 'clickOtpPage', 'login');
    Cookies.set('log_reg', logReg, { path: '/' });

    const referral = data?.referral;
    const receivedPoint = referral?.is_success ? referral?.otopoints : null;

    setToken(data?.refresh_token, 'refresh_token');
    redirectToLogin(data?.jwt_token, receivedPoint);
  };

  const onValidateForgetAuth = (data) => {
    if (email) {
      handleChangeToken(data?.token);
      openNewPhoneNumber();
      closeOtp();
    } else {
      setToken(data?.refresh_token, 'refresh_token');
      redirectToLogin(data?.jwt_token);
    }
  };

  const onValidateEditProfile = () => {
    const token = Cookies.get('token');
    authenticate(token);
    closeOtp();
  };

  const onValidatePopupLogin = (data, logReg) => {
    Cookies.set('log_reg', logReg, { path: '/' });
    setToken(data?.refresh_token, 'refresh_token');
    setToken(data?.jwt_token, 'token').then((userToken) => {
      authenticate(userToken);
      onVerificationSubmit();
    });
  };

  const decodeJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  };

  const trackFBPixelOnAuth = (isAuth) => {
    window.fbq('track', 'CompleteRegistration', { status: isAuth ? 1 : 0 });
  };

  const processAuthentication = async (url, params, logReg) => {
    await api
      .post(`v2/auth/${url}`, params)
      .then((res) => {
        if (res?.data?.data?.jwt_token) {
          const tokenDecoded = decodeJwt(res?.data?.data?.jwt_token);
          amplitude.getInstance().setUserId(tokenDecoded?.user_id.toString());
        }

        if (!res?.data?.data?.is_new_user) {
          Cookies.set('auth', 'login');
        } else {
          Cookies.set('auth', 'register');
        }

        setDisableSubmitButton(false);
        setHasLoading(false);

        trackFBPixelOnAuth(formState === 'otp-register' ? true : false);

        if (origin === 'auth') {
          amplitude
            .getInstance()
            .logEvent('otp submitted', { auth_attempt: authAttempt, auth_status: 'success' });
          onValidateLogin(res?.data?.data, logReg);
        }

        if (origin === 'forgot-auth') {
          onValidateForgetAuth(res?.data?.data);
        }

        if (origin === 'edit-profile') {
          onValidateEditProfile();
        }

        if (origin === 'modal') {
          amplitude.getInstance().logEvent('otp submitted', {
            auth_attempt: authAttempt,
            auth_status: 'success',
            page_location: fullPath
          });
          onValidatePopupLogin(res?.data?.data, logReg);
        }
      })
      .catch((err) => {
        console.log(err);
        amplitude
          .getInstance()
          .logEvent('otp submitted', { auth_attempt: authAttempt, auth_status: 'failed' });
        throwErrorAuthentication();
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fromOrder) {
      gtag('click submit otp', 'clickOtpOrderPage');
    }

    setDisableSubmitButton(true);
    setHasLoading(true);

    let params = { otp_code: otpCode, recipient: email || phoneNumber };
    let log_reg = { type: formState, method: isSocialAccount ? 'account' : 'phone' };
    let url = 'validate-otp/';

    if (origin === 'auth' || origin === 'modal') {
      url = 'smart-authentication/';
      params.phone_number = phoneNumber;
      params?.recipient && delete params?.recipient;
    }

    if (origin === 'forgot-auth') {
      params.token = token;
      params?.phone_number && delete params?.phone_number;
    }

    processAuthentication(url, params, log_reg);
  };

  let msgFromSource;
  if (origin === 'auth') {
    msgFromSource = 'nomor';
  } else if (origin === 'edit-profile' && phoneNumber) {
    msgFromSource = 'nomor';
  } else if (origin === 'modal' && phoneNumber) {
    msgFromSource = 'nomor';
  } else if (origin === 'forgot-auth' && phoneNumber) {
    msgFromSource = 'nomor';
  } else {
    msgFromSource = 'email';
  }

  const getMaskedString = (text) => {
    if (text == null || typeof text === 'undefined') return '-';
    const splittedText = text.split('@');
    const isEmail = splittedText.length > 1;
    const value = splittedText[0];
    const emailHost = splittedText[1];
    if (isEmail) {
      if (value.length > 6) {
        return `${value.substring(0, 3)}${Array(value.length - 6)
          .fill('*')
          .join('')}${value.substring(value.length - 3, value.length)}@${emailHost}`;
      } else if (value.length > 1) {
        return `${value.substring(0, 1)}${Array(value.length - 1)
          .fill('*')
          .join('')}@${emailHost}`;
      } else {
        return `${value.substring(0, 1)}@${emailHost}`;
      }
    } else {
      return `${value.substring(0, 4)}******${value.substring(value.length - 3, value.length)}`;
    }
  };

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'filling otp',
      screen_category: 'authentication',
      page_location: fullPath
    });

    if (fromOrder) {
      gtag('view otp page', 'viewOtpOrderPage');
    } else {
      gtag('view otp page', 'viewOtpPage');
    }
  }, []);

  return (
    <Div100vh>
      <Header
        title="OTP"
        onBackClick={closeOtp}
        className="shadow-sm"
        dataAutomationButton="otp_button_back"
      />
      <Form onSubmit={(e) => e.preventDefault()}>
        <Container className="wrapper-content">
          <h6 className="fw-semi-bold lh-base me-3">
            {msgFromSource == 'nomor' && (
              <>
                {`Masukkan kode OTP yang dikirim via WA/SMS ke `}
                <span className="text-secondary fw-bold">{getMaskedString(phoneNumber)}</span>
              </>
            )}
            {msgFromSource == 'email' && (
              <>
                {`Masukkan 6 digit Kode OTP yang terkirim ke `}
                <span className="text-secondary fw-bold">{getMaskedString(email)}</span>
              </>
            )}
          </h6>

          <div
            onClick={() => fromOrder && gtag('click otp field', 'clickOtpOrderPage')}
            data-automation="otp_input_code">
            <OtpInput
              isInputNum={true}
              value={otpCode}
              onChange={handleChange}
              numInputs={6}
              containerStyle="justify-content-center mt-5"
              inputStyle="form-control form-control-sm mx-1 p-0 w-100 form-control-otp border-7"
            />
          </div>

          {hasError && otpTimer === 0 && (
            <FormText className="d-flex text-center justify-content-center mt-4">
              <span className="text-danger">{errorMessage}</span>
            </FormText>
          )}

          <OtpTimer otpTimer={otpTimer} setOtpTimer={setOtpTimer} resend={resendOtp} />

          {hasError && otpTimer > 0 && (
            <FormText className="d-flex text-center justify-content-center">
              <span className="text-danger">{errorMessage}</span>
            </FormText>
          )}
        </Container>
        <div className="otp-button-submit">
          <Button
            data-automation="otp_button_submit"
            className="p-3"
            block
            color={otpCode?.length < 6 ? 'light' : 'primary'}
            type="submit"
            onClick={handleSubmit}
            loading={hasLoading}
            disabled={disableSubmitButton || otpCode?.length < 6}>
            Kirim
          </Button>
        </div>
      </Form>
    </Div100vh>
  );
}

export default OtpVerification;
