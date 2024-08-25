import { useToggle } from '@/hooks/useToggle';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';

export default function ModalPage() {
  const { isToggled, toggle } = useToggle();

  return (
    <>
      <div className='flex h-screen flex-col items-center justify-center'>
        <Button variant='outline' onClick={toggle}>
          모달
        </Button>
      </div>
      {isToggled && <Modal modalToggleHandler={toggle}>모달 내용</Modal>}
    </>
  );
}
