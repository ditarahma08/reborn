import { FormGroup, FormText, Input, Label } from '@components/otoklix-elements';
import { api } from '@utils/API';
import Cookies from 'js-cookie';
import { forwardRef, useEffect, useRef } from 'react';
import SelectSearch from 'react-select-search/dist/cjs';

const FieldInputs = forwardRef((valueProps, ref) => {
  return (
    <>
      <Input
        invalid={!valueProps}
        {...valueProps}
        innerRef={ref}
        className="bg-white border-7"
        bsSize="sm"
      />
      <img className="select-arrow" src="/assets/icons/arrow-down.svg" alt="" />
    </>
  );
});

FieldInputs.displayName = 'FieldInputs';

const SelectCar = ({
  label,
  carData,
  setCarData,
  user,
  setUser,
  labelClassName,
  invalid,
  disabled,
  errorText
}) => {
  const fieldRef = useRef(null);

  const handleSetVehicle = (value, optionValue) => {
    fieldRef.current.value = { value, optionValue };

    if (fieldRef.current.value) {
      Cookies.set('car_data', optionValue, { path: '/otoklixpickup/forms' });
    }

    setCarData(optionValue);
    setUser({
      ...user,
      customer_vehicle_type: optionValue?.name
    });
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
        <span className="fs-8 fw-normal">{option?.name}</span>
      </button>
    );
  };

  const getVehicleOptions = async (query) => {
    try {
      let url = `/v2/md/search-car/?q=${query}`;
      const response = await api.get(url);
      return [
        response.data.data
          .map((item) => ({
            value: item.id.toString(),
            name: `${item?.car_model?.model_name} - ${item?.variant}`,
            car_details: item
          }))
          .slice(0, 5),
        null
      ];
    } catch (e) {
      return [[], 'error'];
    }
  };

  const handleGetCar = async (query) => {
    if (query) {
      const [res] = await getVehicleOptions(query);
      return res;
    }
    return [];
  };

  useEffect(() => {
    const userCar = Cookies.get('car_data', { path: '/otoklixpickup/forms' });

    userCar && setCarData(JSON.parse(userCar));
  }, []);

  return (
    <FormGroup>
      <Label className={`fw-weight-600 required mb-1${` ${labelClassName}` ?? ''}`}>{label}</Label>
      <div className="position-relative">
        <SelectSearch
          ref={fieldRef}
          className={`select-search select-search--vehicle ${invalid ? ' is-invalid' : ''}`}
          options={
            carData
              ? [
                  {
                    index: 0,
                    value: parseInt(carData?.car_details?.id),
                    name: carData?.name
                  }
                ]
              : []
          }
          value={carData}
          printOptions="on-focus"
          autoComplete="off"
          placeholder="Pilih Merek & Tipe Mobil"
          name="Vehicle"
          emptyMessage={emptyRenderer}
          renderOption={renderVehicle}
          getOptions={handleGetCar}
          onChange={handleSetVehicle}
          renderValue={(valueProps) => (
            <FieldInputs {...valueProps} data-automation="search_car_input" />
          )}
          search
          disabled={disabled}
          invalid={invalid}
        />
      </div>
      {invalid && (
        <FormText className="text-xs" color="danger">
          {errorText}
        </FormText>
      )}
    </FormGroup>
  );
};

export default SelectCar;
