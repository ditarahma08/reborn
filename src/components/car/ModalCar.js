import { getVehicleOptions } from '@actions/Workshop';
import CustomModal from '@components/modal/CustomModal';
import { Button, Container, FormGroup, Header, Input, Label } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { numberOnlyRegex } from '@utils/Constants';
import Helper from '@utils/Helper';
import Cookies from 'js-cookie';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import SelectSearch from 'react-select-search/dist/cjs';

const FieldInputs = forwardRef((valueProps, ref) => {
  return (
    <>
      <Input {...valueProps} innerRef={ref} />
      <img className="select-arrow" src="/assets/icons/arrow-down.svg" alt="" />
    </>
  );
});

FieldInputs.displayName = 'FieldInputs';

const ModalCar = (props) => {
  const { closeHasNewCar, callbackAfterCreate, title, buttonTitle, buttonColor, carData } = props;
  const carId = carData.id;
  const transmissionInit = carData.transmission;
  const yearInit = carData.year;

  const licensePlate = Helper.formatLicensePlate(carData.license_plate);

  const plateInitArray = licensePlate.split(' ');
  const platePrefixInit = plateInitArray[0];
  const plateNumberInit = plateInitArray[1];
  const plateSuffixInit = plateInitArray[2];
  const { isAuthenticated, token } = useAuth();

  const [licensePlatePrefix, setLicensePlatePrefix] = useState(platePrefixInit);
  const [licensePlateNumber, setLicensePlateNumber] = useState(plateNumberInit);
  const [licensePlateSuffix, setLicensePlateSuffix] = useState(plateSuffixInit);
  const [transmission, setTransmission] = useState(transmissionInit);
  const [year, setYear] = useState(yearInit);
  const [yearIsValid, setyearIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(false);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const TransmissionOptions = [
    { value: 'at', name: 'Automatic' },
    { value: 'mt', name: 'Manual' }
  ];

  const fieldRef = useRef(null);

  const handleSetVehicle = (value, optionValue) => {
    fieldRef.current.value = { value, optionValue };
  };

  const handleLicensePlatePrefix = (e) => {
    if (e.target.value.length < 3) {
      setLicensePlatePrefix(Helper.onlyAlphabetUpperCase(e.target.value));
    }
  };

  const handleLicensePlateNumber = (e) => {
    if (e.target.value.length < 5 && numberOnlyRegex.test(e.target.value)) {
      setLicensePlateNumber(e.target.value);
    }
  };

  const handleLicensePlateSuffix = (e) => {
    if (e.target.value.length < 4) {
      setLicensePlateSuffix(Helper.onlyAlphabetUpperCase(e.target.value));
    }
  };

  const handleTransmission = (type) => {
    setTransmission(type);
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
  };

  const handleAddCar = async (license_plate, variant_id, transmission, year) => {
    authenticateAPI(token);

    const params = {
      license_plate,
      transmission,
      year
    };

    await api
      .put(`v2/garage/car/${carId}/`, params)
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

    const license_plate = `${licensePlatePrefix} ${licensePlateNumber} ${licensePlateSuffix}`;
    const params = {
      car_details: fieldRef.current?.value?.optionValue?.car_details,
      license_plate,
      transmission,
      year
    };

    if (
      fieldRef.current.value &&
      licensePlatePrefix &&
      licensePlateNumber &&
      transmission &&
      year
    ) {
      setIsLoading(true);
      setButtonSubmitDisabled(true);

      if (isAuthenticated) {
        handleAddCar(
          license_plate,
          Number(fieldRef.current.value.value),
          transmission,
          Number(year)
        );
      }

      Cookies.set('user_car', JSON.stringify(params), { path: '/' });
    } else if (fieldRef.current.value === undefined) {
      alert('Cari mobil harus diisi!');
    } else if (licensePlatePrefix === '') {
      alert('Nomor polisi harus diisi!');
    } else if (licensePlateNumber === '') {
      alert('Nomor polisi harus diisi!');
    } else if (transmission === '') {
      alert('Transmission harus diisi!');
    } else if (year === '') {
      alert('Tahun harus diisi!');
    } else {
      alert('Data Tidak Lengkap');
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
    return (
      <button {...props} className={`car-item ${className}`}>
        <img src={option?.car_details?.car_model?.image_link} alt="" />
        <span className="fs-8 fw-bold">{`${option?.name} - ${option?.car_details?.variant}`}</span>
      </button>
    );
  };

  const handleGetCar = async (query) => {
    if (query) {
      const [res] = await getVehicleOptions(query);

      return res;
    }

    return [];
  };

  useEffect(() => {
    handleSetVehicle(parseInt(carData.car_details.id), {
      index: 0,
      value: parseInt(carData.car_details.id),
      name: `${carData.car_details.car_model.model_name} - ${carData.car_details.variant}`
    });
  }, []);

  return (
    <React.Fragment>
      <Header title={title} onBackClick={closeHasNewCar} />

      <Container className="wrapper-content">
        <FormGroup>
          <Label className="mb-2 fw-bold">Cari Mobil Kamu</Label>
          <div className="position-relative">
            <SelectSearch
              disabled={true}
              ref={fieldRef}
              className="select-search select-search--vehicle"
              options={[
                {
                  index: 0,
                  value: parseInt(carData.car_details.id),
                  name: `${carData.car_details.car_model.model_name} - ${carData.car_details.variant}`
                }
              ]}
              value={parseInt(carData.car_details.id)}
              printOptions="on-focus"
              autoComplete="off"
              placeholder="Cari Mobil"
              name="Vehicle"
              emptyMessage={emptyRenderer}
              renderOption={renderVehicle}
              getOptions={handleGetCar}
              onChange={handleSetVehicle}
              renderValue={(valueProps) => (
                <FieldInputs {...valueProps} data-automation="search_car_input" />
              )}
              search
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label className="mb-2 fw-bold">Nomor Polisi</Label>
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
          className="p-3"
          block
          color={buttonColor}
          type="submit"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={buttonSubmitDisabled}
          data-automation="button_save_car">
          {buttonTitle}
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
    </React.Fragment>
  );
};

export default ModalCar;
