import { Button, Col, EmptyState, Modal, ModalBody, Text } from '@components/otoklix-elements';

const ModalReviewConfirm = (props) => {
  const { isOpen, onConfirm, onCancel } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={onCancel}
      centered
      className="real-modal otobody-modal custom-modal rating-form--confirm-modal">
      <ModalBody className="text-center">
        <Col className="workshop-review-section--empty">
          <EmptyState
            image="/assets/images/bigcoin-no.png"
            imgAlt="No otopoints"
            imgHeight={112}
            imgWidth={112}>
            <div className="d-flex flex-column">
              <Text weight="bold" className="text-sm mb-2">
                Kirim Review Tanpa Menceritakan Pengalamanmu?
              </Text>
              <Text className="text-xs">
                Kamu akan kehilangan kesempatan untuk mendapatkan Otopoints, lanjutkan kirim tanpa
                menceritakan pengalamanmu?
              </Text>
            </div>
          </EmptyState>
        </Col>

        <Col className="d-flex justify-content-between">
          <Button block className="me-1" onClick={onCancel}>
            Kembali
          </Button>
          <Button block className="ms-1" color="subtle" onClick={onConfirm}>
            Ya, Kirim
          </Button>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export default ModalReviewConfirm;
