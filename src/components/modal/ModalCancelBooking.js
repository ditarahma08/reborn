import { Button, Icon, Modal, ModalBody, ModalHeader, Text } from '@components/otoklix-elements';

const ModalCancelBooking = ({
  isOpen,
  onCancel,
  onOK,
  dataAutomationCancelOrder,
  dataAutomationCloseModal
}) => {
  return (
    <Modal isOpen={isOpen} className="modal-cancel-order real-modal" centered>
      <ModalHeader className="d-flex justify-content-end py-0 px-2 border-0 modal-cancel-order__header">
        <Icon
          card
          className="pointer"
          image="/assets/icons/close-circle-grey.svg"
          imageHeight={20}
          imageWidth={20}
          onClick={onCancel}
          data-automation={dataAutomationCloseModal}
        />
      </ModalHeader>

      <ModalBody className="p-3 modal-cancel-order__body">
        <div className="d-flex flex-column text-center pb-4 description">
          <Text className="fw-bold pb-3">Ajukan Pembatalan?</Text>
          <Text>
            Yakin mau mengajukan pembatalan untuk order ini?
            <br />
            Klik “Batalkan Order” untuk melanjutkan aksi. Klik “Kembali” untuk mengurungkan aksi.
          </Text>
        </div>
        <div className="d-flex justify-content-between">
          <Button className="me-1" block size="sm" color="danger" onClick={onCancel}>
            Kembali
          </Button>
          <Button
            className="ms-1"
            block
            size="sm"
            color="danger"
            outline
            onClick={onOK}
            style={{ whiteSpace: 'nowrap' }}
            data-automation={dataAutomationCancelOrder}>
            Batalkan Order
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalCancelBooking;
