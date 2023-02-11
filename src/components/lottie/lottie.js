import Lottie from 'react-lottie-player';

import lottieJson from './otopointsAnim.json';
import lottieSearchingJson from './searchingAnim.json';

export const LottieCoin = ({ width = 24, height = 24 }) => {
  return <Lottie style={{ width: width, height: height }} animationData={lottieJson} loop play />;
};

export const LottieSearching = ({ width = 140, height = 140 }) => {
  return (
    <Lottie
      style={{ width: width, height: height }}
      animationData={lottieSearchingJson}
      loop
      play
    />
  );
};
