import { Icon } from '@components/otoklix-elements';

const SearchListItem = (props) => {
  const {
    imageLeft,
    title,
    subtitle,
    rating,
    distance,
    onClick,
    subtitleClassName,
    imageRight = '/assets/icons/arrow-right.svg'
  } = props;

  return (
    <a
      className="list-search-menu-item pointer d-flex mb-3 text-decoration-none text-title-active"
      role="presentation"
      onClick={onClick}>
      <div className="pe-3">
        <img width="60" height="60" src={imageLeft} alt="" className="img-link" />
      </div>

      <div>
        <div className="title text text-truncate-double">{title}</div>
        <div className={`subtitle mt-1 ${subtitleClassName}`}>{subtitle}</div>

        <div className="d-flex mt-1">
          {rating > 0 && (
            <Icon
              textRight
              imageWidth={13}
              imageHeight={13}
              textClassName="subtitle"
              title={rating.toString()}
              iconClassName="rating-icon"
              image="/assets/icons/star.svg"
            />
          )}

          {distance && (
            <Icon
              textRight
              imageWidth={13}
              imageHeight={13}
              textClassName="subtitle"
              title={distance}
              iconClassName="ms-2 rating-icon"
              image="/assets/icons/pin-map-orange.svg"
            />
          )}
        </div>
      </div>

      <div className="ms-auto p-2">{imageRight && <img src={imageRight} alt="" />}</div>
    </a>
  );
};

export default SearchListItem;
