import { Icon, RatingStar } from '@components/otoklix-elements';

const CardReviewSmall = ({
  wsName,
  image,
  category,
  categoryIcon,
  roleName,
  roleIcon,
  date,
  key
}) => {
  return (
    <div className="card-unreview p-3" key={key}>
      <div className="d-flex">
        <div className="ws-image-wrapper">
          <img src={image} className="ws-image" alt="image_workshop" loading="lazy" />
        </div>
        <div className="content ms-3">
          <div className="title">{wsName || '-'}</div>
          <div>
            <Icon
              card
              textRight
              image={roleIcon || '/assets/icons/package-item.svg'}
              title={roleName || '-'}
              imageHeight={18}
              imageWidth={18}
              imgAlt="img_package_item"
            />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <Icon
          card
          textRight
          textClassName="txt-grey"
          image={categoryIcon || '/assets/icons/package-item.svg'}
          title={category || '-'}
          imageHeight={16}
          imageWidth={16}
          imgAlt="img_package_item"
        />
        <span className="txt-grey align-self-center">{date || '-'}</span>
      </div>
      <hr className="devider" />
      <div className="d-flex justify-content-center custom-stars">
        <RatingStar rating={5} iconHeight={20} iconWidth={20} />
      </div>
    </div>
  );
};

export default CardReviewSmall;
