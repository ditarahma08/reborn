import { Col, Icon, Text } from '@components/otoklix-elements';

const RatingSummary = (props) => {
  const { rating, ratingSummary, ratingTotal } = props;

  return (
    <Col className="my-3">
      <Text
        color="dark"
        weight="bold"
        className="workshop-section-title d-flex align-items-center mb-2 text-md">
        Rating
      </Text>

      <div className="d-flex col-12">
        <Col className="d-flex flex-column col-3">
          <Text weight="bold" className="workshop-review-page--rating-total">
            {rating}
          </Text>
          <Text color="placeholder" className="text-xs">
            dari 5
          </Text>
        </Col>

        <Col>
          {ratingSummary
            .slice(0)
            .reverse()
            .map((rating, index) => (
              <div className="d-flex align-items-center col-12" key={`rating-sum-${index}`}>
                <div className="d-flex col-3 justify-content-end">
                  {[...Array(rating?.star)].map((star, index) => (
                    <Icon
                      card
                      image="/assets/icons/star.svg"
                      imageHeight={10}
                      imageWidth={10}
                      className="workshop-review-page--star-icon"
                      key={`rating-star-sum-${index}`}
                    />
                  ))}
                </div>

                <div className="progress workshop-review-page--progressbar col-7 mx-2">
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: `${rating?.percentage}` }}></div>
                </div>

                <div className="w-100 text-end">
                  <Text color="placeholder" className="text-xxs">
                    {rating?.percentage}
                  </Text>
                </div>
              </div>
            ))}

          <div className="d-flex justify-content-end mt-1">
            <Text color="placeholder" className="text-xxs">
              Jumlah rating&nbsp;
            </Text>
            <Text className="text-xxs" weight="bold">
              {ratingTotal}
            </Text>
          </div>
        </Col>
      </div>
    </Col>
  );
};

export default RatingSummary;
