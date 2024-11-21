import { useState } from 'react';
import { useThrottle } from '@/throttle/useThrottle';

export default function ThrottlePage() {
  const [numbers, setNumbers] = useState<number[]>([0, 0, 0, 0]);

  const throttle = useThrottle();

  const resetNumbers = (numbers: number[]) => {
    const newNumbers: number[] = [];
    numbers.forEach((number: number) => newNumbers.push(Math.floor(number + Math.random() * 10)));
    setNumbers(newNumbers);
  };

  const handleResetNumbers = () => {
    console.log('버튼 클릭');
    throttle(() => resetNumbers(numbers), 2000);
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex flex-col gap-y-5'>
        <button className='bg-blue-300 p-1' onClick={handleResetNumbers}>
          재설정
        </button>
        <ul className='flex gap-x-10'>
          {numbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
