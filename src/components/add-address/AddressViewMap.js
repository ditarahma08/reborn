import { fetchSearchWorkshopList } from '@actions/Search';
import PinMapLocation from '@components/map/PinMapLocation';
import PinShop from '@components/map/PinShop';
import CustomModal from '@components/modal/CustomModal';
import { Button, Text } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { gmapConfig } from '@utils/Constants';
import { getAddressLocation } from '@utils/geoCode';
import GoogleMapReact from 'google-map-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';

const GMAP_KEY = process.env.GMAP;

const AddressViewMap = (props) => {
  const { center, geoLocation, place, fullPath, onClose, onConfirm, onInput, onTrack } = props;
  const {
    setValue,
    suggestions: { data }
  } = usePlacesAutocomplete();
  const router = useRouter();
  const isEdit = router?.query?.edit || '';

  const [mapZoom, setMapZoom] = useState(15);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapGeoLoc, setMapGeoLoc] = useState(geoLocation);
  const [showPinCenter, setShowPinCenter] = useState(true);
  const [showPinHover, setShowPinHover] = useState(false);
  const [placeName, setPlaceName] = useState(place);
  const [firstLoad, setFirstLoad] = useState(true);
  const [modalLocPermission, setModalLocPermission] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadMap, setIsLoadMap] = useState(false);

  const setupCoord = () => {
    let locations = [];

    workshops.forEach((value) => {
      locations.push({
        lat: Number(value.latitude),
        lng: Number(value.longitude),
        text: value.name,
        hash: value
      });
    });

    return locations;
  };

  const coord = setupCoord();

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      const addressLocation = getAddressLocation(lat, lng, true);
      addressLocation.then((response) => {
        setMapGeoLoc(response);
        setMapCenter({ lat: response?.lat, lng: response?.lng });
        setMapZoom(15);
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
      setFirstLoad(false);
      navigator.geolocation.getCurrentPosition(
        () => getCurrentLocation(),
        () => setModalLocPermission(true)
      );
    }
  };

  const getWorkshopList = async () => {
    const main = {
      page: 1,
      product_id: router?.query?.product_id,
      lat: mapGeoLoc?.lat,
      lng: mapGeoLoc?.lng,
      variant_car_id: router?.query?.variant_car_id,
      is_pudo: true
    };

    try {
      const response = await fetchSearchWorkshopList(main);
      setWorkshops(response);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleBoundsChange = ({ center, zoom }) => {
    setMapZoom(zoom);
    setMapCenter(center);
    const addressLocation = getAddressLocation(center?.lat, center?.lng, true);
    addressLocation.then((response) => {
      setMapGeoLoc(response);
      setValue(response?.address);
    });
  };

  const handleDrag = () => {
    setFirstLoad(false);
    setShowPinCenter(false);
    setShowPinHover(true);
  };

  const handleDragEnd = () => {
    setIsLoadMap(true);
    /* setShowPinHover(false);
    setTimeout(() => {
      setShowPinCenter(true);
    }, 500) */
  };

  const handleConfirmLoc = () => {
    onTrack('user address saved', { user_address_label: placeName || mapGeoLoc?.address });
    onConfirm(mapGeoLoc);
  };

  const handleManualInput = () => {
    onTrack('form initiated', {
      cta_location: 'bottom',
      form_name: 'manual user address from',
      page_location: fullPath
    });
    onInput(mapGeoLoc);
  };

  const detectMobileBrowser = () => {
    const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /Windows Phone/i];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  };

  useEffect(() => {
    onTrack('screen viewed', {
      screen_name: 'choose pin point location',
      screen_category: 'browse',
      page_location: fullPath
    });
    setIsMobile(detectMobileBrowser());
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      setIsLoadMap(false);
      if (data.length > 0) {
        setPlaceName(data[0].structured_formatting.main_text);
      } else {
        setPlaceName('');
      }
    }
  }, [data]);

  useEffect(() => {
    getWorkshopList();
  }, [mapGeoLoc]);

  return (
    <>
      <GoogleMapReact
        options={gmapConfig}
        bootstrapURLKeys={{ key: GMAP_KEY }}
        defaultZoom={15}
        zoom={mapZoom}
        center={mapCenter}
        onChange={handleBoundsChange}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}>
        {showPinCenter && <PinMapLocation {...mapGeoLoc} text={'Current Location'} />}

        {coord.map((value, index) => {
          return <PinShop key={index} lat={value.lat} lng={value.lng} text={value.text} />;
        })}
      </GoogleMapReact>

      {showPinHover && <PinMapLocation hover mobile={isMobile} />}

      <div className="add-address__address-footer d-flex flex-column  w-100">
        <div className="d-flex justify-content-between p-1 mb-2">
          <Button
            data-automation="add_address_current_location_map"
            color="subtle"
            size="sm"
            className="d-flex align-items-center add-address__map-button"
            onClick={getLocationPermission}>
            <img
              src="/assets/icons/current-location.svg"
              alt="current-location"
              height="13"
              width="13"
              loading="lazy"
              className="me-1"
            />
            <Text color="dark">Gunakan lokasi saat ini</Text>
          </Button>
          <Button
            data-automation="add_address_search_again"
            color="subtle"
            size="sm"
            className="add-address__map-button"
            onClick={onClose}>
            <img
              src="/assets/icons/search-thin.svg"
              alt="current-location"
              height="13"
              width="13"
              loading="lazy"
              className="me-1 "
            />
            <Text color="dark">Cari Ulang</Text>
          </Button>
        </div>

        <div className="bg-white d-flex flex-column p-3">
          <div className="my-2">
            {isLoadMap ? (
              <>
                <Skeleton className="square" width="80px" height="10px" />
                <Skeleton className="square" width="100%" height="10px" />
                <Skeleton className="square" width="50%" height="10px" />
              </>
            ) : (
              <>
                <Text weight="semi-bold" className="text-sm d-block">
                  {placeName}
                </Text>
                <Text className="text-xxs mb-2" color="black-md">
                  {mapGeoLoc?.address}
                </Text>
              </>
            )}
          </div>
          <Button
            data-automation="add_address_button_confirm"
            className="my-2"
            onClick={handleConfirmLoc}>
            Konfirmasi
          </Button>
          {!isEdit && (
            <Button
              data-automation="add_address_button_manual_input"
              outline
              className="mb-2"
              onClick={handleManualInput}>
              Detail Lainnya (Optional)
            </Button>
          )}
        </div>
      </div>

      <CustomModal
        show={modalLocPermission}
        title="Oops!"
        caption="Lokasimu tidak terdeteksi. Silakan aktifkan lokasi lewat Pengaturan di browser kamu."
        submitButton="Tutup"
        submitButtonColor="secondary"
        onSubmit={() => setModalLocPermission(false)}
      />
    </>
  );
};

export default AddressViewMap;
