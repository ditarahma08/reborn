import { Card, CardBody, CardTitle, Icon } from '@components/otoklix-elements';
import Helper from '@utils/Helper';

const CardSearchExplore = (props) => {
  const { title, tierImage, rating, ratingImage, distance, className, ...attributes } = props;

  return (
    <Card className={`card-search-workshop ${className}`} {...attributes}>
      <CardBody className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="d-flex align-items-center">
            <CardTitle className="mb-0 me-1">{Helper.truncateText(title, 12)}</CardTitle>
            {tierImage && <img width="13" height="13" src={tierImage} alt="" />}
          </div>
          <div className="d-flex align-items-center">
            {distance && <span className="distance">{distance}</span>}
            {rating && (
              <>
                <span className="separator mx-2">|</span>
                <Icon
                  size="sm"
                  textRight
                  imageWidth={12}
                  imageHeight={12}
                  textClassName="star-search-explore mx-1"
                  title={rating.toString()}
                  image={ratingImage}
                />
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardSearchExplore;
