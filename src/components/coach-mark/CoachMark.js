const CoachMark = (props) => {
  const {
    step,
    index,
    continuous,
    backProps,
    primaryProps,
    closeProps,
    tooltipProps,
    totalSteps,
    extraClass
  } = props;

  return (
    <div className={`coachmark-card ${extraClass}`} {...tooltipProps}>
      <div className="coachmark-header">
        <span className="coachmark-title">{step.title}</span>
        <img src="/assets/icons/close.svg" {...closeProps} />
      </div>

      <div className="coachmark-content">{step.content}</div>

      <div className="coachmark-footer">
        <div className="coachmark-indicator">
          <span className="text-primary fw-bold">{index + 1}&nbsp;</span>
          <span className="text-soft-grey"> dari {totalSteps}</span>
        </div>

        <div className="coachmark-action text-primary">
          {index > 0 && (
            <span {...backProps}>
              <img src="/assets/icons/left-outline-chevron.svg" height="30" alt="back" />
            </span>
          )}
          {index > 0 && <span className="mx-2">|</span>}
          {continuous && index !== totalSteps - 1 && (
            <span {...primaryProps} className="fill-step fw-bold">
              {step?.locale?.next || 'Lanjutkan'}
            </span>
          )}
          {continuous && index === totalSteps - 1 && (
            <span {...primaryProps} className="fill-step fw-bold">
              {step?.locale?.last || 'Selesai'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachMark;
