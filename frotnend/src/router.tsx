import { createBrowserRouter } from 'react-router-dom';
import { ProductView } from './views/product';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductView />,
  },
]);

export default router;
