import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AdminList } from '../pages/admins';

export const adminRoutes : RouteObject[] = [
  {
    path: '/admins',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <AdminList />,
      },
    ],
  },
];
