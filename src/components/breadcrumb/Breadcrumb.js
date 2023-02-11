const Breadcrumb = (props) => {
  const { list } = props;
  const renderList = () => {
    return list.map((item, index) => {
      if (+index + 1 === list?.length) {
        return (
          <li key={item.id} property="itemListElement" typeof="ListItem" className="li-breadcrumb">
            <span property="name">{item.name}</span>
            <meta property="position" content={+index + 1} />
          </li>
        );
      } else {
        return (
          <li key={item.id} property="itemListElement" typeof="ListItem" className="li-breadcrumb">
            <a href={item.path} property="item" typeof="WebPage">
              <span property="name">{item.name}</span>
            </a>
            <meta property="position" content={+index + 1} />
          </li>
        );
      }
    });
  };
  return (
    <ol vocab="https://schema.org/" typeof="BreadcrumbList" className="ol-breadcrumb">
      {renderList()}
    </ol>
  );
};

export default Breadcrumb;
