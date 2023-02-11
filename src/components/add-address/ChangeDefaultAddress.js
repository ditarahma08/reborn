import { Container } from '@components/otoklix-elements';
import { BottomSheet } from 'react-spring-bottom-sheet';

const ChangeDefaultAddress = (props) => {
  const { open, onClose, handleChangeAddress, handleDeleteAddress } = props;

  return (
    <BottomSheet open={open} blocking={true}>
      <div className="pointer bottom-sheet-close" onClick={onClose}>
        <img src="/assets/icons/close.svg" alt="" />
      </div>
      <Container>
        <div className="my-4 address-sheet">
          <div className="m-2 update">
            <span className="p-2 d-block" onClick={handleChangeAddress}>
              Jadikan Alamat Utama
            </span>
          </div>
          <div className="m-2 delete">
            <span className="p-2 d-block" onClick={handleDeleteAddress}>
              Hapus
            </span>
          </div>
        </div>
      </Container>
    </BottomSheet>
  );
};

export default ChangeDefaultAddress;
