import { Button, Modal, ModalBody } from '@components/otoklix-elements';

function ModalLogout({ show, toggle, onSubmit, onCancel }) {
  return (
    <Modal centered className="real-modal otobody-modal" isOpen={show} toggle={toggle}>
      <ModalBody className="text-center">
        <img src="/assets/images/logout.png" alt="logout" width="150" height="150" loading="lazy" />
        <h1>Keluar dari akun kamu di Otoklix?</h1>
        <Button
          block
          outline
          color="danger"
          className="mb-2"
          size="sm"
          onClick={onCancel}
          data-automation="account_modal_button_kembali">
          Kembali
        </Button>
        <Button
          block
          color="danger"
          size="sm"
          onClick={onSubmit}
          data-automation="account_modal_button_logout">
          Log Out
        </Button>
      </ModalBody>
    </Modal>
  );
}

export default ModalLogout;
