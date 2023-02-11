import ModalCancelBooking from '@components/modal/ModalCancelBooking';
import { Container, Text } from '@components/otoklix-elements';
import amplitude from 'amplitude-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

const OrderButtonSheet = (props) => {
  const router = useRouter();
  const { openSheet, onDismiss, buttonList } = props;

  const [itemUrl, setItemUrl] = useState();

  const handleOpenChat = (name) => {
    sendAmplitudeEvent(name);

    if (typeof window !== 'undefined') {
      const chatId = document.getElementById('fc_frame');
      onDismiss();
      if (chatId) {
        window.fcWidget.open();
      }
    }
  };

  const handleOnDismiss = () => {
    onDismiss();
  };

  const handleColorButton = (name) => {
    let color;

    if (name === 'Batal') {
      color = 'danger';
    } else if (name === 'Ubah Jadwal') {
      color = 'primary';
    } else {
      color = '';
    }

    return color;
  };

  const handleOnclick = (name, url) => {
    sendAmplitudeEvent(name);

    if (name === 'Batal') {
      onDismiss();
      setItemUrl(url);
    } else {
      router.push(url);
    }
  };

  const sendAmplitudeEvent = (name) => {
    amplitude.getInstance().logEvent('order options initiated', { option_type: name });
  };

  return (
    <>
      <BottomSheet
        open={openSheet}
        onDismiss={handleOnDismiss}
        className="button-list-order-sheet box-mobile-first"
        skipInitialTransition
        initialFocusRef={true}
        scrollLocking={false}
        blocking={true}
        header>
        <Container className="py-3">
          {buttonList?.map((item, index) => (
            <div key={index}>
              {item?.name === 'Hubungi Otobuddy' ? (
                <div
                  data-automation="order_list_button_otobuddy"
                  className="py-3 px-2 pointer"
                  onClick={() => handleOpenChat(item?.name)}>
                  <Text>{item?.name}</Text>
                </div>
              ) : (
                <div
                  data-automation={
                    item?.name === 'Ubah Jadwal'
                      ? 'order_list_button_reschedule'
                      : item?.name === 'Batal'
                      ? 'order_list_button_batal'
                      : 'order_list_button_detail'
                  }
                  className="py-3 px-2 pointer"
                  onClick={() => handleOnclick(item?.name, item?.url)}>
                  <Text color={handleColorButton(item?.name)}>{item?.name}</Text>
                </div>
              )}
              <hr />
            </div>
          ))}
        </Container>
      </BottomSheet>
      <ModalCancelBooking
        isOpen={!!itemUrl}
        onOK={() => router.push(itemUrl)}
        onCancel={() => setItemUrl()}
        dataAutomationCancelOrder="order_list_batalkan_order"
        dataAutomationCloseModal="order_list_close_modal"
      />
    </>
  );
};

export default OrderButtonSheet;
