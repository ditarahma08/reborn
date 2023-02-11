import { Icon } from '@components/otoklix-elements';

const PlainHeader = (props) => {
  const { title, icon, iconOnClick, dataAutomation } = props;

  return (
    <div
      className="py-2 border-bottom sticky-top clear-header"
      data-automation={dataAutomation || 'plain_header'}>
      <div className="d-flex align-items-center p-2 w-100">
        <span className="title text-center fw-bold w-100">{title}</span>
        <div className="position-absolute">
          <Icon
            textRight
            imageWidth={20}
            imageHeight={20}
            size="sm"
            bgIconColor="off-white"
            className="pointer"
            iconClassName="rounded-circle border workshop-navbar-back"
            onClick={iconOnClick}
            image={icon}
          />
        </div>
      </div>
    </div>
  );
};

export default PlainHeader;
