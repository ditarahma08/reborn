const ListMenuItem = (props) => {
  const {
    imageLeft,
    imageRight = '/assets/icons/arrow-right.svg',
    title,
    onClick,
    extraIcon
  } = props;
  return (
    <a
      className="list-menu-item pointer d-flex mb-3 pb-3 text-decoration-none text-title-active align-items-center border-bottom border-white-md"
      role="presentation"
      onClick={onClick}>
      <img className="me-3" src={imageLeft} alt="" width="24" height="24" loading="lazy" />

      <div className="fw-semi-bold flex-grow-1 fs-7">{title}</div>

      <div className="d-flex ms-2auto">
        {extraIcon && <span className="me-1">{extraIcon}</span>}
        <span>{imageRight && <img src={imageRight} alt="" />}</span>
      </div>
    </a>
  );
};

export default ListMenuItem;
