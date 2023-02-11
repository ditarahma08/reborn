import { Container, Text } from '@components/otoklix-elements';
import { BottomSheet } from 'react-spring-bottom-sheet';

const ServiceOptionsSheet = (props) => {
  const { open, onClose, handleCheckoutDatangKeBengkel, handleCheckoutPudo } = props;

  return (
    <BottomSheet
      open={open}
      blocking={true}
      skipInitialTransition
      scrollLocking={false}
      onDismiss={onClose}
      className="box-mobile-first bottom-sheet-order">
      <div className="pointer bottom-sheet-close" onClick={onClose}>
        <img src="/assets/icons/close.svg" alt="" />
      </div>
      <Container>
        <Text className="fs-6 fw-bold">Pilih Metode Servis</Text>
        <div className="my-4">
          <div className="m-2 p-2 pointer" onClick={handleCheckoutPudo}>
            <Text color="dark" className="text-xs d-block">
              Otoklix Pick Up
            </Text>
            <Text color="placeholder" className="text-xs d-block">
              Kami yang akan antar-jemput mobilmu
            </Text>
          </div>
          <hr className="mx-2 px-2" style={{ backgroundColor: '#979797' }} />
          <div className="m-2 p-2 pointer" onClick={handleCheckoutDatangKeBengkel}>
            <Text color="dark" className="text-xs d-block">
              Ke Bengkel
            </Text>
            <Text color="placeholder" className="text-xs d-block">
              Kamu bisa datang langsung ke bengkel
            </Text>
          </div>
        </div>
      </Container>
    </BottomSheet>
  );
};

export default ServiceOptionsSheet;
