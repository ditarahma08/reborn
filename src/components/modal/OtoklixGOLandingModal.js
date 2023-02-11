import { Button, Modal, ModalBody, Text } from '@components/otoklix-elements';
import { OTOKLIX_GO_FLOW } from '@utils/Constants';

const OtoklixGOLandingModal = (props) => {
  const { isOpen, toggle } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="real-modal modal-otoklix-go"
      backdrop="static"
      centered>
      <ModalBody className="d-flex flex-column align-items-center">
        <img
          src="/assets/icons/logo-orange.svg"
          alt="Otoklix Pick Up"
          width={72}
          className="mb-3"
        />
        <Text tag="span" className="modal-otoklix-go__title mb-2" weight="bold">
          Otoklix Pick Up Sudah Hadir, Nih!
        </Text>
        <Text tag="span" className="modal-otoklix-go__subtitle text-center mb-3">
          Kamu tidak perlu lagi repot ke bengkel untuk perawatan mobil dengan jaminan perlindungan
          asuransi. Begini cara kerja Otoklix Pick Up:
        </Text>

        <div className="modal-otoklix-go__flow mb-3 px-3">
          {OTOKLIX_GO_FLOW?.map((item, index) => (
            <div key={index}>
              <img src={`/assets/icons/${item?.src}.svg`} alt="" width={28} height={28} />
              <div>
                <Text>{item?.desc}</Text>
              </div>
            </div>
          ))}
        </div>

        <Button block color="primary" size="sm" className="py-2" onClick={toggle}>
          Mengerti
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default OtoklixGOLandingModal;
