import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CategoryList } from '../pages/categories/list.page';

export const categoryRoutes :RouteObject[] = [
  {
    path: '/categories',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <CategoryList/>,
      },
    ],
  },
];
