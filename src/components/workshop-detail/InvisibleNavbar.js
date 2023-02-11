import { Col, Icon } from '@components/otoklix-elements';
import ShareSheet from '@components/sheet/ShareSheet';
import VehicleNavbar from '@components/workshop-detail/VehicleNavbar';
import amplitude from 'amplitude-js';
import { useState } from 'react';

const InvisibleNavbar = (props) => {
  const {
    rating,
    showNavbar,
    workshopDetail,
    workshopSlug,
    workshopType,
    onBack,
    idShare,
    car,
    showCar,
    editCar,
    trackerPath
  } = props;

  const [openShareSheet, setOpenShareSheet] = useState(false);

  const mainClass = 'header-fixed-top d-flex justify-content-center flex-column';
  const showRating = rating > 0 && workshopType !== 'non_verified';

  const handleDismissShare = () => {
    setOpenShareSheet(false);
  };

  const trackShare = () => {
    amplitude.getInstance().logEvent('share initiated', {
      source_icon: 'workshop detail',
      share_details: `workshop - ${workshopDetail?.name}`,
      page_location: trackerPath
    });
  };

  return (
    <div
      className={showNavbar ? `bg-white border-bottom position-sticky ${mainClass}` : mainClass}
      id="headerInvisibleNavbar">
      <Col className="d-flex p-2 workshop-navbar-wrapper" id={idShare}>
        <Icon
          textRight
          imageWidth={20}
          imageHeight={20}
          size="sm"
          bgIconColor="off-white"
          onClick={onBack}
          className={`pointer header-back-margin ${!showNavbar && 'on-scroll'}`}
          iconClassName="rounded-circle border workshop-navbar-back"
          image="/assets/icons/arrow-left-blue.svg"
        />

        {showNavbar && showCar ? (
          <VehicleNavbar car={car} onEditCar={editCar} />
        ) : (
          <Col
            className={
              showNavbar
                ? 'd-flex justify-content-between workshop-navbar-info__content --visible'
                : 'd-flex justify-content-between workshop-navbar-info__content'
            }>
            <div className="workshop-navbar-info">
              {workshopDetail?.tier && workshopDetail?.tier.value !== 'non_verified' ? (
                <Icon
                  card
                  textRight
                  image={workshopDetail?.tier?.image_link}
                  imageHeight={15}
                  imageWidth={15}
                  className="workshop-navbar-info__icon"
                  title={
                    <span className="workshop-navbar-info__title mb-0">{workshopDetail?.name}</span>
                  }
                />
              ) : (
                <span className="workshop-navbar-info__title mb-0 ms-2">
                  {workshopDetail?.name}
                </span>
              )}

              <div
                className={
                  showRating
                    ? 'workshop-navbar-info__subtitle ms-2'
                    : 'workshop-navbar-info__subtitle ms-2 mt-1'
                }>
                <span className="workshop-navbar-info__district">{workshopDetail?.kecamatan}</span>
                <span>
                  &nbsp;|&nbsp;{workshopDetail?.distance}km - {workshopDetail?.eta}{' '}
                  {workshopDetail?.eta > 1 ? 'mins' : 'min'}
                </span>
                {showRating && (
                  <>
                    <Icon
                      className="workshop-navbar-info__icon mt-0"
                      card
                      textRight
                      image="/assets/icons/star.svg"
                      imageHeight={12}
                      imageWidth={12}
                    />
                    <span className="d-flex">
                      <span className="workshop-navbar-info__subtitle fw-bold ps-0">{rating}</span>
                      <span className="workshop-navbar-info__subtitle">/5</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="d-flex">
              <Icon
                card
                textRight
                className="pointer ms-2"
                image="/assets/icons/share-blue.svg"
                imageHeight={20}
                imageWidth={20}
                onClick={() => {
                  setOpenShareSheet(true);
                  trackShare();
                }}
              />
            </div>
          </Col>
        )}

        {openShareSheet && (
          <ShareSheet
            link={`https://otoklix.com/bengkel/${workshopSlug}`}
            openSheet={openShareSheet}
            onDismiss={handleDismissShare}
          />
        )}
      </Col>
    </div>
  );
};

export default InvisibleNavbar;
