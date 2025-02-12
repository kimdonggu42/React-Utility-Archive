import { createBrowserRouter } from 'react-router-dom';

import App from '@/app';
import ModalDemo from '@/pages/ui/modal/modal-demo';
import PaginationDemo from '@/pages/ui/pagination/pagination-demo';
import InfiniteScrollDemo from '@/pages/web-api/intersection-observer/infinitescroll-demo';
import DebounceDemo from '@/pages/optimization/debounce/debounce-demo';
import ThrottleDemo from '@/pages/optimization/throttle/throttle-demo';
import AudioVisualizerDemo from '@/pages/web-api/web-audio/audiovisualizer-demo';
import SpeechRecognitionDemo from '@/pages/web-api/web-speech/speechrecognition-demo';
import WebSocketDemo from '@/pages/web-api/websocket/websocket-demo';
import WebRTCDemo from '@/pages/web-api/webrtc/webrtc-demo';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'modal',
    element: <ModalDemo />,
  },
  {
    path: 'pagination',
    element: <PaginationDemo />,
  },
  {
    path: 'infinitescroll',
    element: <InfiniteScrollDemo />,
  },
  {
    path: 'debounce',
    element: <DebounceDemo />,
  },
  {
    path: 'throttle',
    element: <ThrottleDemo />,
  },
  {
    path: 'audiovisualizer',
    element: <AudioVisualizerDemo />,
  },
  {
    path: 'speechrecognition',
    element: <SpeechRecognitionDemo />,
  },
  {
    path: 'websocket',
    element: <WebSocketDemo />,
  },
  {
    path: 'webrtc',
    element: <WebRTCDemo />,
  },
]);
