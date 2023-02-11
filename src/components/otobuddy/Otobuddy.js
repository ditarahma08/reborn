import OtobuddyModal from '@components/modal/OtobuddyModal';
import { gtag } from '@utils/Gtag';
import { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';

export const PopoverExternalized = (props) => {
  if (typeof window !== 'undefined') {
    return <Popover {...props}>{props.children}</Popover>;
  }
  return null;
};

const Otobuddy = ({ isVisible, otobuddyType }) => {
  const isDefault = otobuddyType === 'default';

  const [showModal, setShowModal] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);

  const onClick = () => {
    if (isDefault) {
      gtag('open otobuddy home', 'clickOtoBuddyHome');
    } else if (otobuddyType === 'globalsearch') {
      gtag('click otobuddy icon', 'clickSearchPage');
    } else {
      gtag('open otobuddy workshop', 'clickOtoBuddyWorkshop');
    }

    setShowModal(!showModal);
  };

  const showPopover = () => {
    if (!isVisible) {
      return false;
    } else {
      return isPopoverOpen;
    }
  };

  const onClickAskCS = () => {
    if (isDefault) {
      gtag('click tanya cs home', 'clickOtoBuddyHome');
    } else {
      gtag('click tanya cs workshop', 'clickOtoBuddyWorkshop');
    }
  };

  const onClickAskExpert = () => {
    if (isDefault) {
      gtag('click konsultasi otoexpert home', 'clickOtoBuddyHome');
    } else {
      gtag('click konsultasi otoexpert workshop', 'clickOtoBuddyWorkshop');
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
      <OtobuddyModal
        isOpen={showModal}
        toggle={() => onClick()}
        onClickAskCS={() => onClickAskCS()}
        onClickAskExpert={() => onClickAskExpert()}
      />

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
          className={`otobuddy ${isVisible ? '' : 'hide-buddy'} ${
            isDefault ? '' : 'workshop-buddy'
          }`}
          onClick={() => onClick()}>
          <img
            src={`${
              isDefault ? '/assets/images/otobuddy.png' : '/assets/images/otobuddy-metro.png'
            }`}
            alt="otobuddy"
          />
        </div>
      </PopoverExternalized>
    </>
  );
};

export default Otobuddy;
