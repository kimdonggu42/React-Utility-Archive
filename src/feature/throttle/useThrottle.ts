// 짧은 시간 간격으로 이벤트가 연속해서 발생하더라도
// 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되도록 하는 커스텀 훅(일정 시간이 지나기 전에 재호출 방지)
// ex: 버튼을 클릭할 때 마다 비용이 많이 드는 계산이 실행되는 것을 방지하기 위해
// 버튼을 연타해도 일정 간격으로 이벤트가 실행되도록 함
import { useRef } from 'react';

export const useThrottle = () => {
  // lastRun은 최초 const throttle = useThrottle(); 이렇게 선언되었을 때의 시간을 기록
  const lastRun = useRef<number | null>(null);

  return (callback: () => void, delay: number) => {
    // 최초 실행일 경우 바로 callback 호출하고 lastRun을 현재 시간으로 업데이트
    if (lastRun.current === null) {
      callback();
      lastRun.current = Date.now();
    } else {
      // 이후 throttle이 트리거 되면 트리거 될 당시의 시간과 lastRun의 차이를 계산해서
      // 그 차이가 delay 이상이라면 lastRun이 기록된 이후로 delay 만큼의 시간이 지났다는 뜻이므로 callback을 호출 함
      const timeElapsed = Date.now() - lastRun.current;

      if (timeElapsed >= delay) {
        callback();
        lastRun.current = Date.now();
      }
    }
  };
};

// 사용법
// const throttle = useThrottle();
// throttle(() => callback(), delay);
