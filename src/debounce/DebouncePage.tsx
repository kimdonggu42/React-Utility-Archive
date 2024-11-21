import { useState } from 'react';
import { useDebounce } from '@/debounce/useDebounce';

export default function DebouncePage() {
  const [text, setText] = useState<string>('');

  const debounce = useDebounce();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    debounce(() => {
      alert('마지막으로 입력한지 2초가 지났습니다!');
    }, 2000);
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <input className='border border-black' value={text} onChange={handleInputChange} />
    </div>
  );
}
