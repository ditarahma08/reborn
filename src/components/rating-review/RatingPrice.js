import { Col, Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';

const RatingPrice = (props) => {
  const { priceLevel = 0 } = props;
  const [levels, setLevels] = useState([false, false, false, false, false]);

  useEffect(() => {
    assignPriceLevel();
  }, [priceLevel]);

  const assignPriceLevel = () => {
    const arrayLevels = [];
    for (let i = 0; i < 5; i++) {
      arrayLevels.push(i <= priceLevel - 1 ? true : false);
      setLevels(arrayLevels);
    }
  };

  return (
    <Col>
      {levels.map((price, index) => {
        return (
          <Text color={price ? 'label' : 'line'} weight="bold" key={`price-${index}`}>
            $
          </Text>
        );
      })}
    </Col>
  );
};

export default RatingPrice;
