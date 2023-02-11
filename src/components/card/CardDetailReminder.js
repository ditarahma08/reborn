import { Icon } from '@components/otoklix-elements';

const CardDetailReminder = ({
  wsName,
  image,
  category,
  categoryIcon,
  roleName,
  roleIcon,
  date,
  address
}) => {
  return (
    <div className="card-unreview detail-reminder">
      <div className="d-flex">
        <div className="ws-image-wrapper">
          <img src={image} className="ws-image" alt="" />
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
            />
          </div>
        </div>
      </div>
      <span className="txt-grey d-block py-2">{address || '-'}</span>
      <div className="d-flex highlight justify-content-between">
        <Icon
          card
          textRight
          textClassName="txt-grey"
          image={categoryIcon || '/assets/icons/package-item.svg'}
          title={category || '-'}
          imageHeight={16}
          imageWidth={16}
        />
        <span className="txt-grey align-self-center">{date || '-'}</span>
      </div>
    </div>
  );
};

export default CardDetailReminder;
