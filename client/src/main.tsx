// import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import './index.css';

// const enableMocking = async () => {
//   const { worker } = await import('./mocks/browser.ts');
//   return worker.start();
// };

async function init() {
  // await enableMocking();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <RouterProvider router={router} />,
    // </React.StrictMode>,
  );
}

init();
