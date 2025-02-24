import { createPortal } from 'react-dom';
import Modal from '@/components/Modal';
import { useToggle } from '@/hooks/useToggle';

export default function ModalDemo() {
  const { isToggled, toggle } = useToggle();

  return (
    <>
      <div className='flex h-screen flex-col items-center justify-center'>
        <button
          className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white hover:bg-slate-100 hover:text-slate-900'
          onClick={toggle}
        >
          모달
        </button>
      </div>
      {/* createPortal을 사용하면, React 컴포넌트 트리 바깥의 DOM 노드로 렌더링할 수 있다.
          예를 들어, body에 직접 모달을 렌더링하면 부모 컴포넌트의 CSS 속성(z-index, overflow 등)에
          영향을 받지 않고 독립적으로 UI를 구성할 수 있어 모달, 툴팁 등에 자주 사용된다.
          모달이나 툴팁 같은 UI 요소는 전체 페이지를 덮는 오버레이이므로, 부모 요소의 DOM 구조에 중첩되도록 렌더링하는 것은 의미적·구조적 측면에서 적절하지 않다.
          비록 스타일로는 동작이 가능해 보여도, HTML 구조가 복잡해지고 의미가 흐려지기 쉽다.
          따라서 이러한 오버레이 컴포넌트는 createPortal을 사용해 document.body 같은 최상위 DOM 노드에 직접 렌더링하는 것이 좋다.
          https://ko.react.dev/reference/react-dom/createPortal */}
      {isToggled &&
        createPortal(<Modal modalToggleHandler={toggle}>모달 내용</Modal>, document.body)}
    </>
  );
}
