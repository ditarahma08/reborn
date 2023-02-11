import PlainHeader from '@components/header/PlainHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import {
  CardReview,
  Col,
  Container,
  EmptyState,
  Spinner,
  Text
} from '@components/otoklix-elements';
import RatingSummary from '@components/rating-review/RatingSummary';
import ReviewFilter from '@components/rating-review/ReviewFilter';
import { api } from '@utils/API';
import { monasLocation } from '@utils/Constants';
import Helper from '@utils/Helper';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import InfiniteScroll from 'react-infinite-scroller';

const Review = (props) => {
  const { workshopDetail, reviewData, slug } = props;
  const tracksRef = useRef(null);
  const router = useRouter();

  const [serviceOptions, setServiceOptions] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [hasReview, setHasReview] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [params, setParams] = useState({
    order_by: 'latest',
    category_service: '',
    rating: ''
  });

  const [ratingTotal, setRatingTotal] = useState();
  const [ratingSummary, setRatingSummary] = useState([]);

  const assignInitReviews = () => {
    const subRating = reviewData?.data?.sub_total_reviewer;
    const totalReviewer = reviewData?.data?.total_reviewer;

    setReviewList(reviewData?.data?.reviews);
    setHasReview(reviewData?.data?.reviews.length > 0);
    setRatingTotal(Helper.formatNumberCount(totalReviewer));
    setRatingSummary([
      {
        star: 1,
        percentage: subRating?.star_one
          ? Helper.formatPercentage(subRating?.star_one / totalReviewer)
          : `${subRating?.star_one}%`
      },
      {
        star: 2,
        percentage: subRating?.star_two
          ? Helper.formatPercentage(subRating?.star_two / totalReviewer)
          : `${subRating?.star_two}%`
      },
      {
        star: 3,
        percentage: subRating?.star_three
          ? Helper.formatPercentage(subRating?.star_three / totalReviewer)
          : `${subRating?.star_three}%`
      },
      {
        star: 4,
        percentage: subRating?.star_four
          ? Helper.formatPercentage(subRating?.star_four / totalReviewer)
          : `${subRating?.star_four}%`
      },
      {
        star: 5,
        percentage: subRating?.star_five
          ? Helper.formatPercentage(subRating?.star_five / totalReviewer)
          : `${subRating?.star_five}%`
      }
    ]);
  };

  const assignServiceCategoryOptions = (serviceCategory) => {
    const options = serviceCategory.map((service) => {
      return { name: service?.name, icon: service?.icon_link };
    });

    options.unshift({ name: 'Semua Servis', icon: '' });

    setServiceOptions(options);
  };

  const assignFilter = (key, value) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    getReviewList(newParams, true, 1);
  };

  const fetchMoreReviews = async (payload, restart, page) => {
    let pages;

    try {
      setIsFetching(true);

      if (restart) {
        setPageIndex(1);
        setReviewList([]);
        setHasMoreItems(true);
        pages = 1;
      } else {
        pages = page ?? pageIndex;
      }

      getReviewList(payload, restart, pages);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviewList = async (params, restart, page) => {
    api
      .get(`v2/workshops/${slug}/reviews/?page=${page}`, { params })
      .then((res) => {
        const data = res?.data?.data;
        if (data?.reviews?.length < 10) setHasMoreItems(false);
        if (restart) {
          console.log('masuk restart');
          tracksRef?.current?.scrollToTop();
          setReviewList(res?.data?.data?.reviews);
        } else {
          console.log('masuk no-restart');
          const reviewArr = uniqBy([...reviewList, ...data?.reviews], 'id');
          setReviewList(reviewArr);
        }
        setIsFetching(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reviews = () => {
    const newReviewList =
      reviewList?.length > 0 ? reviewList?.filter((dt) => dt?.review?.length > 0) : [];

    return newReviewList;
  };

  const onScrollUpdate = (values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 55; // padding before reach bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);

    if (t > 1 && !isFetching) {
      setLoading(false);
    }
  };

  const handleLoadItems = () => {
    const increasePageIndex = pageIndex + 1;
    setPageIndex(increasePageIndex);
    setLoading(true);
    fetchMoreReviews(params, false, increasePageIndex);
  };

  const emptyState = (text) => (
    <EmptyState
      image="/assets/images/no-review.png"
      imgAlt="No review"
      imgHeight={140}
      imgWidth={140}>
      <div className="d-flex flex-column">
        <Text color="dark" className="mb-2 workshop-review-section--empty-title">
          Belum Ada Review
        </Text>
        <Text color="dark" className="text-xs">
          {text}
        </Text>
      </div>
    </EmptyState>
  );

  useEffect(() => {
    if (reviewData) {
      assignInitReviews();
    }
  }, [reviewData]);

  useEffect(() => {
    assignServiceCategoryOptions(workshopDetail?.service_categories);
  }, [workshopDetail]);

  return (
    <PrivateLayout
      wrapperClassName="wrapper-full"
      hasAppBar={false}
      title={Helper.metaWorkshop(workshopDetail)?.title}
      description={Helper.metaWorkshop(workshopDetail)?.desc}>
      <PlainHeader
        title="Rating & Review"
        icon="/assets/icons/arrow-left-blue.svg"
        iconOnClick={() => router.back()}
      />
      <Container>
        {hasReview && (
          <Col>
            <RatingSummary
              rating={reviewData?.data?.rating}
              ratingSummary={ratingSummary}
              ratingTotal={ratingTotal}
            />

            <ReviewFilter serviceOptions={serviceOptions} onChangeFilter={assignFilter} onChange />

            <Scrollbars
              autoHide
              autoHeight
              autoHeightMin="59vh"
              universal={true}
              onUpdate={onScrollUpdate}
              ref={tracksRef}>
              <InfiniteScroll
                threshold={500}
                pageStart={0}
                loadMore={handleLoadItems}
                hasMore={hasMoreItems && !loading}
                useWindow={false}>
                {reviews().map((review, index) => (
                  <div
                    className="my-3 workshop-review-list--card-review"
                    key={`review-${index}`}
                    onClick={() => router.push(`/bengkel/${slug}/review/${review?.id}`)}>
                    <CardReview
                      content={review?.review}
                      username={review?.reviewer_name || '*******'}
                      rating={review?.rating}
                      date={moment(review?.created_at).format('DD MMM YYYY')}
                      charShow={130}
                    />
                  </div>
                ))}

                {!loading && reviews()?.length < 1 && (
                  <div className="mt-5">
                    {emptyState(
                      'Sayang sekali bengkel ini belum memiliki review untuk dilihat pada filter yang anda pilih'
                    )}
                  </div>
                )}

                {hasMoreItems && isFetching ? (
                  <div className="d-flex justify-content-center align-items-center my-4">
                    <Spinner color="placeholder" size="sm" />
                    <Text color="placeholder" className="text-sm ms-2">
                      Memuat Lebih Banyak Ulasan...
                    </Text>
                  </div>
                ) : null}
              </InfiniteScroll>
            </Scrollbars>
          </Col>
        )}

        {!hasReview && (
          <Col className="workshop-review-section--empty workshop-review-section--empty-page d-flex align-items-center">
            {emptyState('Sayang sekali bengkel ini belum memiliki review untuk dilihat')}
          </Col>
        )}
      </Container>
    </PrivateLayout>
  );
};

export default Review;

export async function getServerSideProps({ query }) {
  const { slug, lat, lng, variant_car_id, promo } = query;
  const queryLocation = lat && lng;

  const location = {
    lat: queryLocation ? Number(lat) : monasLocation.lat,
    lng: queryLocation ? Number(lng) : monasLocation.lng
  };

  let params = {
    promo,
    variant_car_id,
    latitude: location.lat,
    longitude: location.lng
  };

  const apiWorkshopDetailUrl = `${process.env.API_URL}v2/workshops/${slug}/?${stringify(params)}`;
  const apiReviewUrl = `${process.env.API_URL}v2/workshops/${slug}/reviews`;

  const [workshopDataRes, reviewDataRes] = await Promise.all([
    fetch(apiWorkshopDetailUrl),
    fetch(apiReviewUrl)
  ]);

  const [workshopData, reviewData] = await Promise.all([
    workshopDataRes.json(),
    reviewDataRes.json()
  ]);

  const workshopDetail = workshopData?.data;

  return {
    props: {
      workshopDetail,
      reviewData,
      slug
    }
  };
}
