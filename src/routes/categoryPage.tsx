import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='flex flex-col gap-y-5'>
        <Button variant='outline' onClick={() => navigate('/modal')}>
          모달
        </Button>
        <Button variant='outline' onClick={() => navigate('/pagination?page=1&parse=5')}>
          페이지네이션
        </Button>
      </div>
    </div>
  );
}
