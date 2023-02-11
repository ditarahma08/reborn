import PrivateLayout from '@components/layouts/PrivateLayout';
import { Alert, Container, Header, Spinner } from '@components/otoklix-elements';
import OrderDetail from '@components/refund/OrderDetail';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/refund/index');

const Refund = () => {
  const router = useRouter();
  const { user, token } = useAuth();

  const [booking, setBooking] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [userBankAccount, setUserBankAccount] = useState([]);
  const [bookingErrMessage, setBookingErrMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  let { id } = router.query;
  // handle undefined parameters on first render
  if (!id && typeof window !== 'undefined') {
    id = window.location.pathname.split('/').pop();
  }

  const fetchDetailBooking = async () => {
    setIsFetching(true);
    authenticateAPI(token);

    try {
      const response = await api.get(`v2/bookings/${id}/`);
      setBooking(response.data.data);
      setIsFetching(false);
      setHasError(false);
    } catch (e) {
      setHasError(true);
      const message = e?.response?.data?.error?.message || e?.message || 'Terjadi Kesalahan';
      setBookingErrMessage(message);
      setIsFetching(false);
    }
  };

  const fetchUserBankAccount = async () => {
    try {
      const response = await api.get('v2/bank/customer-account/');
      setUserBankAccount(response?.data?.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSuccessRefund = (isSuccess) => {
    if (isSuccess) {
      router.push('/servis');
    }
  };

  useEffect(() => {
    fetchDetailBooking();
    fetchUserBankAccount();
  }, [user]);

  return (
    <PrivateLayout
      hasAppBar={false}
      wrapperClassName="wrapper-full refund-wrapper order-confirmation-wrapper">
      <Header
        className="refund-header"
        title="Pengajuan Refund"
        onBackClick={() => router.back()}
        dataAutomationTitle="refund_title_page"
        dataAutomationButton="refund_button_back"
      />

      {isFetching ? (
        <div className="d-flex justify-content-center p-3">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {hasError && (
            <Container className="mt-2">
              <Alert borderColor="danger" textColor="danger" onClose={() => setHasError(false)}>
                {bookingErrMessage}
              </Alert>
            </Container>
          )}
          <OrderDetail
            data={booking}
            bookingId={id}
            userBankAccount={userBankAccount}
            isSuccessRefund={handleSuccessRefund}
            dataAutomationId="refund_order_id"
          />
        </>
      )}
    </PrivateLayout>
  );
};

export default Refund;
