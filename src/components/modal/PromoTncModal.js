import { Modal, ModalBody, ModalHeader } from '@components/otoklix-elements';
import { Scrollbars } from 'react-custom-scrollbars-2';

const PromoTncModal = ({ isOpen, toggle, tnc }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="real-modal tnc-modal">
      <ModalHeader toggle={toggle}>Syarat & Ketentuan</ModalHeader>
      <ModalBody className="text-start p-0">
        <Scrollbars autoHide autoHeight autoHeightMin={'500px'} universal={true}>
          <div className="py-3 pe-3" dangerouslySetInnerHTML={{ __html: tnc }}></div>
        </Scrollbars>
      </ModalBody>
    </Modal>
  );
};

export default PromoTncModal;
