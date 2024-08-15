// 짧은 시간 간격으로 이벤트가 연속해서 발생하면 이벤트 핸들러를 호출하지 않다가
// 일정 시간(delay)이 경과한 이후에 이벤트 핸들러가 한 번만 호출되도록 하는 디바운스 커스텀 훅

import { useRef } from 'react';

export const useDebounce = () => {
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (callback: () => void, delay: number) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(callback, delay);
  };
};

// 사용
// const debounce = useDebounce();
// debounce(() => callback(), 300);
