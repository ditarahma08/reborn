import {
  Button,
  Col,
  EmptyState,
  Icon,
  Modal,
  ModalBody,
  Text
} from '@components/otoklix-elements';

const ModalReviewSent = (props) => {
  const { otopoints = false, isOpen, toggle, onConfirm } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="real-modal otobody-modal custom-modal">
      <ModalBody className="text-center">
        <Col className="workshop-review-section--empty">
          <EmptyState
            image="/assets/images/sent.png"
            imgAlt="Review sent"
            imgHeight={112}
            imgWidth={112}>
            <div className="d-flex flex-column">
              <Text weight="bold" className="text-sm">
                Wooosh! Review Terkirim
              </Text>
              <Text className="text-xs">
                Terimakasih sudah membantu kami menjadi lebih baik lewat reviewmu
              </Text>
            </div>
          </EmptyState>
        </Col>

        {otopoints && (
          <Col className="d-flex flex-column align-items-center rating-form--rating-star mb-4 pt-3">
            <Text color="label" className="text-xxs">
              Selamat! Kamu Mendapatkan
            </Text>

            <div className="d-flex text-center">
              <Icon
                card
                textRight
                image="/assets/images/bigcoin.png"
                imageHeight={15}
                imageWidth={15}
                imgAlt="img_bigcoin"
                title={
                  <Text className="text-sm" color="secondary" weight="bold">
                    +5.000 Otopoints
                  </Text>
                }
              />
            </div>
          </Col>
        )}

        <Col>
          <Button block onClick={onConfirm}>
            Mengerti
          </Button>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export default ModalReviewSent;
