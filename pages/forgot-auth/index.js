import NewPhoneNumber from '@components/auth/NewPhoneNumber';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  AbsoluteWrapper,
  Button,
  Container,
  FormGroup,
  FormText,
  Header,
  Input,
  Label
} from '@components/otoklix-elements';
import OtpVerification from '@components/otp/OtpVerification';
import { api } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Div100vh from 'react-div-100vh';
import validator from 'validator';

sentryBreadcrumb('pages/forgot-auth/index');

const ForgotAuth = () => {
  const router = useRouter();

  const [hasOtp, setHasOtp] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [hasNewPhoneNumber, setHasNewPhoneNumber] = useState(false);
  const [tokenNewNumber, setTokenNewNumber] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const handleChangeEmail = (e) => {
    let email = e.target.value;

    if (validator.isEmail(email)) {
      setButtonSubmitDisabled(false);
    } else {
      setButtonSubmitDisabled(true);
    }

    setEmail(email);
  };

  const handleChangeToken = (value) => {
    setTokenNewNumber(value);
  };

  const handleNewPhoneNumber = (value) => {
    setNewPhoneNumber(value);
  };

  const handleCloseOtp = () => {
    if (newPhoneNumber) {
      setNewPhoneNumber(newPhoneNumber);
      setHasNewPhoneNumber(true);
    }
    setHasOtp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonSubmitDisabled(false);
    setIsLoading(true);

    await api
      .post('v2/auth/send-otp/', { recipient: email })
      .then(() => {
        setButtonSubmitDisabled(false);
        setIsLoading(false);
        setHasOtp(true);
      })
      .catch((err) => {
        setButtonSubmitDisabled(false);
        setIsLoading(false);
        setHasError(true);
        setErrorMessage(err.response.data.error.message);
      });
  };

  return (
    <PrivateLayout hasAppBar={false}>
      <Div100vh>
        {hasOtp ? (
          <OtpVerification
            origin="forgot-auth"
            email={email}
            token={tokenNewNumber}
            phoneNumber={newPhoneNumber}
            closeOtp={handleCloseOtp}
            openNewPhoneNumber={() => setHasNewPhoneNumber(true)}
            handleChangeToken={handleChangeToken}
            fullPath={fullPath}
          />
        ) : hasNewPhoneNumber ? (
          <NewPhoneNumber
            closeNewPhoneNumber={() => setHasNewPhoneNumber(false)}
            openOtp={() => setHasOtp(true)}
            handleNewPhoneNumber={handleNewPhoneNumber}
            setEmail={setEmail}
          />
        ) : (
          <React.Fragment>
            <Header title="Lupa nomor HP?" onBackClick={() => router.back()} />

            <Container className="wrapper-content">
              <h6 className="fw-bold mb-3">Masukkan email yang terhubung dengan akun Kamu.</h6>

              <FormGroup floating>
                <Input
                  data-automation="forgot_auth_input_email"
                  name="email"
                  bsSize="sm"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={handleChangeEmail}
                  invalid={hasError}
                  type="email"
                />

                <Label className="text-placeholder">Masukkan Email</Label>

                {hasError && (
                  <FormText>
                    <p className="text-danger mt-2">{errorMessage}</p>
                    <p>
                      Silahkan klik
                      <Button className="px-1 py-0" color="link" size="sm">
                        di sini
                      </Button>
                      untuk menghubungi Help Center.
                    </p>
                  </FormText>
                )}
              </FormGroup>
            </Container>

            <AbsoluteWrapper bottom block>
              <Button
                data-automation="forgot_auth_button_send"
                className="p-3"
                block
                color="primary"
                type="submit"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={buttonSubmitDisabled}>
                Kirim
              </Button>
            </AbsoluteWrapper>
          </React.Fragment>
        )}
      </Div100vh>
    </PrivateLayout>
  );
};

export default ForgotAuth;
