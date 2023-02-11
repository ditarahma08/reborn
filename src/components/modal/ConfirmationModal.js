import { Button, Modal } from '@components/otoklix-elements';

const ConfirmationModal = ({ isOpen, onCancel, onOK }) => {
  return (
    <Modal isOpen={isOpen} data-automation="confirmation_modal">
      <div className="p-3" style={{ textAlign: 'center' }}>
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: '1px',
            color: '#14142B'
          }}>
          Ingin Ubah Mobil
        </span>
        <p
          style={{
            fontSize: 14,
            lineHeight: '24px',
            textAlign: 'center',
            letterSpacing: 0.75,
            color: '#4E4B66'
          }}>
          Jika kamu ingin mengubah mobil, item yang ada di keranjang akan hilang. Lanjutkan?
        </p>
        <div className="d-flex justify-content-between mt-3">
          <Button color="link" onClick={onCancel} data-automation="confirmation_modal_cancel">
            Kembali
          </Button>
          <Button onClick={onOK} data-automation="confirmation_modal_ok">
            Ubah Mobil
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
