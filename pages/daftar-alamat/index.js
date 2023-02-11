import AddressCard from '@components/add-address/AddressCard';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { AbsoluteWrapper, Button, Container, Text } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import { times } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AddressList = () => {
  const router = useRouter();
  const { token, authenticate } = useAuth();
  const [addressList, setAddressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [temporaryAddress, setTemporaryAddress] = useState({});

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const handleBackClick = () => {
    router.push({
      pathname: `/cari/pilih-bengkel`,
      query: {
        ...router.query,
        from_address: true
      }
    });
  };

  const getUserAddressList = async (getDefaultAddress) => {
    authenticate(token);
    setIsLoading(true);

    try {
      const response = await api.get('v2/account/address/');
      setAddressList(response?.data?.data);
      getTemporaryAddress(response?.data?.data);
      if (getDefaultAddress && response?.data?.data.length > 0) {
        handleChangeTemporaryAddress(response?.data?.data[0]);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getTemporaryAddress = (addressList) => {
    const getAddress = Cookies.get('user_address');
    let userAddress = getAddress ? JSON.parse(getAddress) : {};
    userAddress = addressList.find((item) => item.id === userAddress?.id);

    if (!userAddress) {
      userAddress = addressList[0];
    }

    setTemporaryAddress(userAddress);
  };

  const handleChangeTemporaryAddress = (item, instantChange) => {
    Cookies.set('user_address', item, { expires: 1, path: '/' });
    setTemporaryAddress(item);
    if (instantChange) {
      handleBackClick();
    }
  };

  const loading = times(4, (item) => <Skeleton key={item} width={'100%'} height={'200px'} />);

  const handleDeleteAddress = async (id) => {
    authenticateAPI(token);
    api
      .delete(`v2/account/address/${id}/`)
      .then(() => {
        getUserAddressList(true);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeDefaultAddress = async (id) => {
    authenticateAPI(token);
    api
      .put(`v2/account/address/${id}/default/`)
      .then(() => {
        getUserAddressList();
      })
      .catch((err) => console.log(err));
  };

  const handleAddAddress = () => {
    const { lat, lng, next, product_id, promo, variant_car_id } = router.query;

    router.push({
      pathname: `/tambah-alamat`,
      query: {
        lat,
        lng,
        next,
        product_id,
        promo,
        variant_car_id
      }
    });
  };

  const handleEditAddress = (id) => {
    router.push({
      pathname: `/tambah-alamat`,
      query: {
        ...router.query,
        edit: id
      }
    });
  };

  useEffect(() => {
    getUserAddressList();
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'address list',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  return (
    <PrivateLayout
      title="Daftar Alamat | Otoklix"
      description=""
      metaRobots="noindex"
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      <div
        className="py-3 px-3 d-flex align-items-center z-index-100 sticky-top clear-header header-promo"
        role="presentation"
        data-automation="list_address_back_button">
        <div className="pointer" onClick={() => handleBackClick()}>
          <img src="/assets/icons/arrow-left-thin.svg" alt="arrow-left-thin" loading="lazy" />
        </div>
        <Text weight="semi-bold" className="ms-4">
          Daftar Alamat
        </Text>
      </div>

      <Container className="pb-5 mb-4">
        <div>
          {isLoading
            ? loading
            : addressList?.map((item) => {
                const isTemporaryAddress = temporaryAddress?.id === item?.id ? true : false;
                return (
                  <div key={item?.id}>
                    <AddressCard
                      id={item?.id}
                      onCardClick={() => handleChangeTemporaryAddress(item, true)}
                      label={item?.label}
                      address={item?.address1}
                      addressDetail={item?.address2}
                      isDefault={item?.is_selected}
                      onClickEditAddress={handleEditAddress}
                      temporaryAddress={isTemporaryAddress}
                      handleDeleteAddress={handleDeleteAddress}
                      handleChangeAddress={handleChangeDefaultAddress}
                    />
                  </div>
                );
              })}
        </div>
      </Container>
      {addressList?.length < 10 && (
        <AbsoluteWrapper bottom className="shadow-none position-fixed wrapper-fixed-bottom">
          <Button size="md" data-automation="add_address_button" block onClick={handleAddAddress}>
            Tambah Alamat
          </Button>
        </AbsoluteWrapper>
      )}
    </PrivateLayout>
  );
};

export default AddressList;
