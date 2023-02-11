import { Text } from '@components/otoklix-elements';

const Stepper = (props) => {
  const { data, activeStep, direction = 'horizontal' } = props;

  if (direction === 'horizontal') {
    return (
      <div className="d-flex justify-content-center align-items-center Stepper">
        {data?.map((item, index) => (
          <>
            <span className={index <= activeStep ? 'active' : ''}>{item?.title}</span>
            {index < data?.length - 1 && (
              <hr className={activeStep === index + 1 ? 'active' : ''} />
            )}
          </>
        ))}
      </div>
    );
  } else if (direction === 'vertical') {
    return (
      <div className="stepper">
        {data?.map((item, index) => (
          <div className="stepper__step" key={index}>
            <div className="stepper__step__item">
              <div className="stepper__step__item__bullet"></div>
              <div className="d-flex flex-column">
                <Text>{item?.title}</Text>
                <Text>{item?.desc}</Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Stepper;
