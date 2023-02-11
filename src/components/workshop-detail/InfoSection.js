const InfoSection = (props) => {
  const { address, workshopDetail, onClickTrack } = props;

  return (
    <div className="info-section">
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        data-automation="wdp_ws_name_section">
        <h1 className="mt-2">{workshopDetail?.name}</h1>
      </div>

      <div className="address">
        <span className="text-muted">
          {address}
          <br />
          <span className="text-dark">Jarak darimu {workshopDetail?.distance} km </span>
          <span className="text-dark">/ {workshopDetail?.eta} min</span>
        </span>
        <a
          href={workshopDetail?.gmaps_link}
          target="_blank"
          rel="noreferrer"
          onClick={() => onClickTrack('navigation map')}>
          <img
            src="/assets/icons/open-map-blue.svg"
            className="ms-1"
            alt="open-map-blue"
            height="20"
            width="20"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
};

export default InfoSection;
