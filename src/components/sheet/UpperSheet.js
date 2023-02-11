import { Button, Container, Row, Text } from '@components/otoklix-elements';
import { MobileView } from 'react-device-detect';

export const config = {
  unstable_runtimeJS: false
};

const Uppersheet = ({
  handleCloseSheet,
  handleOpen,
  desc,
  icon,
  buttonText,
  page,
  closeIcon = '/assets/icons/close-square.svg'
}) => {
  return (
    <Container>
      <Row>
        <MobileView className="uppersheet d-flex justify-content-between align-items-center flex-nowrap">
          <div className="d-flex align-items-center col pe-1">
            <div
              onClick={handleCloseSheet}
              className="pointer"
              data-automation={`${page}_close_uppersheet`}>
              <img src={closeIcon} height={16} weight={16} alt="close" />
            </div>
            <img src={icon} height={48} weight={48} alt="inspeksi" className="mx-2" />
            <Text className="w-auto ps-0 uppersheet-text" color="white">
              {desc}
            </Text>
          </div>

          <Button
            className="button col-3 me-2"
            onClick={handleOpen}
            data-automation={`${page}_uppersheet_open_button`}>
            {buttonText}
          </Button>
        </MobileView>
      </Row>
    </Container>
  );
};

export default Uppersheet;
