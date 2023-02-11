import { Icon } from '@components/otoklix-elements';

function RatingHeader({ name, icon }) {
  return (
    <div className="workshop-detail-wrapper d-flex justify-content-start align-items-center">
      <div>
        <div className="workshop-info d-flex justify-content-start align-items-center">
          {icon && (
            <Icon
              className="workshop-navbar-info__icon mt-0"
              card
              textRight
              image={icon}
              imageHeight={14}
              imageWidth={14}
            />
          )}
          <span className="title mx-2">{name}</span>
        </div>
      </div>
    </div>
  );
}

export default RatingHeader;
