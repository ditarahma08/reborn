import InputRadio from '@components/input/InputRadio';
import { Button } from '@components/otoklix-elements';
import { Icon, Text } from '@components/otoklix-elements';
import { gtag } from '@utils/Gtag';
import pickBy from 'lodash/pickBy';
import React, { useState } from 'react';

const InputRadioGroup = (props) => {
  const { defaultValue, onApply, filterData, title = 'Filter Bengkel' } = props;

  const initFilters = filterData.sequence_filter
    .map((x) => x.value)
    .reduce((acc, value) => {
      acc[value] = defaultValue[value] || '';
      return acc;
    }, {});

  const emptyFilter = filterData.sequence_filter
    .map((x) => x.value)
    .reduce((acc, value) => {
      acc[value] = '';
      return acc;
    }, {});

  const [state, setState] = useState(initFilters);

  // prettier-ignore
  const handleChange = (props) => {
    if (props.value === 'tier_1') { gtag('click filter workshop', 'clickExploreMapsFilter', 'official partner') }
    if (props.value === 'tier_2') { gtag('click filter workshop', 'clickExploreMapsFilter', 'verified') }
    if (props.value === 'cheapest') { gtag('click filter price', 'clickExploreMapsFilter', 'termurah') }
    if (props.value === 'most-expensive') { gtag('click filter price', 'clickExploreMapsFilter', 'termahal') }

    let newState = { ...state };
    newState[props.groupName] = props.value;
    setState(newState);
  };

  const handleApplyFilter = () => {
    const result = pickBy(state, (value) => value !== '');
    onApply(result);
  };

  return (
    <div className="input-radio-group-container">
      <div className="item-row mx-2" role="button">
        <Text tag="div" weight="semi-bold" className="xtitle">
          {title}
        </Text>

        <div onClick={() => setState(emptyFilter)}>
          <Icon
            card
            textRight
            image="/assets/icons/reset-blue.svg"
            title="Reset"
            imageHeight={24}
            imageWidth={24}
            className="reset"
          />
        </div>
      </div>

      {filterData?.sequence_filter.map((item) => {
        return (
          <div key={item.value}>
            <Text tag="div" weight="semi-bold" className="mx-2 my-3">
              {item.name}
            </Text>
            <InputRadio
              groupName={item.value}
              options={filterData.group_by[item.value]}
              onChange={handleChange}
              selected={state[item.value]}
            />
          </div>
        );
      })}

      <Button className="mt-3" size="md" block onClick={handleApplyFilter}>
        Terapkan
      </Button>
    </div>
  );
};

export default InputRadioGroup;
