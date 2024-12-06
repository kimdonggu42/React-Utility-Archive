import { createBrowserRouter } from 'react-router-dom';

import App from '@/app';
import PaginationPage from '@/feature/pagination/PaginationPage';
import InfiniteScrollPage from '@/feature/infinite-scroll/InfiniteScrollPage';
import DebouncePage from '@/feature/debounce/DebouncePage';
import ThrottlePage from '@/feature/throttle/ThrottlePage';
import ModalPage from '@/feature/modal/ModalPage';
import AudioVisualizerPage from '@/feature/web-audio-api/AudioVisualizerPage';
import SpeechRecognitionPage from '@/feature/speech-recognition/SpeechRecognitionPage';
import WebSocketPage from '@/feature/websocket/WebSocketPage';
import SocketIOPage from '@/feature/socketio/SocketIOPage';
import WebRTCPage from '@/feature/web-rtc/WebRTCPage';

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
  {
    path: 'websocket',
    element: <WebSocketPage />,
  },
  {
    path: 'socketio',
    element: <SocketIOPage />,
  },
  {
    path: 'webrtc',
    element: <WebRTCPage />,
  },
]);
