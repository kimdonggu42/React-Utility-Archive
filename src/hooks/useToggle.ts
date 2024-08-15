// boolean 상태를 false/true로 변경하는 함수를 반환하는 커스텀 훅

import { useState } from 'react';

export const useToggle = (initialValue = false) => {
  const [isToggled, setIsToggled] = useState<boolean>(initialValue);

  const toggleOn = () => {
    setIsToggled(true);
  };

  const toggleOff = () => {
    setIsToggled(false);
  };

  const toggle = () => {
    setIsToggled((prevState) => !prevState);
  };

  return { isToggled, toggleOn, toggleOff, toggle };
};

// 사용
// const { isToggled, toggleOn, toggleOff, toggle } = useToggle();
