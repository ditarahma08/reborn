import PrivateLayout from '@components/layouts/PrivateLayout';
import { Button, EmptyState } from '@components/otoklix-elements';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';
import { useRouter } from 'next/router';

sentryBreadcrumb('pages/pesanan/payment-success');

const Index = () => {
  const router = useRouter();

  let { order_id, transaction_status } = router.query;

  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full payment-status">
      {transaction_status === 'settlement' || transaction_status === 'success' ? (
        <EmptyState
          image="/assets/images/payment-success.png"
          title="Pembayaran Berhasil!"
          imgHeight={140}
          onSecondaryButtonClick={() => router.push(`/order/${order_id}`)}
          secondaryButtonTitle="Ke Rincian Transaksi"
          imgAlt="">
          Yeay! Pembayaran kamu sudah berhasil kami proses. Kami akan menginformasikan pembayaran
          kamu ke bengkel. Sampai jumpa di bengkel ya~
        </EmptyState>
      ) : (
        <EmptyState
          image="/assets/images/payment-pending.png"
          title="Yuk Selesaikan Pembayaran Kamu"
          imgHeight={140}
          imgAlt="">
          Segera selesaikan pembayaran kamu dengan metode pembayaran yang telah dipilih sebelumnya.
          Jika menemukan kesulitan, silakan hubungi Customer Service dengan klik di bawah ini.
          <br />
          <Button className="button btn btn-subtle btn-sm mt-3" onClick={Helper.openOtobuddy}>
            Hubungi Otobuddy
          </Button>
        </EmptyState>
      )}
    </PrivateLayout>
  );
};

export default Index;
