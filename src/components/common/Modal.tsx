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

    // ex: 모달 배경에 모달 on/off 토글 이벤트(onClick)를 등록해둘 경우 모달을 클릭하여 마우스를 드래그하여 모달 배경에서 놓을 경우 모달이 꺼지게 된다.
    // 이유는 onClick 이벤트는 마우스에서 손가락을 뗄 때 실행되기 때문이다.
    // 이 문제를 해결하기 위해 마우스를 클릭할 때인 onMouseDown 이벤트 핸들러에 e.target과 e.currentTarget이 일치할 때 isMouseDown을 true로 만들어
    // 모달 내부를 클릭했는지 모달 배경을 클릭했는지를 체크한다. 그리고 마우스를 뗄 때인 onMouseUp 이벤트 핸들러에서 isMouseDown이 true 일 때 모달 토글 이벤트를 실행한다.
    // 이렇게 되면 모달 내부를 클릭하여 외부로 드래그했을 때 e.target은 모달 내부 div 태그가 선택되고 e.currentTarget은 모달 배경 div 태그가 선택되므로
    // isMouseDown이 false이기 때문에 드래그하여 마우스를 모달 배경에서 놓았을 때 모달 토글 이벤트가 발생하지 않는다.
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
