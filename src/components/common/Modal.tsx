import { useState } from 'react';

import { useKeyDown } from '@/hooks/useKeyDown';

export interface ModalProps {
  modalToggleHandler: () => void;
  children: React.ReactNode;
}

/**
  modalToggleHandler: 모달 온/오프 이벤트 핸들러\
  children: 모달 레이아웃에 전달할 children 컴포넌트
 */
export default function Modal({ modalToggleHandler, children }: ModalProps) {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  useKeyDown(['Escape'], () => {
    modalToggleHandler();
  });

  const modalBackgroundMouseDownHandler = (e: React.MouseEvent) => {
    // 이벤트가 발생한 요소와 이벤트 핸들러가 부착된 요소와 동일한지 확인, 이 방법은 특정 요소에서만 이벤트를 처리할 때 유용
    // e.target: 이벤트가 실제로 발생한 요소, 예를 들어, 클릭 이벤트가 발생한 버튼이나 링크와 같은 구체적인 요소
    // e.currentTarget: 이벤트 핸들러가 부착된 요소, 예를 들어, 이벤트 위임을 통해 부모 요소에 이벤트 핸들러를 설정한 경우, e.currentTarget은 그 부모 요소가 됨
    if (e.target === e.currentTarget) setIsMouseDown(true);
  };

  const modalBackgroundMouseUpHandler = (e: React.MouseEvent) => {
    if (isMouseDown && e.target === e.currentTarget) modalToggleHandler();
  };

  return (
    <div
      className='fixed bottom-0 left-0 right-0 top-0 z-10 bg-black/50'
      onMouseDown={modalBackgroundMouseDownHandler}
      onMouseUp={modalBackgroundMouseUpHandler}
    >
      <div className='fixed left-1/2 top-1/2 flex h-full max-h-[500px] w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center rounded-2xl border border-solid border-stone-400 bg-white'>
        {children}
      </div>
    </div>
  );
}
