import { Alert } from '@components/otoklix-elements';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const AlertCarInfo = ({
  carName,
  hasBottomSheet = false,
  fromCheckout = false,
  show = false,
  message,
  openAlert = true
}) => {
  const [showAlert, setShowAlert] = useState(false);

  const carStatus = Cookies.get('car_changed') && JSON.parse(Cookies.get('car_changed'));

  const alertMessage = !message
    ? `Harga produk telah diperbarui sesuai dengan kebutuhan mobil ${carName}`
    : message;

  useEffect(() => {
    if (carStatus && !fromCheckout && openAlert) {
      setShowAlert(true);
      Cookies.set('car_changed', false, { path: '/' });

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [carStatus]);

  useEffect(() => {
    if (show) setShowAlert(true);
  }, [show]);

  return (
    <>
      {showAlert && (
        <div className="alert-car-info">
          <Alert
            floating
            className={`content ${hasBottomSheet && 'hasBottomSheet'}`}
            borderColor="dark"
            color="dark"
            textColor="white"
            showClose={false}>
            {alertMessage}
          </Alert>
        </div>
      )}
    </>
  );
};

export default AlertCarInfo;
