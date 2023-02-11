import CardConfirmationOrderNew from '@components/card/CardConfirmationOrderNew';
import DateTimePicker from '@components/datepicker/DateTimePicker';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  AbsoluteWrapper,
  Alert,
  Button,
  Container,
  EmptyState,
  FormGroup,
  Header,
  Input,
  Label,
  Spinner,
  Text
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { days } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/reschedule/index');

const Reschedule = () => {
  const router = useRouter();
  const { user, token } = useAuth();

  const [booking, setBooking] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [bookingErrMessage, setBookingErrMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [successReschedule, setSuccessReschedule] = useState(false);
  const [operatingHours, setOperatingHours] = useState({});
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const [rescheduleReasonOpt, setRescheduleReasonOpt] = useState([]);

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  const countHoursLimit = (minimumBookingTime, scheduleData) => {
    const day = scheduleData?.find((time) => {
      return time?.day === days[new Date(minimumBookingTime).getDay()];
    });
    const today = scheduleData?.find((time) => {
      return time?.day === days[new Date().getDay()];
    });

    setNewScheduleTime(`${day?.opening_hour}:00`);

    setSchedule({
      min: {
        openingHour: day?.opening_hour,
        closingHour: day?.closing_hour,
        isOpen: day?.is_open
      },
      today: {
        openingHour: today?.opening_hour,
        closingHour: today?.closing_hour,
        isOpen: today?.is_open
      }
    });
  };

  const fetchDetailBooking = async () => {
    setIsFetching(true);
    authenticateAPI(token);

    try {
      const response = await api.get(`v2/bookings/${id}/?with_operating_hours=1`);
      const responseData = response?.data?.data;
      const scheduleData = responseData?.workshop?.operating_hours?.schedule;
      const minimumBookingTimeData = responseData?.workshop?.operating_hours?.minimum_booking_time;
      setBooking(responseData);
      setOperatingHours(responseData?.workshop?.operating_hours);
      setNewScheduleDate(moment(minimumBookingTimeData).format('YYYY-MM-DD'));
      countHoursLimit(minimumBookingTimeData, scheduleData);
      setIsFetching(false);
      setHasError(false);
    } catch (e) {
      setHasError(true);
      const message = e?.response?.data?.error?.message || e?.message || 'Terjadi Kesalahan';
      setBookingErrMessage(message);
      setIsFetching(false);
    }
  };

  const fetchRescheduleReasons = async () => {
    try {
      const response = await api.get('v2/bookings/reschedule-reasons/');
      setRescheduleReasonOpt(response?.data?.data);
    } catch (e) {
      setIsFetching(false);
    }
  };

  const handleRescheduleTime = (time, type) => {
    if (type === 'date-changed') {
      setNewScheduleDate(moment(time).format('YYYY-MM-DD'));
      countHoursLimit(time, operatingHours?.schedule);
    } else {
      setNewScheduleTime(`${moment(time).hours()}:00:00`);
    }
  };

  const onSubmitReschedule = async () => {
    setIsLoading(true);
    setIsDisabled(true);

    const params = {
      new_time: `${newScheduleDate} ${newScheduleTime.replace('.', ':')}`,
      reason_id: rescheduleReason?.id,
      reason_value: rescheduleReason?.value
    };

    try {
      const response = await api.put(`v2/bookings/${id}/schedule/`, params);
      if (response?.status == 200) {
        setSuccessReschedule(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setSuccessReschedule(false);
      setIsLoading(false);
      setSubmitErrorMessage('Gagal mengubah jadwal booking.');
      setTimeout(() => {
        setSubmitErrorMessage('');
        setIsDisabled(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchDetailBooking();
    fetchRescheduleReasons();
  }, [user]);

  return (
    <PrivateLayout
      hasAppBar={false}
      wrapperClassName="wrapper-full refund-wrapper order-confirmation-wrapper pb-5">
      <Header className="refund-header" title="Ubah Jadwal" />

      {isFetching && (
        <div className="d-flex justify-content-center p-3">
          <Spinner size="lg" />
        </div>
      )}

      {!successReschedule && !isFetching && (
        <>
          {hasError && (
            <Container className="mt-2">
              <Alert borderColor="danger" textColor="danger" onClose={() => setHasError(false)}>
                {bookingErrMessage}
              </Alert>
            </Container>
          )}

          {!hasError && (
            <>
              <Container className="order-id-wrapper mt-3 py-3 px-4 bg-white">
                <div>
                  <span className="label">Order ID&nbsp;&nbsp;&nbsp;:</span>
                  <span className="order-id"> {booking?.booking_code || '-'}</span>
                </div>
              </Container>

              <Container className="bg-white p-3 mt-3">
                <Text color="label" weight="bold" className="text-md">
                  Ordermu
                </Text>

                <div className="mt-3 mb-4">
                  {booking?.packages?.length > 0 &&
                    booking.packages.map((packageItem, index) => (
                      <CardConfirmationOrderNew
                        parentData={booking}
                        packages={packageItem}
                        key={index}
                      />
                    ))}
                </div>

                <Text color="label" weight="bold" className="text-md">
                  Ubah jadwal ke:
                </Text>

                <div className="mt-3">
                  <DateTimePicker
                    value={newScheduleDate || operatingHours?.minimum_booking_time}
                    schedule={schedule}
                    onChange={handleRescheduleTime}
                    minimumDateTime={operatingHours?.minimum_booking_time}
                    disabledDates={operatingHours?.closed_dates}
                  />
                </div>
              </Container>

              <Container className="bg-white p-3 mt-3 pb-5">
                <Text color="label" weight="bold" className="text-md">
                  Alasan ingin ubah jadwal
                </Text>

                {rescheduleReasonOpt?.map((reason, index) => (
                  <FormGroup className="mt-3" check key={index}>
                    <Label>
                      <Input
                        className="input-radio me-2"
                        type="radio"
                        name="selectReason"
                        value={reason?.id}
                        checked={rescheduleReason?.id === reason?.id}
                        onChange={() => setRescheduleReason(reason)}
                      />
                      <Text className="text-sm ms-3">{reason?.value}</Text>
                    </Label>
                  </FormGroup>
                ))}
              </Container>

              <AbsoluteWrapper
                bottom
                className="position-fixed wrapper-fixed-bottom d-flex justify-content-between">
                <Button
                  color="primary"
                  className="me-2"
                  outline
                  size="sm"
                  block
                  onClick={() => router.back()}>
                  Kembali
                </Button>

                <Button
                  color="primary"
                  className="ms-2"
                  size="sm"
                  block
                  onClick={onSubmitReschedule}
                  loading={isLoading}
                  disabled={isDisabled || !rescheduleReason?.id}>
                  Ubah Jadwal
                </Button>
              </AbsoluteWrapper>
            </>
          )}
        </>
      )}

      {successReschedule && !isFetching && (
        <Container className="bg-white d-flex flex-grow-1 pt-4">
          <EmptyState
            image="/assets/images/sent.png"
            title="Jadwal Servismu Berhasil Diubah"
            titleColor="title"
            imgHeight={150}
            imgAlt="Success Reschedule">
            <Text color="dark">Silakan datang ke bengkel pada waktu yang sudah kamu tentukan</Text>
            <div className="mt-4">
              <Button
                color="primary"
                className="mb-4"
                size="md"
                block
                onClick={() => router.push(`/order/${id}`)}>
                Cek Ordermu
              </Button>

              <Button
                color="primary"
                outline
                size="md"
                block
                onClick={() => router.push('/servis')}>
                Kembali ke Home
              </Button>
            </div>
          </EmptyState>
        </Container>
      )}

      {submitErrorMessage && (
        <Container className="mt-5">
          <Alert
            floating={true}
            showClose={false}
            color="danger"
            borderColor="danger"
            textColor="white"
            className="mt-5">
            {submitErrorMessage}
          </Alert>
        </Container>
      )}
    </PrivateLayout>
  );
};

export default Reschedule;
