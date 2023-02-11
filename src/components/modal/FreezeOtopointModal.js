import { Button, Col, EmptyState, Modal, ModalBody, Text } from '@components/otoklix-elements';

const FreezeOtopointModal = (props) => {
  const { isOpen, toggle, onConfirm } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      backdrop="static"
      modalMobile
      centered
      className="real-modal otobody-modal custom-modal modal-refund">
      <ModalBody className="text-center">
        <Col className="workshop-review-section--empty">
          <EmptyState
            image="/assets/images/payment-failed.png"
            imgAlt="Review sent"
            imgHeight={112}
            imgWidth={112}>
            <div className="d-flex flex-column">
              <Text weight="bold" className="text-md mb-2">
                Otopoint Dibekukan
              </Text>
              <Text className="text-xs">
                Anda tidak dapat menggunakan otopoint untuk saat ini. Silakan hubungi CS
              </Text>
            </div>
          </EmptyState>
        </Col>

        <Col>
          <Button block onClick={onConfirm}>
            Hubungi CS
          </Button>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export default FreezeOtopointModal;
