import BookingBadge from '@components/badge/BookingBadge';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Collapse,
  Icon,
  Spinner,
  Text
} from '@components/otoklix-elements';
import OrderButtonSheet from '@components/sheet/OrderButtonSheet';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import { first } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CardOrder = (props) => {
  const {
    badgeStatus,
    title,
    subtitle,
    info,
    rightImage,
    total_price,
    packages,
    maximumTime,
    addReview,
    isReviewed,
    isMultiplePackage,
    paymentMethod,
    workshopSlug,
    expiredPaymentTime,
    paymentType,
    index
  } = props;

  const router = useRouter();
  const { token } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [openButtonListSheet, setOpenButtonListSheet] = useState(false);
  const [isConfirmDone, setIsConfirmDone] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleDismissSheet = () => {
    setOpenButtonListSheet(false);
  };

  const handleOpenChat = () => {
    sendAmplitudeEvent();

    if (typeof window !== 'undefined') {
      const chatId = document.getElementById('fc_frame');
      if (chatId) {
        window.fcWidget.open();
      }
    }
  };

  const getTruncateValue = (status) => {
    let value;

    if (status === 'complain') {
      value = 36;
    } else if (status === 'payment') {
      value = 30;
    } else {
      value = 100;
    }

    return value;
  };

  const handleReorder = async () => {
    authenticateAPI(token);

    sendAmplitudeEvent();

    router.push({
      pathname: '/konfirmasi-order',
      query: {
        package_id: first(packages)?.id,
        workshop: workshopSlug
      }
    });
  };

  const infoTime = () => {
    let time;

    if (badgeStatus === 'payment' && paymentMethod === 'online' && paymentType) {
      time = (
        <Text className="fw-bold ms-1 time text-end">
          {expiredPaymentTime[0]}
          <br />
          {expiredPaymentTime[1]} WIB
        </Text>
      );
    } else {
      time = '';
    }

    return time;
  };

  const paymentTypeInfo = () => {
    let type;

    if (badgeStatus === 'payment' && paymentMethod === 'online' && paymentType) {
      if (paymentType?.toLowerCase()?.includes('virtual account')) {
        type = `VA ${paymentType.replace('Virtual Account', '')}`;
      } else if (paymentType?.toLowerCase()?.includes('tunai')) {
        type = 'Offline';
      } else {
        type = paymentType;
      }
    }

    return type;
  };

  const getStatusOrderInfo = () => {
    let info;
    const extraInfo = paymentTypeInfo();

    if (
      badgeStatus === 'payment' &&
      paymentMethod === 'offline' &&
      paymentType?.toLowerCase()?.includes('tunai')
    ) {
      info = <Text className="confirmation-info d-block">Jangan lupa bayar dibengkel ya</Text>;
    } else if (badgeStatus === 'payment' && paymentMethod === 'offline' && !paymentType) {
      info = <Text className="confirmation-info d-block">Silakan pilih metode pembayaran</Text>;
    } else if (badgeStatus === 'payment' && paymentMethod === 'online' && paymentType) {
      info = (
        <Text className="confirmation-info d-block">
          Bayar melalui <b>{extraInfo}</b> sebelum
        </Text>
      );
    } else {
      info = (
        <Text
          className="confirmation-info d-block"
          data-automation={`order_list_helper_text_${index}`}>
          {Helper.truncateText(Helper.infoPaymentOrder(badgeStatus, extraInfo), truncate)}
        </Text>
      );
    }

    return info;
  };

  const reInitPayment = async () => {
    await api
      .post(`v2/bookings/pay/checkout`, { booking_code: title })
      .then((res) => {
        router.push(res?.data?.data?.web_view_url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmDone = async () => {
    setIsConfirmDone(true);

    sendAmplitudeEvent();

    await api
      .put(`v2/bookings/${title}/finished-confirmation/`)
      .then(() => {
        setIsConfirmDone(false);
        router.push(`order/${title}`);
      })
      .catch((err) => {
        setIsConfirmDone(false);
        console.log(err);
      });
  };

  const isShowMaxTime = badgeStatus == 'waiting' && maximumTime;

  const buttonList = Helper.exploreOrderButtonList(badgeStatus, title); //get button array for bottomsheet

  const orderCardButton = Helper.exploreOrderButton(badgeStatus, title); //get button for order card

  const truncate = getTruncateValue(badgeStatus);

  let maximumTimeFormatted = false;
  if (isShowMaxTime) {
    maximumTimeFormatted = moment(maximumTime).format('DD-MM-YYYY, HH:mm');
  }

  const handleRedirect = () => {
    sendAmplitudeEvent();

    if (orderCardButton?.url === 'to_payment' && !paymentType) {
      reInitPayment();
      return;
    }

    if (orderCardButton?.url === 'to_payment' && paymentType) {
      router.push(`/order/${title}`);
      return;
    }

    if ((badgeStatus === 'finish' && isReviewed) || badgeStatus === 'cancel') {
      handleReorder();
      return;
    }

    router.push(orderCardButton?.url);
  };

  const sendAmplitudeEvent = () => {
    amplitude.getInstance().logEvent('order action initiated', {
      booking_code: title,
      action_type: orderCardButton?.name
    });
  };

  const handleButtonOrder = () => {
    let button;

    if (badgeStatus === 'finish' && !isReviewed) {
      button = (
        <Button
          data-automation="order_list_button_review"
          block
          className="ms-3"
          color="secondary"
          size="sm"
          onClick={addReview}>
          Beri Ulasan
        </Button>
      );
    } else if ((badgeStatus === 'finish' && isReviewed) || badgeStatus === 'cancel') {
      button = (
        <Button
          data-automation="order_list_button_reorder"
          block
          className="ms-3"
          color="secondary"
          size="sm"
          onClick={isMultiplePackage ? handleOpenChat : handleReorder}>
          {orderCardButton?.name}
        </Button>
      );
    } else if (badgeStatus === 'service-done') {
      button = (
        <Button
          data-automation="order_list_button_confirm"
          block
          className="ms-3"
          color="secondary"
          size="sm"
          disabled={isConfirmDone}
          onClick={handleConfirmDone}>
          {isConfirmDone ? <Spinner color="primary" size="sm" /> : orderCardButton?.name}
        </Button>
      );
    } else {
      button = (
        <Button
          data-automation={
            badgeStatus === 'waiting' || badgeStatus === 'on-process'
              ? 'order_list_button_detail'
              : badgeStatus === 'payment'
              ? 'order_list_button_payment'
              : badgeStatus === 'confirm'
              ? 'order_list_button_verif'
              : 'order_list_button_complain'
          }
          block
          className="ms-3"
          color="secondary"
          size="sm"
          onClick={handleRedirect}>
          {orderCardButton?.name}
        </Button>
      );
    }

    return button;
  };

  const handleKebabMenu = () => {
    // const optionType = buttonList.map((item) => {
    //   return item['name'];
    // });

    // amplitude.getInstance().logEvent("order options initiated", { option_type: optionType});

    setOpenButtonListSheet(true);
  };

  return (
    <Card className="card-order mb-3 border-0">
      {badgeStatus !== 'finish' && (
        <div className="confirmation-info-wrapper">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex justify-content-start">
              <img
                src="/assets/icons/info-circle-primary.svg"
                width="15"
                height="15"
                className="me-1"
              />
              {getStatusOrderInfo()}
            </div>
            {infoTime()}
          </div>
        </div>
      )}
      <CardBody className="bg-white-lg border-radius-top">
        <img src={rightImage} className="card-image" alt="icon" />

        <BookingBadge status={badgeStatus} />

        <CardTitle tag="h6" className="mt-3" data-automation={`order_list_booking_id_${index}`}>
          {title}
        </CardTitle>

        <CardSubtitle className="mb-3" data-automation={`order_list_car_info_${index}`}>
          {subtitle}
        </CardSubtitle>
        <CardSubtitle data-automation={`order_list_date_${index}`}>{info}</CardSubtitle>

        <img
          src={isOpen ? '/assets/icons/arrow-up-orange.svg' : '/assets/icons/arrow-down-orange.svg'}
          onClick={() => toggle()}
          alt="arrow"
          role="presentation"
          className="toggle-collapse"
          data-automation={`order_list_toggle_${index}`}
        />
      </CardBody>

      {/* accordion section */}
      <CardBody className="py-0 bg-white-lg">
        <Collapse isOpen={isOpen}>
          <div className="border-top" />
          <div className="py-3">
            {isShowMaxTime && (
              <>
                <div className="item mb-0">
                  <div className="text-dark mb-1 ">Order Akan Dikonfirmasi Sebelum</div>
                  <div className="fs-7 fw-semi-bold text-secondary">{maximumTimeFormatted}</div>
                </div>
                <div className="border-top my-3" />
              </>
            )}

            {packages.map((item, index) => (
              <div key={index} className="d-flex">
                <div className="item w-100" data-automation={`order_list_package_name_${index}`}>
                  {Helper.shortenName(item.name)}
                </div>
                <div
                  className="price w-50 text-end"
                  data-automation={`order_list_package_price_${index}`}>
                  {`Rp${Helper.formatMoney(item.total_price)}`}
                </div>
              </div>
            ))}

            <div
              className="d-flex justify-content-between align-items-center fw-bold mt-2"
              data-automation={`order_list_total_price_${index}`}>
              <div className="total">Total</div>
              <div className="total text-secondary">{total_price}</div>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <Icon
                data-automation={`order_list_button_menu_${index}`}
                card
                textRight
                image="/assets/icons/kebab.svg"
                imageHeight={15}
                imageWidth={15}
                className="pointer bg-kebab px-2"
                onClick={handleKebabMenu}
              />
              {handleButtonOrder()}
            </div>
          </div>
        </Collapse>
        <OrderButtonSheet
          openSheet={openButtonListSheet}
          onDismiss={handleDismissSheet}
          buttonList={buttonList}
        />
      </CardBody>
    </Card>
  );
};

export default CardOrder;
