import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ProductView } from './views/product';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(
  <React.StrictMode>
    <ProductView />
  </React.StrictMode>,
);
