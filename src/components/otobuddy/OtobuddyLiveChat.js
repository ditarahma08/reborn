import amplitude from 'amplitude-js';
import { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';

export const PopoverExternalized = (props) => {
  if (typeof window !== 'undefined') {
    return <Popover {...props}>{props.children}</Popover>;
  }
  return null;
};

const OtobuddyLiveChat = ({ isVisible, otobuddyType, otobuddySource }) => {
  const isDefault = otobuddyType === 'default';

  let fullPath = '';
  if (typeof window !== 'undefined') {
    fullPath = window.location.href;
  }

  const [isPopoverOpen, setIsPopoverOpen] = useState(true);

  const showPopover = () => {
    if (!isVisible) {
      return false;
    } else {
      return isPopoverOpen;
    }
  };

  const handleOpenChat = () => {
    amplitude.getInstance().logEvent('help initiated', {
      page_location: fullPath,
      source_icon: otobuddySource
    });
    if (typeof window !== 'undefined') {
      const chatId = document.getElementById('fc_frame');
      if (chatId) {
        window.fcWidget.open();
      }
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setIsPopoverOpen(false);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PopoverExternalized
        isOpen={showPopover()}
        positions={['left', 'top']}
        content={
          <div className="info-buddy align-items-center">
            <div>
              <div className="timer"></div>
            </div>
            <div className="ps-2">
              {isDefault ? (
                <span>
                  Ingin konsultasi masalah mobil kamu? <b>Klik OtoBuddy</b>
                </span>
              ) : (
                <span>
                  Tidak menemukan yang kamu cari? <b>Klik OtoBuddy</b>
                </span>
              )}
              <div className="close-btn" onClick={() => setIsPopoverOpen(false)}>
                x
              </div>
            </div>
          </div>
        }>
        <div
          id="custom_chat_button"
          data-automation="home_custom_chat-button"
          className="default-custom_chat_button"
          onClick={() => handleOpenChat()}></div>
      </PopoverExternalized>
    </>
  );
};

export default OtobuddyLiveChat;
