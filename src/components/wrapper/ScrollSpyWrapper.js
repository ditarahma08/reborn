const ScrollSpyWrapper = ({ id, children }) => {
  return (
    <>
      <div className="position-relative">
        <div id={id} className="position-absolute scroll-spy" />
      </div>
      {children}
    </>
  );
};

export default ScrollSpyWrapper;
