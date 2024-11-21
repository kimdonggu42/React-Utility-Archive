import { createBrowserRouter } from 'react-router-dom';

import App from '@/app';
import PaginationPage from '@/pagination/PaginationPage';
import InfiniteScrollPage from '@/infinite-scroll/InfiniteScrollPage';
import DebouncePage from '@/debounce/DebouncePage';
import ThrottlePage from '@/throttle/ThrottlePage';
import ModalPage from '@/modal/ModalPage';
import AudioVisualizerPage from '@/web-audio-api/AudioVisualizerPage';
import SpeechRecognitionPage from '@/speech-recognition/SpeechRecognitionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'modal',
    element: <ModalPage />,
  },
  {
    path: 'pagination',
    element: <PaginationPage />,
  },
  {
    path: 'infinitescroll',
    element: <InfiniteScrollPage />,
  },
  {
    path: 'debounce',
    element: <DebouncePage />,
  },
  {
    path: 'throttle',
    element: <ThrottlePage />,
  },
  {
    path: 'audiovisualizer',
    element: <AudioVisualizerPage />,
  },
  {
    path: 'speechrecognition',
    element: <SpeechRecognitionPage />,
  },
]);
