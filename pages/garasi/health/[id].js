import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  Container,
  ContentWrapper,
  Header,
  Row,
  WidgetListItem
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/garasi/health/[id]');

const CarHealth = () => {
  const router = useRouter();

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [healthData, setHealthData] = useState([]);

  const licensePlate = data?.license_plate ? Helper.formatLicensePlate(data.license_plate) : '';
  const carName = data?.car_details?.car_model?.model_name + ' ' + data?.car_details?.variant;

  async function fetchCarDetail() {
    authenticateAPI(token);

    const response = await api.get(`v2/garage/car/${id}/`);
    setData(response.data.data);

    const responseHealth = await api.get(`v2/garage/car/${id}/health/`);
    setHealthData(responseHealth.data.data);
  }

  const handleColor = (color, condition) => {
    let defaultColor = 'body';

    if (!condition) {
      defaultColor = 'success';
    } else {
      if (color) {
        defaultColor = color;
      } else {
        defaultColor = 'body';
      }
    }

    return defaultColor;
  };

  useEffect(() => {
    fetchCarDetail();
  }, []);

  return (
    <PrivateLayout
      isAuthenticated={isAuthenticated}
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      <Header title="Kondisi Mobil" onBackClick={() => router.back()} />

      <Container className="wrapper-content">
        <Row>
          <div className="d-flex justify-content-center">
            <img width="320" src={data?.car_details?.car_model?.image_link} alt="" />
          </div>

          <ContentWrapper>
            <div className="d-flex flex-column">
              <h5 className="fw-bold">
                {data?.car_details?.car_model?.brand?.name}{' '}
                <img src="/assets/icons/verified-blue.svg" alt="" />
              </h5>
              <h5 className="text-secondary">{`${carName} ${
                licensePlate.trim() ? '|' : ''
              } ${licensePlate}`}</h5>
            </div>
          </ContentWrapper>
          <ContentWrapper title="Detail Kondisi" bodyClassName="table-gray-white">
            {healthData.map((value, index) => {
              const name = value.name.replace(/_/g, ' ');
              const color = handleColor(value?.color, value?.condition);

              return (
                <WidgetListItem
                  key={index}
                  titleClassName="text-capitalize"
                  title={name}
                  titleTruncate={true}
                  subtitle={
                    value?.condition === 0
                      ? 0
                      : value?.condition === null
                      ? 'None'
                      : value?.condition
                  }
                  subtitleClassName={`text-${color}`}
                />
              );
            })}
          </ContentWrapper>
        </Row>
      </Container>
    </PrivateLayout>
  );
};

export default CarHealth;
