import { CardGarage } from '@components/otoklix-elements';
import { useState } from 'react';

const CardGarageItem = (props) => {
  const { healthData } = props;
  const [open, setOpen] = useState(false);
  let arrowImage = 'assets/icons/arrow-down.svg';
  if (open) {
    arrowImage = 'assets/icons/arrow-up.svg';
  }

  return (
    <CardGarage
      {...props}
      detailButtonTitle="Lihat Detail"
      className="card-garage-new"
      buttonClassName="card-garage-new-button"
      noBorder={true}
      toggleImage={arrowImage}
      cardInfoOpen={open}
      toggleImageClick={() => setOpen(!open)}
      dataAutomationInfoImg="garage_button_more_info"
      cardExtraInfo={
        healthData && (
          <div className="px-3 pt-3">
            {healthData.slice(0, 2).map((value, index) => {
              const name = value.name.replace(/_/g, ' ');

              return (
                <div key={index} className="health-item">
                  <div className="health-name title">{name}</div>
                  <div className={`ms-3 title ${value?.condition === null ? 'text-success' : ''}`}>
                    {value?.condition == 0
                      ? 0
                      : value?.condition == null
                      ? 'None'
                      : value?.condition}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
      accordionData={
        healthData && (
          <div className="px-3">
            {healthData.slice(2).map((value, index) => {
              const name = value.name.replace(/_/g, ' ');
              return (
                <div key={index} className="health-item">
                  <div className="health-name title">{name}</div>
                  <div className={`ms-3 title ${value?.condition === null ? 'text-success' : ''}`}>
                    {value?.condition == 0
                      ? 0
                      : value?.condition == null
                      ? 'None'
                      : value?.condition}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    />
  );
};

export default CardGarageItem;
