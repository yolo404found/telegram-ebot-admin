import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductList } from '../pages/products';

export const productRoutes :RouteObject[] = [
  {
    path: '/products',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <ProductList />,
      },
    ],
  },
];
