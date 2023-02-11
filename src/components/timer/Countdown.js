import { useCountdown } from '@utils/useCountdown';
import React from 'react';
import { useEffect } from 'react';

const CountdownTimer = ({ className, targetDate, onBoom }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const finalTimes = (times) => {
    return times < 10 ? `0${times}` : times;
  };

  useEffect(() => {
    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
      onBoom();
    }
  }, [days, hours, minutes, seconds]);

  return (
    <span className={className ? className : ''}>
      {`${finalTimes(days)}:${finalTimes(hours)}:${finalTimes(minutes)}:${finalTimes(seconds)}`}
    </span>
  );
};

export default CountdownTimer;
