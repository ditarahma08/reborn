import { Button, Container, Header, Input, Label } from '@components/otoklix-elements';
import Div100vh from 'react-div-100vh';

const PaymentMethod = ({ onBackClick, selectedServiceReceived, handleSelectService }) => {
  return (
    <Div100vh>
      <Header title="Konfirmasi Order" onBackClick={onBackClick} />

      <Container className="content-wrapper">
        <Button
          block
          color="secondary-light"
          className="mb-4 p-3 d-flex align-items-center justify-content-between btn-payment"
          disabled={selectedServiceReceived === 'offline'}>
          <div className="d-flex align-items-center">
            <div className="me-1 left-box"></div>
            <Label className="ms-2" check={selectedServiceReceived === 'online'}>
              Pembayaran Online{' '}
            </Label>
          </div>
          <Input type="radio" name="selectservice" value="offline" onClick={handleSelectService} />
        </Button>
        <Button
          block
          color="secondary-light"
          className="d-flex p-3 align-items-center justify-content-between btn-payment"
          disabled={selectedServiceReceived === 'online'}>
          <div className="d-flex align-items-center">
            <div className="me-1 left-box"></div>
            <Label className="ms-2" check={selectedServiceReceived === 'offline'}>
              Bayar di Bengkel (COD){' '}
            </Label>
          </div>
          <Input type="radio" name="selectservice" value="offline" onClick={handleSelectService} />
        </Button>
      </Container>
    </Div100vh>
  );
};

export default PaymentMethod;
