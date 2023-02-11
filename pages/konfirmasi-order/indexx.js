import ButtonPromo from '@components/button/ButtonPromo';
import CardConfirmationOrder from '@components/card/CardConfirmationOrder';
import PackageDetail from '@components/collapse/PackageDetail';
import DateTimePicker from '@components/datepicker/DateTimePicker';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { LottieCoin } from '@components/lottie/lottie';
import ConfirmationModal from '@components/modal/ConfirmationModal';
import PromoSearchModal from '@components/modal/PromoSearchModal';
import {
  AbsoluteWrapper,
  Alert,
  Button,
  Card,
  CardSubtitle,
  CardTitle,
  Container,
  Divider,
  FormGroup,
  Header,
  Input,
  Label
} from '@components/otoklix-elements';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { days } from '@utils/Constants';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { gtag } from '@utils/Gtag';
import GtmEvents from '@utils/GtmEvents';
import Helper from '@utils/Helper';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Toggle from 'react-toggle';

sentryBreadcrumb('pages/konfirmasi-order/index');

const KonfirmasiOrder = (props) => {
  const { operatingHoursData } = props;
  const router = useRouter();
  const { promo } = router.query;
  const { authenticate, token, user } = useAuth();

  const [dataOrderConfirmation, setDataOrderConfirmation] = useState({});
  const [promos, setPromos] = useState([]);
  const [dataSuccessSelectPromo, setDataSuccessSelectPromo] = useState({});
  const [selectedServiceReceived, setSelectedServiceReceived] = useState('now');
  const [useOtopoints, setUseOtopoints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPromoLoading, setIsPromoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasScheduledService, setHasScheduledService] = useState(false);
  const [hasModalConfirmation, setHasModalConfirmation] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasValidDate, setHasValidDate] = useState(true);
  const [forceLater, setForceLater] = useState(false);
  const [operatingHours, setOperatingHours] = useState({
    min: { openingHour: '09.00', closingHour: '18.00', isOpen: true },
    today: { openingHour: '09.00', closingHour: '18.00', isOpen: true }
  });

  const [laterDateTime, setLaterDateTime] = useState('');
  const [minimumBookingTime, setMinimumBookingTime] = useState('');

  const fetchOrderConfirmation = async () => {
    const response = await api.get('v2/cart/');
    const data = response.data.data;
    setDataOrderConfirmation(data);
    const minimumDateTime = data?.minimum_booking_time;
    setLaterDateTime(minimumDateTime);
    setMinimumBookingTime(minimumDateTime);
    countHoursLimit(minimumDateTime);
  };

  const handleLaterDateTime = (value, changeType) => {
    if (changeType == 'date-changed') {
      gtag('click jadwal booking', 'clickConfirmOrderPage', 'date');
    } else if (changeType == 'hour-changed') {
      gtag('click jadwal booking', 'clickConfirmOrderPage', 'time');
    }

    setLaterDateTime(value);

    changeType !== 'hour-changed' && countHoursLimit(value);
  };

  const fetchPromo = async () => {
    authenticateAPI(token);

    const response = await api.get('v2/promo/eligible-promo/');
    const promoData = response.data.data;
    if (promoData) {
      setPromos(promoData);
    }
  };

  const handleSelectService = (e) => {
    setSelectedServiceReceived(e.target.value);

    setHasScheduledService(e.target.value === 'later' ? true : false);

    if (e.target.value === 'now') {
      setLaterDateTime(minimumBookingTime);
    }

    countHoursLimit(minimumBookingTime);
  };

  const handleClickPromo = () => {
    if (Helper.isEmptyObj(dataSuccessSelectPromo)) {
      setOpenPromoModal(true);
    } else {
      if (isRemovable) {
        setDataSuccessSelectPromo({});
      }
    }
  };

  const calculateFinalAmounts = () => {
    let grandTotal = 0;
    let finalAmountOtopoints = 0;
    if (!Helper.isEmptyObj(dataSuccessSelectPromo)) {
      grandTotal = dataSuccessSelectPromo.discounted_total_price;
    } else {
      grandTotal = dataOrderConfirmation.grand_total;
    }

    if (useOtopoints) {
      if (grandTotal - user?.otopoints < 0) {
        finalAmountOtopoints = grandTotal;
        grandTotal = 0;
      } else {
        finalAmountOtopoints = user?.otopoints;
        grandTotal = grandTotal - user?.otopoints;
      }
    }

    return {
      grandTotal,
      finalAmountOtopoints
    };
  };

  const handleSelectVoucher = async (item) => {
    authenticateAPI(token);
    setIsPromoLoading(true);
    return await api
      .post('v2/promo/calculate-cart/', { promo_code: item.promo_code, input: item?.inputType })
      .then((res) => {
        const dataSelectVoucher = res.data.data;
        setOpenPromoModal(false);
        setHasError(false);
        setDataSuccessSelectPromo(dataSelectVoucher);
      })
      .catch(() => {
        setHasError(true);
        setErrorMessage(item.promo_code);
      })
      .finally(() => {
        setIsPromoLoading(false);
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    gtag('click checkout', 'clickConfirmOrderPage');
    GtmEvents.gtmCheckoutKonfirmasiOrder(dataOrderConfirmation);

    setIsLoading(true);

    let currentDateTime = moment();
    let bookingDateTime = moment(laterDateTime);
    let displayedDateTime = moment(laterDateTime);
    let finalDateTime;

    if (selectedServiceReceived == 'later') {
      displayedDateTime.set({ minutes: 0, seconds: 0 });
      if (displayedDateTime <= currentDateTime) {
        // case: current time = 16.25, 16 is still displayed in Hour Options
        // preserve minutes to have 16.56 instead of 16.00
        // 16.00 is before 16.25 and breaking Server Validation
        finalDateTime = bookingDateTime.set({ seconds: 0 });
      } else {
        // case: current time = 16.56, 16 is not displayed in Hour Options
        // the earliest hour will be 17.
        // remove minutes to have 17.00 instead of 17.26
        finalDateTime = bookingDateTime.set({ minutes: 0, seconds: 0 });
      }
    } else {
      // case: order now should add 30 minutes from now hour
      finalDateTime = bookingDateTime.add(30, 'minutes');
    }

    const params = {
      booking_datetime: finalDateTime.format('YYYY-MM-DD HH:mm:ss'),
      promo_code: dataSuccessSelectPromo?.promo_code || '',
      use_otopoints: useOtopoints,
      payment_method: 'offline',
      note: '',
      booking_origin: 'Web'
    };

    const response = await api.post('v2/bookings/cart/', params);
    const responseData = response.data.data;

    try {
      if (responseData) {
        router.push(
          {
            pathname: '/thank-you',
            query: {
              redirect_checkout: true,
              checkout_params: JSON.stringify(params),
              booking_code: responseData.booking_code,
              data_order: JSON.stringify(dataOrderConfirmation),
              user: JSON.stringify(user),
              select_promo: JSON.stringify(dataSuccessSelectPromo),
              amount_oto_points_used: finalAmountOtopoints,
              grand_total: grandTotal
            }
          },
          '/thank-you?booking_code=' + responseData.booking_code
        );
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const countHoursLimit = (date) => {
    const day = operatingHoursData?.data?.find((schedule) => {
      return schedule?.day === days[new Date(date).getDay()];
    });
    const today = operatingHoursData?.data?.find((schedule) => {
      return schedule?.day === days[new Date().getDay()];
    });
    setOperatingHours({
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

  const setCloseAlert = (opening, closing, isOpen) => {
    const maxBooking = parseInt(closing?.replace('.', ''));
    const minBooking = parseInt(opening?.replace('.', ''));
    const bookingHours = parseInt(moment().add(30, 'minutes').format('HH:mm').replace(':', ''));

    const diffOpen = minBooking - bookingHours;
    const diffClose = maxBooking - bookingHours;

    if (diffOpen > 30 || diffClose < 30 || !isOpen) {
      setHasValidDate(false);
      setForceLater(true);
      setSelectedServiceReceived('later');
      setHasScheduledService(true);
    } else {
      setHasValidDate(true);
      setForceLater(false);
    }
  };

  useEffect(() => {
    setCloseAlert(
      operatingHours?.today?.openingHour,
      operatingHours?.today?.closingHour,
      operatingHours?.today?.isOpen
    );
  }, [operatingHours]);

  useEffect(() => {
    authenticateAPI(token);
    fetchPromo();
    fetchOrderConfirmation();
    authenticate(token);

    gtag('view order and booking detail', 'viewConfirmOrderPage');

    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (promo) {
      const item = {
        promo_code: promo
      };

      handleSelectVoucher(item);
    }
  }, [promo]);

  useEffect(() => {
    if (selectedServiceReceived === 'later') {
      gtag('click pesan servis kapan', 'clickConfirmOrderPage');
    }
  }, [selectedServiceReceived]);

  const isRemovable = !dataSuccessSelectPromo?.is_campaign;
  const showBookingAlert = dataOrderConfirmation?.workshop?.tier?.value == 'tier_2';

  const { grandTotal, finalAmountOtopoints } = calculateFinalAmounts();

  if (hasMounted) {
    return (
      <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full workshop-detail-wrapper">
        <PromoSearchModal
          toggle={openPromoModal}
          promos={promos}
          isLoading={isPromoLoading}
          hasError={hasError}
          setHasError={setHasError}
          errorMessage={errorMessage}
          handleSelectVoucher={handleSelectVoucher}
          setToggle={() => setOpenPromoModal(!openPromoModal)}
        />

        <Header title="Konfirmasi Order" onBackClick={() => router.back()} />

        <Container className="wrapper-content pb-0">
          <CardConfirmationOrder
            imgSrc={
              user?.user_car
                ? user?.user_car?.car_details?.car_model?.image_link
                : '/assets/images/no-car.png'
            }
            title={user?.user_car?.car_details?.car_model?.model_name}
            subtitle={user?.user_car?.license_plate}
            onClickEdit={() => alert('on progress')}
          />

          <CardConfirmationOrder
            title="Bengkel"
            subtitle={dataOrderConfirmation?.workshop?.name}
            onClickEdit={() => alert('on progress')}
          />
        </Container>

        <Divider type="page-divider" />

        <Container className="wrapper-content py-3">
          <span className="rincian-paket">Rincian Paket / Servis</span>

          {dataOrderConfirmation?.packages?.length > 0 &&
            dataOrderConfirmation.packages.map((packageItem) => (
              <PackageDetail key={packageItem.id} packageItem={packageItem} />
            ))}
        </Container>

        <Divider type="page-divider" />

        <Container className="wrapper-content pb-0 pt-0">
          <span className="rincian-paket">Mau pesan service kapan?</span>

          {!hasValidDate && (
            <Alert
              className="my-3"
              borderColor="danger"
              textColor="danger"
              onClose={() => setHasValidDate(true)}>
              Sayangnya workshop sudah tutup. <br />
              Pesan untuk nanti dan pilih tanggal esok hari.
            </Alert>
          )}

          <FormGroup className="mt-2" check>
            <Label
              className="d-flex"
              check={selectedServiceReceived === 'now'}
              disabled={forceLater}>
              <Input
                defaultChecked={hasValidDate}
                className="input-radio me-2"
                type="radio"
                name="selectservice"
                value="now"
                checked={selectedServiceReceived === 'now'}
                onClick={handleSelectService}
                disabled={forceLater}
              />
              Pesan sekarang di Bengkel
            </Label>
          </FormGroup>

          <FormGroup className="mt-3 mb-4" check>
            <Label className="d-flex" check={selectedServiceReceived === 'later'}>
              <Input
                className="input-radio me-2"
                type="radio"
                name="selectservice"
                value="later"
                checked={selectedServiceReceived === 'later'}
                onClick={handleSelectService}
              />
              Pesan untuk nanti
            </Label>
          </FormGroup>
        </Container>

        {hasScheduledService && (
          <Container className="mb-4">
            <span className="rincian-paket mb-1">Jadwal Booking</span>

            <DateTimePicker
              value={laterDateTime}
              schedule={operatingHours}
              onChange={handleLaterDateTime}
              minimumDateTime={minimumBookingTime}
              disabledDates={dataOrderConfirmation?.operating_hours?.closed_dates}
            />

            {showBookingAlert && (
              <Card className="card-common-info p-2 mt-4">
                <CardTitle className="mb-3 text-success">
                  <img src="/assets/icons/exclamation-green.svg" /> Info
                </CardTitle>
                <CardSubtitle className="text-label">
                  Kami akan segera mengkonfirmasi ketersediaan servis kamu di bengkel ini maksimal
                  24 jam setelah kamu check out{' '}
                  <span role="img" aria-label="moce">
                    😉
                  </span>
                </CardSubtitle>
              </Card>
            )}
          </Container>
        )}

        <Divider type="page-divider" />

        <Container className="wrapper-content py-3">
          <div className="d-flex justify-content-between">
            <span className="d-flex align-items-center otopoints-use">
              Gunakan&nbsp;
              <span className="fw-bold text-secondary">
                {Helper.formatMoney(user?.otopoints)} OtoPoints
              </span>
            </span>

            <Toggle
              id="toggle_otopoints"
              checked={user?.otopoints > 0 ? useOtopoints : false}
              disabled={user?.otopoints < 1}
              icons={false}
              onChange={() => setUseOtopoints(!useOtopoints)}
            />
          </div>

          <div className="mt-3">
            <div className="rincian-paket mb-1">Pakai Promo</div>

            {hasError && (
              <Alert
                className="mt-2"
                borderColor="danger"
                textColor="danger"
                onClose={() => setHasError(false)}>
                Sayangnya, promo <b>{errorMessage}</b> tidak dapat digunakan
              </Alert>
            )}

            <ButtonPromo
              id="button_promo"
              className="mt-3"
              isActive={dataSuccessSelectPromo?.promo_code}
              promoCode={dataSuccessSelectPromo?.promo_code}
              promoCount={promos?.length}
              onClick={handleClickPromo}
              disabled={!isRemovable}
              leftImage="/assets/images/voucher.png"
              rightImage={
                dataSuccessSelectPromo?.promo_code
                  ? '/assets/icons/x-orange.svg'
                  : '/assets/icons/plus-orange.svg'
              }
            />
          </div>
        </Container>

        <Divider type="page-divider" />

        <Container
          className={`confirmation-order-summary ${
            Helper.isEmptyObj(dataSuccessSelectPromo) ? '' : 'pb-3'
          }`}>
          <div className="d-flex justify-content-between w-100 px-3 py-3">
            <span className="text-left">Biaya Servis</span>
            <span className="fs-7 fw-semi-bold">
              {dataOrderConfirmation.original_grand_total > dataOrderConfirmation.grand_total && (
                <span className="original-price me-2">
                  {`Rp${Helper.formatMoney(dataOrderConfirmation.original_grand_total)}`}
                </span>
              )}
              <span className="">
                {`Rp${Helper.formatMoney(dataOrderConfirmation.grand_total)}`}
              </span>
            </span>
          </div>

          {useOtopoints ? (
            <div className="d-flex justify-content-between w-100 px-3 pb-3">
              <span className="text-left">OtoPoints</span>
              <span className="fs-7 fw-semi-bold text-success">{`-Rp${Helper.formatMoney(
                finalAmountOtopoints
              )}`}</span>
            </div>
          ) : (
            ''
          )}

          {!Helper.isEmptyObj(dataSuccessSelectPromo) &&
          dataSuccessSelectPromo?.discount_amount > 0 ? (
            <div className="d-flex justify-content-between w-100 px-3 pb-3">
              <div className="">
                <div className="">Promo</div>
                <div className="promo-code">{dataSuccessSelectPromo?.promo_code}</div>
              </div>
              <div className="fs-7 fw-semi-bold text-success">
                {'-Rp'}
                {Helper.formatMoney(dataSuccessSelectPromo.discount_amount)}
              </div>
            </div>
          ) : (
            ''
          )}

          <hr className="my-0 mx-3" />

          <div className="d-flex justify-content-between align-items-center w-100 px-3 my-3 fw-bold fs-6">
            <span className="text-left text-dark">Total Tagihan</span>
            <span className="text-right text-secondary">{`Rp${Helper.formatMoney(
              grandTotal
            )}`}</span>
          </div>

          {Helper.isEmptyObj(dataSuccessSelectPromo) && (
            <div className="get-otopoints-wrapper pt-0 p-3">
              <div className="overline">Akan mendapatkan</div>
              <div className="d-flex align-items-center title">
                <LottieCoin />
                <div className="ms-1">{`+${Helper.formatMoney(
                  Helper.OtopointsCalc(grandTotal)
                )} Points`}</div>
              </div>
            </div>
          )}

          <div className="margin-behind-footer" />
        </Container>

        <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column">
              <span className="text-total-tagihan">Total Tagihan</span>
              <span className="text-jumlah-total-tagihan">
                {`Rp${Helper.formatMoney(grandTotal)}`}
              </span>
            </div>
            <Button
              id="button_checkout"
              color="secondary"
              size="sm"
              type="submit"
              onClick={onSubmit}
              loading={isLoading}
              disabled={isLoading}>
              Check Out
            </Button>
          </div>
        </AbsoluteWrapper>

        <ConfirmationModal
          isOpen={hasModalConfirmation}
          onCancel={() => setHasModalConfirmation(false)}
          onOK={() => router.push('/mobilku')}
        />
      </PrivateLayout>
    );
  }

  return null;
};

export default KonfirmasiOrder;

export async function getServerSideProps({ query }) {
  const { workshop } = query;

  const operatingHoursRes = await fetch(
    `${process.env.API_URL}v2/workshops/${workshop}/operating_hours/`
  );

  const operatingHoursData = await operatingHoursRes.json();

  return {
    props: {
      operatingHoursData
    }
  };
}
