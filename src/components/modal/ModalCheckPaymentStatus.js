import { Icon, Modal, ModalBody, Text } from '@components/otoklix-elements';

const ModalCheckPaymentStatus = (props) => {
  const { isOpen, toggle } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="real-modal" centered>
      <ModalBody className="text-center p-0">
        <div className="w-100 d-flex justify-content-end px-1">
          <Icon
            card
            className="pointer"
            image="/assets/icons/close-circle-grey.svg"
            imageHeight={20}
            imageWidth={20}
            onClick={toggle}
          />
        </div>

        <div className="p-3 pt-0">
          <img src="/assets/images/sent.png" alt="payment-check" height={130} className="mb-3" />

          <div className="d-flex flex-column mb-3">
            <Text weight="bold" className="mb-3">
              Sedang Memeriksa <br /> Transaksimu
            </Text>

            <Text className="text-xxs">
              Kami akan segera mengabarimu jika transaksi berhasil diproses. Pastikan kamu sudah
              melakukan pembayaran dengan benar.
            </Text>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalCheckPaymentStatus;
