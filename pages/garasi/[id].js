// import ModalCar from '@components/car/ModalCar';
import NewCar from '@components/car/NewCar';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Container,
  ContentWrapper,
  Header,
  Label,
  Row,
  WidgetListItem
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import { toInteger } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { BottomSheet } from 'react-spring-bottom-sheet';

sentryBreadcrumb('pages/garasi/[id]');

const DetailGarasi = () => {
  const router = useRouter();

  const [openCarModal, setOpenCarModal] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const licensePlate = data?.license_plate ? Helper.formatLicensePlate(data?.license_plate) : '';
  const carName = data?.car_details?.car_model?.model_name + ' ' + data?.car_details?.variant;

  async function fetchDetailGarage() {
    authenticateAPI(token);

    const response = await api.get(`v2/garage/car/${id}/`);
    setData(response.data.data);
    setLoadingData(false);

    const responseHealth = await api.get(`v2/garage/car/${id}/health/`);
    setHealthData(responseHealth.data.data);

    const responseService = await api.get(`v2/bookings/list/`, {
      params: {
        status: 'finish',
        page: 1,
        limit: 10,
        user_car_id: id
      }
    });

    setServiceData(responseService.data.data);
  }

  async function fetchBasicInfo() {
    const response = await api.get(`v2/garage/car/${id}/`);
    setData(response.data.data);
    setLoadingData(false);
  }

  async function removeCar() {
    setLoading(true);
    authenticateAPI(token);

    api
      .delete(`v2/garage/car/${id}/`)
      .then(() => {
        setLoading(false);
        router.push('/garasi');
      })
      .catch((e) => alert(e.response.data.error?.message));
  }

  useEffect(() => {
    fetchDetailGarage();
  }, []);

  const slickSettings = () => {
    return {
      arrows: false,
      dots: false,
      infinite: false,
      centerMode: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: serviceData.length > 1 ? true : false,
      className: `slider variable-width ${serviceData.length > 1 ? '' : 'garage-slider'}`
    };
  };

  const formatPointsGet = (service) => {
    /*
      First and Second case, directly display preserved data from Backend.
      It came from recently created bookings.
      Third case manually computes Otopoints for older bookings.
    */
    let totalPointGet;
    if (service?.total_point_get) {
      totalPointGet = service.total_point_get;
    } else if (service?.total_point_get == 0) {
      totalPointGet = 0;
    } else {
      totalPointGet = toInteger(service?.total_price / 100);
    }
    return `+${Helper.formatMoney(totalPointGet)} Otopoints`;
  };

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

  return (
    <PrivateLayout
      isAuthenticated={isAuthenticated}
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      {openCarModal ? (
        <NewCar
          title="Ubah Mobil"
          carData={data}
          closeHasNewCar={() => setOpenCarModal(false)}
          callbackAfterCreate={() => fetchBasicInfo()}
        />
      ) : (
        <>
          <Header
            title="Rincian Mobil"
            headerTextClassName="text-center"
            onBackClick={() => router.back()}
            rightImageId="button_edit_car"
            rightImageSrc="/assets/icons/edit.svg"
            rightImageClick={() => setOpenCarModal(true)}
          />

          <Container className="wrapper-content">
            <Row>
              <div className="d-flex justify-content-center">
                <img width="320" src={data?.car_details?.car_model?.image_link ?? ''} alt="" />
              </div>

              {!loadingData && (
                <ContentWrapper>
                  <div className="d-flex flex-column">
                    <h5 className="fw-bold">{data?.car_details?.car_model?.brand?.name ?? ''} </h5>
                    <h5 className="text-secondary">{`${carName} ${
                      licensePlate.trim() ? '|' : ''
                    } ${licensePlate}`}</h5>
                  </div>
                </ContentWrapper>
              )}

              <ContentWrapper title="Detail Informasi" bodyClassName="table-gray-white">
                <WidgetListItem title="Tahun" subtitle={data?.year ? data.year : '-'} />
                <WidgetListItem
                  title="Bahan Bakar"
                  subtitle={Helper.fuelConverter(data?.car_details?.fuel)}
                />
                <WidgetListItem
                  title="Transmisi"
                  subtitle={Helper.transmissionConverter(data?.transmission)}
                />
              </ContentWrapper>
              <ContentWrapper
                title="Kondisi Mesin Terkini"
                className="table-gray-white mt-4"
                subtitle="Detail Kondisi"
                subtitleClick={() => router.push({ pathname: `/garasi/health/${id}` })}
                dataAutomationSubtitle="garage_button_edit_car">
                {healthData.slice(0, 4).map((value, index) => {
                  const name = value?.name.replace(/_/g, ' ');
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
              <ContentWrapper
                title="Riwayat Service"
                className="table-gray-white mt-4"
                subtitle="Semua"
                subtitleClick={() => router.push({ pathname: `/garasi/service/${id}` })}
                dataAutomationSubtitle="garage_button_riwayat_service">
                <Slider {...slickSettings()}>
                  {serviceData.map((service) => {
                    return (
                      <Card key={service.booking_code} className="card-service">
                        <CardBody className="px-3 py-4 h-100">
                          <div>
                            <CardTitle className="mb-0">
                              {service?.user_car?.car_details?.car_model?.model_name}
                            </CardTitle>
                            <div className="text-date">{service?.booking_date}</div>
                          </div>
                          <div className="text-price">
                            <div className="">
                              {`Rp${Helper.formatMoney(service?.total_price)} `}
                              <span className="text-title-active">(Total)</span>
                            </div>
                            <div className="text-secondary">{formatPointsGet(service)}</div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </Slider>
              </ContentWrapper>
            </Row>
          </Container>
          <div className="p-3">
            <Button
              id="delete_car"
              block
              color="danger"
              size="md"
              onClick={() => setSheetOpen(true)}
              data-automation="garage_delete_car">
              Hapus Mobil
            </Button>
          </div>
        </>
      )}

      <BottomSheet
        open={sheetOpen}
        onDismiss={() => setSheetOpen(false)}
        footer={
          <div className="d-flex p-3">
            <div className="me-1 w-50">
              <Button
                color="danger"
                block
                outline
                onClick={() => setSheetOpen(false)}
                disabled={loading}
                data-automation="garage_button_cancel_delete_car">
                Tidak
              </Button>
            </div>
            <div className="ms-1 w-50">
              <Button
                color="danger"
                block
                onClick={() => removeCar()}
                disabled={loading}
                loading={loading}
                data-automation="garage_button_confirm_delete_car">
                Ya, Hapus
              </Button>
            </div>
          </div>
        }>
        <div className="p-3 text-center">
          <Label className="mb-3 fw-bold">Hapus Mobil</Label>
          <div>Apakah kamu yakin ingin hapus mobil ini dari garasi?</div>
        </div>
      </BottomSheet>
    </PrivateLayout>
  );
};

export default DetailGarasi;
