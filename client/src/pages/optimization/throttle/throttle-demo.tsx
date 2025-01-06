import { useState } from 'react';
import { useThrottle } from '@/hooks/useThrottle';

export default function ThrottleDemo() {
  const [clickCount, setClickCount] = useState<number>(0);
  const [numbers, setNumbers] = useState<number[]>([0, 0, 0, 0]);

  const throttle = useThrottle();

  const resetNumbers = (numbers: number[]) => {
    const newNumbers: number[] = [];
    numbers.forEach((number: number) => newNumbers.push(Math.floor(number + Math.random() * 10)));
    setNumbers(newNumbers);
  };

  const handleResetNumbers = () => {
    setClickCount((prev) => prev + 1);
    throttle(() => resetNumbers(numbers), 2000);
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex flex-col gap-y-5'>
        <div>재설정 클릭 횟수: {clickCount}</div>
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
