import { Card, CardBody, CardSubtitle, CardTitle, Icon, Tags } from '@components/otoklix-elements';

const CardSearchService = (props) => {
  const {
    badgeTitle,
    title,
    workshopTitle,
    workshopImage,
    discount,
    image,
    rating,
    ratingImage,
    distance,
    locationImage,
    timeArrival,
    originalPrice,
    price,
    showButtonLocation,
    showButtonVehicle,
    buttonVehicleImage,
    buttonLocationClick,
    buttonVehicleClick,
    className,
    ...attributes
  } = props;

  const renderRibbonDiscount = () => {
    return (
      <div className="ribbon-container ms-2">
        <div className="ribbon-discount">
          <svg width="27" height="36" viewBox="0 0 27 36" fill="none">
            <path d="M27 36V13H0V36L13.5 32.8056L27 36Z" fill="#FFC727" />
            <path d="m0 0.022533h27v13.977h-27z" fill="#FFC727" />
          </svg>

          <span className="ribbon-text fw-semi-bold">
            <div>{discount}</div>
            <div className="text-white-lg">OFF</div>
          </span>
        </div>
      </div>
    );
  };

  let locationInfo = `${distance}`;
  if (timeArrival) {
    locationInfo = `${distance} - ${timeArrival}`;
  }
  return (
    <Card className={`card-search-service ${className}`} {...attributes}>
      {badgeTitle && (
        <Tags
          className="badge-top-left"
          title={badgeTitle}
          size="sm"
          pill={true}
          textColor="secondary"
          color="secondary-light"
        />
      )}
      <img className="card-image" src={image} alt="" />
      <CardBody className="p-0 px-2">
        <div className="d-flex">
          <div>
            <CardTitle className="m-0">{title}</CardTitle>
            <div className="d-flex align-items-center">
              <CardSubtitle>{workshopTitle}</CardSubtitle>
              {workshopImage && (
                <img className="ms-1" width="12" height="12" src={workshopImage} alt="" />
              )}
            </div>
          </div>
          {discount && renderRibbonDiscount()}
        </div>
        <div className="d-flex mb-1">
          {rating && (
            <Icon
              size="sm"
              textRight
              imageWidth={12}
              imageHeight={12}
              textClassName="card-stats me-1"
              title={rating.toString()}
              image={ratingImage}
            />
          )}
          {!showButtonLocation && distance && (
            <Icon
              size="sm"
              textRight
              imageWidth={12}
              imageHeight={12}
              textClassName="card-stats me-1"
              title={locationInfo}
              image={locationImage}
            />
          )}
          {showButtonLocation && (
            <div
              className="card-stats d-flex align-items-center pointer"
              onClick={buttonLocationClick}
              data-automation="select_location">
              <img width="12" height="12" src={locationImage} alt="" />
              <span className="highlight mx-1">Pilih Lokasi</span>
              <span className="detail">untuk melihat jarak</span>
            </div>
          )}
        </div>
        {!showButtonVehicle && (
          <div className="d-flex align-items-center mt-2">
            {originalPrice && <div className="original-price me-2">{originalPrice}</div>}
            <div className="price">{price}</div>
          </div>
        )}
        {showButtonVehicle && (
          <div
            className="d-flex align-items-center mx-2 pointer"
            data-automation="add_car_button"
            onClick={buttonVehicleClick}>
            {buttonVehicleImage && (
              <img className="me-2" src={buttonVehicleImage} width={20} height={20} alt="" />
            )}
            <div className="">
              <div className="btn-title text-secondary">Tambah Mobil</div>
              <div className="btn-subtitle">Untuk melihat harga</div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CardSearchService;
