// /* eslint-disable */
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  AbsoluteWrapper,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Container,
  Divider,
  Text
} from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { BranchTracker } from '@utils/BranchTracker';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import map from 'lodash/map';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';

sentryBreadcrumb('pages/thank-you/index');

const PaymentStatus = () => {
  const router = useRouter();
  const { booking_code, order_id, source } = router.query;
  let gTagLabel = '';
  let fullPath = '';

  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  if (source == 'landing') gTagLabel = 'landing-page';
  const { token } = useAuth();

  const [data, setData] = useState({});
  const [paymentIndicator, setPaymentIndicator] = useState('primary');
  const [paymentLabel, setPaymentLabel] = useState({
    title: 'Sukses',
    subtitle: 'Terus gunakan aplikasi Otoklix dan nikmati keuntungannya!'
  });
  const [bookingCode, setBookingCode] = useState(booking_code || order_id);
  const [isLoading, setLoading] = useState(false);

  const fetchPaymentStatus = async () => {
    authenticateAPI(token);

    const response = await api.get(`v2/bookings/${bookingCode}/revamp`);
    return response.data.data;
  };

  const prepareInitialData = async () => {
    setLoading(true);

    await fetchPaymentStatus()
      .then((res) => {
        if (!res?.is_first_view) {
          window.fbq('track', 'Purchase', {
            currency: 'IDR',
            value_total_cart_price: `${res?.packages[0].total_price}.00`,
            value_user_pay: `${res?.total_price}.00`,
            package_name: res?.packages[0]?.name,
            product_name: map(res?.packages[0]?.package_details, 'name'),
            payment_method: res?.payment_details?.provider,
            content_type: 'product'
          });
        }
        BranchTracker('PURCHASE', {
          currency: 'IDR',
          value_total_cart_price: res?.packages[0].total_price,
          value_user_pay: res?.total_price,
          package_name: res?.packages[0]?.name,
          product_name: map(res?.packages[0]?.package_details, 'name'),
          payment_method: res?.payment_details?.provider
        });
        const paymentDetails = res?.payment_details;
        setData(res);
        assignPaymentIndicator(paymentDetails);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const goToOrderDetail = () => {
    router.push(`order/${bookingCode}`);
  };

  const goToHome = () => {
    router.push('/servis');
  };

  const handleOpenOtobuddy = () => {
    if (typeof window !== 'undefined') {
      const chatId = document.getElementById('fc_frame');
      if (chatId) {
        window.fcWidget.open();
      }
    }
  };

  const assignPaymentIndicator = (paymentDetails) => {
    if (
      paymentDetails?.status === 'settlement' ||
      (paymentDetails?.status === 'pending' && paymentDetails?.method_type === 'offline')
    ) {
      setPaymentIndicator('primary');

      if (paymentDetails?.method_type === 'offline') {
        setPaymentLabel({
          title: 'Menunggu Bayar',
          subtitle: 'Jangan lupa bayar di bengkel sesuai dengan invoice ya'
        });
      } else {
        setPaymentLabel({
          title: 'Sukses',
          subtitle: 'Terus gunakan aplikasi Otoklix dan nikmati keuntungannya!'
        });
      }
    } else {
      setPaymentIndicator('danger');
      setPaymentLabel({
        title: 'Gagal',
        subtitle: 'Silahkan coba lagi atau hubungi OtoBuddy jika butuh bantuan ya'
      });
    }
  };

  const renderWrapperClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'sukses':
        return 'success';
      case 'gagal':
        return 'fail';
      default:
        return 'success';
    }
  };

  const renderWrapperImage = (status) => {
    switch (status?.toLowerCase()) {
      case 'sukses':
        return 'icons/receipt.svg';
      case 'gagal':
        return 'images/logout.png';
      default:
        return 'icons/receipt.svg';
    }
  };

  useEffect(() => {
    if (bookingCode) {
      prepareInitialData();

      gtag('view thank you page', 'viewThankYouPage', gTagLabel);

      amplitude.getInstance().logEvent('screen viewed', {
        screen_name: 'order thank you',
        screen_category: 'purchase',
        page_location: fullPath
      });
    }
  }, [bookingCode]);

  useEffect(() => {
    if (booking_code) setBookingCode(booking_code);
    if (order_id) setBookingCode(order_id);
  }, [booking_code, order_id]);

  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="max-height-screen login-layout">
      <Div100vh>
        {data?.payment_details?.status === 'pending' &&
        data?.payment_details?.method_type !== 'offline' ? (
          <Container className="m-auto d-flex justify-content-center align-items-center flex-column">
            <img src="/assets/images/sent.png" alt="payment-check" height={130} className="mb-3" />

            <div className="d-flex flex-column text-center mb-3">
              <Text weight="bold" className="mb-3">
                Sedang Memeriksa <br /> Transaksimu
              </Text>

              <Text className="text-xxs">
                Tunggu sebentar ya! Kami sedang memeriksa transaksimu. Notifikasi akan segera muncul
                setelah proses ini selesai
              </Text>
            </div>
          </Container>
        ) : (
          <>
            <Container
              className={`thank-you__header d-flex justify-content-between align-items-center py-3 pb-5 ${renderWrapperClass(
                paymentLabel?.title
              )}${isLoading ? ' px-4' : ''}`}>
              {isLoading ? (
                <Skeleton height={143} width={132.15} className="me-2 mb-0" />
              ) : (
                <img
                  src={`/assets/${renderWrapperImage(paymentLabel?.title)}`}
                  alt=""
                  className="me-2"
                  width={143}
                />
              )}
              <p className="d-flex flex-column">
                {isLoading ? (
                  <Skeleton width={220} height={24} />
                ) : (
                  <Text className="mb-2 mb-0" weight="bold">
                    {`${data?.payment_details?.method_type === 'offline' ? '' : 'Pembayaran '}${
                      paymentLabel?.title
                    }${paymentLabel?.title?.toLowerCase() === 'gagal' ? '!' : ''}`}
                  </Text>
                )}
                {isLoading ? (
                  <Skeleton width={185} height={24} />
                ) : (
                  <Text>{paymentLabel?.subtitle}</Text>
                )}
              </p>
            </Container>

            <Container className="thank-you__body px-4">
              <Card className="detail-order">
                <CardBody>
                  <Text color="label" weight="bold" className="text-sm">
                    Rincian Pembayaran
                  </Text>

                  <div className="mt-4 thank-you__body__detail-wrapper">
                    {isLoading ? (
                      <Skeleton height={18} className="mb-2" />
                    ) : (
                      data?.packages?.map((item, index) => (
                        <div className="text-xs d-flex justify-content-between my-2" key={index}>
                          <Text className="label">{Helper.shortenName(item?.name)}</Text>
                          <Text className="ms-3 text-nowrap">
                            Rp{Helper.formatMoney(item?.total_price)}
                          </Text>
                        </div>
                      ))
                    )}

                    <div className="text-xs d-flex justify-content-between my-2">
                      {isLoading ? (
                        <Skeleton height={18} className="mb-2" />
                      ) : (
                        <>
                          <Text className="label">{`Potongan Harga${
                            data?.promo?.promo_code ? ` (${data?.promo?.promo_code})` : ''
                          }`}</Text>
                          <Text className="text-nowrap">
                            -Rp{Helper.formatMoney(data?.discount_promo)}
                          </Text>
                        </>
                      )}
                    </div>

                    <div className="text-xs d-flex justify-content-between my-2">
                      {isLoading ? (
                        <Skeleton height={18} className="mb-2" />
                      ) : (
                        <>
                          <Text className="label">OtoPoints</Text>
                          <Text className="text-nowrap">
                            -{Helper.formatMoney(data?.otopoints_used)}
                          </Text>
                        </>
                      )}
                    </div>

                    <Divider type="bg-dark" />

                    <div className="text-xs d-flex justify-content-between my-2">
                      {isLoading ? (
                        <Skeleton height={18} className="mb-2" />
                      ) : (
                        <>
                          <Text className="label">Total</Text>
                          <Text weight="bold" color="secondary" className="text-nowrap">
                            Rp{Helper.formatMoney(data?.total_price)}
                          </Text>
                        </>
                      )}
                    </div>

                    <Divider type="bg-dark" />

                    <div className="text-xxs d-flex justify-content-between align-items-end my-2">
                      {isLoading ? (
                        <Skeleton height={36} />
                      ) : (
                        <>
                          <div className="d-flex flex-column">
                            <Text weight="bolder" className="mb-1">
                              Metode Pembayaran
                            </Text>
                            <Text weight="bolder" className="label">
                              {data?.total_price > 0
                                ? data?.payment_details?.method_name ?? '-'
                                : 'Gratis'}
                            </Text>
                          </div>

                          <img
                            src={
                              data?.total_price > 0
                                ? data?.payment_details?.method_icon_link
                                : '/assets/icons/promo-blue.svg'
                            }
                            height={15}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {(data?.payment_details?.method_type !== 'offline' && data?.total_point_get > 0) ||
                (!paymentLabel?.title.toLowerCase() === 'gagal' && (
                  <Card className="card-info-otopoints p-2">
                    <CardTitle className="mb-2">Total OtoPoints akan didapatkan</CardTitle>
                    <CardSubtitle className="text-primary">{`+${Helper.formatMoney(
                      data?.total_point_get
                    )} Points`}</CardSubtitle>
                  </Card>
                ))}
            </Container>
          </>
        )}

        <AbsoluteWrapper
          bottom
          className="wrapper-fixed-bottom thank-you__bottom-sheet shadow-none">
          {isLoading ? (
            <>
              <Skeleton height={48} className="rounded-pill" />
              <Skeleton height={48} className="rounded-pill mt-4 mb-0" />
            </>
          ) : paymentLabel?.title?.toLowerCase() === 'gagal' ? (
            <>
              <Button color={paymentIndicator} block onClick={goToOrderDetail}>
                Cek Lagi Order Saya
              </Button>
              <Button
                color={paymentIndicator}
                className="mt-4"
                block
                outline
                onClick={handleOpenOtobuddy}>
                Hubungi OtoBuddy
              </Button>
            </>
          ) : (
            <>
              <Button color={paymentIndicator} block onClick={goToOrderDetail}>
                Cek Order Saya
              </Button>
              <Button color={paymentIndicator} className="mt-4" block outline onClick={goToHome}>
                Ke Beranda
              </Button>
            </>
          )}
        </AbsoluteWrapper>
      </Div100vh>
    </PrivateLayout>
  );
};

export default PaymentStatus;
