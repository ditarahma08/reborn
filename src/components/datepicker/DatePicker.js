import { Button } from '@components/otoklix-elements';
import moment from 'moment';
import { useState } from 'react';
import Calendar from 'react-calendar';

/*
  Ex:
  import DatePicker from '@components/datepicker/DatePicker';

  <Modal centered backdrop isOpen={true} className="pickermodal" modalMobile={false}>
    <DatePicker onNext={(value) => alert(value)} />
  </Modal>
*/

const DatePicker = ({
  onNext,
  value = new Date(),
  minDate,
  maxDate = new Date(moment().add(1, 'M')),
  disabledDates
}) => {
  const [dateValue, onChange] = useState(value);
  const tileDisabled = ({ date, view }) => {
    // Disable tiles in month view only
    if (view === 'month') {
      return disabledDates.find((dDate) => moment(date).diff(dDate, 'days') === 0);
    }
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        value={dateValue}
        showNeighboringMonth={false}
        tileDisabled={tileDisabled}
      />
      <div className="d-flex flex-row-reverse mt-3">
        <div>
          <Button color="secondary" size="sm" onClick={() => onNext(dateValue)}>
            Lanjutkan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
