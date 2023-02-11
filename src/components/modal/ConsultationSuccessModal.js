import { Button, Modal, ModalBody, Text } from '@components/otoklix-elements';
import { useRouter } from 'next/router';

const ConsultationSuccessModal = ({ isOpen, toggle }) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="real-modal" centered>
      <ModalBody className="d-flex flex-column align-items-center text-center">
        <img src="/assets/images/sent.png" alt="payment-check" height={130} className="mb-3" />
        <Text weight="bold" className="mb-3">
          Pesan Sudah Terkirim
        </Text>
        <Text className="text-xxs">Terima kasih. Tim Otoklix akan segera menghubungimu</Text>

        <Button
          className="rounded-pill mt-3"
          color="primary"
          block
          onClick={() => router.push('/servis')}>
          Ke Beranda
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default ConsultationSuccessModal;
