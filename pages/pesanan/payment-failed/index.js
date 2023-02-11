import PrivateLayout from '@components/layouts/PrivateLayout';
import { Button, EmptyState, Text } from '@components/otoklix-elements';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import Helper from '@utils/Helper';

sentryBreadcrumb('pages/pesanan/payment-failed');

const Index = () => {
  return (
    <PrivateLayout hasAppBar={false} wrapperClassName="wrapper-full payment-status">
      <EmptyState
        image="/assets/images/payment-failed.png"
        title="Oh Tidak..."
        imgHeight={140}
        imgAlt="">
        <div className="d-flex flex-column">
          <Text>
            Kamu ga bisa akses halaman pembayaran nih, ada sesuatu yang tidak beres. Tapi tenang
            Customer Service kami siap membantu kamu.
          </Text>
          <Button className="button btn btn-subtle btn-sm mt-3" onClick={Helper.openOtobuddy}>
            Hubungi Otobuddy
          </Button>
        </div>
      </EmptyState>
    </PrivateLayout>
  );
};

export default Index;
