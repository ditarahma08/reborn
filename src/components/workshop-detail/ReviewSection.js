import { CardReview, Col, Icon, Text } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import amplitude from 'amplitude-js';
import moment from 'moment';
import { useRouter } from 'next/router';
import Slider from 'react-slick';

const ReviewSection = (props) => {
  const { slug, reviewData, fullPath, wsDetail, wdpType } = props;
  const router = useRouter();

  const reviewCarousel = {
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    infinite: true,
    arrows: false,
    dots: true,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  const formatDate = (date) => {
    return moment(date).format('DD MMM YYYY');
  };

  const openDetailReview = (id, rating, review) => {
    router.push(`/bengkel/${slug}/review/${id}`);

    amplitude.getInstance().logEvent('review details viewed', {
      review_ratings: rating,
      review_details: review,
      workshop_name: wsDetail?.name,
      workshop_tier: wsDetail?.tier?.name,
      wdp_type: wdpType,
      page_location: fullPath
    });
  };

  const handleOpenReview = () => {
    router.push(`/bengkel/${slug}/review`);

    amplitude.getInstance().logEvent('review summary viewed', {
      ratings_average: reviewData?.rating,
      ratings_count: reviewData?.total_reviewer,
      workshop_name: wsDetail?.name,
      workshop_tier: wsDetail?.tier?.name,
      wdp_type: wdpType,
      page_location: fullPath
    });
  };

  const reviews = () => {
    const reviewList = reviewData?.reviews;
    const newReviewList =
      reviewList?.length > 0 ? reviewList?.filter((dt) => dt?.review?.length > 0) : [];

    return newReviewList;
  };

  return (
    <div>
      <Col className="d-flex align-items-start justify-content-between">
        <Col>
          <div className="d-flex align-items-center">
            <Icon
              card
              image="/assets/icons/star.svg"
              imageHeight={20}
              imageWidth={20}
              className="workshop-review-page--star-icon"
            />
            <Text color="dark" weight="bold" className="ms-2 mt-1">
              {reviewData?.rating}
            </Text>
            <Text color="placeholder" className="text-xs ms-1 mt-1">
              ({Helper.formatNumberCount(reviewData?.total_reviewer)} ulasan)
            </Text>
          </div>
        </Col>

        <Col className="d-flex flex-column align-items-end mt-2 d-none">
          <Text
            color="primary"
            weight="bold"
            className="text-sm pointer"
            onClick={handleOpenReview}>
            Lihat Semua
          </Text>
        </Col>
      </Col>

      <Col>
        {reviews()?.length > 0 && (
          <Slider {...reviewCarousel} className="workshop-review-section--carousel mt-3">
            {reviews()?.map((review, index) => (
              <div
                className="pointer"
                onClick={() => openDetailReview(review?.id, review?.rating, review?.review)}
                key={`review-card-carousel-${index}`}>
                <CardReview
                  showDate={false}
                  infoInline
                  content={review?.review}
                  username={review?.reviewer_name || '*******'}
                  date={formatDate(review?.created_at)}
                  small
                  charShow={100}
                  rating={review?.rating}
                />
              </div>
            ))}
          </Slider>
        )}
      </Col>
    </div>
  );
};

export default ReviewSection;
