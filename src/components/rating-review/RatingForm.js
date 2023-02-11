// import { LottieCoin } from '@components/lottie/lottie';
import { Button, Col, Container, Icon, Input, Text } from '@components/otoklix-elements';
import OrderReview from '@components/rating-review/OrderReview';
import RatingInput from '@components/rating-review/RatingInput';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BottomSheet } from 'react-spring-bottom-sheet';
import ReactWhatsapp from 'react-whatsapp';

const RatingForm = (props) => {
  const { reviewData, open, loading, reviewProps, onDismiss } = props;
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [char, setChar] = useState(0);
  const [reviewFocus, setReviewFocus] = useState(false);
  const [rating, setRating] = useState(5);

  const onChangeReview = (event) => {
    const { value } = event.target;
    setReview(value);
    setChar(value.length);
  };

  const sendReview = () => {
    const reviewProps = { rating: rating, review: review, anonymous: anonymous };
    onDismiss('send', reviewProps);
  };

  const closeModal = () => {
    onDismiss();
  };

  useEffect(() => {
    setReview(reviewProps?.review);
    setRating(5);
    setChar(0);
  }, [reviewProps]);

  return (
    <BottomSheet
      open={open}
      blocking={true}
      skipInitialTransition
      scrollLocking={true}
      className="rating-form--bottomsheet-form reminder-bottomsheet">
      <Container className="p-3 mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <Text tag="div" weight="bold">
            Beri Review
          </Text>

          <Icon
            card
            className="pointer"
            image="/assets/icons/close-light-grey.svg"
            imageHeight={18}
            imageWidth={18}
            onClick={closeModal}
          />
        </Col>

        <Scrollbars
          autoHide
          autoHeight
          autoHeightMin="70vh"
          renderView={({ style, ...props }) => (
            <div {...props} style={{ ...style, marginRight: '0px' }} />
          )}>
          <Col className="d-flex my-4">
            <Icon
              image={reviewData?.booking_details?.package_image}
              imageHeight={56}
              imageWidth={56}
              className="rating-form--workshop-image"
            />

            <Col>
              <Text weight="bold" className="text-xs ms-2 text-truncate rating-form--truncate-text">
                {reviewData?.booking_details?.package_name}
              </Text>

              <div className="d-flex align-items-center">
                <Icon
                  card
                  textRight
                  image={reviewData?.workshop?.tier?.image_link}
                  imageHeight={10}
                  imageWidth={10}
                  className="rating-form--icon-verified"
                  title={
                    <Text
                      color="label"
                      className="text-xxs text-truncate rating-form--truncate-text">
                      {reviewData?.workshop?.name}
                    </Text>
                  }
                />
              </div>
            </Col>
          </Col>

          <Col className="my-3">
            <RatingInput addRating={(star) => setRating(star)} rating={rating} />
          </Col>

          <Col className="my-3">
            <OrderReview orderData={reviewData?.booking_details} />
          </Col>

          <Col className="my-3">
            <Text weight="bold" className="text-xs">
              Ceritakan Pengalamanmu
            </Text>
          </Col>

          <Col className="my-3 d-flex flex-column align-items-end">
            <Input
              data-automation="review_form_input_review"
              type="textarea"
              placeholder="Ceritakan pengalamanmu..."
              className={reviewFocus ? 'rating-form--input-review' : ''}
              value={review}
              onChange={onChangeReview}
              onFocus={() => setReviewFocus(true)}
              onBlur={() => setReviewFocus(false)}
            />
            {char !== 0 ? (
              <Text color="success" className="text-xs mt-3">
                Review kamu siap dikirim!
              </Text>
            ) : (
              ''
            )}
          </Col>

          <Col className="my-3 d-flex align-items-center justify-content-between">
            <div className="semi-round-checkbox me-2">
              <Input
                data-automation="review_form_checkbox_anonymous"
                type="checkbox"
                bsSize="xl"
                onChange={() => setAnonymous(!anonymous)}
              />
            </div>
            <div className="d-flex flex-column">
              <Text weight="bold" color="label" className="text-xs mb-1">
                Sembunyikan Namamu
              </Text>
              <Text color="label" className="text-xs">
                Klik box di samping untuk menyembunyikan namamu pada review
              </Text>
            </div>
          </Col>

          <Col className="my-3">
            <Button
              data-automation="review_form_button_submit"
              block
              loading={loading}
              disabled={rating === 0 || loading}
              onClick={sendReview}>
              Kirim Review
            </Button>
          </Col>

          <Col className="my-3">
            <Text color="label" className="text-xs">
              Dengan Kirim Review, berarti kamu setuju dengan{' '}
              <Text
                data-automation="review_form_link_terms_condition"
                color="secondary"
                tag="a"
                href="/account/terms-conditions"
                target="_blank">
                Syarat dan Ketentuan
              </Text>{' '}
              dan{' '}
              <Text
                data-automation="review_form_link_privacy"
                color="secondary"
                tag="a"
                href="/account/privacy-policy"
                target="_blank">
                Kebijakan Privasi
              </Text>{' '}
              kami.
            </Text>
          </Col>

          <Col className="mt-3 mb-5">
            <ReactWhatsapp
              data-automation="review_form_button_help"
              number={process.env.CS_NUMBER}
              message="Hai Otoklix, saya butuh bantuan untuk order saya."
              className="btn btn-subtle btn-md d-block w-100">
              Butuh Bantuan?
            </ReactWhatsapp>
          </Col>
        </Scrollbars>
      </Container>
    </BottomSheet>
  );
};

export default RatingForm;
