import { Star, Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';

const RatingInput = (props) => {
  const { addRating, rating = 5 } = props;
  const [stars, setStars] = useState([true, true, true, true, true]);

  const assignRatingValue = (rating) => {
    const newStarsValue = stars.map((star, index) => {
      return index <= rating ? true : false;
    });
    setStars(newStarsValue);
    addRating(rating + 1);
  };
  useEffect(() => {
    assignRatingValue(rating - 1);
  }, [rating]);

  return (
    <div className="d-flex flex-column align-items-center rating-form--rating-star pb-3 pt-4">
      <Text weight="bold" className="text-xs">
        Bagaimana Pengalaman Servismu ?
      </Text>
      <Text color="label" className="text-xs my-2">
        1: tidak puas, 5: sangat puas
      </Text>

      <div className="d-flex my-3">
        {stars.map((star, index) => (
          <div
            data-automation={`review_form_star_rating_${index}`}
            className="pointer mx-1"
            key={`rating-star-${index}`}
            onClick={() => assignRatingValue(index)}>
            <Star height={32} width={32} type={star ? 'full' : 'zero'} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingInput;
