import { Button, Text } from '@components/otoklix-elements';
import { filterPromo } from '@utils/Constants';
import { gtag } from '@utils/Gtag';
import amplitude from 'amplitude-js';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

const InputRadioGroupPromo = (props) => {
  const { defaultValue, onApply, title = 'Urutkan' } = props;
  let userCar = Cookies.get('user_car') && JSON.parse(Cookies.get('user_car'));

  const [selected, setSelected] = useState(defaultValue);

  // prettier-ignore
  const handleChange = (props) => {
    if (props.value === 'recommended-car') { gtag('click filter workshop', 'clickExploreMapsFilter', 'car recommended') }
    if (props.value === 'best-seller') { gtag('click filter workshop', 'clickExploreMapsFilter', 'terlaris') }
    if (props.value === 'cheapest') { gtag('click filter price', 'clickExploreMapsFilter', 'termurah') }
    if (props.value === 'most-expensive') { gtag('click filter price', 'clickExploreMapsFilter', 'termahal') }
    setSelected(props.target.value);
  };

  const handleApplyFilter = () => {
    amplitude.getInstance().logEvent('product list refined', {
      refine_type: `sorting ${selected}`
    });
    onApply(selected);
  };

  const handleResetFilter = () => {
    Cookies.remove('filter_promo');
    setSelected(userCar ? 'recommended-car' : 'best-seller');
  };

  return (
    <div className="input-radio-group-container group-promo">
      <div className="item-row mx-2" role="button">
        <Text tag="div" weight="semi-bold" className="xtitle">
          {title}
        </Text>
        <Text onClick={() => handleResetFilter()} className="reset">
          Reset
        </Text>
      </div>

      <div className="input-radio-container">
        {userCar
          ? filterPromo.map((item) => {
              return (
                <React.Fragment key={item.value}>
                  <input
                    id={`$promo-${item.value}`}
                    name="promo"
                    type="radio"
                    value={item.value}
                    checked={selected == item.value}
                    onChange={handleChange}
                  />
                  <label className="radio-label" htmlFor={`$promo-${item.value}`}>
                    <div className="radio-text">{item.name}</div>
                    <div className="circle"></div>
                    <img
                      className="checkmark"
                      src="/assets/icons/radio-selected.svg"
                      alt="icon_radio_selected"
                      loading="lazy"
                    />
                  </label>
                </React.Fragment>
              );
            })
          : filterPromo
              .filter((data) => data.value !== 'recommended-car')
              .map((item) => {
                return (
                  <React.Fragment key={item.value}>
                    <input
                      id={`$promo-${item.value}`}
                      name="promo"
                      type="radio"
                      value={item.value}
                      checked={selected == item.value}
                      onChange={handleChange}
                    />
                    <label className="radio-label" htmlFor={`$promo-${item.value}`}>
                      <div className="radio-text">{item.name}</div>
                      <div className="circle"></div>
                      <img
                        className="checkmark"
                        src="/assets/icons/radio-selected.svg"
                        alt="icon_radio_selected"
                        loading="lazy"
                      />
                    </label>
                  </React.Fragment>
                );
              })}
      </div>

      <Button className="mt-3" size="md" block onClick={handleApplyFilter}>
        Terapkan
      </Button>
    </div>
  );
};

export default InputRadioGroupPromo;
