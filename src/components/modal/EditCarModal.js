import NewCar from '@components/car/NewCar';
import { Modal, ModalBody, ModalHeader } from '@components/otoklix-elements';

const EditCarModal = (props) => {
  const { isOpen, closeHasNewCar } = props;
  return (
    <Modal isOpen={isOpen} className="wrapper wrapper-xs modal-no-shadow">
      <ModalHeader className="p-0"></ModalHeader>
      <ModalBody className="p-0">
        <NewCar closeHasNewCar={closeHasNewCar} />
      </ModalBody>
    </Modal>
  );
};

export default EditCarModal;
