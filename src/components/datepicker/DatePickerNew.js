import { Text } from '@components/otoklix-elements';
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

const DatePickerNew = ({
  onNext,
  value = new Date(),
  minDate,
  maxDate = new Date(moment().add(1, 'M')),
  disabledDates
}) => {
  const [dateValue, setDateValue] = useState(value);
  const tileDisabled = ({ date, view }) => {
    // Disable tiles in month view only
    if (view === 'month') {
      return disabledDates.find((dDate) => moment(date).diff(dDate, 'days') === 0);
    }
  };

  const handleChange = (value) => {
    setDateValue(value);
    onNext(value);
  };

  return (
    <div>
      <Text className="text-md fw-weight-600 mb-2">Pilih Tanggal Booking</Text>

      <Calendar
        onChange={handleChange}
        minDate={minDate}
        maxDate={maxDate}
        value={dateValue}
        showNeighboringMonth={false}
        tileDisabled={tileDisabled}
      />
    </div>
  );
};

export default DatePickerNew;
