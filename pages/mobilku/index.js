import CardNewCar from '@components/car/CardNewCar';
import NewCar from '@components/car/NewCar';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { AbsoluteWrapper, Button, Container, Header, Spinner } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { use100vh } from 'react-div-100vh';

sentryBreadcrumb('pages/mobilku/index');

export const config = {
  unstable_runtimeJS: false
};

const ListMyCar = () => {
  const router = useRouter();
  const height = use100vh();

  const { redirectPath, redirectQuery } = router.query;
  const { token, authenticate, isAuthenticated } = useAuth();

  const [carList, setCarList] = useState([]);
  const [hasNewCar, setHasNewCar] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeCar, setActiveCar] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);

  const getCarList = async () => {
    setIsFetching(true);
    authenticateAPI(token);
    authenticate(token);

    const response = await api.get('v2/garage/');
    setCarList(response.data.data);

    setIsFetching(false);
  };

  const handleBackClick = () => {
    if (redirectPath) {
      let finalQuery = JSON.parse(redirectQuery);
      if (activeCar?.car_details?.id) {
        finalQuery.variant_car_id = activeCar?.car_details?.id;
      }

      router.replace({
        pathname: redirectPath,
        query: finalQuery
      });
    } else {
      router.back();
    }
  };

  const setDefaultCar = async (id) => {
    authenticateAPI(token);

    const response = await api.put(`v2/garage/car/${id}/set-as-default/`);
    const dataCarList = response.data.data;

    if (dataCarList) {
      authenticate(token);
    }

    setCarList(dataCarList);

    const defaultCarIndex = dataCarList.map((arrayItem) => arrayItem.id).indexOf(id);
    setActiveCar(dataCarList[defaultCarIndex]);

    Cookies.set('user_car', dataCarList[defaultCarIndex], { path: '/' });
    Cookies.set('car_changed', true, { path: '/' });

    handleBackClick();
  };

  const handleClickButtonScroll = (actMenu) => {
    const elm = document.getElementById(actMenu);

    elm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleOnScrollUpdate = (pos) => {
    const { scrollTop } = pos;
    if (scrollTop > 500) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const loader = (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" />
    </div>
  );

  useEffect(() => {
    getCarList();
  }, []);

  return (
    <PrivateLayout
      isAuthenticated={isAuthenticated}
      hasAppBar={false}
      handleUpdate={handleOnScrollUpdate}>
      <div style={{ minHeight: height }}>
        <div id="top" />
        {hasNewCar ? (
          <NewCar closeHasNewCar={() => setHasNewCar(false)} callbackAfterCreate={getCarList} />
        ) : (
          <>
            <Header title="Mobilku" onBackClick={handleBackClick} className="border-bottom" />

            {isFetching ? (
              loader
            ) : (
              <>
                <Container
                  className={`wrapper-content d-flex flex-column pb-100 justify-content-center${
                    carList?.length === 0 ? 'align-items-center' : ''
                  }`}>
                  {carList?.length > 0 ? (
                    carList.map((carListItem, index) => (
                      <CardNewCar
                        key={carListItem.id}
                        data={carListItem}
                        setDefaultCar={setDefaultCar}
                        index={index}
                      />
                    ))
                  ) : (
                    <span>Tidak ada mobil tersedia</span>
                  )}
                </Container>

                <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom">
                  <Button
                    id="button_add_car"
                    className="p-3"
                    block
                    color="primary"
                    type="submit"
                    data-automation="button_mobilku_tambah_mobil"
                    onClick={() => setHasNewCar(true)}>
                    Tambah Mobil
                  </Button>
                </AbsoluteWrapper>
              </>
            )}
          </>
        )}
        <div
          className={`otobuddy scroll-top-btn-mycar ${showScrollButton ? '' : 'hide-buddy'}`}
          onClick={() => handleClickButtonScroll('top')}>
          <img src="/assets/icons/arrow-to-top.svg" alt="scroll to top" />
        </div>
      </div>
    </PrivateLayout>
  );
};

export default ListMyCar;
