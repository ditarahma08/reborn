import { Button, Modal, ModalBody } from '@components/otoklix-elements';

function CustomModal({
  show,
  title,
  caption,
  submitButton,
  cancelButton,
  onSubmit,
  onCancel,
  toggle,
  submitButtonColor,
  imageUrl,
  buttonPill,
  cancelButtonColor,
  titleClass = '',
  dataAutomationButtonCancel = 'modal_button_cancel',
  dataAutomationButtonSubmit = 'modal_button_submit'
}) {
  return (
    <Modal
      centered
      backdrop="static"
      className="real-modal otobody-modal custom-modal"
      isOpen={show}
      toggle={toggle}>
      <ModalBody className="text-center">
        {imageUrl && <img src={imageUrl} width="120" alt="alert" loading="lazy" />}
        <h1 className={`${titleClass}`}>{title}</h1>
        <p>{caption}</p>
        {submitButton && (
          <Button
            block
            color={submitButtonColor || 'primary'}
            onClick={onSubmit}
            className={buttonPill && 'rounded-pill'}
            data-automation={dataAutomationButtonSubmit}>
            {submitButton}
          </Button>
        )}
        {cancelButton && (
          <Button
            block
            color={cancelButtonColor || 'primary'}
            className={`mt-2 ${buttonPill && 'rounded-pill'}`}
            outline
            onClick={onCancel}
            data-automation={dataAutomationButtonCancel}>
            {cancelButton}
          </Button>
        )}
      </ModalBody>
    </Modal>
  );
}

export default CustomModal;
