import { useAuth } from '@contexts/auth';
import { api } from '@utils/API';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ModalReviewConfirm = dynamic(() => import('@components/rating-review/ModalReviewConfirm'));
const ModalReviewSent = dynamic(() => import('@components/rating-review/ModalReviewSent'));
const RatingForm = dynamic(() => import('@components/rating-review/RatingForm'));

const RatingFormBundle = (props) => {
  const { open, onClose, onOpen, bookingCode } = props;
  const { user } = useAuth();

  const [ratingForm, setRatingForm] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalSent, setModalSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewProps, setReviewProps] = useState({ rating: 0, review: '' });

  const toggleModalSent = () => {
    setModalSent(!modalSent);
  };

  const closeRatingForm = () => {
    setRatingForm(false);
    onClose();
  };

  const openRatingForm = () => {
    setRatingForm(true);
    onOpen();
  };

  const handleDismissRatingForm = (event, prop) => {
    setReviewProps(prop);

    if (event === 'confirm') {
      closeRatingForm();
      setModalConfirm(true);
    } else if (event === 'send') {
      setLoading(true);
      confirmReview(prop);
    } else {
      closeRatingForm();
    }
  };

  const cancelConfirm = () => {
    setModalConfirm(false);
    openRatingForm();
  };

  const confirmReview = (prop) => {
    setLoading(true);
    // setModalConfirm(false);
    // openRatingForm();
    sendReview(prop);
  };

  const sendReview = (params) => {
    api
      .post(`v2/review/`, {
        booking_code: bookingCode,
        review: params?.review || '',
        rating: params?.rating,
        reviewer_name: user?.name,
        workshop_name: params?.workshops?.name,
        is_hidden_name: params?.anonymous ? 1 : 0
      })
      .then(() => {
        setLoading(false);
        closeRatingForm();
        setModalSent(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getReviewData = (code) => {
    api
      .get(`v2/bookings/${code}/review/detail/`)
      .then((response) => {
        setReviewData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onReviewSent = () => {
    toggleModalSent();
    location.reload();
  };

  useEffect(() => {
    setRatingForm(open);
  }, [open]);

  useEffect(() => {
    bookingCode && getReviewData(bookingCode);
    setReviewProps({ review: '', rating: 0, anonymous: false });
  }, [bookingCode]);

  return (
    <div>
      <RatingForm
        open={ratingForm}
        loading={loading}
        reviewData={reviewData}
        onDismiss={handleDismissRatingForm}
        reviewProps={reviewProps}
      />
      <ModalReviewConfirm
        isOpen={modalConfirm}
        onCancel={cancelConfirm}
        onConfirm={confirmReview}
      />
      <ModalReviewSent isOpen={modalSent} toggle={toggleModalSent} onConfirm={onReviewSent} />
    </div>
  );
};

export default RatingFormBundle;
