import { Button } from '@components/otoklix-elements';
import { useEffect } from 'react';

function OtpTimer({ otpTimer, setOtpTimer, resend }) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (otpTimer > 0) {
        setOtpTimer((timer) => {
          return timer - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="d-flex justify-content-center m-4 otp-info">
      {otpTimer === 0 ? (
        <Button data-automation="otp_button_resend" size="sm" onClick={resend} color="link">
          <span className="text-secondary text-decoration-underline">Kirim Ulang OTP</span>
        </Button>
      ) : (
        <>
          <span className="me-1">Kirim ulang kode</span>
          <span className="text-secondary">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
        </>
      )}
    </div>
  );
}

export default OtpTimer;
