import { Button, Modal, ModalBody } from '@components/otoklix-elements';

const RemovePromoModal = ({ isOpen, toggle, onClickYes, promoCode, label = 'Bengkel' }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="real-modal otobody-modal">
      <ModalBody className="text-center">
        <h1>
          Yakin ingin Mencari {label} Tanpa Promo{' '}
          <span className="text-secondary">{promoCode}</span>?
        </h1>
        <p>Jika kamu ingin menggunakan promo, kamu bisa menemukannya di halaman &quot;Home&quot;</p>

        <Button className="mb-2" block onClick={onClickYes} size="sm">
          Ya, Cari {label} Tanpa Promo
        </Button>

        <Button block outline onClick={toggle} size="sm">
          Batalkan
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default RemovePromoModal;
