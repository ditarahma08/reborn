import { EmptyState } from '@components/otoklix-elements';
import { Modal, ModalBody } from '@components/otoklix-elements';
import { use100vh } from 'react-div-100vh';

const DeepLinkModal = ({ show, toggle, onClick }) => {
  const height = use100vh();

  return (
    <Modal isOpen={show} toggle={toggle} centered className="deep-link-modal">
      <ModalBody className="p-0">
        <div className="deep-link-modal__body" style={{ height: height }}>
          <div onClick={toggle}>
            <img
              src="/assets/icons/close.svg"
              alt=""
              className="deep-link-modal__close"
              height={24}
              width={24}
            />
          </div>
          <EmptyState
            image="/assets/icons/deep-link.svg"
            title="Lanjut di Aplikasi Otoklix, Yuk!"
            imgHeight={280}
            imgAlt="Otoklix App"
            mainButtonTitle="Download Sekarang"
            onMainButtonClick={onClick}>
            Karena ada voucher DISKON ganti oli dan cuci mobil yang sudah menantimu!
          </EmptyState>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeepLinkModal;
