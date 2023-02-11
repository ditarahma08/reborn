import PlainHeader from '@components/header/PlainHeader';
import PrivateLayout from '@components/layouts/PrivateLayout';
import { Container, Icon, RatingStar } from '@components/otoklix-elements';
import Skeleton from '@components/skeleton/Skeleton';
import { sentryBreadcrumb } from '@utils/globalFunctions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

sentryBreadcrumb('pages/promo/index');

const DetailReview = ({ review }) => {
  const router = useRouter();
  const wsIcon = review?.workshop_tier?.image_link || '';

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [review]);

  return (
    <PrivateLayout pathName="/" wrapperClassName="wrapper-full">
      <PlainHeader
        title="Detail Review"
        icon="/assets/icons/arrow-left-blue.svg"
        iconOnClick={() => router.back()}
      />

      <Container>
        <div className="detail-review mt-2 mb-1">
          <span className="detail-review--label mb-2">Ulasan Dari</span>
          {isLoading ? (
            <>
              <Skeleton width={'58%'} height={'20px'} />
              <Skeleton width={'58%'} height={'20px'} />
            </>
          ) : (
            <>
              <h5 className="detail-review--name mb-1">{review?.reviewer_name || '*******'}</h5>
              <p className="detail-review--extra mb-0">{review?.date || '-'}</p>
            </>
          )}
        </div>
        <RatingStar rating={review?.rating || 0} iconHeight={20} iconWidth={20} />
        <div className="detail-review mt-2 mb-3">
          <span className="detail-review--label mb-2">Untuk Bengkel</span>
          <div className="d-flex justify-content-left align-items-center">
            {wsIcon && (
              <Icon
                className="workshop-navbar-info__icon mt-0 me-1"
                card
                textRight
                image={wsIcon}
                imageHeight={16}
                imageWidth={16}
              />
            )}
            {isLoading ? (
              <Skeleton width={'50%'} height={'20px'} />
            ) : (
              <h6 className="detail-review--ws-name mb-0">{review?.workshop_name || '-'}</h6>
            )}
          </div>
        </div>
        <div className="detail-review my-2">
          <span className="detail-review--label mb-2">Deskripsi Ulasan</span>
          {isLoading ? (
            <>
              {[1, 2, 3].map((index) => (
                <Skeleton key={index} width={'100%'} height={'20px'} />
              ))}
              <Skeleton width={'50%'} height={'20px'} />
            </>
          ) : (
            <p className="detail-review--description">{review?.review || '-'}</p>
          )}
        </div>
      </Container>
    </PrivateLayout>
  );
};

export default DetailReview;

export async function getServerSideProps({ query }) {
  const { id } = query;

  const [reviewRes] = await Promise.all([fetch(`${process.env.API_URL}v2/review/${id}`)]);

  const [reviewData] = await Promise.all([reviewRes.json()]);
  const review = reviewData?.data ? reviewData?.data : null;

  return {
    props: {
      review
    }
  };
}
