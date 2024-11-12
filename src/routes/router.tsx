import { createBrowserRouter } from 'react-router-dom';

import CategoryPage from '@/routes/CategoryPage';
import PaginationPage from '@/routes/PaginationPage';
import InfiniteScrollPage from '@/routes/InfiniteScrollPage';
import DebouncePage from '@/routes/DebouncePage';
import ThrottlePage from '@/routes/ThrottlePage';
import ModalPage from '@/routes/ModalPage';
import AudioVisualizerPage from '@/routes/AudioVisualizePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CategoryPage />,
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
]);
