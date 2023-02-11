/* eslint-disable no-self-assign */
import NewCar from '@components/car/NewCar';
import CardGarageItem from '@components/card/CardGarageItem';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Button, Container, Header, Modal, Spinner } from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import { trendingSettings } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { use100vh } from 'react-div-100vh';
import Slider from 'react-slick';

sentryBreadcrumb('pages/garasi/index');

const Garasi = () => {
  const router = useRouter();
  const height = use100vh();

  const { authenticate, token, isAuthenticated } = useAuth();

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [hasNewCar, setHasNewCar] = useState(false);

  async function fetchGarage() {
    authenticate(token);
    const response = await api.get('v2/garage/');
    setLoadingData(false);
    setData(response.data.data);
  }

  const slickSettings = () => {
    return {
      ...trendingSettings,
      variableWidth: data.length > 1 ? true : false,
      className: `slider variable-width ${data.length > 1 ? '' : 'garage-slider'}`
    };
  };

  useEffect(() => {
    fetchGarage();
  }, []);

  return (
    <PrivateLayout
      title="Mobilmu | Otoklix"
      description=""
      metaRobots="noindex"
      isAuthenticated={isAuthenticated}
      hasAppBar={false}>
      <Modal isOpen={hasNewCar} className="wrapper wrapper-xs modal-no-shadow">
        <NewCar closeHasNewCar={() => setHasNewCar(false)} callbackAfterCreate={fetchGarage} />
      </Modal>
      <Header title="Garasi" onBackClick={() => router.push('/account')} />

      <div style={{ minHeight: height }}>
        <Container className="wrapper-content">
          <div className="d-flex mb-4 box-add-car-garage">
            <div className="flex-grow-1">
              <h6>Garasi</h6>
              <span>Daftar Mobil Kamu</span>
            </div>
            <div className="flex-shrink-0">
              <Button
                id="button_add_car"
                size="sm"
                onClick={() => setHasNewCar(!hasNewCar)}
                data-automation="garage_button_add_car">
                Tambah Mobil
              </Button>
            </div>
          </div>
          {loadingData && (
            <div className="d-flex justify-content-center p-3">
              <Spinner color="primary" />
            </div>
          )}
          {data.length > 0 && (
            <Slider {...slickSettings()}>
              {data.map((car) => {
                let licensePlate = car.license_plate || '';
                let carName =
                  car?.car_details?.car_model?.model_name + ' ' + car?.car_details?.variant;

                if (licensePlate.indexOf(' ') == -1) {
                  try {
                    const plateNumbers = licensePlate.match(/([0-9])+/g)[0];
                    licensePlate = licensePlate.replace(plateNumbers, ` ${plateNumbers} `);
                  } catch {
                    licensePlate = licensePlate;
                  }
                }

                return (
                  <CardGarageItem
                    key={car.id}
                    style={{ width: 280 }}
                    title={car.car_details.car_model.brand.name}
                    subtitle={`${carName} ${licensePlate.trim() ? '|' : ''} ${licensePlate}`}
                    hasAdditionalBadge={car.is_selected === 1}
                    additionalText="Utama"
                    detailImageLink={car.car_details.car_model.image_link}
                    detailButtonClick={() => router.push(`/garasi/${car.id}`)}
                    healthData={car?.car_health}
                    dataAutomationDetailButton="garage_button_detail_car"
                    data-automation="garage_card_car"
                  />
                );
              })}
            </Slider>
          )}
          <br />
          <br />
          <br />
        </Container>
      </div>
    </PrivateLayout>
  );
};

export default Garasi;
