import { WidgetListItem } from '@components/otoklix-elements';
import { BottomSheet } from 'react-spring-bottom-sheet';

const OperatingHoursSheet = (props) => {
  const { showBottomSheetHour, setToggleOpenHour, operatingHours, days } = props;

  return (
    <BottomSheet
      className="box-mobile-first bottom-sheet-map operation-hour-sheet"
      open={showBottomSheetHour}
      onDismiss={setToggleOpenHour}
      initialFocusRef={false}
      scrollLocking={false}
      blocking
      header={
        <div className="px-3 position-relative">
          <h2>Jam Buka</h2>
          <h3>Waktu Setempat</h3>
        </div>
      }>
      <div className="pointer bottom-sheet-close" onClick={setToggleOpenHour}>
        <img src="/assets/icons/close.svg" alt="" />
      </div>
      <div className="p-3">
        {operatingHours?.data?.map((operate) => {
          const todayOpen = operate.day === days[new Date().getDay()];

          return (
            <WidgetListItem
              key={operate.day}
              className="pb-2"
              titleClassName={todayOpen ? 'fw-bold' : 'fw-normal'}
              title={
                <>
                  {operate.day}
                  {todayOpen && <span className="text-muted fw-normal"> - Hari ini</span>}
                </>
              }
              subtitleColor={operate.is_open ? 'success' : 'muted'}
              subtitle={
                operate.is_open ? `${operate.opening_hour} - ${operate.closing_hour}` : 'Libur'
              }
            />
          );
        })}
      </div>
    </BottomSheet>
  );
};

export default OperatingHoursSheet;
