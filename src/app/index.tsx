import ReactDOM from 'react-dom/client';
import React from 'react';
import { router } from '@/app/routes.tsx';
import { RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
