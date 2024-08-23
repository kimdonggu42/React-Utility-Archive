import { createBrowserRouter } from 'react-router-dom';

import CategoryPage from '@/routes/categoryPage';
import PaginationPage from '@/routes/paginationPage';
import ModalPage from '@/routes/modalPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CategoryPage />,
  },
  {
    path: '/pagination',
    element: <PaginationPage />,
  },
  {
    path: 'modal',
    element: <ModalPage />,
  },
]);
