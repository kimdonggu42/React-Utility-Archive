import { setupWorker } from 'msw/browser';
import { useState, useEffect } from 'react';

type WorkerType = ReturnType<typeof setupWorker>;

export const useMockServer = () => {
  const [mockWorker, setMockWorker] = useState<WorkerType | null>(null);

  useEffect(() => {
    const initializeMocking = async () => {
      if (!mockWorker) {
        const { worker } = await import('@/mocks/browser.ts');
        await worker.start();
        setMockWorker(worker);
      }
    };
    initializeMocking();

    return () => {
      if (mockWorker) mockWorker.stop();
    };
  }, [mockWorker]);

  return mockWorker;
};
