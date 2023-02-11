import {
  Button,
  Container,
  Header,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tags
} from '@components/otoklix-elements';
import { DefaultClosingHour, OTOKLIX_GO_LIMIT_ORDER } from '@utils/Constants';
import amplitude from 'amplitude-js';
import moment from 'moment';
import { useEffect, useState } from 'react';

import DatePickerNew from './DatePickerNew';
import TimePickerNew from './TimePickerNew';

const DateTimePickerNew = (props) => {
  const {
    value,
    disabledDates,
    maximumDateTime,
    minimumDateTime,
    onChange,
    schedule,
    disabled = false,
    fullPath,
    countHoursLimit,
    wsSchedules,
    isFbo,
    isOtoklixGo = false,
    isOtoklixPickup = false,
    pickupDate,
    setErrorSubmit,
    setErrorSubmitMessage
  } = props;

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(DefaultClosingHour);
  const [hourSelected, setHourSelected] = useState(
    isOtoklixGo ? '--.-- WIB' : `${moment(value).hours()}.00 WIB`
  );
  const [dateSelected, setDateSelected] = useState(moment(value).format(`dddd, DD MMM YYYY`));
  const [pickerDateSelected, setPickerDateSelected] = useState(value);
  const [hour, setHour] = useState(moment(minimumDateTime).hours());
  const [date, setDate] = useState(minimumDateTime);

  const momentMinimumDate = moment(minimumDateTime);
  const isToday =
    new Date(date).getDate() === new Date().getDate() &&
    new Date(date).getMonth() === new Date().getMonth();
  const nowHour = new Date().getHours();
  const valueHour = new Date(value).getHours();
  const pickUpHour = new Date(pickupDate).getHours();
  const pickUpDates = moment(pickupDate).format('dddd, DD MMM YYYY');

  // set initial hour value for power workshop
  const setInitialHour = (open, close) => {
    if (isToday && nowHour >= open) {
      if (nowHour + 1 <= close) {
        setStartHour(nowHour + 1);
        setHour(nowHour + 1);
      } else {
        setStartHour(close);
        setHour(close);
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
      setHour(open);
    } else if (valueHour > close) {
      setHour(close);
    } else {
      setHour(valueHour);
    }
  };

  const handleChange = (hour, date) => {
    amplitude.getInstance().logEvent('booking time change attempted', {
      date: moment(date).format('L'),
      time: `${hour}:00`
    });

    const newDateTime = moment(date).set({ hour: hour });

    onChange(newDateTime.toDate(), 'date-changed');
    setHourSelected(`${hour}.00 WIB`);
    setDateSelected(moment(date).format('dddd, DD MMM YYYY'));
    setPickerDateSelected(newDateTime);
    setOpenDatePicker(false);

    if (isOtoklixPickup) {
      setErrorSubmit(false);
      setErrorSubmitMessage('');
    }
  };

  const onClickDatePicker = () => {
    amplitude.getInstance().logEvent('booking time change initiated', { page_location: fullPath });

    !disabled && setOpenDatePicker(true);

    if (date !== pickerDateSelected) {
      setDate(pickerDateSelected);
      if (countHoursLimit) countHoursLimit(pickerDateSelected, wsSchedules);
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
    if (countHoursLimit) countHoursLimit(date, wsSchedules);
  };

  useEffect(() => {
    const selectedDate = moment(value).format('dddd, DD MMM YYYY');
    const hourSelected = `${moment(value).hours()}.00 WIB`;

    setDateSelected(isOtoklixPickup && pickupDate ? pickUpDates : selectedDate);
    setHourSelected(hourSelected);
    setPickerDateSelected(isOtoklixPickup && pickupDate ? pickupDate : value);
  }, [value, pickUpDates]);

  useEffect(() => {
    const minOpen = parseInt(schedule?.min?.openingHour?.slice(0, 2));
    const minClose = parseInt(schedule?.min?.closingHour?.slice(0, 2));

    if (!isOtoklixGo) {
      setInitialHour(minOpen, minClose);
    } else {
      setStartHour(9);
      setHour(9);
      setEndHour(OTOKLIX_GO_LIMIT_ORDER);
    }
  }, [schedule, isToday]);

  useEffect(() => {
    if (!isOtoklixGo) {
      if (isFbo || !isToday) {
        setHourSelected(`${valueHour}.00 WIB`);
      } else {
        setHourSelected(`${valueHour + 1}.00 WIB`);
      }
    } else {
      if (isOtoklixPickup && !pickUpHour) {
        setHourSelected('--.-- WIB');
      } else if (isOtoklixPickup && pickUpHour) {
        setHourSelected(`${pickUpHour}.00 WIB`);
      } else {
        setHourSelected('09.00 WIB');
      }
    }
  }, [pickUpHour]);

  return (
    <>
      <div
        className="date-picker bg-white-md d-flex pointer justify-content-between align-items-center mb-3"
        onClick={onClickDatePicker}>
        <Tags
          color="none"
          icon="/assets/icons/calendar-dark.svg"
          tag="span"
          textColor="dark"
          size="md"
          title={dateSelected}
          textClassName="fw-bold"
        />
        <hr />
        <Tags
          color="none"
          icon="/assets/icons/clock-dark.svg"
          tag="span"
          textColor="dark"
          size="md"
          title={hourSelected}
        />
      </div>

      <Modal
        isOpen={openDatePicker}
        className="wrapper wrapper-xs modal-find-location modal-fullscreen"
        backdrop={false}
        keyboard={false}>
        <ModalHeader className="border-0 p-0 z-index-100">
          <Header
            title="Pilih Jadwal"
            onBackClick={() => setOpenDatePicker(false)}
            className="bg-white shadow-sm"
          />
        </ModalHeader>

        <ModalBody className="overflow-auto p-0">
          <Container className="d-flex justify-content-center align-items-center p-3 modal-datetime">
            <DatePickerNew
              onNext={handleDateChange}
              minDate={momentMinimumDate.toDate()}
              maxDate={maximumDateTime}
              value={new Date(pickerDateSelected)}
              disabledDates={disabledDates}
            />
          </Container>

          <Container className="d-flex justify-content-center align-items-center p-3 pt-0 modal-datetime">
            <TimePickerNew
              onNext={setHour}
              value={parseInt(hourSelected.slice(0, 2))}
              startHour={startHour}
              endHour={endHour}
            />
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button
            data-automation="order_confirmation_button_save_date"
            id="button_save_date"
            color="primary"
            size="md"
            type="submit"
            block
            className="rounded-pill"
            onClick={() => handleChange(hour, date)}>
            Simpan
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DateTimePickerNew;
