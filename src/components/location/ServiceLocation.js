import Helper from '@utils/Helper';

const ServiceLocation = (props) => {
  const { address, onEditLoc } = props;

  return (
    <div>
      <div className="w-60 address-header-wrapper">
        <div className="d-flex pointer" onClick={onEditLoc}>
          <div>
            <img
              src={`/assets/icons/location.svg`}
              alt="icon_location"
              height={13}
              width={13}
              className="icon-address"
              loading="eager"
            />
          </div>
          <span className="text-address">{Helper.truncateText(address, 65)}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceLocation;
