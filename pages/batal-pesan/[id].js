import CardConfirmationOrderNew from '@components/card/CardConfirmationOrderNew';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  AbsoluteWrapper,
  Button,
  Container,
  Divider,
  Header,
  Text
} from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { useAuth } from '@contexts/auth';
import { api, authenticateAPI } from '@utils/API';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';

const FormCancelOrder = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();

  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);

  const fetchCancelDetail = async () => {
    setLoading(true);
    await api
      .get(`v2/bookings/${id}/cancel/detail/`)
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      authenticateAPI(token);
      fetchCancelDetail();
    }
  }, [id]);

  const fetchComplete = !isLoading && !Helper.isEmptyObj(data);

  return (
    <PrivateLayout hasAppBar={false}>
      <Div100vh>
        <Header
          title="Detail Batal"
          onBackClick={() => router.back()}
          dataAutomationButton="detail_batal_button_back"
        />

        <Divider type="page-divider mt-0" />

        <Container className="booking-info">
          <Text className="booking-info__title" tag="span">
            Ordermu
          </Text>
          <div className="my-3 booking-info__card">
            {fetchComplete ? (
              data?.packages?.length > 0 &&
              data?.packages?.map((packageItem, index) => (
                <CardConfirmationOrderNew
                  className={index > 0 ? 'mt-3' : ''}
                  parentData={data}
                  packages={packageItem}
                  key={index}
                  dataAutomationToggle="detail_batal_toggle"
                />
              ))
            ) : (
              <Skeleton width={332} height={113} />
            )}
          </div>
        </Container>

        <Divider type="page-divider" />

        <Container className="cancel-reason">
          <Text className="cancel-reason__title" data-automation="detail_batal_cancel_reason_title">
            Alasan Pembatalan
          </Text>
          <div className="cancel-reason__description">
            {fetchComplete ? (
              <>
                <div className="marker position-fixed mt-2" />
                <Text className="text-break ms-3" data-automation="detail_batal_cancel_reason_desc">
                  {data?.booking_cancel_reason || '-'}
                </Text>
              </>
            ) : (
              <>
                <Skeleton width={8} height={8} className="marker__loading mt-2" />
                <Skeleton width={100} height={22} />
              </>
            )}
          </div>
        </Container>

        {data?.is_refundable && (
          <AbsoluteWrapper bottom className="position-fixed wrapper-fixed-bottom">
            <Button
              color="secondary"
              size="sm"
              block
              onClick={() => router.push(`/refund/${id}`)}
              loading={isLoading}
              disabled={false}
              data-automation="detail_batal_button_ajukan_refund">
              Ajukan Refund
            </Button>
          </AbsoluteWrapper>
        )}
      </Div100vh>
    </PrivateLayout>
  );
};

export default FormCancelOrder;
