import PrivateLayout from '@components/layouts/PrivateLayout';
import CustomModal from '@components/modal/CustomModal';
import {
  Button,
  Container,
  FormGroup,
  FormText,
  Header,
  Input,
  Label
} from '@components/otoklix-elements';
import OtpVerification from '@components/otp/OtpVerification';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useRef, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { BottomSheet } from 'react-spring-bottom-sheet';

const EditAccount = ({ onBackClick, user, onEditSuccess }) => {
  const { authenticate, token } = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [inputInvalid, setInputInvalid] = useState(false);
  const [inputPlaceHolder, setInputPlaceholder] = useState('');
  const [hasEditInput, setHasEditInput] = useState(false);
  const [hasOtp, setHasOtp] = useState(false);
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [showModalUploadWarning, setShowModalUploadWarning] = useState(false);
  const [showModalUploadError, setShowModalUploadError] = useState(false);
  const [errorModalUpload, setErrorModalUpload] = useState('');

  const hiddenFileInput = useRef();

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onChangeInput = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.length == 0) {
      setInputInvalid(true);
      return;
    }

    if (inputPlaceHolder === 'Nama Lengkap') {
      setInputInvalid(false);
    } else if (inputPlaceHolder === 'Email') {
      if (validateEmail(e.target.value)) {
        setInputInvalid(false);
      } else {
        setInputInvalid(true);
      }
    } else if (inputPlaceHolder === 'Nomor HP') {
      let newValue = e.target.value.replace(/[^0-9+]/g, '');
      newValue = newValue.replace(/(?!^\+)\+/g, '');
      setInputValue(newValue);

      const num = parsePhoneNumberFromString(newValue, 'ID');
      if (!!num && num.isValid() && num.getType() == 'MOBILE') {
        setInputInvalid(false);
      } else {
        setInputInvalid(true);
      }
    }
  };

  const onOpenInput = (value, inputType) => {
    setInputPlaceholder(inputType);
    setInputValue(value ? value : '');
    setHasEditInput(true);
  };

  const onCancel = () => {
    setHasEditInput(false);
    setHasError(false);
    setErrorMessage('');
    setInputPlaceholder('');
    setInputValue('');
    setInputInvalid(false);
  };

  const handleSheetDismiss = () => {
    onCancel();
  };

  const submitChangeName = async () => {
    authenticate(token);
    const formData = new FormData();

    formData.append('name', inputValue);

    await api
      .put('v2/account/profile/', formData)
      .then((response) => {
        onEditSuccess(response?.data?.data);
        setHasEditInput(false);
      })
      .catch((err) => {
        setHasError(true);
        setErrorMessage(err?.response?.data?.error?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitChangeContact = async () => {
    authenticate(token);
    await api
      .post('v2/auth/send-otp/', { recipient: inputValue })
      .then(() => {
        setButtonSubmitDisabled(false);
        setIsLoading(false);
        setHasOtp(true);
        setHasEditInput(false);
      })
      .catch((err) => {
        setButtonSubmitDisabled(false);
        setIsLoading(false);
        setHasError(true);
        setErrorMessage(err?.response?.data?.error?.message);
      });
  };

  const onSubmit = () => {
    setIsLoading(true);

    if (inputPlaceHolder === 'Nama Lengkap') {
      submitChangeName();
    }

    if (inputPlaceHolder === 'Email' || inputPlaceHolder === 'Nomor HP') {
      submitChangeContact();
    }
  };

  const onSubmitImage = async (uploadFile) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('profile_picture', uploadFile);

    await api
      .put('v2/account/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        onEditSuccess(response?.data?.data);
      })
      .catch((err) => {
        setErrorModalUpload(err.response?.data?.error?.message);
        setShowModalUploadError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let inputType;
  if (inputPlaceHolder === 'Nama Lengkap') {
    inputType = 'text';
  } else if (inputPlaceHolder === 'Email') {
    inputType = 'email';
  } else if (inputPlaceHolder === 'Nomor HP') {
    inputType = 'tel';
  }

  const openUploadWindow = () => {
    setShowModalUploadWarning(false);
    setShowModalUploadError(false);
    hiddenFileInput.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 2 * 1024 * 1024) {
        setShowModalUploadWarning(true);
        hiddenFileInput.current.value = '';
      } else {
        onSubmitImage(e.target.files[0]);
      }
    }
  };

  return (
    <PrivateLayout hasAppBar={false}>
      <Div100vh>
        {hasOtp ? (
          <OtpVerification
            origin="edit-profile"
            email={inputPlaceHolder === 'Email' && inputValue}
            phoneNumber={inputPlaceHolder === 'Nomor HP' && inputValue}
            closeOtp={() => setHasOtp(false)}
          />
        ) : (
          <>
            <Header title="Edit Profil" onBackClick={onBackClick} />

            <Container className="wrapper-content edit-profile">
              <div
                className="position-relative m-auto profile-image-wrapper"
                onClick={openUploadWindow}>
                <img
                  className="rounded-circle d-block profile-image"
                  src={
                    user?.profile_picture
                      ? user.profile_picture
                      : '/assets/images/default-profile-picture.png'
                  }
                  alt="prof pict"
                  loading="lazy"
                  width="116"
                  height="116"
                />

                <img
                  className="badge-icon"
                  src="/assets/icons/camera-blue-circle.svg"
                  width="32"
                  height="32"
                  alt="camera"
                  loading="lazy"
                />
              </div>

              <input
                type="file"
                name="myImage"
                ref={hiddenFileInput}
                className="d-none"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
              />

              <div className="mt-3">
                <Label>Nama Lengkap</Label>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="info-profile-text">{user?.name ? user.name : '-'}</span>
                  <Button
                    color="link"
                    className="p-0 edit-button"
                    onClick={() => onOpenInput(user.name, 'Nama Lengkap')}>
                    Ubah
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <Label>Email</Label>
                <div className="d-flex justify-content-between align-items-center">
                  {user?.email ? <span className="info-profile-text">{user?.email}</span> : null}
                  <Button
                    color="link"
                    className="p-0 edit-button"
                    onClick={() => onOpenInput(user.email, 'Email')}>
                    {user?.email ? 'Ubah' : 'Isi Email'}
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <Label>Nomor HP</Label>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="info-profile-text">{user?.phone_number}</span>
                  <Button
                    color="link"
                    className="p-0 edit-button"
                    onClick={() => onOpenInput(user?.phone_number, 'Nomor HP')}>
                    Ubah
                  </Button>
                </div>
              </div>
            </Container>

            <BottomSheet
              open={hasEditInput}
              onDismiss={handleSheetDismiss}
              snapPoints={({ minHeight }) => minHeight}
              footer={
                <div className="d-flex p-3">
                  <div className="me-1 w-50">
                    <Button color="secondary" block outline onClick={onCancel}>
                      Batal
                    </Button>
                  </div>
                  <div className="ms-1 w-50">
                    <Button
                      color="secondary"
                      block
                      loading={isLoading}
                      onClick={onSubmit}
                      disabled={isLoading || buttonSubmitDisabled || inputInvalid}>
                      Simpan
                    </Button>
                  </div>
                </div>
              }>
              <div className="p-3">
                <Label className="mb-3 fw-bold">{`Ubah ${inputPlaceHolder}`}</Label>
                <FormGroup floating>
                  <Input
                    type={inputType}
                    name={inputPlaceHolder}
                    placeholder={inputPlaceHolder}
                    value={inputValue}
                    onChange={onChangeInput}
                    invalid={inputInvalid}
                  />
                  <Label className="text-placeholder">{inputPlaceHolder}</Label>
                </FormGroup>
              </div>
              <div className="p-1">
                {hasError && (
                  <FormText className="d-flex text-center justify-content-center">
                    <span className="text-danger">{errorMessage}</span>
                  </FormText>
                )}
              </div>
            </BottomSheet>
          </>
        )}
        <CustomModal
          show={showModalUploadWarning}
          title="Ukuran Gambar Terlalu Besar"
          caption="Ukuran gambar untuk profil kamu tidak boleh melebihi 2MB ya~"
          submitButton="Upload Lagi"
          cancelButton="Tutup"
          toggle={() => setShowModalUploadWarning(false)}
          onSubmit={() => openUploadWindow()}
          onCancel={() => setShowModalUploadWarning(false)}
        />
        <CustomModal
          show={showModalUploadError}
          title="Upload Gagal"
          caption={errorModalUpload}
          submitButton="Upload Lagi"
          cancelButton="Tutup"
          toggle={() => setShowModalUploadError(false)}
          onSubmit={() => openUploadWindow()}
          onCancel={() => setShowModalUploadError(false)}
        />
      </Div100vh>
    </PrivateLayout>
  );
};

export default EditAccount;
