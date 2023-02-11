import PrivateLayout from '@components/layouts/PrivateLayout';
import ModalSuccessCodeVerification from '@components/modal/ModalSuccessCodeVerification';
import { Container, Divider, Header, Stepper, Text } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { api } from '@utils/API';
import { verifyCodeStep } from '@utils/Constants';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import Div100vh from 'react-div-100vh';

const CodeVerification = () => {
  const router = useRouter();
  const { id } = router.query;

  const [hasSuccessModal, setHasSuccessModal] = useState(false);
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [successVerify, setVerify] = useState(false);

  const fetchBookingVerifyCode = async () => {
    setLoading(true);
    await api
      .get(`/v2/bookings/${id}/verification-code/`)
      .then((res) => {
        setData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const fetchVerificationStatus = async () => {
    await api
      .get(`/v2/bookings/${id}/verification-status/`)
      .then((res) => {
        setVerify(res?.data?.data?.is_verified);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleModalSuccess = () => {
    setHasSuccessModal(true);

    setTimeout(() => {
      setHasSuccessModal(false);
      router.push(`/order/${id}`);
      return;
    }, 3000);
  };

  useEffect(() => {
    fetchBookingVerifyCode();
  }, [id]);

  useEffect(() => {
    let interval;

    if (!Helper.isEmptyObj(data) && !successVerify) {
      interval = setInterval(() => {
        fetchVerificationStatus();
      }, 3000);
    }

    if (!Helper.isEmptyObj(data) && successVerify) {
      toggleModalSuccess();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data, successVerify]);

  const hasData = !isLoading && data;

  return (
    <PrivateLayout hasAppBar={false}>
      <Div100vh>
        <Header title="Kode Verifikasi" onBackClick={() => router.push(`/order/${id}`)} />

        <Divider type="page-divider mt-0" />

        <Container className="verification-code">
          {hasData ? (
            <div className="verification-code__workshop-info">
              <Text>{data?.workshop?.name}</Text>
              <Text>{data?.workshop?.street_address}</Text>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <Skeleton width={200} height={24} />
              <Skeleton height={15} className="mb-0" />
            </div>
          )}

          <Divider type="dash" />

          <Text className="verification-code__show-code">Tunjukan kode ini ke kasir</Text>

          {hasData ? (
            <div className="verification-code__code">
              {data?.code?.map((number, index) => (
                <div key={index}>{number}</div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center pt-3">
              {[...Array(3)].map((i) => (
                <Skeleton width={95} height={48} key={i} />
              ))}
            </div>
          )}
        </Container>

        <Divider type="page-divider" />

        <Container>
          <Stepper data={verifyCodeStep} direction="vertical" />
        </Container>
      </Div100vh>

      <ModalSuccessCodeVerification
        isOpen={hasSuccessModal}
        toggle={() => setHasSuccessModal(!hasSuccessModal)}
      />
    </PrivateLayout>
  );
};

export default CodeVerification;
