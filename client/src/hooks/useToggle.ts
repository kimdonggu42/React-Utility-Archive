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
