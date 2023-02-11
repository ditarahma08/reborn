import { CardServices } from '@components/otoklix-elements';
import Helper from '@utils/Helper';
import React from 'react';

const CardServicePackage = ({ data, onClick, category, hasCar, position, workshopType }) => {
  const hasDisc =
    data?.is_discounted > 0 && (data?.original_price - data?.price) / data?.original_price > 0;
  const verified = workshopType !== 'non_verified';

  const getPrice = (price) => {
    let finalPrice;

    if (!hasCar && category === 'Oli') {
      finalPrice = `${Helper.formatMoney(price)}/liter`;
    } else {
      finalPrice = Helper.formatMoney(price);
    }

    return `Rp${finalPrice}`;
  };

  const getSubPrice = (price) => {
    if (hasDisc) {
      return `Rp${Helper.formatMoney(price)}`;
    } else {
      return '';
    }
  };

  return (
    <div className="my-2">
      <CardServices
        discountLabel={
          hasDisc ? `Diskon ${Helper.calcDiscountOff(data?.price, data?.original_price)}` : ''
        }
        onCardClick={() => verified && onClick(data, position)}
        image={data?.image_link}
        categoryLabel={category}
        showStartPrice={!hasCar && verified}
        price={verified ? getPrice(data?.price) : ''}
        subPrice={verified ? getSubPrice(data?.original_price) : ''}
        title={Helper.shortenName(data?.name)}
      />
    </div>
  );
};

export default CardServicePackage;
