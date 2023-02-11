import { Button, Col, EmptyState, Modal, ModalBody, Text } from '@components/otoklix-elements';

const ModalReviewSent = (props) => {
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
            image="/assets/images/sent.png"
            imgAlt="Review sent"
            imgHeight={112}
            imgWidth={112}>
            <div className="d-flex flex-column">
              <Text weight="bold" className="text-md mb-2" data-automation="refund_modal_title">
                Refund Berhasil Diajukan
              </Text>
              <Text className="text-xs" data-automation="refund_modal_desc">
                Refund yang kamu ajukan sedang diproses. Dalam waktu dekat, dana akan diakumulasikan
                ke OtoPointsmu ya.
              </Text>
            </div>
          </EmptyState>
        </Col>

        <Col>
          <Button block onClick={onConfirm} data-automation="refund_modal_button_home">
            Kembali Ke Home
          </Button>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export default ModalReviewSent;
