import { useRef } from 'react';

export const useDebounce = () => {
  const timerId = useRef<number | null>(null);

  return (callback: () => void, delay: number) => {
    if (timerId.current) window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(callback, delay);
  };
};
