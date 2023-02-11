const CardPackageTitle = (props) => {
  const { title, description, image } = props;
  return (
    <div className="card-package-title d-flex p-3">
      <div>
        <img src={image} alt="img-package-active" loading="lazy" />
      </div>
      <div className="content ms-3">
        <div className="title mb-2">{title}</div>
        <div className="desc">
          <p className="text-truncate-triple four-lines">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardPackageTitle;
