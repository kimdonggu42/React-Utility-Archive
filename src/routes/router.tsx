import { createBrowserRouter } from 'react-router-dom';

import CategoryPage from '@/routes/CategoryPage';
import PaginationPage from '@/routes/PaginationPage';
import InfiniteScrollPage from './InfiniteScrollPage';
import DebouncePage from './DebouncePage';
import ThrottlePage from './ThrottlePage';
import ModalPage from '@/routes/ModalPage';

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
]);
