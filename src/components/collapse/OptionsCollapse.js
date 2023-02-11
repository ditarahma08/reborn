import { Button, Icon, Text } from '@components/otoklix-elements';
import { useEffect, useState } from 'react';

const OptionsCollapse = (props) => {
  const { options, defaultOption, buttonWidth = 'auto', onSelect } = props;
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const onSelectOption = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, []);

  return (
    <div className="options-collapse">
      <Button
        color="subtle"
        size="sm"
        className="options-collapse--button d-flex align-items-center justify-content-between"
        style={{ width: buttonWidth }}
        onClick={() => setShowOptions(!showOptions)}>
        <div className="d-flex align-items-center">
          {selectedOption?.icon && (
            <Icon image={selectedOption?.icon} imageHeight={15} imageWidth={15} />
          )}

          <Text color="label" className="text-sm">
            {selectedOption?.name}
          </Text>
        </div>
        <Icon
          image={
            showOptions
              ? '/assets/icons/chevron-up-blue.svg'
              : '/assets/icons/chevron-down-blue.svg'
          }
          imageHeight={15}
          imageWidth={15}
        />
      </Button>

      {showOptions && (
        <ul className="options-collapse--options">
          {options.map((option, index) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={`option-${index}`}
              className="d-flex align-items-center pointer"
              onClick={() => onSelectOption(option)}>
              {option?.icon && <Icon image={option?.icon} imageHeight={15} imageWidth={15} />}
              <Text color="label" className="text-sm">
                {option?.name}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OptionsCollapse;
