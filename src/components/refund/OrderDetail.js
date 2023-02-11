import { AbsoluteWrapper, Button, Container, Text } from '@components/otoklix-elements';
import BankAccountSection from '@components/refund/BankAccountSection';
import ModalRefundSent from '@components/refund/ModalRefundSent';
import ReasonSection from '@components/refund/ReasonSection';
import { api } from '@utils/API';
import Helper from '@utils/Helper';
import moment from 'moment';
import { useEffect, useState } from 'react';

const OrderDetail = ({ data, userBankAccount, isSuccessRefund, bookingId, dataAutomationId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalRefundSent, setModalRefundSent] = useState(false);
  const [params, setParams] = useState({
    booking_code: null,
    bank_account_number: null,
    bank_account_holder: null,
    bank_id: null,
    refund_reason: null
  });

  const carNameDetail = (booking) => {
    // prettier-ignore
    return `${booking?.user_car?.car_details?.car_model?.brand?.name} ${booking?.user_car?.car_details?.car_model?.model_name} ${booking?.user_car?.car_details?.variant}`;
  };

  const handleAddBank = (label, value) => {
    setParams({ ...params, [label]: value });
  };

  const handleChangeBank = (account) => {
    setParams({
      ...params,
      bank_account_holder: account?.bank_account_holder,
      bank_account_number: account?.bank_account_number,
      bank_id: account?.bank_id
    });
  };

  const handleReason = (reason) => {
    setParams({
      ...params,
      refund_reason: reason
    });
  };

  const onSubmitRefund = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/v2/refund/', params);
      if (response?.data?.data) {
        setIsLoading(false);
        toggleModal();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setModalRefundSent(!modalRefundSent);
  };

  const handleConfirm = () => {
    setModalRefundSent(!modalRefundSent);
    isSuccessRefund(true);
  };

  useEffect(() => {
    setParams({
      ...params,
      booking_code: data?.booking_code || bookingId
    });
  }, [data]);

  useEffect(() => {
    if (userBankAccount.length > 0) {
      const initAccount = userBankAccount[0];
      setParams({
        ...params,
        bank_account_holder: initAccount?.account_holder,
        bank_account_number: initAccount?.account_number,
        bank_id: initAccount?.bank?.id,
        booking_code: data?.booking_code || bookingId
      });
    }
  }, []);

  const isDisabled =
    !params?.booking_code ||
    !params?.bank_account_number ||
    !params?.bank_account_holder ||
    !params?.bank_id ||
    !params?.refund_reason;

  return (
    <>
      <Container className="order-id-wrapper mt-3 py-2">
        <div className=" d-flex justify-content-between" data-automation={dataAutomationId}>
          <span className="label">Order ID</span>
          <span className="order-id">{data?.booking_code || '-'}</span>
        </div>
      </Container>

      <Container className="package-wrapper">
        {data?.packages.map((item, index) => (
          <Text className="title mb-1 d-block" tag="span" key={index}>
            {item?.name?.slice(0, item?.name?.lastIndexOf('-'))}
          </Text>
        ))}
        <div className="py-3">
          <div className="d-flex justify-content-between align-items-center pb-2">
            <span className="label-name">{data?.workshop?.name || '-'}</span>
            <span className="detail">Rp. {Helper.formatMoney(data?.total_price)}</span>
          </div>
          <div className="d-flex align-items-center pb-2">
            <span className="label-name">{carNameDetail(data)}</span>
            <span className="label-name mx-1">-</span>
            <span className="detail">{data?.user_car?.license_plate || '-'}</span>
          </div>
        </div>
        <div>
          <span className="label-name xs d-block mb-2">Jadwal Servis</span>
          <span className="detail d-block">
            {data?.booking_datetime
              ? moment(data?.booking_datetime).locale('id').format('dddd, D MMMM YYYY, HH:mm')
              : '-'}
            WIB
          </span>
        </div>
      </Container>

      <Container className="package-wrapper mt-3">
        <BankAccountSection
          accounts={userBankAccount}
          addBank={handleAddBank}
          onChange={handleChangeBank}
        />
      </Container>

      <Container className="package-wrapper reason-margin py-0 mt-3">
        <ReasonSection onChange={handleReason} />
      </Container>

      <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom">
        <Button
          color="secondary"
          size="sm"
          block
          onClick={onSubmitRefund}
          loading={isLoading}
          disabled={isDisabled}
          data-automation="refund_button_ajukan_refund">
          Ajukan Refund
        </Button>
      </AbsoluteWrapper>

      <ModalRefundSent isOpen={modalRefundSent} toggle={toggleModal} onConfirm={handleConfirm} />
    </>
  );
};

export default OrderDetail;
