const PinMapLocation = ({ hover = false, mobile = false }) => {
  return (
    <div
      style={
        hover
          ? mobile
            ? { position: 'fixed', top: 'calc(54% - 116px)', left: 'calc(50% - 20px)' }
            : { position: 'fixed', top: 'calc(50% - 10px)', left: 'calc(50% - 20px)' }
          : {
              position: 'fixed',
              transform: 'translate(-50%, -90%)'
            }
      }>
      <img
        src="/assets/icons/location.svg"
        alt="pin-location"
        height="40"
        width="40"
        loading="lazy"
      />
    </div>
  );
};

export default PinMapLocation;
