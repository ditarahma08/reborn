import { Tags, Text } from '@components/otoklix-elements';
import { find } from 'lodash';
import { useEffect, useState } from 'react';

const TimePickerNew = ({ value, onNext, startHour, endHour }) => {
  const getOptions = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const options = getOptions(startHour, endHour);
  let selectedIndex = options.indexOf(value) || 0;
  const [selection, setSelection] = useState(options[selectedIndex]);

  const onSubmit = (selectedIndex) => {
    setSelection(options[selectedIndex]);

    const selectedHour = find(options, (e) => e === options[selectedIndex])
      ? options[selectedIndex]
      : options[0];

    onNext(selectedHour);
  };

  useEffect(() => {
    setSelection(options[selectedIndex]);
  }, [value, startHour, endHour]);

  return (
    <>
      <div>
        <Text className="text-md fw-weight-600">Pilih Jam Kedatangan</Text>

        <div className="mt-3 time-picker">
          {options.map((data, index) => {
            return (
              <Tags
                key={index}
                color="none"
                className={`time border rounded-pill mb-2 text-center ${
                  selection === data && 'active'
                }`}
                tag="span"
                textColor="dark"
                size="md"
                title={`${data}:00 WIB`}
                onClick={() => onSubmit(index)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TimePickerNew;
