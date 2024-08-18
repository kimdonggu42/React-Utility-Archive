import { createBrowserRouter } from 'react-router-dom';

import Category from './Category';
import Pagination from './Pagination';
import Modal from './Modal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Category />,
  },
  {
    path: '/pagination',
    element: <Pagination />,
  },
  {
    path: 'modal',
    element: <Modal />,
  },
]);
