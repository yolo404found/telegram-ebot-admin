import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProductList } from '../pages/products';

export const productRoutes :RouteObject[] = [
  {
    path: '/products',
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <ProductList />,
      },
    ],
  },
];
