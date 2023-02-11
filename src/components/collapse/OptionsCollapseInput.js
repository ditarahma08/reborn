import { Icon, Text } from '@components/otoklix-elements';
import { useState } from 'react';

const OptionsCollapseInput = (props) => {
  const { placeholder, options, onChange } = props;
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const onSelectOption = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onChange(option);
  };

  return (
    <div className="mb-3">
      <div
        className="form-control d-flex justify-content-between align-items-center pointer options-collapse-input"
        onClick={() => setShowOptions(!showOptions)}>
        {selectedOption?.name ? (
          <div className="d-flex align-items-center">
            {selectedOption?.icon && (
              <Icon
                card
                textRight
                image={selectedOption?.icon}
                imageHeight={15}
                imageWidth={15}
                className="me-2"
              />
            )}
            <Text>{selectedOption?.name}</Text>
          </div>
        ) : (
          <Text color="placeholder">{placeholder}</Text>
        )}
        <img src="/assets/icons/arrow-down-gray.svg" height={15} width={15} alt="collapse-down" />
      </div>

      {showOptions && (
        <ul className="options-collapse-input--options px-0 pt-3 pb-2 mt-1">
          {options?.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              className="d-flex align-items-center pointer px-3 py-1 mb-2"
              onClick={() => onSelectOption(item)}
              key={index}>
              {item?.icon && (
                <Icon
                  card
                  textRight
                  image={item?.icon}
                  imageHeight={15}
                  imageWidth={15}
                  className="me-2"
                />
              )}
              <Text color="label" data-automation={`refund_list_bank_${index}`}>
                {item?.name}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OptionsCollapseInput;
