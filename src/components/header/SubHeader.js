const SubHeader = (props) => {
  const { title, subtitle, imageLeft } = props;

  return (
    <div className="sub-header d-flex">
      <div className="flex-shrink-0 me-3">
        <img src={imageLeft} alt="" />
      </div>
      <div className="flex-grow-1">
        <h6 className="mb-1">{title}</h6>
        <span className="text-sm">{subtitle}</span>
      </div>
    </div>
  );
};

export default SubHeader;
