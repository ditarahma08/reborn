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
import { api } from '@utils/API';
import Cookies from 'js-cookie';
import parsePhoneNumberFromString from 'libphonenumber-js/max';
import React, { useState } from 'react';

const NewPhoneNumber = ({ closeNewPhoneNumber, setEmail, openOtp, handleNewPhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonSubmitDisabled, setButtonSubmitDisable] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangePhoneNumber = (e) => {
    let newValue = e.target.value.replace(/[^0-9+]/g, '');
    newValue = newValue.replace(/(?!^\+)\+/g, '');
    setPhoneNumber(newValue);

    const num = parsePhoneNumberFromString(newValue, 'ID');
    if (!!num && num.isValid() && num.getType() == 'MOBILE') {
      setHasError(false);
      setButtonSubmitDisable(false);
    } else {
      setButtonSubmitDisable(true);
      setHasError(true);
      setErrorMessage('Nomor HP harus berbeda dengan yang sebelumnya.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonSubmitDisable(true);
    setIsLoading(true);

    const params = {
      recipient: phoneNumber
    };

    await api
      .post('v2/auth/send-otp/', params)
      .then((res) => {
        Cookies.remove('user_address', { path: '/' });
        setButtonSubmitDisable(false);
        setIsLoading(false);
        setEmail('');
        handleNewPhoneNumber(res.data.data.recipient);
        closeNewPhoneNumber();
        openOtp();
      })
      .catch((err) => {
        setButtonSubmitDisable(false);
        setIsLoading(false);
        setErrorMessage(err.response?.data.error.message);
        setHasError(true);
      });
  };

  return (
    <React.Fragment>
      <Header title="Buat Nomor HP Baru" onBackClick={closeNewPhoneNumber} />

      <Container className="wrapper-content">
        <FormGroup floating>
          <Input
            type="tel"
            name="phoneNumber"
            bsSize="sm"
            placeholder="Masukkan Nomor HP"
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
            invalid={hasError}
          />

          <Label className="text-placeholder">Masukan Nomor HP</Label>

          {hasError && (
            <FormText>
              <span className="text-danger mt-2">{errorMessage}</span>
            </FormText>
          )}
        </FormGroup>
      </Container>

      <AbsoluteWrapper bottom block>
        <Button
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
  );
};

export default NewPhoneNumber;
