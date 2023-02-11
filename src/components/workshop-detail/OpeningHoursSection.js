import { Button } from '@components/otoklix-elements';

const OpeningHoursSection = (props) => {
  const { isTodayOpen, currentOperationHour, setToggleOpenHour, onTrack } = props;

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <img
          src={`/assets/icons/clock-${isTodayOpen ? 'green' : 'red'}.svg`}
          alt="clock"
          loading="lazy"
          height="16"
          width="16"
        />
        <div
          className={`d-flex flex-column fw-bold text ps-2 ${
            isTodayOpen ? 'text-success' : 'text-danger'
          }`}>
          {isTodayOpen ? (
            <>
              <span>
                {`Buka ${currentOperationHour?.opening_hour} - ${currentOperationHour.closing_hour}`}
              </span>
              <span className="text-muted fw-normal">
                Close Order: {currentOperationHour?.closing_hour}
              </span>
            </>
          ) : (
            <span>Tutup</span>
          )}
        </div>
      </div>

      <Button
        className="text-decoration-none p-0"
        color="link"
        onClick={() => {
          setToggleOpenHour();
          onTrack('operating hours');
        }}
        size="sm">
        Lihat Jam Buka
      </Button>
    </div>
  );
};
export default OpeningHoursSection;
