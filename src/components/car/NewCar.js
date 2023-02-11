import { getVehicleOptions } from '@actions/Workshop';
import CustomModal from '@components/modal/CustomModal';
import {
  Button,
  Container,
  FormGroup,
  Header,
  Input,
  Label,
  Text
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { numberOnlyRegex } from '@utils/Constants';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import SelectSearch from 'react-select-search/dist/cjs';
import { BottomSheet } from 'react-spring-bottom-sheet';

const FieldInputs = forwardRef((valueProps, ref) => {
  return (
    <>
      <img
        className="select-search-start"
        width={18}
        height={18}
        src="/assets/icons/search-thin.svg"
        alt="icon_search_thin"
        loading="lazy"
      />
      <Input {...valueProps} tabIndex={-1} innerRef={ref} />
      {valueProps.showClear ? (
        <div onClick={valueProps.onClear}>
          <img
            className="select-close"
            src="/assets/icons/close.svg"
            alt="icon_close"
            loading="lazy"
          />
        </div>
      ) : (
        ''
      )}
    </>
  );
});

FieldInputs.displayName = 'FieldInputs';

const NewCar = ({
  closeHasNewCar,
  callbackAfterCreate,
  title = 'Mobilku',
  origin = '',
  carData
}) => {
  const { isAuthenticated, token } = useAuth();

  const [licensePlatePrefix, setLicensePlatePrefix] = useState('');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');
  const [licensePlateSuffix, setLicensePlateSuffix] = useState('');
  const [transmission, setTransmission] = useState('');
  const [year, setYear] = useState('');
  const [yearIsValid, setyearIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(false);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBottomsheetCarExist, setShowBottomsheetCarExist] = useState(false);
  const [isEditCar, setIsEditCar] = useState(false);
  const [query, setQuery] = useState('');
  const [showClear, setShowClear] = useState(false);

  const TransmissionOptions = [
    { value: 'at', name: 'Automatic' },
    { value: 'mt', name: 'Manual' }
  ];

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const fieldRef = useRef(null);

  const handleSetVehicle = (value, optionValue) => {
    fieldRef.current.value = { value, optionValue };
    const carDetails = optionValue?.car_details;
    setQuery(
      `${carDetails?.car_model?.brand?.name} ${carDetails?.car_model?.model_name} - ${carDetails?.variant}`
    );

    if (origin === 'workshop-page') {
      gtag('click cari mobil', 'clickTambahMobilOrderPage');
    }
  };

  const handleLicensePlatePrefix = (e) => {
    if (e.target.value.length < 3) {
      setLicensePlatePrefix(Helper.onlyAlphabetUpperCase(e.target.value));
    }

    if (origin === 'workshop-page') {
      gtag('click nomor polisi', 'clickTambahMobilOrderPage');
    }
  };

  const handleLicensePlateNumber = (e) => {
    if (e.target.value.length < 5 && numberOnlyRegex.test(e.target.value)) {
      setLicensePlateNumber(e.target.value);
    }

    if (origin === 'workshop-page') {
      gtag('click nomor polisi', 'clickTambahMobilOrderPage');
    }
  };

  const handleLicensePlateSuffix = (e) => {
    if (e.target.value.length < 4) {
      setLicensePlateSuffix(Helper.onlyAlphabetUpperCase(e.target.value));
    }

    if (origin === 'workshop-page') {
      gtag('click nomor polisi', 'clickTambahMobilOrderPage');
    }
  };

  const handleTransmission = (type) => {
    setTransmission(type);

    if (origin === 'workshop-page') {
      gtag('click transmisi', 'clickTambahMobilOrderPage');
    }
  };

  const handleYear = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    const now = new Date();
    setYear(newValue);
    if (now.getFullYear() >= parseInt(newValue) && newValue.length == 4) {
      setyearIsValid(true);
      setButtonSubmitDisabled(false);
    } else {
      setyearIsValid(false);
      setButtonSubmitDisabled(true);
    }

    if (origin === 'workshop-page') {
      gtag('click tahun', 'clickTambahMobilOrderPage');
    }
  };

  const handleAddCar = async () => {
    authenticateAPI(token);

    const licensePlate = `${licensePlatePrefix} ${licensePlateNumber} ${licensePlateSuffix}`;

    const params = {
      license_plate: licensePlate,
      variant_id: Number(fieldRef.current.value.value),
      transmission,
      year: Number(year)
    };

    await api
      .post('v2/garage/cars/', params)
      .then(() => {
        callbackAfterCreate();
        closeHasNewCar();
      })
      .catch((e) => {
        let message;

        if (e?.response?.data?.error?.message === 'License plate has been used') {
          message = 'Silakan tambahkan mobil dengan plat nomor yang lain ya';
        } else {
          message = e?.response?.data?.error?.message;
        }

        setErrorMessage(message);
        setIsLoading(false);
        setButtonSubmitDisabled(false);
        setShowPopupInfo(true);
      });
  };

  const handleEditCar = async (licensePlate) => {
    authenticateAPI(token);

    const params = {
      license_plate: licensePlate,
      transmission,
      year: Number(year)
    };

    await api
      .put(`v2/garage/car/${carData?.id}/`, params)
      .then(() => {
        callbackAfterCreate();
        closeHasNewCar();
      })
      .catch((e) => {
        let message;

        if (e?.response?.data?.error?.message === 'License plate has been used') {
          message = 'Plat nomor sudah digunakan';
        } else {
          message = e?.response?.data?.error?.message;
        }

        setErrorMessage(message);
        setIsLoading(false);
        setButtonSubmitDisabled(false);
        setShowPopupInfo(true);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (origin === 'workshop-page') {
      gtag('click tambah mobil', 'clickTambahMobilOrderPage');
    }

    const license_plate = `${licensePlatePrefix} ${licensePlateNumber} ${licensePlateSuffix}`;
    const params = {
      car_details: fieldRef.current?.value?.optionValue?.car_details,
      license_plate,
      transmission,
      year
    };

    const userCarCookies = Cookies.get('user_car') ? JSON.parse(Cookies.get('user_car')) : {};

    if (userCarCookies?.id == carData?.id) {
      userCarCookies.carPlate = Helper.formatLicensePlate(license_plate);
      Cookies.set('user_car', JSON.stringify(userCarCookies), { path: '/' });
    }

    if (fieldRef.current.value && transmission && year) {
      setIsLoading(true);
      setButtonSubmitDisabled(true);

      GtmEvents.gtmSuccessAddCar(fieldRef?.current?.value?.optionValue?.name ?? '');

      const carBrand = params?.car_details?.car_model?.brand?.name || '';
      const carModel = params?.car_details?.car_model?.model_name || '';
      const carVariant = params?.car_details?.variant || '';

      amplitude.getInstance().logEvent('add new car submitted', {
        car_details: carBrand + ' ' + carModel + ' ' + carVariant
      });

      if (isAuthenticated) {
        if (isEditCar) {
          handleEditCar(license_plate);
        } else {
          checkExistCar(Number(fieldRef.current.value.value));
        }
      } else {
        closeHasNewCar();
      }
    } else if (fieldRef.current.value === undefined) {
      alert('Cari mobil harus diisi!');
    } else if (transmission === '') {
      alert('Transmission harus diisi!');
    } else if (year === '') {
      alert('Tahun harus diisi!');
    } else {
      alert('Data Tidak Lengkap');
    }
  };

  const checkExistCar = async (variantId) => {
    try {
      const response = await api.get(
        `v2/garage/car/is_exist?variant_id=${variantId}&transmission=${transmission}&year=${year}`
      );
      if (response?.data?.data) {
        setShowBottomsheetCarExist(true);
      } else {
        handleAddCar();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const emptyRenderer = () => {
    return (
      <div className="text-center empty-item">
        <span>Mobil tidak ditemukan</span>
      </div>
    );
  };

  const renderVehicle = (props, option, snapshot, className) => {
    const carDetails = option?.car_details;
    if (carDetails) {
      return (
        <button {...props} className={`car-item ${className}`}>
          <Text color="label">{`${carDetails?.car_model?.brand?.name} ${option?.name} - ${carDetails?.variant}`}</Text>
        </button>
      );
    } else {
      return (
        <button {...props} className={`car-item ${className}`}>
          <Text color="label">Mohon tunggu . . . </Text>
        </button>
      );
    }
  };

  const handleGetCar = async () => {
    if (query) {
      const querySearch = query.split(' - ')[0];
      const [res] = await getVehicleOptions(querySearch);
      return res;
    }
    return [];
  };

  const initCarValue = () => {
    const licensePlate = carData?.license_plate
      ? Helper.formatLicensePlate(carData?.license_plate)
      : '';

    if (licensePlate) {
      const plateInitArray = licensePlate.split(' ');
      const platePrefixInit = plateInitArray[0];
      const plateNumberInit = plateInitArray[1];
      const plateSuffixInit = plateInitArray[2];

      setLicensePlatePrefix(platePrefixInit ?? '');
      setLicensePlateNumber(plateNumberInit ?? '');
      setLicensePlateSuffix(plateSuffixInit ?? '');
    }

    setTransmission(carData?.transmission);
    setYear(carData?.year);
  };

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'add car',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  useEffect(() => {
    if (carData) {
      setIsEditCar(true);
      setShowClear(false);
      handleSetVehicle(parseInt(carData?.car_details?.id), {
        index: 0,
        value: parseInt(carData?.car_details?.id),
        name: `${carData?.car_details?.car_model?.model_name} - ${carData?.car_details.variant}`,
        car_details: carData?.car_details
      });
      initCarValue();
    }
  }, [carData]);

  useEffect(() => {
    if (query !== '' && !isEditCar) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [query]);

  return (
    <React.Fragment>
      <Header title={title} onBackClick={closeHasNewCar} />

      <Container className="wrapper-content">
        <FormGroup>
          <Label className="mb-2 fw-bold">Cari Mobil Kamu</Label>
          <div className="position-relative">
            <SelectSearch
              disabled={carData}
              ref={fieldRef}
              className="select-search select-search--vehicle"
              options={
                carData
                  ? [
                      {
                        index: 0,
                        value: parseInt(carData?.car_details?.id),
                        name: `${carData?.car_details?.car_model?.model_name} - ${carData?.car_details?.variant}`
                      }
                    ]
                  : []
              }
              value={carData && parseInt(carData?.car_details?.id)}
              printOptions="on-focus"
              autoComplete="off"
              placeholder="Ketik Merek & Tipe Mobil"
              name="Vehicle"
              emptyMessage={emptyRenderer}
              renderOption={renderVehicle}
              getOptions={handleGetCar}
              onChange={handleSetVehicle}
              renderValue={(valueProps) => (
                <FieldInputs
                  {...valueProps}
                  data-automation="search_car_input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  showClear={showClear}
                  onClear={() => setQuery('')}
                />
              )}
              debounce={750}
              search
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label className="mb-2 fw-bold">
            <Text weight="bold">Nomor Polisi</Text>
            <Text color="label" className="ms-1">
              (Opsional)
            </Text>
          </Label>
          <div className="d-flex license-plate-block">
            <Input
              className="text-center w-25 me-2"
              name="license-plate-prefix"
              placeholder="AB"
              onChange={handleLicensePlatePrefix}
              value={licensePlatePrefix}
              autoComplete="off"
              data-automation="license_plate_prefix_input"
            />
            <Input
              className="text-center w-50 me-2"
              name="license-plate-number"
              placeholder="1234"
              onChange={handleLicensePlateNumber}
              value={licensePlateNumber}
              type="tel"
              autoComplete="off"
              data-automation="license_plate_number_input"
            />
            <Input
              className="text-center w-25 p-3"
              name="license-plate-suffix"
              placeholder="REF"
              onChange={handleLicensePlateSuffix}
              value={licensePlateSuffix}
              autoComplete="off"
              data-automation="license_plate_suffix_input"
            />
          </div>
        </FormGroup>

        <FormGroup className="d-flex flex-column">
          <Label className="mb-2 fw-bold">Transmisi</Label>
          <div className="d-flex">
            {TransmissionOptions.map((item) => (
              <Button
                key={item.value}
                className={item.value === 'at' ? 'me-1' : 'ms-1'}
                color="primary"
                block
                outline
                active={transmission === item.value}
                onClick={() => handleTransmission(item.value)}
                data-automation="transmission_input_radio">
                {item.name}
              </Button>
            ))}
          </div>
        </FormGroup>

        <FormGroup>
          <Label className="mb-2 fw-bold">Tahun</Label>
          <Input
            type="tel"
            maxLength="4"
            name="tahun"
            placeholder="Tahun"
            value={year}
            onChange={handleYear}
            autoComplete="off"
            invalid={!yearIsValid}
            data-automation="car_year_input"
          />
        </FormGroup>
      </Container>

      <Container>
        <Button
          id="button_add_car"
          className="p-3"
          block
          color="primary"
          type="submit"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={buttonSubmitDisabled}
          data-automation="button_add_car">
          {carData ? 'Simpan' : 'Tambah Mobil'}
        </Button>
      </Container>

      <CustomModal
        show={showPopupInfo}
        title="Ups, Mobil Sudah Terdaftar!"
        caption={<span>{errorMessage}</span>}
        submitButton="Mengerti"
        toggle={() => setShowPopupInfo(false)}
        onSubmit={() => setShowPopupInfo(false)}
      />

      <BottomSheet
        className="bottomsheet-fixed"
        blocking={true}
        skipInitialTransition
        scrollLocking={false}
        open={showBottomsheetCarExist}
        onDismiss={() => setShowBottomsheetCarExist(false)}>
        <Container className="d-flex flex-column align-items-center mb-5">
          <img
            src="/assets/images/car-blue.png"
            height={200}
            width={200}
            alt="car-blue"
            loading="lazy"
          />
          <div className="d-flex flex-column align-items-center text-center mt-3">
            <Text weight="bold">Yakin Tambahkan Mobil?</Text>
            <Text color="label" className="text-sm my-3">
              Sepertinya data mobil yang kamu tambahkan sama dengan data mobil yang sudah ada
            </Text>
          </div>
          <div className="d-flex mt-4 w-100 mb-2">
            <Button
              color="primary"
              outline={true}
              block
              className="me-2"
              onClick={() => {
                setShowBottomsheetCarExist(false);
                setButtonSubmitDisabled(false);
              }}>
              Batal
            </Button>
            <Button
              color="primary"
              block
              className="ms-2"
              onClick={() => {
                setShowBottomsheetCarExist(false);
                handleAddCar();
              }}>
              Tambahkan
            </Button>
          </div>
        </Container>
      </BottomSheet>
    </React.Fragment>
  );
};

export default NewCar;
