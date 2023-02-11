import { Modal, ModalBody, Text } from '@components/otoklix-elements';

const ModalSuccessCodeVerification = (props) => {
  const { isOpen, toggle } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="real-modal" centered>
      <ModalBody className="text-center p-0">
        <div className="p-3">
          <img src="/assets/images/sent.png" alt="sent" height={130} className="mb-3" />

          <div className="d-flex flex-column mb-3">
            <Text weight="bold" className="mb-3">
              Kode Berhasil Dikonfirmasi
            </Text>

            <Text className="text-xxs">
              Kode verifikasimu berhasil dikonfirmasi oleh bengkel. Selanjutnya mobilmu siap untuk
              diproses
            </Text>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalSuccessCodeVerification;
