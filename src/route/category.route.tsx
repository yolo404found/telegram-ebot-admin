import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CategoryList } from '../pages/categories/list.page';

export const categoryRoutes :RouteObject[] = [
  {
    path: '/categories',
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <CategoryList/>,
      },
    ],
  },
];
