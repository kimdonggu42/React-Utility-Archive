import Modal from '@/feature/modal/Modal';
import { useToggle } from '@/feature/modal/useToggle';

export default function ModalPage() {
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
      {isToggled && <Modal modalToggleHandler={toggle}>모달 내용</Modal>}
    </>
  );
}
