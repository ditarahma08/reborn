import CustomModal from '@components/modal/CustomModal';
import { Button, Card, Container, Form, FormText, Header } from '@components/otoklix-elements';
import { api } from '@utils/API';
import { gtag } from '@utils/Gtag';
import amplitude from 'amplitude-js';
import React, { useEffect, useState } from 'react';
import Toggle from 'react-toggle';

import InputField from './InputField';
import InputFieldClose from './InputFieldClose';

const RegisterForm = ({ userData, onClose, onSent }) => {
  const [user, setUser] = useState({
    username: null,
    phone_number: null,
    referral_code: null,
    email: null
  });

  const [invalidPhone, setInvalidPhone] = useState(false);
  const [errorPhone, setErrorPhone] = useState('');
  const [invalidReferralCode, setInvalidReferralCode] = useState(false);
  const [errorReferralCode, setErrorReferralCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [useReferralCode, setUseReferralCode] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [existingUserClass, setExistingUserClass] = useState('');

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const prefillForm = (data) => {
    setUser({ ...user, ...data });
    data?.referral_code && setUseReferralCode(true);
  };

  const clearReferralCode = () => {
    setUser({ ...user, referral_code: '' });
    clearInvalidReferralCode();
  };

  const clearInvalidPhone = () => {
    setInvalidPhone(false);
    setErrorPhone('');
  };

  const clearInvalidReferralCode = () => {
    setInvalidReferralCode(false);
    setErrorReferralCode('');
  };

  const setErrorPhoneMessage = (message) => {
    setInvalidPhone(true);
    setErrorPhone(message);
  };

  const toggleReferralCode = () => {
    if (useReferralCode) {
      clearReferralCode();
      setUseReferralCode(false);
    } else {
      setUseReferralCode(true);
    }
  };

  const onChangeInput = (event) => {
    setIsRegistered(false);
    const { value, name } = event.target;

    if (name === 'user_name') {
      let nameValue = value.replace(/[^a-zA-Z\d\s:]/, '');
      setUser({ ...user, username: nameValue });
    } else if (name === 'user_phone') {
      onChangePhoneNumber(value);
    } else if (name === 'user_email') {
      setUser({ ...user, email: value });
    } else {
      clearInvalidReferralCode();
      let referralCode = value ? value.toUpperCase() : value;
      setUser({ ...user, referral_code: referralCode });
    }
  };

  const onChangePhoneNumber = (value) => {
    let phoneValue = value.replace(/[^0-9+()]/g, '');
    phoneValue.replace(/(?!^\+)\+/g, '');
    setUser({ ...user, phone_number: phoneValue });

    if (phoneValue === '') {
      setExistingUserClass('');
      setErrorPhoneMessage('Nomor HP tidak boleh kosong');
    } else {
      validateNumber(phoneValue);
    }
  };

  const validateNumber = async (phoneNumber) => {
    clearInvalidPhone();

    const url = `v2/account/is-user-exist/`;
    const payload = {
      phone_number: phoneNumber
    };

    const response = await api.post(url, payload);
    const isNewUser = response?.data?.data?.is_new_user;

    if (!isNewUser && user?.email) {
      setErrorPhoneMessage(
        `Nomor telah terdaftar, email dengan nomor ini akan diperbarui menjadi ${user?.email}.`
      );
      setExistingUserClass('phone-number-exist');
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
      setExistingUserClass('');
    }
  };

  const registerUser = async () => {
    setIsLoading(true);
    setSubmitDisabled(true);

    if (user?.is_social_login) {
      gtag('click kirim', 'clickOtpPage', 'from gmail');
    } else {
      gtag('click kirim', 'clickOtpPage', 'from phone');
    }

    await api
      .post('v2/auth/send-otp-number/', { ...user })
      .then((response) => {
        const validation = response?.data?.data?.validation;
        const isReferralCodeValid = validation?.referral_code;

        setIsLoading(false);
        setSubmitDisabled(false);

        if (validation && !isReferralCodeValid) {
          setInvalidReferralCode(true);
          setErrorReferralCode(
            'Referral kamu tidak sesuai, coba cek kembali kode yang kamu masukkan ya'
          );
        } else {
          const isUseReferralCode = user?.referral_code ? 'yes' : 'no';
          amplitude
            .getInstance()
            .logEvent('register attempted', { use_referral: isUseReferralCode });

          onSent(user);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setSubmitDisabled(false);
      });
  };

  useEffect(() => {
    prefillForm(userData);
  }, [userData]);

  useEffect(() => {
    if (userData?.is_social_login) {
      gtag('view lengkapi data page', 'viewOtpPage', 'from gmail');
    } else {
      gtag('view lengkapi data page', 'viewOtpPage', 'from phone');
    }

    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'register',
      screen_category: 'authentication',
      page_location: fullPath
    });
  }, []);

  return (
    <React.Fragment>
      <Header onBackClick={() => setShowCloseModal(true)} />

      <Container className="wrapper-content">
        <h4>
          <b>Yuk, lengkapi data agar proses servis lebih gampang dan aman!</b>
        </h4>

        <div className="d-flex justify-content-center mt-5 mb-5">
          <img src="/assets/images/receipt-wa.png" alt="receipt" />
        </div>

        <Form onSubmit={(e) => e.preventDefault()}>
          <div>
            <InputField
              dataAutomation="auth_input_name"
              inputLabel="Nama"
              inputName="user_name"
              inputType="text"
              inputPlaceholder="Tulis Nama Kamu"
              inputValue={user?.username}
              inputInvalid={user?.username === ''}
              errorMessage="Nama tidak boleh kosong"
              onChangeInput={onChangeInput}
              isRequired
            />

            <div className={existingUserClass}>
              <InputField
                dataAutomation="auth_input_phone_number"
                inputLabel="Nomor HP"
                inputName="user_phone"
                inputType="tel"
                inputPlaceholder="Nomor HP Kamu"
                inputValue={user?.phone_number}
                inputInvalid={invalidPhone}
                inputDisabled={!user?.is_social_login}
                errorMessage={errorPhone}
                onChangeInput={onChangeInput}
                isRequired
              />
            </div>

            {user?.is_social_login && (
              <InputField
                dataAutomation="auth_input_email"
                inputLabel="Email"
                inputName="user_email"
                inputType="email"
                inputPlaceholder="Email Kamu"
                inputValue={user?.email}
                inputDisabled={true}
                onChangeInput={onChangeInput}
              />
            )}

            {!isRegistered && (
              <>
                <div className="d-flex align-items-center mb-3">
                  <Toggle
                    data-automation="auth_toggle_referral"
                    checked={useReferralCode}
                    className="toggle-primary"
                    icons={false}
                    onChange={toggleReferralCode}
                  />

                  <span className="ms-2">
                    <b>Gunakan Kode Referral</b>
                  </span>
                </div>

                {useReferralCode && (
                  <InputFieldClose
                    dataAutomation="auth_input_referral"
                    inputType="text"
                    inputName="referral_code"
                    inputPlaceholder="Masukkan Kode Referral"
                    inputDesc="Kosongkan jika tidak memiliki"
                    inputValue={user?.referral_code}
                    inputInvalid={invalidReferralCode}
                    errorMessage={errorReferralCode}
                    onChangeInput={onChangeInput}
                    onClose={clearReferralCode}
                  />
                )}
              </>
            )}

            {isRegistered && (
              <Card className="bg-white-md border-0 p-2 text-sm">
                <div className="d-flex">
                  <img
                    src="/assets/icons/info-circle-green.svg"
                    width={16}
                    alt="info-circle-green"
                  />
                  <span className="text-success ms-2">
                    <b>Info</b>
                  </span>
                </div>
                <span className="text-muted mt-1">
                  Tidak dapat menggunakan kode referral karena nomor kamu sudah terdaftar.
                </span>
              </Card>
            )}
          </div>

          <Button
            data-automation="auth_button_submit"
            className="p-3 mt-4"
            block
            color="primary"
            type="submit"
            loading={isLoading}
            disabled={
              !user?.phone_number ||
              !user?.username ||
              (errorPhone && !existingUserClass) ||
              submitDisabled
            }
            onClick={registerUser}>
            Kirim
          </Button>
        </Form>

        <div className="mt-3 mb-4">
          <FormText>
            Kami membutuhkan data kamu untuk mengirimkan kuitansi maupun informasi mengenai servis
            yang akan kamu pesan nantinya.
          </FormText>
        </div>
      </Container>

      <CustomModal
        show={showCloseModal}
        title="Yakin tidak ingin melanjutkan pendaftaran"
        caption="Jika kamu kembali ke halaman sebelumnya maka kamu harus mengisi kelengkapan profil kamu dari awal dan tidak dapat lagi menggunakan kode referral."
        submitButton="Lanjutkan Pendaftaran"
        cancelButton="Kembali ke Halaman Sebelumnya"
        toggle={() => setShowCloseModal(false)}
        onSubmit={() => setShowCloseModal(false)}
        onCancel={onClose}
        dataAutomationButtonCancel="auth_modal_button_cancel"
        dataAutomationButtonSubmit="auth_modal_button_submit"
      />
    </React.Fragment>
  );
};

export default RegisterForm;
