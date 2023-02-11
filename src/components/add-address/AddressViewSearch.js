import CoachMark from '@components/coach-mark/CoachMark';
import InputGlobalSearch from '@components/input/InputGlobalSearch';
import CustomModal from '@components/modal/CustomModal';
import { Divider, EmptyState, Text } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { coachMarkLocale, coachMarkPickupLocSteps, coachMarkStyles } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import Cookies from 'js-cookie';
import { times } from 'lodash';
import { useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const AddressViewSearch = (props) => {
  const {
    fullPath,
    onClickAddress,
    onTrack,
    addressList,
    onUserAddressClick,
    isFetchingAddress
  } = props;
  const {
    value,
    setValue,
    suggestions: { data }
  } = usePlacesAutocomplete();

  const [modalLocPermission, setModalLocPermission] = useState(false);
  const [showCoachMark, setShowCoachMark] = useState(false);

  const handleSearch = (e) => {
    setValue(e.target.value);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      const addressLocation = getAddressLocation(lat, lng);
      addressLocation.then((response) => {
        onClickAddress(response);
      });
    });
  };

  const getLocationPermission = () => {
    if (!navigator.userAgent.includes('Safari')) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          getCurrentLocation();
        } else if (result.state === 'denied') {
          setModalLocPermission(true);
        }
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        () => getCurrentLocation(),
        () => setModalLocPermission(true)
      );
    }
  };

  const handleClickSuggestion = async (suggestion) => {
    await getGeocode({ address: suggestion.description })
      .then((response) => getLatLng(response[0]))
      .then(({ lat, lng }) => {
        onClickAddress({
          lat: lat,
          lng: lng,
          address: suggestion.description,
          place: suggestion.structured_formatting.main_text
        });
      });
  };

  const handleJoyrideCallback = (params) => {
    if (
      (params?.action === 'next' && params?.type === 'step:after') ||
      (params?.action === 'close' && params?.type === 'step:after')
    ) {
      onTrack(params?.action === 'next' ? 'coach mark initiated' : 'coach mark skipped', {
        page_location: fullPath,
        steps: params?.step?.title
      });
    }

    if (params?.lifecycle === 'complete') {
      if (params?.action === 'close') {
        setShowCoachMark(false);
      }
    }
  };

  const triggerCoachMark = () => {
    const getCoachMarkPickup = Cookies.get('coachmark_location');

    if (!getCoachMarkPickup) {
      setShowCoachMark(true);
      Cookies.set('coachmark_location', true);
    } else {
      setShowCoachMark(false);
    }
  };

  const onCardClick = (item) => {
    onUserAddressClick(item);
  };

  const Tooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps
  }) => (
    <CoachMark
      step={step}
      index={index}
      continuous={continuous}
      backProps={backProps}
      closeProps={closeProps}
      primaryProps={primaryProps}
      tooltipProps={tooltipProps}
      totalSteps={coachMarkPickupLocSteps.length}
    />
  );

  const loading = times(5, (item) => <Skeleton key={item} width={'100%'} height={'100px'} />);

  useEffect(() => {
    onTrack('screen viewed', {
      screen_name: 'completing address',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  useEffect(() => {
    triggerCoachMark();
  }, []);

  const renderSuggestions = () =>
    data.map((suggestion, index) => {
      return (
        <div
          data-automation={`add_address_suggestion_${index}`}
          key={suggestion.place_id}
          onClick={() => handleClickSuggestion(suggestion)}>
          <div className="d-flex align-items-start mx-3 pointer">
            <div>
              <img src="/assets/icons/location-grey.svg" alt="location-grey" loading="lazy" />
            </div>
            <div className="ms-2 d-flex flex-column">
              <Text weight="semi-bold" className="text-xs">
                {suggestion.structured_formatting.main_text}
              </Text>
              <Text className="text-xxs">{suggestion.structured_formatting.secondary_text}</Text>
            </div>
          </div>

          <Divider type="bg-dark" />
        </div>
      );
    });

  return (
    <>
      <div className="mt-2">
        <div className="mx-3" id="coachMarkLocStep1">
          <InputGlobalSearch
            data-automation="add_address_input_search"
            placeholder="Masukkan kota/kecamatan"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div id="coachMarkLocStep2">
        <Divider type="bg-dark" />
        <div
          data-automation="add_address_current_location"
          className="mx-3 pointer"
          onClick={() => getLocationPermission()}>
          <img
            src="/assets/icons/current-location-grey.svg"
            height="20"
            width="20"
            alt="current-location"
            loading="lazy"
          />
          <Text weight="semi-bold" className="text-xs ms-2">
            Gunakan Lokasi Saat Ini
          </Text>
        </div>
        <Divider type="bg-dark" />
      </div>

      {data.length > 0 && renderSuggestions()}

      {data.length === 0 && !!value && (
        <EmptyState image="/assets/images/sorry.png" imageHeight={140} imgAlt="icon-sorry">
          <div className="d-flex flex-column">
            <Text color="dark" weight="semi-bold">
              Ups! Pencarian tidak ditemukan
            </Text>
            <Text color="dark" className="text-xs mt-3 mx-2">
              Coba ulangi pencarianmu dengan memasukkan kata kunci lain
            </Text>
          </div>
        </EmptyState>
      )}

      {isFetchingAddress && <div className="m-3">{loading}</div>}

      {!isFetchingAddress && addressList?.length > 0 && (
        <div className="pb-3">
          <div className="m-3">
            <Text weight="bold">Daftar Alamat Saya</Text>
          </div>
          {addressList?.map((item, index) => (
            <div
              data-automation={`user_address_${index}`}
              key={item.id}
              onClick={() => onCardClick(item)}>
              <div className="d-flex align-items-start mx-3 pointer">
                <div>
                  <img src="/assets/icons/location-grey.svg" alt="location-grey" loading="lazy" />
                </div>
                <div className="ms-2 d-flex flex-column">
                  <Text weight="semi-bold d-block mb-2 mt-1" className="text-xs">
                    {item?.label || '-'}
                  </Text>
                  <Text className="text-xxs">{item?.address1}</Text>
                  <Text className="text-xxs mt-2">{item?.address2}</Text>
                </div>
              </div>

              <Divider type="bg-dark" />
            </div>
          ))}
        </div>
      )}

      <CustomModal
        show={modalLocPermission}
        title="Oops!"
        caption="Lokasimu tidak terdeteksi. Silakan aktifkan lokasi lewat Pengaturan di browser kamu."
        submitButton="Tutup"
        submitButtonColor="secondary"
        onSubmit={() => setModalLocPermission(false)}
      />

      <Joyride
        continuous={true}
        disableOverlay={false}
        disableScrollParentFix={true}
        disableOverlayClose={true}
        run={showCoachMark}
        steps={coachMarkPickupLocSteps}
        styles={coachMarkStyles}
        locale={coachMarkLocale}
        callback={handleJoyrideCallback}
        tooltipComponent={Tooltip}
      />
    </>
  );
};

export default AddressViewSearch;
