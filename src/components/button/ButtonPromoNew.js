import { Text } from '@components/otoklix-elements';

const ButtonPromo = (props) => {
  const {
    className,
    isActive,
    promoCode,
    promoCount,
    leftImage,
    rightImage,
    ...attributes
  } = props;
  return (
    <button {...attributes} className={`btn-promo --new p-3 ${className}`}>
      {leftImage && <img className="me-3" src={leftImage} alt="" />}

      {isActive && (
        <div className="content">
          <div className="overline">Promo</div>
          <div className="title">{promoCode}</div>
        </div>
      )}
      {!isActive && (
        <div className="content">
          {promoCount > 0 && (
            <Text color="label" weight="bold" className="text-sm">
              Tersedia{' '}
              <Text color="secondary" weight="bold">
                {promoCount} Promo
              </Text>
            </Text>
          )}
          {promoCount == 0 && (
            <Text color="label" weight="bold" className="text-sm">
              Makin hemat pakai promo
            </Text>
          )}
        </div>
      )}
      {rightImage && (
        <div className={`right-image-box ${!isActive && 'circle'}`}>
          <img src={rightImage} alt="" />
        </div>
      )}
    </button>
  );
};

export default ButtonPromo;
