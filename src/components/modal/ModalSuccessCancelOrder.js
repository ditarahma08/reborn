import { Button, Modal, Text } from '@components/otoklix-elements';
import { useRouter } from 'next/router';

const ModalSuccessCancelOrder = ({ isOpen, toggle, workshopData }) => {
  const router = useRouter();

  const handleUrl = () => {
    let query = {
      src: 'my_order'
    };
    router.push({ pathname: `/bengkel/${workshopData?.slug}`, query: query });
  };

  const handleListBengkelUrl = () => {
    const params = {
      service_category: 'workshop',
      recommendation: true,
      src: 'my_order'
    };

    router.push({ pathname: `/cari`, query: params });
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="wrapper wrapper-xs modal-no-shadow modal-success-cancel-order">
      <div className="d-flex flex-column align-items-center modal-success-cancel-order__header">
        <img src="/assets/images/sorry.png" alt="order-canceled" height={200} width={200} />
        <Text>Order Batal</Text>
        <Text>Order Anda telah dibatalkan</Text>
      </div>

      <div className="d-flex flex-column modal-success-cancel-order__body">
        <Button
          color="secondary"
          block
          onClick={handleUrl}
          data-automation="batal_pesan_button_cari_servis">
          Cari Service Lainnya
        </Button>
        <Button
          color="secondary"
          block
          outline
          className="mt-4"
          onClick={handleListBengkelUrl}
          data-automation="batal_pesan_button_cari_bengkel">
          Cari Bengkel Lainnya
        </Button>
      </div>
    </Modal>
  );
};

export default ModalSuccessCancelOrder;
