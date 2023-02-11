import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalHeader
} from '@components/otoklix-elements';
import amplitude from 'amplitude-js';
import { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import usePlacesAutocomplete from 'use-places-autocomplete';

const LocationModal = ({
  toggle,
  isOpen,
  handleSelectSuggestion,
  fullPath = '',
  pageName = ''
}) => {
  const {
    value,
    suggestions: { loading, status, data },
    setValue
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (isOpen) {
      amplitude
        .getInstance()
        .logEvent('location initiated', { page_location: fullPath, position: pageName });
    }
  }, [isOpen]);

  const renderLoader = () => (
    <ContentLoader height={200} width={1060} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
      <rect x="103" y="12" rx="3" ry="3" width="123" height="7" />
      <rect x="102" y="152" rx="3" ry="3" width="171" height="6" />
      <circle cx="44" cy="42" r="38" />
      <circle cx="44" cy="147" r="38" />
      <circle cx="44" cy="251" r="38" />
      <rect x="105" y="117" rx="3" ry="3" width="123" height="7" />
      <rect x="104" y="222" rx="3" ry="3" width="123" height="7" />
      <rect x="105" y="48" rx="3" ry="3" width="171" height="6" />
      <rect x="104" y="257" rx="3" ry="3" width="171" height="6" />
    </ContentLoader>
  );

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const renderNotFound = () => (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5 search-message">
      <div>
        <img
          src="/assets/images/workshop-not-found.png"
          alt="img_workshop_not_found"
          width="200"
          height="200"
          loading="lazy"
        />
      </div>
      <div className="text-center">
        <h3>Lokasi Tidak Ditemukan</h3>
        <p>Cek kembali pengejaan lokasi yang kamu cari</p>
      </div>
    </div>
  );

  const renderSuggestions = () =>
    data.map((suggestion, index) => {
      return (
        <div
          className="d-flex pointer mb-3"
          data-automation={`suggestion_loc_${index}`}
          key={suggestion.place_id}
          onClick={() => handleSelectSuggestion(suggestion)}>
          <div className="flex-shrink-0">
            <img
              src="/assets/images/location.png"
              width="44"
              height="44"
              alt="img_location"
              loading="lazy"
            />
          </div>
          <div className="flex-grow-1 ms-3 suggestion-box">
            <h3>{suggestion.structured_formatting.main_text}</h3>
            <p>{suggestion.structured_formatting.secondary_text}</p>
          </div>
        </div>
      );
    });

  return (
    <Modal
      isOpen={isOpen}
      className="wrapper wrapper-xs modal-find-location"
      toggle={toggle}
      backdrop={false}
      keyboard={false}>
      <ModalHeader className="box-shadow-modal-header">
        <div className="d-flex flex-row pointer justify-content-center align-items-center text-center">
          <div className="me-2" role="presentation" onClick={toggle}>
            <img
              src="/assets/icons/back.svg"
              alt="icon_back"
              width="48"
              height="48"
              loading="lazy"
            />
          </div>
          <div className="w-100">
            <h1 className="title">Lokasi</h1>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <InputGroup inputType="relative-sm">
          <FormGroup className="has-left-icon">
            <InputGroupAddon addonType="prepend">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 14C11.7614 14 14 11.7614 14 9C14 6.23858 11.7614 4 9 4C6.23858 4 4 6.23858 4 9C4 11.7614 6.23858 14 9 14ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
                  fill="#A0A3BD"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.5858 12.5858C13.3668 11.8047 14.6332 11.8047 15.4142 12.5858L19.4142 16.5858C20.1953 17.3668 20.1953 18.6332 19.4142 19.4142C18.6332 20.1953 17.3668 20.1953 16.5858 19.4142L12.5858 15.4142C11.8047 14.6332 11.8047 13.3668 12.5858 12.5858Z"
                  fill="#A0A3BD"
                />
              </svg>
            </InputGroupAddon>

            <Input
              data-automation="location_modal_input_address"
              bsSize="sm"
              placeholder="Ketik Nama Tempat"
              className="bg-off-white border border-line"
              onChange={handleInput}
              value={value}
            />
          </FormGroup>
        </InputGroup>

        {loading ? (
          renderLoader()
        ) : (
          <>
            {status === 'ZERO_RESULTS' ? (
              renderNotFound()
            ) : data.length === 0 ? (
              <div className="d-flex flex-column justify-content-center align-items-center mt-5 search-message">
                <div>
                  <img
                    src="/assets/images/search-message.png"
                    alt="icon_search_message"
                    width="80"
                    height="80"
                    loading="lazy"
                  />
                </div>
                <div className="text-center mt-3">
                  <h3>Cari Servis Di Mana?</h3>
                  <p>
                    Ketik nama lokasi, gedung, atau bengkel di search bar untuk melihat hasilnya
                  </p>
                </div>
              </div>
            ) : (
              <>
                {value && (
                  <p className="info-text">
                    Klik pada lokasi yang kamu tuju untuk melihatnya di <strong>map</strong>
                  </p>
                )}

                {status === 'OK' && renderSuggestions()}
              </>
            )}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default LocationModal;
