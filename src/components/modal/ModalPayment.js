import {
  Alert,
  Button,
  Divider,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from '@components/otoklix-elements';
import CountdownTimer from '@components/timer/Countdown';
import Helper from '@utils/Helper';
import moment from 'moment';
import { useState } from 'react';

const ModalPayment = (props) => {
  const { isOpen, toggle, onClickButton, data } = props;
  const dataPayment = data?.payment_details;

  const [showCopyAlert, setShowCopyAlert] = useState(false);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyAlert(true);

    setTimeout(() => {
      setShowCopyAlert(false);
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="real-modal" centered>
      <ModalHeader className="d-flex justify-content-end py-0 px-2 border-0">
        <Icon
          card
          className="pointer"
          image="/assets/icons/close-circle-grey.svg"
          imageHeight={20}
          imageWidth={20}
          onClick={toggle}
        />
      </ModalHeader>

      <ModalBody className="p-0 payment-info">
        <div className="payment-info__due-hour px-3">
          <div className="d-flex flex-column">
            <Text color="placeholder">Lakukan pembayaran sebelum</Text>
            <Text color="label">
              {moment(dataPayment?.expired_at).format('dddd, DD MMMM YYYY HH.mm')} WIB
            </Text>
          </div>
          <CountdownTimer
            className="timer-countdown"
            targetDate={moment(dataPayment?.expired_at)}
          />
        </div>

        <Divider type="page-divider" />

        <div className="payment-info__bank-info px-3">
          <Text>{`${dataPayment?.method_name}`}</Text>
          <img src={dataPayment?.method_icon_link} alt="payment-method" height={15} />
        </div>

        {dataPayment?.method_type === 'echannel' && (
          <div className="px-3 payment-info__va-number">
            <div className="d-flex flex-column">
              <Text color="placeholder">Biller Code</Text>
              <Text className="number">{dataPayment?.biller_code}</Text>
            </div>

            <Text
              className="d-flex align-items-center salin"
              onClick={() => copyText(dataPayment?.biller_code)}>
              Salin
              <img src="/assets/icons/copy-green.svg" height={15} width={15} className="ms-1" />
            </Text>
          </div>
        )}

        {dataPayment?.method_type === 'bank_transfer' || dataPayment?.method_type === 'echannel' ? (
          <div className="px-3 payment-info__va-number">
            <div className="d-flex flex-column">
              <Text color="placeholder">
                {dataPayment?.method_type === 'bank_transfer'
                  ? 'Nomor Virtual Account'
                  : 'Biller Key'}
              </Text>
              <Text className="number">{dataPayment?.virtual_number}</Text>
            </div>

            <Text
              className="d-flex align-items-center salin"
              onClick={() => copyText(dataPayment?.virtual_number)}>
              Salin
              <img src="/assets/icons/copy-green.svg" height={15} width={15} className="ms-1" />
            </Text>
          </div>
        ) : null}

        <div className="px-3 payment-info__total">
          <div className="d-flex flex-column">
            <Text color="placeholder">Jumlah Bayar</Text>
            <Text className="number">{`Rp${Helper?.formatMoney(data?.total_price)}`}</Text>
          </div>

          <Text
            className="d-flex align-items-center salin"
            onClick={() => copyText(data?.total_price)}>
            Salin
            <img src="/assets/icons/copy-green.svg" height={15} width={15} className="ms-1" />
          </Text>
        </div>

        <Divider />

        {dataPayment?.method_type === 'gopay' && (
          <div className="mt-2 px-3">
            <Text className="fw-normal text-dark text-xs">
              Khusus transaksi via website, <br />
              silahkan scan QR code berikut.
            </Text>
            <img src={dataPayment?.qr_code_link} width="100%" />
          </div>
        )}

        <div className="my-3 px-3">
          <Button color="secondary" size="sm" block onClick={onClickButton}>
            {dataPayment?.method_type === 'gopay' ? 'Bayar GoPay Sekarang' : 'Saya Sudah Bayar'}
          </Button>
        </div>

        {showCopyAlert && (
          <Alert
            floating={true}
            showClose={false}
            color="success"
            borderColor="success"
            textColor="white"
            className="mb-5">
            Text berhasil disalin.
          </Alert>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ModalPayment;
