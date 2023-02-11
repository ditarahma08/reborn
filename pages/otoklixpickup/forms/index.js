import SelectCar from '@components/car/SelectCar';
import DateTimePickerNew from '@components/datepicker/DateTimePickerNew';
import PrivateLayout from '@components/layouts/PrivateLayout';
import CustomModal from '@components/modal/CustomModal';
import LocationPickupModal from '@components/modal/LocationPickupModal';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Header,
  Input,
  Label,
  Row,
  Text
} from '@components/otoklix-elements';
import { api } from '@utils/API';
import { days, otoPickup } from '@utils/Constants';
import Helper from '@utils/Helper';
import { isBrowser } from '@utils/isBrowser';
import amplitude from 'amplitude-js';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { isUndefined } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { forwardRef, useEffect, useRef, useState } from 'react';
import SelectSearch from 'react-select-search/dist/cjs';
import * as Yup from 'yup';

const FieldInputCategory = forwardRef((valueProps, ref) => {
  return (
    <>
      <Input
        readOnly={false}
        {...valueProps}
        innerRef={ref}
        className="bg-white border-7"
        bsSize="sm"
      />
      <img className="select-arrow pointer" src="/assets/icons/arrow-down.svg" alt="" />
    </>
  );
});

FieldInputCategory.displayName = 'FieldInputCategory';

