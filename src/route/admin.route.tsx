import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminList } from '../pages/admins';

export const adminRoutes : RouteObject[] = [
  {
    path: '/admins',
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <AdminList />,
      },
    ],
  },
];
