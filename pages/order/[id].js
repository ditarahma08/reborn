import BookingBadge from '@components/badge/BookingBadge';
import OrderDetailCollapse from '@components/collapse/OrderDetailCollapse';
import PrivateLayout from '@components/layouts/PrivateLayout';
import ModalCheckPaymentStatus from '@components/modal/ModalCheckPaymentStatus';
import ModalPayment from '@components/modal/ModalPayment';
import {
  AbsoluteWrapper,
  Button,
  Card,
  CardListMedia,
  CardSubtitle,
  CardTitle,
  Container,
  ContentWrapper,
  Divider,
  Header,
  Spinner,
  Tags,
  Text,
  WidgetListItem
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import { useCountdown } from '@utils/useCountdown';
import amplitude from 'amplitude-js';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/order/[id]');

const ordersDetail = () => {
  const router = useRouter();
  const { authenticate, token, isAuthenticated } = useAuth();
  let { id } = router.query;
  let fullPath = '';

  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
    fullPath = window.location.href;
  }

  const [booking, setBooking] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [openModalPayment, setModalPayment] = useState(false);
  const [openModalPaymentStatus, setModalPaymentStatus] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [paymentStatusBadge, setBadge] = useState('light');
  const [isSettlement, setIsSettlement] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const { minutes, seconds } = useCountdown(moment(booking?.payment_details?.expired_at));

  const carNameDetail = (booking) => {
    // prettier-ignore
    return `${booking?.user_car?.license_plate || ''} | ${booking?.user_car?.car_details?.car_model?.brand?.name} ${booking?.user_car?.car_details?.car_model?.model_name} ${booking?.user_car?.car_details?.variant} ${Helper.transmissionConverter(booking?.user_car?.transmission, '')} ${Helper.fuelConverter(booking?.user_car?.car_details?.fuel, '')}`;
  };

  async function fetchDetailBooking() {
    setIsFetching(true);
    authenticateAPI(token);

    const response = await api.get(`v2/bookings/${id}/revamp/`);
    const data = response.data.data;

    setBooking(data);
    renderPaymentStatus(data?.payment_details?.status);
    setIsFetching(false);
  }

  const fetchCheckPayment = async () => {
    await api
      .get(`v2/payment/${booking?.booking_code}/status`)
      .then((res) => {
        if (res?.data?.data === 'settlement' && booking && !isSettlement) {
          setIsSettlement(true);
          GtmEvents.gtmPurchaseOrder(booking);
        }
        if (res?.data?.data !== 'pending') {
          onBoom();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBoom = () => {
    if (booking) fetchDetailBooking();
    setModalPayment(false);
    setModalPaymentStatus(false);
  };

  const toggleModalPayment = () => {
    setModalPayment(!openModalPayment);
  };

  const toggleModalPaymentStatus = () => {
    setModalPaymentStatus(!openModalPaymentStatus);
  };

  const handleClickPay = () => {
    if (
      booking?.payment_details?.method_type === 'gopay' ||
      booking?.payment_details?.status === 'pending'
    ) {
      window.location.assign(booking?.payment_details?.deeplink);
    }

    fetchCheckPayment();
    toggleModalPaymentStatus();
  };

  const reInitPayment = async () => {
    await api
      .post(`v2/bookings/pay/checkout`, { booking_code: booking?.booking_code })
      .then((res) => {
        setPaymentStatus(res?.data?.data?.payment_hook_token);

        if (res?.data?.data?.payment_hook_token === 'payment status updated') {
          setModalPayment(true);
          fetchCheckPayment();
          renderPaymentStatus('pending');
        } else {
          router.push(res?.data?.data?.web_view_url);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickPayNow = () => {
    setLoadingSubmit(true);
    authenticate(token);

    if (!booking?.payment_details?.status && !paymentStatus) {
      reInitPayment();
      setLoadingSubmit(false);
      return;
    }

    toggleModalPayment();
    fetchCheckPayment();
    setLoadingSubmit(false);
  };

  const renderPaymentStatus = (paymentStatus) => {
    if (paymentStatus === 'pending') {
      setBadge('secondary');
    } else if (paymentStatus === 'settlement') {
      setBadge('success');
    } else {
      setBadge('danger');
    }
  };

  useEffect(() => {
    fetchDetailBooking();
  }, []);

  useEffect(() => {
    let interval;
    if (booking?.payment_details?.status === 'pending') {
      interval = setInterval(() => {
        fetchCheckPayment();
      }, 10000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [booking?.payment_details?.status]);

  useEffect(() => {
    if (minutes < 1 && seconds < 1) {
      setTimeout(() => {
        onBoom();
      }, 2000);
    }
  }, [minutes, seconds]);

  useEffect(() => {
    amplitude.getInstance().logEvent('screen viewed', {
      screen_name: 'order details',
      screen_category: 'browse',
      page_location: fullPath
    });
  }, []);

  const handleCheckInvoice = () => {
    amplitude.getInstance().logEvent('order invoice viewed', {
      booking_code: booking?.booking_code,
      booking_status: booking?.booking_status?.name
    });

    router.push(`/order/invoice/${booking?.booking_code}`);
  };

  const showConfirmationTime =
    booking?.booking_status?.slug == 'waiting' && booking?.maximum_confirmation_time;

  const renderStatusText = booking?.payment_details?.status_name
    ? booking?.payment_details?.status_name
    : paymentStatus
    ? 'Menunggu Pembayaran'
    : booking?.payment_details?.status;

  let maximumTimeFormatted = false;
  if (showConfirmationTime) {
    maximumTimeFormatted = moment(booking?.maximum_confirmation_time).format('D MMMM YYYY, HH:mm');
  }

  return (
    <PrivateLayout
      isAuthenticated={isAuthenticated}
      hasAppBar={false}
      wrapperClassName="wrapper-full">
      <Header title="Rincian Transaksi" onBackClick={() => router.push('/order')} />

      {isFetching ? (
        <div className="d-flex justify-content-center p-3">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Container className="order-content">
            <CardListMedia
              title="Kode Booking"
              subtitle={booking?.booking_code}
              iconLeftImage="/assets/icons/files.svg"
              iconLeftBgColor="primary-light"
            />

            <CardListMedia
              className="mt-3"
              title="Total Pembayaran"
              subtitle={`Rp${Helper.formatMoney(booking?.total_price)}`}
              iconLeftImage="/assets/icons/money.svg"
              iconLeftBgColor="secondary-light"
            />

            <Button block className="mt-3" color="secondary" onClick={handleCheckInvoice} size="sm">
              Lihat Invoice
            </Button>

            {booking?.is_refundable && (
              <Button
                block
                className="mt-3"
                color="secondary"
                onClick={() => router.push(`/refund/${booking?.booking_code}`)}
                outline
                size="sm">
                Ajukan Refund
              </Button>
            )}
          </Container>

          <Container className="order-content">
            <ContentWrapper noBottomMargin title="Rincian Pembayaran">
              {booking?.packages.map((item, index) => (
                <OrderDetailCollapse key={index} item={item} />
              ))}

              {booking?.promo?.promo_code || booking?.otopoints_used > 0 ? (
                <Divider type="dash" />
              ) : null}

              {booking?.otopoints_used > 0 && (
                <WidgetListItem
                  className="mt-1"
                  title="OtoPoints"
                  titleClassName="text-secondary fw-normal fs-7"
                  subtitle={
                    booking?.otopoints_used
                      ? `-${Helper.formatMoney(booking?.otopoints_used)}`
                      : '0'
                  }
                  subtitleColor="secondary"
                  subtitleClassName="fs-7 fw-normal"
                />
              )}

              {booking?.promo?.promo_code && (
                <WidgetListItem
                  className="mt-1"
                  title={`Promo (${booking?.promo?.promo_code})`}
                  titleClassName="text-secondary fw-normal fs-7"
                  subtitle={`-Rp${Helper.formatMoney(booking?.discount_promo)}`}
                  subtitleColor="secondary"
                  subtitleClassName="fs-7 fw-normal"
                />
              )}

              <Divider type="dash" />

              <WidgetListItem
                title="Total"
                titleClassName="text-label fw-normal fs-6"
                subtitle={`Rp${Helper.formatMoney(booking?.total_price)}`}
                subtitleColor="title-active"
                subtitleClassName="fs-6"
              />
            </ContentWrapper>
          </Container>

          <Container className="order-content py-4">
            <ContentWrapper noBottomMargin title="Informasi Umum">
              <CardListMedia
                title="Status Transaksi"
                titleClassName="text-placeholder fs-8"
                subtitle={<BookingBadge status={booking?.booking_status?.slug} />}
              />
              <CardListMedia
                className="mt-4"
                title="Detail Mobil"
                titleClassName="text-placeholder fs-8"
                subtitle={carNameDetail(booking)}
                subtitleClassName="text-body fw-normal fs-7"
              />
              <CardListMedia
                className="mt-4"
                title="Tanggal Servis"
                titleClassName="text-placeholder fs-8"
                subtitle={`${moment(booking?.booking_datetime).format(
                  'dddd, DD MMM YYYY - HH:mm'
                )} WIB`}
                subtitleClassName="text-body fw-normal fs-7"
              />
              <CardListMedia
                className="mt-4"
                title="Metode Pembayaran"
                titleClassName="text-placeholder fs-8"
                subtitle={
                  booking?.total_price < 1 ? 'Gratis' : booking?.payment_details?.method_name ?? '-'
                }
                subtitleClassName="text-body fw-normal fs-7 text-capitalize"
              />
              {booking?.payment_details?.method_name && (
                <CardListMedia
                  className="mt-4"
                  title="Status Pembayaran"
                  titleClassName="text-placeholder fs-8"
                  subtitle={
                    renderStatusText ? (
                      <Tags
                        pill
                        color={paymentStatusBadge}
                        size="sm"
                        tag="span"
                        title={renderStatusText}
                      />
                    ) : (
                      '-'
                    )
                  }
                  subtitleClassName="text-body fw-normal fs-7 text-capitalize"
                />
              )}
            </ContentWrapper>
            {showConfirmationTime && (
              <Card className="card-info-otopoints mt-4 mb-2 p-2">
                <CardTitle className="mb-1 fs-8 text-light-dark">
                  Order Akan Dikonfirmasi Sebelum
                </CardTitle>
                <CardSubtitle className="mt-0 text-secondary fw-normal">
                  {maximumTimeFormatted}
                </CardSubtitle>
              </Card>
            )}
            {booking?.service_type?.value === 'pickup_dropoff' && (
              <>
                <CardListMedia
                  className="mt-4"
                  title="Alamat"
                  titleClassName="text-placeholder fs-8"
                  subtitle={
                    <div className="d-flex flex-column">
                      <Text tag="span" weight="weight-600">
                        {booking?.service_type?.customer_address?.label}
                      </Text>
                      <Text tag="span" className="font-xs">
                        {`${booking?.service_type?.customer_address?.address1}`}
                      </Text>
                      {booking?.service_type?.customer_address?.address2 && (
                        <Text tag="span" className="font-xs mt-2">
                          {`${booking?.service_type?.customer_address?.address2}`}
                        </Text>
                      )}
                    </div>
                  }
                  subtitleClassName="text-body fw-normal fs-7 text-capitalize"
                />
                <CardListMedia
                  className="mt-4"
                  title="Tipe Servis"
                  titleClassName="text-placeholder fs-8"
                  subtitle={booking?.service_type?.name}
                  subtitleClassName="text-primary fw-weight-600 fs-7 text-capitalize"
                />
              </>
            )}
          </Container>
          <Container className="order-content pb-100">
            <ContentWrapper noBottomMargin title="Detail Bengkel">
              <CardListMedia
                title={
                  <span>
                    {booking?.workshop?.name}{' '}
                    <img src={booking?.workshop?.tier?.image_link} height={14} width={14} />
                  </span>
                }
                titleClassName="text-title-active fs-7 fw-weight-600"
                subtitle={
                  <a
                    href={booking?.workshop?.gmaps_link}
                    className="fw-weight-600 open-map-link pointer"
                    target="_blank"
                    rel="noreferrer">
                    {booking?.workshop?.street_address}
                    <img className="ms-1" src="/assets/icons/open-new-link.svg" alt="" />
                  </a>
                }
                subtitleClassName="text-label fw-normal fs-7"
                leftImage={
                  booking?.workshop?.image_link
                    ? booking?.workshop?.image_link
                    : '/assets/images/noimage.png'
                }
              />
            </ContentWrapper>
          </Container>

          <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom">
            <div className="d-flex">
              {(booking?.payment_details?.status === 'pending' ||
                !booking?.payment_details?.status) &&
              booking?.payment_details?.provider !== 'offline' ? (
                <Button
                  block
                  className="p-3 ms-2"
                  color="secondary"
                  type="submit"
                  size="sm"
                  loading={loadingSubmit}
                  disabled={loadingSubmit}
                  onClick={handleClickPayNow}>
                  Bayar Sekarang
                </Button>
              ) : (
                <Button
                  className="p-3 btn btn-secondary btn-sm d-block w-100"
                  onClick={Helper.openOtobuddy}>
                  Hubungi Otobuddy
                </Button>
              )}
            </div>
          </AbsoluteWrapper>
        </>
      )}

      <ModalPayment
        isOpen={openModalPayment}
        toggle={toggleModalPayment}
        onClickButton={handleClickPay}
        data={booking}
      />

      <ModalCheckPaymentStatus isOpen={openModalPaymentStatus} toggle={toggleModalPaymentStatus} />
    </PrivateLayout>
  );
};

export default ordersDetail;
