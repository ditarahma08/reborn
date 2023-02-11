import {
  Button,
  Divider,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalHeader
} from '@components/otoklix-elements';
import { api } from '@utils/API';
import amplitude from 'amplitude-js';
import { Fragment, useEffect, useState } from 'react';

const LocationPickupModal = ({ setHasModalLocation, isOpen, user, setUser, type, fullPath }) => {
  const [inputValue, setInputValue] = useState('');
  const [locations, setLocations] = useState([]);

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleLocation = (value) => {
    setUser({
      ...user,
      province: value?.province,
      city: value?.city,
      district: value?.district
    });
    setInputValue('');
    setHasModalLocation(false);
  };

  const handleGetLocations = async (query) => {
    await api
      .get(`v2/pudo/area/?q=${query}`)
      .then((res) => {
        const responses = res.data?.data;
        setLocations(responses);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBack = () => {
    setHasModalLocation(false);
    setInputValue('');
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleGetLocations(inputValue);
      if (type === 'otoklix-pickup' && inputValue) {
        amplitude.getInstance().logEvent('form input finished', {
          form_name: 'PUDO',
          field_name: 'provinsi, kota, kecamatan',
          field_type: 'single line text',
          input_value: inputValue,
          page_location: fullPath
        });
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [inputValue]);

  const renderSuggestions = () =>
    locations?.map((suggestion, index) => {
      return (
        <Fragment key={index}>
          <div className="d-flex pointer" onClick={() => handleLocation(suggestion)}>
            <div className="flex-shrink-0">
              <img src="/assets/images/location2.png" alt="" />
            </div>
            <div className="flex-grow-1 ms-3 suggestion-box">
              <h3 className="text-capitalize">
                {suggestion?.area?.toLowerCase().replace('dki', 'DKI')}
              </h3>
            </div>
          </div>
          <Divider />
        </Fragment>
      );
    });

  return (
    <Modal
      isOpen={isOpen}
      className="wrapper wrapper-xs modal-find-location"
      backdrop={false}
      keyboard={false}>
      <ModalHeader className="border-0">
        <div className="d-flex flex-row align-items-center">
          <div className="me-2 pointer" role="presentation" onClick={handleBack}>
            <img src="/assets/icons/back.svg" alt="" />
          </div>
          <div className="w-100">
            <h1 className="title">Isi Kota/Kecamatan</h1>
          </div>
        </div>

        <InputGroup inputType="relative-sm" className="mt-4">
          <FormGroup className="has-left-icon">
            <InputGroupAddon addonType="prepend" className="d-flex mt-1">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="6.84442"
                  cy="6.84442"
                  r="5.99237"
                  stroke="#676765"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.0122 11.3232L13.3616 13.6665"
                  stroke="#676765"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </InputGroupAddon>

            <Input
              bsSize="sm"
              placeholder="Masukkan kota/kecamatan"
              className="bg-neutral border-none"
              onChange={handleInput}
              value={inputValue}
            />
          </FormGroup>
        </InputGroup>
      </ModalHeader>

      <ModalBody className="overflow-auto pt-0">
        {locations?.length <= 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <div>
              <img src="/assets/images/sorry.png" alt="" width="160" height="160" />
            </div>
            <div className="text-center mt-3">
              <h3 className="text-md fw-weight-600">Ups! Lokasimu di Luar Jangkauan</h3>
              <p className="text-sm">
                Untuk saat ini, lokasi yang kamu pilih belum terjangkau layanan Otoklix Pick Up
              </p>
              <Button onClick={() => setInputValue('')} className="text-md rounded-pill">
                Cek Area Jangkauan Kami
              </Button>
            </div>
          </div>
        ) : (
          <>{renderSuggestions()}</>
        )}
      </ModalBody>
    </Modal>
  );
};

export default LocationPickupModal;
