import { Text } from '@components/otoklix-elements';

const ButtonPromoSmall = (props) => {
  const { className, promoCode, leftImage, rightImage, ...attributes } = props;

  return (
    <div {...attributes} className={`btn-promo-small p-3 py-1 ${className}`}>
      {leftImage && <img className="me-1" src={leftImage} alt="" width="16" />}
      {rightImage && <img className="me-1" src={rightImage} alt="" width="24" />}
      <Text weight="bold" className="text-xs">
        {promoCode}
      </Text>
    </div>
  );
};

export default ButtonPromoSmall;
