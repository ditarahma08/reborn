import CardConfirmationOrderNew from '@components/card/CardConfirmationOrderNew';
import PrivateLayout from '@components/layouts/PrivateLayout';
import ModalSuccessCancelOrder from '@components/modal/ModalSuccessCancelOrder';
import {
  AbsoluteWrapper,
  Alert,
  Button,
  Col,
  Container,
  Divider,
  FormGroup,
  Header,
  Input,
  Label,
  Row,
  Text
} from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { gambirLocation } from '@utils/Constants';
import { assign } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';

const FormCancelOrder = () => {
  const router = useRouter();
  const { booking_code } = router.query;
  const { token } = useAuth();

  const [data, setData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setReason] = useState();
  const [loadingReason, setLoadingReason] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [showErrorInput, setErrorInput] = useState(false);
  const [showErrorSubmit, setErrorSubmit] = useState();
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [geoLocation, setGeoLocation] = useState({
    lat: gambirLocation.lat,
    lng: gambirLocation.lng
  });

  const fetchDetailBooking = async () => {
    setLoadingData(true);
    await api
      .get(`v2/bookings/${booking_code}/`)
      .then((res) => {
        setLoadingData(false);
        setData(res.data.data);
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  };

  const fetchCancelReason = async () => {
    setLoadingReason(true);
    await api
      .get('v2/bookings/cancel-reasons')
      .then((res) => {
        const dt = res.data.data;
        setLoadingReason(false);
        setReasons(dt);
        setReason(dt[0]?.id);
      })
      .catch((err) => {
        setLoadingReason(false);
        console.log(err);
      });
  };

  const onChangeReason = (e) => {
    if (e?.target?.value) {
      setReason(e.target.value);
    } else {
      setReason(e);
    }
  };

  const handleOtherReason = (e) => {
    setOtherReason(e.target.value);

    if (e.target.value.length < 10) {
      setErrorInput(true);
    } else {
      setErrorInput(false);
    }
  };

  const handleCancel = async () => {
    setLoadingSubmit(true);

    let params = {
      booking_code: data?.booking_code,
      booking_cancel_reason_id: selectedReason
    };

    if (selectedReason === 11) {
      assign(params, { booking_cancel_notes: otherReason });
    }

    await api
      .put('v2/bookings/cancel', params)
      .then(() => {
        if (showErrorInput) setErrorInput(false);
        setShowCancelSuccess(true);
        setLoadingSubmit(false);
      })
      .catch((err) => {
        let message = 'Terjadi kesalahan.';

        if (err?.response?.data?.error?.message === 'Booking cannot be canceled!')
          message = 'Booking tidak bisa dibatalkan!';
        setErrorSubmit(message);
        setLoadingSubmit(false);
        setTimeout(() => {
          setErrorSubmit();
        }, 3000);
      });
  };

  useEffect(() => {
    authenticateAPI(token);
    fetchCancelReason();

    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation({
        ...geoLocation,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);

  useEffect(() => {
    if (booking_code) fetchDetailBooking();
  }, [booking_code]);

  const disableSubmit =
    (loadingData && loadingReason) ||
    loadingSubmit ||
    (selectedReason === 11 && otherReason?.length < 10);

  return (
    <PrivateLayout hasAppBar={false}>
      <Div100vh>
        <Header
          title="Ajukan Pembatalan"
          onBackClick={() => router.back()}
          dataAutomationButton="batal_pesan_button_back"
        />

        <Divider type="page-divider mt-0" />

        <Container className="booking-info">
          <Text
            weight="bold"
            className="booking-info__title"
            tag="span"
            data-automation="batal_pesan_title">
            Ordermu
          </Text>
          <div className="mt-3">
            {!loadingData && data?.packages?.length > 0 ? (
              data?.packages?.map((packageItem, index) => (
                <div className="mb-3" key={index}>
                  <CardConfirmationOrderNew
                    parentData={data}
                    packages={packageItem}
                    dataAutomationPackage="batal_pesan_detail_package"
                  />
                </div>
              ))
            ) : (
              <Skeleton width={332} height={137} />
            )}
          </div>
        </Container>

        <Divider type="page-divider" />

        <Container className="cancel-reason">
          <Text className="cancel-reason__title">Alasan Pembatalan</Text>
          <div className="mt-4">
            {!loadingReason && reasons.length > 0 ? (
              reasons?.map((item, index) => (
                <FormGroup key={item?.id} check onClick={() => onChangeReason(item?.id)}>
                  <Input
                    name={item?.custapp_description}
                    value={item?.id}
                    type="radio"
                    checked={selectedReason === item?.id}
                  />{' '}
                  <Label check data-automation={`batal_pesan_reason_${index}`}>
                    {item?.custapp_description}
                  </Label>
                </FormGroup>
              ))
            ) : (
              <div className="d-flex">
                <Skeleton width={24} height={24} className="me-4" />
                <Skeleton width={212} height={22} />
              </div>
            )}
            {selectedReason === 11 && (
              <>
                <Input
                  className="mt-4"
                  placeholder="Alasan Lainnya"
                  type="textarea"
                  maxLength={300}
                  onChange={handleOtherReason}
                  data-automation="batal_pesan_other_reason"
                />
                {showErrorInput && (
                  <Alert className="mt-2" borderColor="danger" color="danger" textColor="white">
                    Alasan wajib diisi (min. 10 karakter).
                  </Alert>
                )}
              </>
            )}
          </div>
        </Container>

        <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom">
          <Row>
            <Col>
              <Button
                outline
                color="danger"
                size="sm"
                block
                onClick={() => router.back()}
                data-automation="batal_pesan_button_kembali">
                Kembali
              </Button>
            </Col>
            <Col>
              <Button
                color="danger"
                size="sm"
                block
                onClick={handleCancel}
                loading={loadingSubmit}
                disabled={disableSubmit}
                data-automation="batal_pesan_button_batalkan_order">
                Batalkan Order
              </Button>
            </Col>
          </Row>
        </AbsoluteWrapper>
      </Div100vh>

      <ModalSuccessCancelOrder isOpen={showCancelSuccess} workshopData={data?.workshop} />

      {!!showErrorSubmit && (
        <Alert
          floating={true}
          showClose={false}
          color="danger"
          borderColor="danger"
          textColor="white"
          className="mb-5 cancel-order">
          {showErrorSubmit}
        </Alert>
      )}
    </PrivateLayout>
  );
};

export default FormCancelOrder;
