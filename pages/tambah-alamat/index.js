import AddressViewInput from '@components/add-address/AddressViewInput';
import AddressViewMap from '@components/add-address/AddressViewMap';
import AddressViewSearch from '@components/add-address/AddressViewSearch';
import PrivateLayout from '@components/layouts/PrivateLayout';
import CustomModal from '@components/modal/CustomModal';
import { Text } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Screen() {
  const router = useRouter();
  const { edit, origin, package_id, workshop, variant_car_id, product_id } = router.query;

  const [view, setView] = useState('search');
  const [addressSuggestion, setAddressSuggestion] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [editValue, setEditValue] = useState('');
  const [addressList, setAddressList] = useState({});
  const [showOutOfRange, setShowOutOfRange] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const { isAuthenticated, authenticate, token } = useAuth();

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const submitAddress = async (location) => {
    const params = {
      label: location?.label || '',
      address1: location?.address,
      address2: location?.detail || '',
      latitude: location?.lat,
      longitude: location?.lng,
      is_selected: true,
      id: Number(edit) || ''
    };

    Cookies.set('user_address', params, { expires: 1, path: '/' });

    if (isAuthenticated) {
      try {
        const response = edit
          ? await api.put(`v2/account/address/${edit}/`, params)
          : await api.post('v2/account/address/', params);
        console.log(response?.status);
      } catch (error) {
        console.log(error);
      }
    }

    router.back();
  };

  const handleClickAddress = (address) => {
    setAddressSuggestion({
      lat: address?.lat,
      lng: address?.lng,
      address: address?.address,
      id: Number(edit) || ''
    });
    setPlaceName(address?.place);
    setView('map');
  };

  const handleSelectLoc = (address) => {
    if (edit) {
      handleInputLoc(address);
    } else if (origin === 'wdp') {
      const payload = {
        latitude: address?.lat,
        longitude: address?.lng,
        address1: address?.address
      };
      handleUserAddressClick(payload);
    } else {
      setAddressSuggestion(address);
      submitAddress(address);
    }
  };

  const handleInputLoc = (address) => {
    let values;
    if (edit) {
      values = {
        lat: address?.lat,
        lng: address?.lng,
        address: address?.address,
        detail: editValue?.detail,
        label: editValue?.label
      };
    } else {
      values = address;
    }

    setAddressSuggestion(values);
    setView('input');
  };

  const handleAddLoc = (address) => {
    if (origin === 'wdp') {
      const payload = {
        label: address?.label || '',
        address1: address?.address,
        address2: address?.detail || '',
        latitude: address?.lat,
        longitude: address?.lng,
        is_selected: true,
        id: ''
      };
      handleUserAddressClick(payload);
    } else {
      setAddressSuggestion(address);
      submitAddress(address);
    }
  };

  const handleBackClick = () => {
    if (view === 'input') {
      setView('map');
    } else if (view === 'map') {
      setView('search');
    } else {
      router.back();
    }
  };

  const trackEvent = (eventName, eventProps) => {
    amplitude.getInstance().logEvent(eventName, eventProps);
  };

  const getDetailAddress = async (id) => {
    try {
      const response = await api.get(`v2/account/address/${id}/`);
      const address = response?.data?.data;
      const payload = {
        lat: Number(address?.latitude),
        lng: Number(address?.longitude),
        address: address?.address1,
        detail: address?.address2,
        label: address?.label
      };
      setEditValue(payload);
      setAddressSuggestion(payload);
      handleClickAddress(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserAddressList = async () => {
    authenticate(token);
    setIsFetchingAddress(true);
    try {
      const response = await api.get('v2/account/address/');
      setIsFetchingAddress(false);
      setAddressList(response?.data?.data);
    } catch (err) {
      setIsFetchingAddress(false);
      console.log(err);
    }
  };

  const handleClickOutOfRangeModal = (isDatangKeBengkel) => {
    if (isDatangKeBengkel) {
      router.push({
        pathname: '/konfirmasi-order',
        query: {
          package_id: package_id,
          workshop: workshop
        }
      });
    } else {
      setView('search');
      setShowOutOfRange(false);
    }
  };

  const handleUserAddressClick = async (item) => {
    Cookies.set('user_address', item, { expires: 1, path: '/' });

    const params = {
      location: item?.latitude + ',' + item?.longitude,
      variant_car_id: variant_car_id,
      product_id: product_id,
      package_id: package_id,
      workshop_slug: workshop
    };

    try {
      const response = await api.get('v2/pudo/is-workshop-eligible/', { params });
      if (response?.data?.data?.is_eligible) {
        router.push({
          pathname: '/konfirmasi-order',
          query: {
            package_id: package_id,
            workshop: workshop,
            location: item?.latitude + ',' + item?.longitude,
            otoklix_go: true
          }
        });
      } else {
        setShowOutOfRange(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (edit) {
      getDetailAddress(edit);
    }
  }, [edit]);

  useEffect(() => {
    if (origin === 'wdp' && isAuthenticated) {
      getUserAddressList();
    }
  }, [origin, isAuthenticated]);

  return (
    <PrivateLayout
      title="Tambah Alamat | Otoklix"
      description=""
      metaRobots="noindex"
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      <div
        className={`py-3 px-3 d-flex align-items-center header-promo ${
          view === 'map' ? 'mb-0' : ' '
        }`}
        role="presentation"
        data-automation="add_address_back_button">
        {/*   eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions*/}
        <img
          src="/assets/icons/arrow-left-thin.svg"
          alt="arrow-left-thin"
          loading="lazy"
          className="pointer"
          onClick={() => handleBackClick()}
        />
        <Text weight="semi-bold" className="ms-4">
          {view === 'search'
            ? 'Masukkan Alamat'
            : view === 'map'
            ? 'Tentukan Titik Lokasimu'
            : 'Detail Alamat'}
        </Text>
      </div>

      {view === 'search' && (
        <AddressViewSearch
          onClickAddress={handleClickAddress}
          onTrack={trackEvent}
          fullPath={fullPath}
          origin={origin}
          addressList={addressList}
          isFetchingAddress={isFetchingAddress}
          onUserAddressClick={(item) => handleUserAddressClick(item)}
        />
      )}

      {view === 'map' && addressSuggestion && (
        <div className="add-address__map">
          <AddressViewMap
            center={{ lat: addressSuggestion?.lat, lng: addressSuggestion?.lng }}
            geoLocation={addressSuggestion}
            place={placeName}
            fullPath={fullPath}
            onClose={() => setView('search')}
            onConfirm={handleSelectLoc}
            onInput={handleInputLoc}
            onTrack={trackEvent}
          />
        </div>
      )}

      {view === 'input' && (
        <AddressViewInput
          location={addressSuggestion}
          onConfirm={handleAddLoc}
          fullPath={fullPath}
          onTrack={trackEvent}
          isEdit={edit ? true : false}
        />
      )}

      <CustomModal
        show={showOutOfRange}
        imageUrl="/assets/images/workshop-not-found.png"
        title="Ups! Lokasimu di Luar Jangkauan"
        titleClass="text-md"
        caption="Tapi tenang! Kamu masih bisa melanjutkan order ini dengan datang langsung ke bengkel ya! "
        submitButton="Datang Ke Bengkel Aja"
        cancelButton="Pilih Alamat Lainnya"
        onSubmit={() => handleClickOutOfRangeModal(true)}
        onCancel={() => handleClickOutOfRangeModal()}
      />
    </PrivateLayout>
  );
}

export default Screen;
