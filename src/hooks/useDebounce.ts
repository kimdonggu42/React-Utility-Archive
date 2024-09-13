// 짧은 시간 간격으로 이벤트가 연속해서 발생하면 이벤트 핸들러를 호출하지 않다가
// 일정 시간(delay)이 경과한 이후에 이벤트 핸들러가 한 번만 호출되도록 하는 디바운스 커스텀 훅

import { useRef } from 'react';

export const useDebounce = () => {
  // timerId는 최초 const debounce = useDebounce(); 이렇게 선언되었을 때는 null을 가짐
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (callback: () => void, delay: number) => {
    // debounce가 트리거 되면 timerId.current = setTimeout(callback, delay); 이 코드를 실행하고
    // 이제 timerId는 null이 아니기 때문에, 즉 delay가 지나기 전에 다시 debounce를 호출할 때 마다
    // 기존의 timer를 취고하고 새로운 timer를 생성하는 작업을 반복한다.
    // 이후 delay가 지나면 callback을 실행한다.
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(callback, delay);
  };
};

// 사용법
// const debounce = useDebounce();
// debounce(callback, 300);
