import {
  Button,
  Carousel,
  CarouselIndicators,
  CarouselItem,
  Container,
  Form,
  FormGroup,
  FormText,
  Icon
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';

const OtpVerification = dynamic(() => import('@components/otp/OtpVerification'));
const InputField = dynamic(() => import('@components/register/InputField'));
const RegisterForm = dynamic(() => import('@components/register/RegisterForm'));
const CustomModal = dynamic(() => import('@components/modal/CustomModal'));
const PrivateLayout = dynamic(() => import('@components/layouts/PrivateLayout'));

sentryBreadcrumb('pages/auth/index');

const slideItems = [
  {
    image: '/assets/images/voucher-xl.png',
    subtitle: 'Daftar akun di Otoklix! Banyak promo servis bergaransi untuk mobil kamu!'
  },
  {
    image: '/assets/images/receipt-wa.png',
    subtitle: 'Lengkapi nomor handphone untuk verifikasi. '
  },
  {
    image: '/assets/images/high-five.png',
    subtitle:
      'Share kode referral kamu dan dapatkan OtoPoints! Cek menu Akun setelah pendaftaran berhasil.'
  }
];

const Login = ({ onBackAction, showAsModal, onVerificationSubmit, routerOrigin, fromOrder }) => {
  const router = useRouter();
  const { ref } = router.query;

  const { authenticate, setToken, token } = useAuth();
  const [formState, setFormState] = useState('login');
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState();
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [showModalReferralWarning, setShowModalReferralWarning] = useState(false);
  const [tempData, setTempData] = useState();
  const [isSocialAccount, setIsSocialAccount] = useState();

  const disableSubmit = false;

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  /* Phone Number Validation */
  const handleChangePhoneNumber = async (e) => {
    let newValue = e.target.value.replace(/[^0-9+]/g, '');
    newValue = newValue.replace(/(?!^\+)\+/g, '');
    setPhoneNumber(newValue);

    setPhoneErrorMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSocialAccount(false);

    amplitude.getInstance().logEvent('auth submitted', { auth_method: 'phone_number' });

    if (fromOrder) {
      gtag('click kirim', 'viewLoginOrderPage');
    } else {
      gtag('click kirim nomor button', 'clickLoginPage');
    }

    setIsLoading(true);

    const payload = {
      phone_number: phoneNumber,
      referral_code: referralCode
    };

    try {
      const response = await api.post('v2/auth/verify-phone/', payload);
      processLoginFlow(response?.data?.data);
    } catch (err) {
      setPhoneErrorMessage(err.response.data.error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackLoginForm = () => {
    if (showAsModal) {
      onBackAction();
    } else {
      window.location = '/servis';
    }
  };

  const handleBackOtpForm = () => {
    if (formState == 'otp-register') {
      setFormState('register');
    } else {
      setFormState('login');
    }
  };

  const handleBackCompletionForm = () => {
    setFormState('login');
  };

  const handleSubmitCompletionForm = (userData) => {
    setUserData(userData);
    setPhoneNumber(userData?.phone_number);
    setFormState('otp-register');
  };

  const redirectToAccount = (jwt_token) => {
    setToken(jwt_token, 'token')
      .then((userToken) => {
        const log_reg = { type: formState, method: 'account' };
        Cookies.set('log_reg', log_reg, { path: '/' });

        authenticate(userToken);
        if (showAsModal) {
          onVerificationSubmit();
        } else {
          if (referralCode) {
            Cookies.set('invalid_referral', true);
          }

          window.location.href = '/account';
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const processLoginFlow = (data) => {
    if (data?.is_new_user) {
      // New User
      const payload = {
        referral_code: referralCode,
        ...data
      };
      setUserData(payload);
      setFormState('register');
    } else if (data?.jwt_token && data?.is_social_login) {
      // Registered User - Direct Login
      setToken(data?.refresh_token, 'refresh_token');
      redirectToAccount(data?.jwt_token);
    } else if (data?.referral_code) {
      // Registered User - Show Warning
      setTempData(data);
      setShowModalReferralWarning(true);
    } else {
      // Registered User - OTP Needed
      loginWithPhone(data);
    }
  };

  const loginWithPhone = async (data) => {
    await api.post('v2/auth/send-otp-number/', data).then(() => {
      setFormState('otp');
    });
  };

  const loginWithGoogle = async (tokenId) => {
    setIsSocialAccount(true);

    const payload = {
      access_token: tokenId,
      provider: 'google',
      referral_code: referralCode
    };

    try {
      const response = await api.post('v2/auth/login-by-social-media/', payload);
      processLoginFlow(response?.data?.data);
    } catch (error) {
      console.error('SSO Failed');
    }
  };

  const onGoogleSuccess = async (googleData) => {
    loginWithGoogle(googleData?.tokenId);
  };

  const onGoogleFailed = async (err) => {
    console.error(err);
  };

  const renderGoogleButton = ({ onClick, disabled }) => {
    const clickButton = () => {
      gtag('click lanjutkan google', 'clickLoginPage', 'login');
      amplitude.getInstance().logEvent('auth submitted', { auth_method: 'social_login_google' });
      onClick(); // process oauth from google
    };

    return (
      <div className="">
        <button
          data-automation="login_button_google"
          onClick={() => clickButton()}
          disabled={disabled}
          className="btn-google-sso w-100 p-3">
          <img
            src="/assets/icons/google-lg.svg"
            alt="google"
            width="25"
            height="24"
            loading="lazy"
          />
          <span className="ms-3 buttonText">Lanjutkan Dengan Google</span>
        </button>
      </div>
    );
  };

  const handlePhoneFlowWithoutReferral = () => {
    setShowModalReferralWarning(false);
    loginWithPhone(tempData);
  };

  // Carousel
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === slideItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? slideItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slideItemsElement = slideItems.map((item, index) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={index}>
        <img
          className="inner-logo"
          src={item?.image}
          width="150"
          height="150"
          alt="illustration"
          loading="lazy"
        />
        <div className="inner-text p-3">{item?.subtitle} </div>
      </CarouselItem>
    );
  });

  useEffect(() => {
    if (fromOrder) {
      gtag('view login page', 'viewLoginOrderPage');
    } else {
      gtag('view register login page', 'viewLoginPage');
    }

    if (!token) {
      amplitude.getInstance().logEvent('screen viewed', {
        screen_name: 'login',
        screen_category: 'authentication',
        page_location: fullPath
      });
    }
  }, []);

  useEffect(() => {
    if (router.query?.ref) {
      setReferralCode(router.query?.ref.toUpperCase());
    }
  }, [router.query.ref]);

  return (
    <PrivateLayout
      title="Login Aplikasi Booking Bengkel & Servis Mobil Otoklix"
      description="Login Aplikasi Booking Bengkel & Servis Mobil Otoklix untuk menemukan bengkel mobil terdekat dan terbaik dari lokasi kamu."
      metaRobots="index"
      hasAppBar={false}
      wrapperClassName="max-height-screen login-layout">
      <div className="wrapper-full">
        {formState == 'login' && (
          <>
            <div className="header-floating pt-3">
              <div className="d-flex align-items-center p-3 w-100">
                <h1 className="title auth w-100">Masuk / Daftar</h1>
                <div className="position-absolute">
                  <Icon
                    textRight
                    imageWidth={48}
                    imageHeight={48}
                    size="md"
                    className="pointer"
                    onClick={handleBackLoginForm}
                    iconClassName="rounded-circle box-shadow-floating-icon"
                    image={
                      ref
                        ? '/assets/icons/home-outline.svg'
                        : '/assets/icons/arrow-left-transparent.svg'
                    }
                  />
                </div>
              </div>
            </div>

            <Carousel
              className="login-carousel"
              ride="carousel"
              interval={3000}
              activeIndex={activeIndex}
              next={next}
              previous={previous}>
              <CarouselIndicators
                items={slideItems}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
              />
              {slideItemsElement}
            </Carousel>

            <Container className="wrapper-content">
              <Form onSubmit={(e) => e.preventDefault()}>
                <FormGroup floating>
                  <InputField
                    dataAutomation="login_input_phone_number"
                    inputLabel="Nomor HP"
                    inputName="phoneNumber"
                    inputType="tel"
                    inputPlaceholder="Cth: 081234567890"
                    inputValue={phoneNumber}
                    inputInvalid={phoneErrorMessage !== ''}
                    onChangeInput={handleChangePhoneNumber}
                  />

                  {phoneErrorMessage && (
                    <FormText tag="div" color="danger" className="mt-3">
                      {phoneErrorMessage}
                    </FormText>
                  )}

                  <Button
                    data-automation="login_link_forget_phone_number"
                    className="btn-ganti-nomor p-0"
                    size="sm"
                    color="link"
                    onClick={() => router.push('/forgot-auth')}>
                    Sudah daftar tapi lupa nomor HP?
                  </Button>
                </FormGroup>

                <Button
                  data-automation="login_button_submit"
                  block
                  className="mt-4"
                  size="lg"
                  color="primary"
                  type="submit"
                  onClick={onSubmit}
                  loading={isLoading}
                  disabled={disableSubmit}>
                  Kirim
                </Button>
              </Form>

              <div className="divider-label py-4">
                <span>Atau</span>
              </div>

              <GoogleLogin
                clientId={process.env.GOOGLE_AUTH_ID}
                onSuccess={onGoogleSuccess}
                onFailure={onGoogleFailed}
                render={renderGoogleButton}
                prompt={'select_account'}
                responseType={'id_token'}
              />
            </Container>
          </>
        )}

        {formState == 'register' && (
          <RegisterForm
            userData={userData}
            onClose={handleBackCompletionForm}
            onSent={handleSubmitCompletionForm}
          />
        )}

        {['otp', 'otp-register'].includes(formState) && (
          <OtpVerification
            phoneNumber={phoneNumber}
            closeOtp={handleBackOtpForm}
            queryOptions={routerOrigin}
            origin={showAsModal ? 'modal' : 'auth'}
            onVerificationSubmit={onVerificationSubmit}
            fromOrder={fromOrder}
            formState={formState}
            isSocialAccount={isSocialAccount}
            fullPath={fullPath}
            userData={userData}
          />
        )}

        <CustomModal
          show={showModalReferralWarning}
          title="Nomor Kamu Sudah Terdaftar"
          caption="Selamat datang kembali, akun dengan nomor yang kamu masukan telah terdaftar. Kode referral tidak dapat digunakan."
          submitButton="Lanjutkan Tanpa Kode Referral"
          cancelButton="Tutup"
          toggle={() => setShowModalReferralWarning(false)}
          onSubmit={handlePhoneFlowWithoutReferral}
          onCancel={() => setShowModalReferralWarning(false)}
        />
      </div>
    </PrivateLayout>
  );
};

export default Login;
