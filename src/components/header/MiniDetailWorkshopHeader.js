import { Icon } from '@components/otoklix-elements';
import ShareSheet from '@components/sheet/ShareSheet';
import amplitude from 'amplitude-js';
import { useState } from 'react';

const MiniDetailWorkshopHeader = (props) => {
  const {
    title,
    icon,
    iconOnClick,
    titleIcon,
    workshopSlug,
    hasShareButton,
    isSticky,
    fullPath,
    backDataQa
  } = props;

  const [openShareSheet, setOpenShareSheet] = useState(false);

  const handleDismissShare = () => {
    setOpenShareSheet(false);
  };

  const handleOpenShare = () => {
    amplitude.getInstance().logEvent('share initiated', {
      source_icon: 'workshop detail',
      share_details: `workshop - ${title}`,
      page_location: fullPath
    });
    setOpenShareSheet(true);
  };

  return (
    <div className={`py-2 clear-header ${isSticky && 'sticky-top z-index-100 shadow-sm'}`}>
      <div className="d-flex justify-content-start align-items-center p-2 w-100">
        <div className="me-1">
          <Icon
            data-automation={backDataQa}
            textRight
            imageWidth={20}
            imageHeight={20}
            size="sm"
            bgIconColor="off-white"
            className="pointer"
            iconClassName="workshop-navbar-back"
            onClick={iconOnClick}
            image={icon}
          />
        </div>
        <span className={`title text-left fw-bold w-100 text-truncate`}>
          {titleIcon && <img width="20px" src={titleIcon} className="me-1" alt="title-icon" />}
          {title}
        </span>
        {hasShareButton && (
          <div className="float-end">
            <Icon
              card
              textRight
              className="pointer mx-2"
              image="/assets/icons/share-grey.svg"
              imageHeight={20}
              imageWidth={20}
              onClick={handleOpenShare}
            />
          </div>
        )}
      </div>

      <ShareSheet
        link={`https://otoklix.com/bengkel/${workshopSlug}`}
        openSheet={openShareSheet}
        onDismiss={handleDismissShare}
      />
    </div>
  );
};

export default MiniDetailWorkshopHeader;
