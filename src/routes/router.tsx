import { createBrowserRouter } from 'react-router-dom';

import CategoryPage from '@/routes/CategoryPage';
import PaginationPage from '@/routes/PaginationPage';
import InfiniteScrollPage from './InfiniteScrollPage';
import ModalPage from '@/routes/ModalPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CategoryPage />,
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
    path: 'modal',
    element: <ModalPage />,
  },
]);
