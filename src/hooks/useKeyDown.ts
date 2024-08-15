// 특정 키보드 입력 발생 시 콜백으로 전달받은 함수를 실행하는 커스텀 훅

import { useEffect } from 'react';

export const useKeyDown = (keys: string[], callback: () => void) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const wasAnyKeyPresses = keys.some((key) => e.key === key);

      if (wasAnyKeyPresses) callback();
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [keys, callback]);
};

// 사용법
// useKeyDown(['Escape', ...], () => {
//   callback();
// });
