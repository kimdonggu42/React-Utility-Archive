import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { paginationPageSize } from '@/constants/pageSize';

export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='flex flex-col gap-y-5'>
        <Button variant='outline' onClick={() => navigate('/modal')}>
          모달
        </Button>
        <Button
          variant='outline'
          onClick={() => navigate(`/pagination?page=1&size=${paginationPageSize}`)}
        >
          페이지네이션
        </Button>
        <Button variant='outline' onClick={() => navigate(`/infinitescroll`)}>
          무한 스크롤
        </Button>
        <Button variant='outline' onClick={() => navigate(`/debounce`)}>
          디바운스
        </Button>
        <Button variant='outline' onClick={() => navigate(`/throttle`)}>
          쓰로틀
        </Button>
        <Button variant='outline' onClick={() => navigate(`/audiovisualizer`)}>
          오디오 비주얼라이저
        </Button>
        <Button variant='outline' onClick={() => navigate(`/speechrecognition`)}>
          speech recognition
        </Button>
      </div>
    </div>
  );
}
