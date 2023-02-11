import { Container, Modal, Tags } from '@components/otoklix-elements';
import { DefaultClosingHour } from '@utils/Constants';
import moment from 'moment';
import { useEffect, useState } from 'react';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const DateTimePicker = (props) => {
  const {
    value,
    disabledDates,
    maximumDateTime,
    minimumDateTime,
    onChange,
    schedule,
    disabled = false,
    otoPickup = false
  } = props;

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(DefaultClosingHour);
  const [hourSelected, setHourSelected] = useState(
    otoPickup ? '--.-- WIB' : `${moment(value).hours()}.00 WIB`
  );
  const [dateSelected, setDateSelected] = useState(
    moment(value).format(`dddd, DD ${otoPickup ? 'MMM' : 'MMMM'} YYYY`)
  );
  const [pickerDateSelected, setPickerDateSelected] = useState(value);

  const momentMinimumDate = moment(minimumDateTime);
  const isToday =
    new Date(value).getDate() === new Date().getDate() &&
    new Date(value).getMonth() === new Date().getMonth();
  const nowHour = new Date().getHours();
  const valueHour = new Date(value).getHours();

  useEffect(() => {
    const selectedDate = moment(value).format(`dddd, DD ${otoPickup ? 'MMM' : 'MMMM'} YYYY`);
    const hourSelected = `${moment(value).hours()}.00 WIB`;

    setDateSelected(selectedDate);
    setHourSelected(hourSelected);
    setPickerDateSelected(value);
  }, [value]);

  useEffect(() => {
    const minOpen = parseInt(schedule?.min?.openingHour?.slice(0, 2));
    const minClose = parseInt(schedule?.min?.closingHour?.slice(0, 2));

    if (!otoPickup) {
      setInitialHour(minOpen, minClose);
    } else {
      setStartHour(9);
      setHourSelected(hourSelected);
      setEndHour(14);
    }
  }, [schedule]);

  // set initial hour value for power workshop
  const setInitialHour = (open, close) => {
    if (isToday && nowHour >= open) {
      if (nowHour + 1 <= close) {
        setStartHour(nowHour + 1);
        setHourSelected(`${nowHour + 1}.00 WIB`);
        handleChangeHour(nowHour + 1);
      } else {
        setStartHour(close);
        setHourSelected(`${close}.00 WIB`);
        handleChangeHour(close);
      }
    } else {
      setStartHour(open);

      // when change hour on time picker out of operating hours range
      calculateHourSelected(open, close);
    }

    setEndHour(close);
  };

  const calculateHourSelected = (open, close) => {
    if (valueHour < open) {
      setHourSelected(`${open}.00 WIB`);
    } else if (valueHour > close) {
      setHourSelected(`${close}.00 WIB`);
    } else {
      setHourSelected(`${valueHour}.00 WIB`);
    }
  };

  const handleChangeDate = (dateTime) => {
    let newDateTime;
    const isToday = moment(dateTime).isSame(momentMinimumDate, 'day');
    if (isToday) {
      newDateTime = moment(dateTime).set({ hour: momentMinimumDate.hour() });
    } else {
      newDateTime = moment(dateTime).set({ hour: moment(value).hours() });
    }
    onChange(newDateTime.toDate(), 'date-changed');
    setDateSelected(moment(dateTime).format('dddd, DD MMMM YYYY'));
    setPickerDateSelected(dateTime);
    setOpenDatePicker(false);
  };

  const handleChangeHour = (hour) => {
    const newDateTime = moment(value).set({ hour: hour });
    onChange(newDateTime.toDate(), 'hour-changed');
    setHourSelected(`${hour}.00 WIB`);
    setOpenTimePicker(false);
  };

  const onClickDatePicker = () => {
    !disabled && setOpenDatePicker(true);
  };

  const onClickTimePicker = () => {
    !disabled && setOpenTimePicker(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <Tags
          color="white-md"
          icon="/assets/icons/calendar-dark.svg"
          tag="span"
          textColor="dark"
          size="md"
          title={dateSelected}
          onClick={onClickDatePicker}
        />
        <Tags
          color="white-md"
          icon="/assets/icons/clock-dark.svg"
          tag="span"
          textColor="dark"
          size="md"
          title={hourSelected}
          onClick={onClickTimePicker}
        />
      </div>

      <Modal className="real-modal" isOpen={openDatePicker} centered>
        <Container className="d-flex justify-content-center align-items-center p-3 modal-datetime">
          <DatePicker
            onNext={handleChangeDate}
            minDate={momentMinimumDate.toDate()}
            maxDate={maximumDateTime}
            value={new Date(pickerDateSelected)}
            disabledDates={disabledDates}
          />
        </Container>
      </Modal>

      <Modal className="real-modal" isOpen={openTimePicker} centered>
        <Container className="d-flex justify-content-center align-items-center p-3 modal-datetime">
          <TimePicker
            onNext={handleChangeHour}
            value={parseInt(hourSelected.slice(0, 2))}
            onClose={() => setOpenTimePicker(false)}
            startHour={startHour}
            endHour={endHour}
          />
        </Container>
      </Modal>
    </>
  );
};

export default DateTimePicker;
