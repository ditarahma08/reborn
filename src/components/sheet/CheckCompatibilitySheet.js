import { Button, Container, Text } from '@components/otoklix-elements';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BottomSheet } from 'react-spring-bottom-sheet';

const CheckCompatibilitySheet = (props) => {
  const { handleRecommend, forceOrder, openSheet, onDismiss } = props;

  return (
    <BottomSheet
      className="box-mobile-first bottom-sheet-order"
      open={openSheet}
      onDismiss={onDismiss}
      snapPoints={() => [355]}
      skipInitialTransition
      scrollLocking={false}
      blocking={true}
      onSpringStart={(event) => {
        if (event.type === 'SNAP' && event.source === 'dragging') {
          onDismiss();
        }
      }}>
      <Scrollbars autoHide autoHeight autoHeightMin={'calc(85vh - 106px)'} universal={true}>
        <Container className="px-2 mt-1" data-automation="popup_car_compatibility">
          <div className="text-center">
            <img
              src="/assets/images/check-compatibility.png"
              height={150}
              width={150}
              loading="lazy"
            />
            <br />
            <Text className="fs-7 fw-bold">Perawatan Tidak Sesuai Mobilmu, Nih!</Text>
            <Text tag="p" className="my-3 text-sm" color="label">
              Kamu bisa tetap “Lanjut Order” atau klik “Rekomendasi” untuk temukan servis sesuai
              mobilmu
            </Text>
          </div>
          <div className="d-flex">
            <Button
              data-automation="popup_car_compatibility_button_recommendation"
              className="mb-3 mt-auto rounded-pill btn-border-primary"
              block
              color="subtle"
              onClick={() => handleRecommend()}>
              Rekomendasi
            </Button>
            <div className="p-1"></div>
            <Button
              data-automation="popup_car_compatibility_button_continue"
              className="mb-3 mt-auto rounded-pill"
              block
              color="primary"
              onClick={() => forceOrder()}>
              Lanjut Order
            </Button>
          </div>
        </Container>
      </Scrollbars>
    </BottomSheet>
  );
};

export default CheckCompatibilitySheet;
