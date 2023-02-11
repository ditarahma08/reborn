import { useEffect, useRef } from 'react';

const useDebounce = (callback, timeout, deps) => {
  const timeoutId = useRef();

  useEffect(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(callback, timeout);

    return () => clearTimeout(timeoutId.current);
  }, deps);
};

export default useDebounce;
