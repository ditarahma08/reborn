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
    <button
      {...attributes}
      className={`btn-promo p-3 py-2 ${isActive ? 'active' : ''} ${className}`}>
      {leftImage && <img className="me-2" src={leftImage} alt="promo-icon-left" loading="lazy" />}

      {isActive && (
        <div className="content">
          <div className="overline">Promo</div>
          <div className="title">{promoCode}</div>
        </div>
      )}
      {!isActive && (
        <div className="content">
          {promoCount > 0 && (
            <div className="title">
              Tersedia <span className="text-secondary">{promoCount} Promo</span>
            </div>
          )}
          {promoCount == 0 && (
            <div className="title">
              Tambahkan <span className="text-secondary">Promo</span>
            </div>
          )}
          <div className="subtitle">untuk order ini</div>
        </div>
      )}
      {rightImage && (
        <div className={`right-image-box ${!isActive && 'circle'}`}>
          <img src={rightImage} alt="promo-icon-right" loading="lazy" />
        </div>
      )}
    </button>
  );
};

export default ButtonPromo;
