import { useState, useEffect } from 'react';

export const useMockServer = () => {
  const [mockWorker, setMockWorker] = useState<any>(null);

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
