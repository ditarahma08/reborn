import { Card, CardBody, CardSubtitle, CardTitle, Icon } from '@components/otoklix-elements';

const CardSearchWorkshop = (props) => {
  const {
    title,
    tier,
    tierImage,
    image,
    rating,
    ratingImage,
    distance,
    locationImage,
    timeArrival,
    showButtonLocation,
    buttonLocationClick,
    className,
    ...attributes
  } = props;

  let locationInfo = `${distance}`;
  if (timeArrival) {
    locationInfo = `${distance} - ${timeArrival}`;
  }
  return (
    <Card className={`card-search-workshop ${className}`} {...attributes}>
      <img className="card-image" src={image} alt="" />
      <CardBody className="p-0 px-2">
        <div className="d-flex">
          <div>
            {tier && (
              <div className="d-flex align-items-center mb-1">
                {tierImage && (
                  <img className="me-1" width="12" height="12" src={tierImage} alt="" />
                )}
                <CardSubtitle className="m-0">{tier}</CardSubtitle>
              </div>
            )}
            <CardTitle className="mb-1">{title}</CardTitle>
          </div>
        </div>
        <div className="d-flex mb-1">
          {rating && (
            <Icon
              size="sm"
              textRight
              imageWidth={12}
              imageHeight={12}
              className="me-3"
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
      </CardBody>
    </Card>
  );
};

export default CardSearchWorkshop;
