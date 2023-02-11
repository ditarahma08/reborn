import { getVehicleOptions } from '@actions/Workshop';
import PrivateLayout from '@components/layouts/PrivateLayout';
import ConsultationSuccessModal from '@components/modal/ConsultationSuccessModal';
import CustomModal from '@components/modal/CustomModal';
import {
  Button,
  Container,
  Divider,
  Form,
  FormGroup,
  FormText,
  Header,
  Input,
  Label,
  Text
} from '@components/otoklix-elements';
import { api } from '@utils/API';
import amplitude from 'amplitude-js';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { forwardRef, useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import SelectSearch from 'react-select-search/dist/cjs';
import * as Yup from 'yup';

const FieldInputs = forwardRef((valueProps, ref) => {
  return (
    <>
      <Input {...valueProps} innerRef={ref} />
      <img className="select-arrow" src="/assets/icons/arrow-down.svg" alt="" />
    </>
  );
});

FieldInputs.displayName = 'FieldInputs';

const KonsultasiPage = () => {
  const router = useRouter();
  const fieldRef = useRef(null);

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [complain, setComplain] = useState('');

  const [hasSuccessConsultation, setHasSuccessConsultation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [hasPromptBackModal, setHasPromptBackModal] = useState(false);

  const handleOpenChat = () => {
    amplitude.getInstance().logEvent('help initiated', {
      page_location: fullPath,
      source_icon: 'custom order (consultation)'
    });

    if (typeof window !== 'undefined') {
      const chatId = document.getElementById('fc_frame');
      if (chatId) {
        window.fcWidget.open();
      }
    }
  };

  const onChangePhoneNumber = (e) => {
    let phoneValue = e.target.value.replace(/[^0-9+]/g, '');
    phoneValue.replace(/(?!^\+)\+/g, '');
    setPhoneNumber(phoneValue);
  };

  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    amplitude.getInstance().logEvent('booking action initiated', {
      cta_location: 'bottom',
      page_location: fullPath
    });

    const params = {
      customer_name: values?.name,
      customer_phone_number: values?.phoneNumber,
      vehicle_type: values?.carType,
      issue: values?.complain
    };

    const res = await api.post('/v2/custom-bookings/', params);
    if (res?.status === 200) {
      setHasSuccessConsultation(true);
      setLoadingSubmit(false);
    } else {
      setLoadingSubmit(false);
    }
  };

  const handleGetCar = async (query) => {
    if (query) {
      const [res] = await getVehicleOptions(query);

      return res;
    }

    return [];
  };

  const handleSetVehicle = (value, optionValue) => {
    fieldRef.current.value = { value, optionValue };
    setCarType(optionValue?.name);
  };

  const handleBackButton = () => {
    setHasPromptBackModal(true);
  };

  const handleUnmountPage = () => {
    setHasPromptBackModal(false);
    router.back();
  };

  const handleCancelUnmountPage = () => {
    setHasPromptBackModal(false);
  };

  const emptyRenderer = () => {
    return (
      <div className="text-center empty-item">
        <span>Mobil tidak ditemukan</span>
      </div>
    );
  };

  const renderVehicle = (props, option, snapshot, className) => {
    return (
      <button {...props} className={`car-item ${className}`}>
        <img src={option?.car_details?.car_model?.image_link} alt="" />
        <span className="fs-8 fw-bold">{`${option?.name} - ${option?.car_details?.variant}`}</span>
      </button>
    );
  };

  const schema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong.'),
    phoneNumber: Yup.string().min(10, 'Min 10 karakter').required('Nomor HP tidak boleh kosong.'),
    carType: Yup.string().required('Tipe mobil tidak boleh kosong.'),
    complain: Yup.string().required('Keluhan tidak boleh kosong.')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name,
      phoneNumber,
      carType,
      complain
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoadingSubmit(true);
      handleSubmit(values);
    }
  });

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'consultation form',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  return (
    <PrivateLayout
      title="Konsultasi | Otoklix"
      description=""
      metaRobots="noindex"
      hasAppBar={false}>
      <Header onBackClick={handleBackButton} title="Konsultasi" className="header-sticky" />

      <Divider type="page-divider" />

      <Container className="consultation-header d-flex align-items-center justify-content-between my-2">
        <img src="/assets/icons/chat-now.svg" alt="" className="me-2" />
        <Text tag="span">
          Bingung masalah <br />
          mobil? Chat Otoklix aja!
        </Text>
        <Button
          data-automation="consultation_button_chat_now"
          color="primary"
          className="rounded-pill px-2 py-1 me-1"
          size="sm"
          onClick={handleOpenChat}>
          Chat Sekarang
        </Button>
      </Container>

      <Divider type="page-divider" />

      <Container className="consultation-body">
        <Text tag="span" className="title">
          Detail Konsultasi
        </Text>
        <Text tag="p" className="mt-1">
          Silakan isi data dengan lengkap untuk konsultasi masalah mobil ya
        </Text>
        <Form onSubmit={formik.handleSubmit} className="consultation-form">
          <FormGroup>
            <Label className="mb-1">
              Nama<sup>*</sup>
            </Label>
            <Input
              data-automation="consultation_input_name"
              className="br-05"
              id="name"
              bsSize="sm"
              invalid={formik.touched.name && formik.errors.name}
              value={formik.values.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              disabled={loadingSubmit}
            />
            {formik.touched.name && formik.errors.name && <FormText>{formik.errors.name}</FormText>}
          </FormGroup>

          <FormGroup>
            <Label className="mb-1">
              Nomor HP<sup>*</sup>
            </Label>
            <Input
              data-automation="consultation_input_phone_number"
              className="br-05"
              id="phoneNumber"
              bsSize="sm"
              invalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
              value={formik.values.phoneNumber}
              onChange={(e) => onChangePhoneNumber(e)}
              placeholder="Isi nomor hp"
              type="tel"
              maxLength={13}
              disabled={loadingSubmit}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <FormText>{formik.errors.phoneNumber}</FormText>
            )}
          </FormGroup>

          <FormGroup>
            <Label className="mb-1">
              Tipe Mobil<sup>*</sup>
            </Label>
            <div className="position-relative">
              <SelectSearch
                data-automation="consultation_select_car"
                ref={fieldRef}
                className={`select-search select-search--vehicle br-05 ${
                  formik.touched.carType && formik.errors.carType ? ' is-invalid' : ''
                }`}
                options={[]}
                value=""
                printOptions="on-focus"
                autoComplete="off"
                placeholder="Pilih merek & tipe mobil"
                name="Vehicle"
                emptyMessage={emptyRenderer}
                renderOption={renderVehicle}
                getOptions={handleGetCar}
                onChange={handleSetVehicle}
                invalid={formik.touched.carType && formik.errors.carType}
                renderValue={(valueProps) => (
                  <FieldInputs {...valueProps} data-automation="search_car_input" />
                )}
                search
                disabled={loadingSubmit}
              />
            </div>
            {formik.touched.carType && formik.errors.carType && (
              <FormText>{formik.errors.carType}</FormText>
            )}
          </FormGroup>

          <FormGroup className="mb-5">
            <Label className="mb-1">
              Keluhan<sup>*</sup>
            </Label>
            <Input
              data-automation="consultation_input_complain"
              className="br-05"
              id="complain"
              bsSize="sm"
              type="textarea"
              invalid={formik.touched.complain && formik.errors.complain}
              value={formik.values.complain}
              onChange={(e) => setComplain(e.target.value)}
              placeholder="Catatkan keluhanmu"
              disabled={loadingSubmit}
            />
            {formik.touched.complain && formik.errors.complain && (
              <FormText>{formik.errors.complain}</FormText>
            )}
          </FormGroup>

          <div className="cta mt-4">
            <Text tag="span" className="text-booking-info" weight="normal">
              Dengan menekan tombol booking, saya menyetujui{' '}
              <a href="/account/privacy-policy">Syarat & Ketentuan</a> yang berlaku
            </Text>
            <Button
              data-automation="consultation_button_booking"
              className="rounded-pill mt-3"
              color="primary"
              block
              type="submit"
              loading={loadingSubmit}
              disabled={loadingSubmit}>
              Booking
            </Button>
          </div>
        </Form>
      </Container>

      <ConsultationSuccessModal isOpen={hasSuccessConsultation} />

      <CustomModal
        show={hasPromptBackModal}
        title="Yakin Mau Keluar?"
        caption="Keluar dari halaman ini menyebabkan data yang telah diisi tidak tersimpan"
        submitButton="Batal"
        cancelButton="Iya, Keluar"
        imageUrl="/assets/images/sent.png"
        toggle={handleCancelUnmountPage}
        onSubmit={handleCancelUnmountPage}
        onCancel={handleUnmountPage}
        buttonPill
      />
    </PrivateLayout>
  );
};

export default KonsultasiPage;
