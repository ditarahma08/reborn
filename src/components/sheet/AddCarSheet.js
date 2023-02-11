import { getVehicleOptions } from '@actions/Workshop';
import { Button, Container, FormGroup, Input, Label, Text } from '@components/otoklix-elements';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
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

const AddCarSheet = (props) => {
  const {
    fullPath,
    page = '',
    openSheet,
    buttonType,
    onDismiss,
    onApplyNewCar = () => {},
    isTopCloseButton = false,
    onSetNewCar
  } = props;

  const [disabled, setDisabled] = useState(true);
  const [onFocusSearch, setOnFocusSearch] = useState(false);
  const [carData, setCarData] = useState();
  const [onSearchCar, setOnSearchCar] = useState('');
  const [showCarList, setShowCarList] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [query, setQuery] = useState('');

  const fieldRef = useRef(null);

  const trackOnSkipCar = () => {
    amplitude.getInstance().logEvent('add new car skipped', {
      page_location: fullPath,
      position: page
    });
  };

  const trackOnSetVehicle = (carValue) => {
    const currentCar = carValue?.car_details;
    const carName =
      currentCar?.car_model?.brand?.name +
      ' ' +
      currentCar?.car_model?.model_name +
      ' ' +
      currentCar?.variant;

    amplitude.getInstance().logEvent('search result car selected', {
      car_details: carName,
      position: page
    });
  };

  const trackOnSetNewCar = (carValue) => {
    const currentCar = carValue?.optionValue?.car_details;
    const carName =
      currentCar?.car_model?.brand?.name +
      ' ' +
      currentCar?.car_model?.model_name +
      ' ' +
      currentCar?.variant;

    amplitude.getInstance().logEvent('add new car submitted', {
      car_details: carName,
      page_location: fullPath,
      position: page
    });
  };

  const handleOnFocus = () => {
    amplitude.getInstance().logEvent('search car initiated', {
      position: page,
      page_location: fullPath
    });
    setOnFocusSearch(true);
  };

  const handleOnBlur = () => {
    setOnFocusSearch(false);
  };

  const handleSetVehicle = (value, optionValue) => {
    fieldRef.current.value = { value, optionValue };
    const carDetails = optionValue?.car_details;
    setCarData(optionValue);
    setDisabled(false);
    trackOnSetVehicle(optionValue);
    setQuery(
      `${carDetails?.car_model?.brand?.name} ${carDetails?.car_model?.model_name} - ${carDetails?.variant}`
    );
  };

  const handleSetNewCar = () => {
    const carValue = fieldRef.current.value;
    const params = {
      car_details: carValue?.optionValue?.car_details,
      license_plate: '',
      transmission: '',
      year: ''
    };

    if (carValue && buttonType === 'order') {
      Cookies.set('user_car', JSON.stringify(params), { path: '/' });
      onSetNewCar(carValue);
    } else {
      Cookies.set('user_car', JSON.stringify(params), { path: '/' });
    }

    Cookies.set('car_changed', true, { path: '/' });

    setDisabled(true);
    setCarData();
    trackOnSetNewCar(carValue);
    onApplyNewCar();
    onDismiss();
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
      setOnSearchCar(querySearch);
      setShowCarList(true);
      const [res] = await getVehicleOptions(querySearch, 8);
      return res;
    }
    setShowCarList(false);
    return [];
  };

  useEffect(() => {
    if (onSearchCar) {
      const timeOutId = setTimeout(
        () =>
          amplitude.getInstance().logEvent('search car performed', {
            search_keyword: onSearchCar,
            position: page
          }),
        300
      );
      return () => clearTimeout(timeOutId);
    }
  }, [onSearchCar]);

  useEffect(() => {
    if (openSheet) {
      amplitude.getInstance().logEvent('add new car initiated', {
        position: page,
        page_location: fullPath
      });
    }
  }, [openSheet]);

  useEffect(() => {
    if (query !== '') {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [query]);

  return (
    <BottomSheet
      className="box-mobile-first bottom-sheet-map"
      open={openSheet}
      snapPoints={({ maxHeight }) => (onFocusSearch || showCarList ? [maxHeight] : [360])}
      skipInitialTransition
      scrollLocking={false}
      blocking={true}
      onSpringStart={(event) => {
        if (event.type === 'SNAP' && event.source === 'dragging') {
          setCarData();
          onDismiss();
          trackOnSkipCar();
        }
      }}
      footer={
        <Button
          className="order-button mb-3 mt-auto rounded-pill fixed-bottom"
          block
          data-automation="submit_button_add_car"
          color={disabled ? 'light' : 'primary'}
          disabled={disabled}
          onClick={handleSetNewCar}>
          {buttonType === 'order' ? 'Order' : 'Tambah Mobil'}
        </Button>
      }>
      {isTopCloseButton && (
        <div
          data-automation="top_close_button_add_car"
          className="pointer bottom-sheet-close"
          onClick={() => {
            setCarData();
            onDismiss();
            trackOnSkipCar();
          }}>
          <img src="/assets/icons/close.svg" alt="icon_close" loading="lazy" />
        </div>
      )}
      <Scrollbars autoHide autoHeight autoHeightMin={'calc(85vh - 106px)'} universal={true}>
        <Container className="wrapper-content">
          <div className="d-flex justify-content-between">
            <Text className="fs-6 fw-bold" data-automation="title_add_car">
              Tambahkan Mobil Saya
            </Text>
            {!isTopCloseButton && (
              <div
                data-automation="close_add_car"
                className="pointer"
                onClick={() => {
                  setCarData();
                  onDismiss();
                  trackOnSkipCar();
                }}>
                <img src="/assets/icons/close.svg" alt="icon_close" loading="lazy" />
              </div>
            )}
          </div>
          <Text
            tag="p"
            className="my-3 text-sm"
            color="label"
            data-automation="description_add_car">
            Data mobil dapat membantu aplikasi menemukan hasil sesuai dengan kebutuhan mobilmu
          </Text>
          <FormGroup>
            <Label className="mb-2 fw-bold required fs-7">Merek Mobil</Label>
            <div className="position-relative">
              <SelectSearch
                ref={fieldRef}
                onFocus={() => handleOnFocus()}
                onBlur={handleOnBlur}
                className="select-search select-search--vehicle"
                options={
                  carData
                    ? [
                        {
                          index: 0,
                          value: parseInt(carData?.car_details?.id),
                          name: `test ${
                            carData?.car_details?.car_model?.brand?.name
                              ? carData?.car_details?.car_model?.brand?.name
                              : ''
                          } ${
                            carData?.car_details?.car_model?.model_name
                              ? carData?.car_details?.car_model?.model_name
                              : ''
                          } - ${carData?.car_details?.variant ? carData?.car_details?.variant : ''}`
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
                debounce={1000}
                search
              />
            </div>
          </FormGroup>
        </Container>
      </Scrollbars>
    </BottomSheet>
  );
};

export default AddCarSheet;
