import { Modal, ModalBody } from '@components/otoklix-elements';
import ReactWhatsapp from 'react-whatsapp';

const OtobuddyModal = ({ isOpen, toggle, onClickAskCS, onClickAskExpert }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="real-modal otobody-modal">
      <ModalBody className="text-center">
        <h1>Tidak Menemukan Servis yang Kamu Cari?</h1>
        <p>
          Tenang! Otoklix akan membantu menemukan solusi terbaik untuk mobil kamu. Silakan klik
          salah satu bantuan di bawah ini
        </p>

        <ReactWhatsapp
          onClick={onClickAskCS}
          number={process.env.CS_NUMBER}
          message="Hi CS Otoklix, bisa bantu saya?"
          className="mb-2 btn btn-outline-primary btn-md d-block w-100">
          Tanya CS
        </ReactWhatsapp>

        <ReactWhatsapp
          onClick={onClickAskExpert}
          number={process.env.CS_EXPERT_NUMBER}
          message="Hi OtoExpert, saya mau konsultasi nih. Bisa tolong bantu saya?"
          className="btn btn-primary btn-md d-block w-100">
          Konsultasi OtoExpert
        </ReactWhatsapp>
      </ModalBody>
    </Modal>
  );
};

export default OtobuddyModal;
