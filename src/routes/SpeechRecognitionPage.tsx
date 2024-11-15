'use client';

import { useState } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function SpeechRecognitionPage() {
  const [isActive, setIsActive] = useState<boolean>(false);

  const { transcript, startSpeechRecognition, stopSpeechRecognition } =
    useSpeechRecognition(isActive);

  const toggleVisualization = async () => {
    if (isActive) {
      stopSpeechRecognition();
      setIsActive(false);
    } else {
      startSpeechRecognition();
      setIsActive(true);
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div>
        <div className='flex w-[500px] flex-col'>
          <h2 className='text-center font-semibold'>Speech Recognition</h2>
          <div className='overflow-wrap break-word h-[150px] overflow-y-auto border border-black pt-3 font-medium'>
            {transcript}
          </div>
        </div>
        <button
          className='w-full rounded bg-slate-950 px-2 py-1.5 font-semibold text-white hover:bg-slate-800'
          onClick={toggleVisualization}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
}