const OtoklixPickup = () => {
  const router = useRouter();

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const userData = Cookies.get('otoklix-pickup', { path: '/otoklixpickup/forms' });
  const userCar = Cookies.get('car_data', { path: '/otoklixpickup/forms' });
  const activeCategory = Cookies.get('active_category', { path: '/otoklixpickup/forms' });

  const addDays = (date, days) => {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  };

  const date = new Date();
  const hour = date.getHours();
  let time = hour >= 16 ? 2 : 1;
  const newDate = addDays(date, time);

  const minimumDate = newDate;

  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');

  const [laterDateTime, setLaterDateTime] = useState(new Date(moment(minimumDate)));
  const [operatingHours, setOperatingHours] = useState({
    min: { openingHour: '09.00', closingHour: '14.00', isOpen: true },
    today: { openingHour: '09.00', closingHour: '14.00', isOpen: false }
  });
  const [carData, setCarData] = useState();
  const [hasModalLocation, setHasModalLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [user, setUser] = useState({
    customer_name: '',
    customer_phone_number: '',
    customer_vehicle_type: '',
    province: '',
    city: '',
    district: '',
    address: '',
    service_category: '',
    pickup_date: ''
  });
  const [backModal, setBackModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [errorSubmitMessage, setErrorSubmitMessage] = useState(false);
  const [servicesCategory, setServicesCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState('');

  const disabledDates = [];
  const schedule = [
    { day: 'Senin', opening_hour: '09.00', closing_hour: '14.00', is_open: false },
    { day: 'Selasa', opening_hour: '09.00', closing_hour: '14.00', is_open: false },
    { day: 'Rabu', opening_hour: '09.00', closing_hour: '14.00', is_open: false },
    { day: 'Kamis', opening_hour: '09.00', closing_hour: '14.00', is_open: false },
    { day: 'Jumat', opening_hour: '09.00', closing_hour: '14.00', is_open: false },
    { day: 'Sabtu', opening_hour: '09.00', closing_hour: '14.00', is_open: false },
    { day: 'Minggu', opening_hour: '09.00', closing_hour: '14.00', is_open: false }
  ];

  const categoryRef = useRef(null);

  const onChangePhoneNumber = (e) => {
    let phoneValue = e.replace(/[^0-9+]/g, '');
    phoneValue.replace(/(?!^\+)\+/g, '');
    setPhoneNumber(phoneValue);
  };

  const handleCategory = (value, optionValue) => {
    categoryRef.current.value = { value, optionValue };

    if (categoryRef.current.value) {
      Cookies.set('active_category', optionValue, { path: '/otoklixpickup/forms' });
    }

    setCategory(optionValue?.name);
    setSelectedCategory(value);

    if (value !== 'other') {
      setUser({ ...user, service_category: value?.charAt(0)?.toUpperCase() + value?.slice(1) });
    } else {
      setUser({ ...user, service_category: '' });
    }
  };

  const onChangeCar = (e) => {
    setCarType(e?.customer_vehicle_type);
  };

  const countHoursLimit = (date, wsSchedules) => {
    const day = wsSchedules?.find((schedule) => {
      return schedule?.day === days[new Date(date).getDay()];
    });
    const today = wsSchedules?.find((schedule) => {
      return schedule?.day === days[new Date().getDay()];
    });

    setOperatingHours({
      min: {
        openingHour: day?.opening_hour,
        closingHour: day?.closing_hour,
        isOpen: day?.is_open
      },
      today: {
        openingHour: today?.opening_hour,
        closingHour: today?.closing_hour,
        isOpen: today?.is_open
      }
    });
  };

  const handleChangeLocation = (e) => {
    setProvince(e?.province);
    setCity(e?.city);
    setDistrict(e?.district);
  };

  const handleChangeCategory = (e) => {
    setOtherCategory(e.target.value);
  };

  const handleLaterDateTime = (value, changeType) => {
    const selectDate = moment(value).format('YYYY-MM-DD');
    const hourSelected = moment(value).hours();

    setLaterDateTime(value);

    if (changeType === 'date-changed') {
      setUser({
        ...user,
        pickup_date: `${selectDate} ${`${hourSelected}:00:00`}`
      });
    } else if (changeType === 'hour-changed') {
      setUser({
        ...user,
        pickup_date: `${selectDate} ${`${hourSelected}:00:00`}`
      });
    }

    changeType !== 'hour-changed' && countHoursLimit(value, schedule);
  };

  const getServicesCategory = async () => {
    await api
      .get('v2/md/service-categories/')
      .then((res) => {
        const responses = res.data.data;
        setServicesCategory([
          ...responses,
          {
            name: 'Other',
            slug: 'other',
            value: 'other',
            icon_link: '',
            is_clickable: true
          }
        ]);
      })
      .catch((error) => console.log(error));
  };

  const checkSubmit = () => {
    if (!user.pickup_date) {
      setErrorSubmit(true);
      setErrorSubmitMessage('Harap pilih jam terlebih dahulu');
    }
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    const params = {
      customer_name: name,
      customer_phone_number: phoneNumber,
      customer_vehicle_type: carType,
      province,
      city,
      district,
      address,
      service_category: selectedCategory === 'other' ? otherCategory : category,
      pickup_date: user?.pickup_date
    };
    await api
      .post('v2/pudo/submit/', params)
      .then(() => {
        amplitude.getInstance().logEvent('booking action initiated', {
          cta_location: 'bottom',
          page_location: fullPath
        });
        setLoadingSubmit(false);
        setSubmitModal(true);
        userData && Cookies.remove('otoklix-pickup', { path: '/otoklixpickup/forms' });
        userCar && Cookies.remove('car_data', { path: '/otoklixpickup/forms' });
        activeCategory && Cookies.remove('active_category', { path: '/otoklixpickup/forms' });
      })
      .catch((error) => {
        setLoadingSubmit(false);
        setErrorSubmit(true);
        setErrorSubmitMessage(error.response?.data?.error?.message.toLowerCase());
        setTimeout(() => {
          setErrorSubmit(false);
        }, 2000);
      });
  };

  useEffect(() => {
    getServicesCategory();
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'PUDO form',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  const onChangeLocation = () => {
    amplitude.getInstance().logEvent('form input initiated', {
      form_name: 'PUDO',
      field_name: 'provinsi, kota, kecamatan',
      field_type: 'single line text',
      page_location: fullPath
    });
    setHasModalLocation(true);
  };

  const handleBackButton = () => {
    setBackModal(true);
  };

  const handleKeluar = () => {
    userData && Cookies.remove('otoklix-pickup', { path: '/otoklixpickup/forms' });
    userCar && Cookies.remove('car_data', { path: '/otoklixpickup/forms' });
    activeCategory && Cookies.remove('active_category', { path: '/otoklixpickup/forms' });
    setBackModal(false);
    router.back();
  };

  const handleBatal = () => {
    setBackModal(false);
  };

  const handleTnc = () => {
    const params = {
      customer_name: name,
      customer_phone_number: phoneNumber,
      customer_vehicle_type: carType,
      province,
      city,
      district,
      address,
      service_category: selectedCategory === 'other' ? otherCategory : category,
      pickup_date: user?.pickup_date
    };
    Cookies.set('otoklix-pickup', params, { path: '/otoklixpickup/forms' });
    router.push('/account/terms-conditions?tnc=pickup');
  };

  const schema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong.'),
    phoneNumber: Yup.string().min(10, 'Min 10 karakter').required('Nomor HP tidak boleh kosong.'),
    carType: Yup.string().required('Tipe mobil tidak boleh kosong.'),
    address: Yup.string().required('Alamat detail tidak boleh kosong.'),
    province: Yup.string().required('Provinsi, Kota, Kecamatan tidak boleh kosong.'),
    category: Yup.string().required('Kategori tidak boleh kosong.')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name,
      phoneNumber,
      carType,
      address,
      province,
      category
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (!user.pickup_date) {
        setErrorSubmit(true);
        setErrorSubmitMessage('Harap pilih jam terlebih dahulu');
        setTimeout(() => {
          setErrorSubmit(false);
        }, 2000);
      } else {
        setLoadingSubmit(true);
        handleSubmit(values);
      }
    }
  });

  useEffect(() => {
    if (userData) {
      setUser({
        ...JSON.parse(userData),
        customer_vehicle_type: userCar && JSON.parse(userCar)?.name
      });
    }
    if (userCar) {
      setCarType(JSON.parse(userCar)?.name);
    }
  }, []);

  useEffect(() => {
    activeCategory && setCategory(JSON.parse(activeCategory)?.name);
    activeCategory && setSelectedCategory(JSON.parse(activeCategory)?.value);
  }, []);

  useEffect(() => {
    if (!isUndefined(userData)) {
      const dataForm = JSON.parse(userData);
      const listCategoryServices = ['Oli', 'Tune Up', 'Rem', 'Cuci', 'Ban', 'Aki', 'AC', 'Berkala'];
      const checkCategoryServices = listCategoryServices.indexOf(dataForm?.service_category) > -1;
      setName(dataForm?.customer_name);
      setPhoneNumber(dataForm?.customer_phone_number);
      setProvince(dataForm?.province);
      setCity(dataForm?.city);
      setDistrict(dataForm?.district);
      setAddress(dataForm?.address);
      setCarType(dataForm?.customer_vehicle_type);
      if (checkCategoryServices) {
        setCategory(dataForm?.service_category);
        setSelectedCategory(Helper.stringToSlug(dataForm?.service_category));
      } else {
        setCategory('Other');
        setSelectedCategory('other');
        setOtherCategory(dataForm?.service_category);
      }
    }
  }, [userData]);

  if (isBrowser()) {
    const element = document.querySelector('input[name="location"]');
    element === document.activeElement && document.activeElement.blur();
  }

  return (
    <PrivateLayout
      title="Otoklix Pick Up | Otoklix"
      description=""
      metaRobots="noindex"
      wrapperClassName="wrapper-full"
      hasAppBar={false}>
      <Header
        title="Booking Servis Otoklix Pick Up"
        onBackClick={handleBackButton}
        className="header-sticky"
      />

      <Form className="mt-4" onSubmit={formik.handleSubmit}>
        <Container className="px-3">
          <Row className="mt-2">
            <img
              src="/assets/icons/logo-orange.svg"
              alt=""
              className="mb-2"
              style={{ width: 96 }}
            />
            <Text tag="p" className="text-xs">
              <Text tag="span">
                Layanan antar-jemput mobil secara GRATIS dari rumah kamu ke bengkel rekanan Otoklix
                untuk ganti oli, ban, dan servis lainnya.
              </Text>
              <br />
              <br />
              <Text tag="span">
                Pemesanan layanan Otoklix Pick Up dilakukan 1 hari sebelum jadwal pengerjaan
              </Text>
              <br />
              <br />
              <Text tag="span">
                Selama proses penjemputan dan pengantaran, kendaraan akan mendapatkan asuransi.
              </Text>
            </Text>
          </Row>
          <Row className="mt-2">
            {otoPickup.map((item, index) => {
              return (
                <Col
                  className={`col-4 d-flex align-items-stretch${
                    index === 0 ? ' pe-1' : index === 1 ? ' px-2' : index === 2 ? ' ps-1' : ''
                  }`}
                  key={index}>
                  <Card className="border-7">
                    <CardBody className="d-flex flex-column justify-content-center px-1">
                      <img src={`/assets/icons/${item.icon}.svg`} alt="" height={13} />
                      <Text className="text-xxs text-center mt-2">{item.desc}</Text>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <div className="mt-4 mb-2">
            <Text tag="h3" className="fw-weight-600 text-xs">
              Rincian Booking
            </Text>
            <Text className="text-xxs">
              Silakan isi data ini dengan lengkap untuk booking <br />
              servis Otoklix Pick Up ya!
            </Text>
          </div>
          <Label className="required fw-weight-600 text-md mb-1">Nama</Label>
          <FormGroup>
            <Input
              name="name"
              bsSize="sm"
              invalid={formik.touched.name && formik.errors.name}
              value={formik.values.name}
              onChange={(e) => setName(e.target.value)}
              disabled={loadingSubmit}
              placeholder="Masukkan nama"
              className="bg-white border-7"
            />
            {formik.touched.name && formik.errors.name && (
              <FormText className="text-xs" color="danger">
                {formik.errors.name}
              </FormText>
            )}
          </FormGroup>
          <Label className="required fw-weight-600 text-md mb-1">Nomor HP</Label>
          <FormGroup>
            <Input
              name="phone"
              bsSize="sm"
              type="tel"
              invalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
              value={formik.values.phoneNumber}
              disabled={loadingSubmit}
              onChange={(e) => onChangePhoneNumber(e.target.value)}
              placeholder="Isi nomor Hp"
              className="bg-white border-7"
              maxLength={13}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <FormText className="text-xs" color="danger">
                {formik.errors.phoneNumber}
              </FormText>
            )}
          </FormGroup>
          <SelectCar
            label="Merek & Tipe Mobil"
            labelClassName="text-md"
            carData={carData}
            setCarData={setCarData}
            setUser={(e) => onChangeCar(e)}
            user={user}
            invalid={formik.touched.carType && formik.errors.carType}
            errorText={formik.errors.carType}
            disabled={loadingSubmit}
          />
          <Label className="required fw-weight-600 text-md mb-1">Provinsi, Kota, Kecamatan</Label>
          <FormGroup>
            <Input
              name="location"
              bsSize="sm"
              value={
                city &&
                `${district?.toLowerCase()}, ${city?.toLowerCase()}, ${province
                  ?.toLowerCase()
                  .replace('dki', 'DKI')}`
              }
              placeholder="Masukkan provinsi, kota, kecamatan"
              onClick={onChangeLocation}
              className="bg-white text-capitalize border-7"
              invalid={formik.touched.province && formik.errors.province}
              readOnly
            />
            <FormText className="text-xs">
              Hanya area yang bisa dijangkau servis antar-jemput
            </FormText>
            <br />
            {formik.touched.province && formik.errors.province && (
              <FormText className="text-xs" color="danger">
                {formik.errors.province}
              </FormText>
            )}
          </FormGroup>
          <Label className="required fw-weight-600 text-md mb-1">Alamat Detail</Label>
          <FormGroup>
            <Input
              bsSize="sm"
              name="address"
              invalid={formik.touched.address && formik.errors.address}
              value={formik.values.address}
              disabled={loadingSubmit}
              onChange={(e) => setAddress(e.target.value)}
              type="textarea"
              placeholder="Tambahkan detail alamat"
              className="bg-white border-7"
              maxLength={500}
            />
            {formik.touched.address && formik.errors.address && (
              <FormText className="text-xs" color="danger">
                {formik.errors.address}
              </FormText>
            )}
          </FormGroup>
          <FormGroup>
            <Label className="required fw-weight-600 text-md mb-1">Kategori Servis</Label>
            <div className="line-items">
              <SelectSearch
                ref={categoryRef}
                className={`select-search select-search--lineitems-new ${
                  formik.touched.category && formik.errors.category ? 'is-invalid' : ''
                }`}
                placeholder="Pilih kategori servis"
                options={servicesCategory}
                printOptions="on-focus"
                autoComplete="off"
                name="Category"
                value={category}
                disabled={loadingSubmit}
                onChange={handleCategory}
                renderValue={(valueProps) => (
                  <FieldInputCategory {...valueProps} value={category} />
                )}
              />
            </div>
            {formik.touched.category && formik.errors.category && (
              <FormText className="text-xs" color="danger">
                {formik.errors.category}
              </FormText>
            )}
          </FormGroup>

          {category === 'Other' && (
            <div>
              <Label className="required fw-weight-600 text-md mb-1">Servis Apa</Label>
              <FormGroup>
                <Input
                  name="category"
                  bsSize="sm"
                  value={otherCategory}
                  onChange={handleChangeCategory}
                  placeholder="Tuliskan servis"
                  invalid={formik.touched.category && formik.errors.category}
                  disabled={loadingSubmit}
                  className="bg-white border-7"
                />
              </FormGroup>
              {formik.touched.category && formik.errors.category && (
                <FormText className="text-xs" color="danger">
                  {formik.errors.category}
                </FormText>
              )}
            </div>
          )}

          <FormGroup>
            <Label className="fw-weight-600 text-md mb-2">Jadwal Penjemputan Mobil</Label>
            <DateTimePickerNew
              value={laterDateTime}
              schedule={operatingHours}
              onChange={handleLaterDateTime}
              disabledDates={disabledDates}
              minimumDateTime={minimumDate}
              userData={userData}
              displayClassName="fw-weight-600"
              isOtoklixGo
              isOtoklixPickup
              pickupDate={user?.pickup_date}
              setErrorSubmitMessage={setErrorSubmitMessage}
              setErrorSubmit={setErrorSubmit}
            />
          </FormGroup>

          {errorSubmit && (
            <Alert
              className="mt-4 text-capitalize"
              borderColor="danger"
              color="danger"
              textColor="white">
              {errorSubmitMessage}
            </Alert>
          )}
        </Container>

        <Container className="d-flex flex-column mt-5 pb-4 px-3">
          <Text className="text-xs">
            Dengan menekan tombol booking, saya <br /> menyetujui{' '}
            <Text
              onClick={handleTnc}
              color="primary"
              className="fw-weight-600 pointer text-decoration-none">
              Syarat & Ketentuan
            </Text>{' '}
            yang berlaku
          </Text>
          <Button
            block
            disabled={false}
            type="submit"
            onClick={checkSubmit}
            loading={loadingSubmit}
            className="rounded-pill mt-3">
            Booking
          </Button>
        </Container>
      </Form>

      <LocationPickupModal
        isOpen={hasModalLocation}
        setHasModalLocation={setHasModalLocation}
        user={user}
        setUser={(e) => handleChangeLocation(e)}
        type="otoklix-pickup"
        fullPath={fullPath}
      />

      <CustomModal
        show={backModal}
        title="Yakin Mau Keluar?"
        caption="Keluar dari halaman ini menyebabkan data yang telah diisi tidak tersimpan"
        submitButton="Batal"
        cancelButton="Iya, Keluar"
        imageUrl="/assets/images/sent.png"
        toggle={handleBatal}
        onSubmit={handleBatal}
        onCancel={handleKeluar}
        buttonPill
      />

      <CustomModal
        show={submitModal}
        title="Yey! Booking Berhasil"
        caption="Terima Kasih. Booking servismu akan segera kami proses"
        submitButton="Servis Lainnya"
        cancelButton="Ke Beranda"
        imageUrl="/assets/images/sent.png"
        onSubmit={() => router.push('/cari')}
        onCancel={() => router.push('/servis')}
        buttonPill
      />
    </PrivateLayout>
  );
};

export default OtoklixPickup;
