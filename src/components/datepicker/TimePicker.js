import { Button } from '@components/otoklix-elements';
import { find } from 'lodash';
import { useState } from 'react';

import WheelPicker from './WheelPicker';

const TimePicker = ({ value, onNext, onClose, startHour, endHour }) => {
  const getOptions = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const options = getOptions(startHour, endHour);
  let selectedIndex = options.indexOf(value) || 0;
  const [selection, setSelection] = useState(selectedIndex);

  const updateSelection = (selectedIndex) => {
    setSelection(options[selectedIndex]);
  };

  const onSubmit = () => {
    const selectedHour = find(options, (e) => e === selection) ? selection : options[0];

    onNext(selectedHour);
  };

  return (
    <div className="timepicker">
      <h1>Pilih Waktu Booking</h1>
      <button type="button" className="btn-close btn-close-modal" onClick={onClose}></button>

      <WheelPicker
        data={options}
        defaultSelection={selectedIndex}
        updateSelection={(selectedIndex) => updateSelection(selectedIndex)}
        scrollerId="scroll-select-subject"
        parentHeight={318}
      />

      <div className="d-flex flex-row-reverse mt-3">
        <div>
          <Button color="secondary" size="sm" onClick={onSubmit}>
            Lanjutkan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
