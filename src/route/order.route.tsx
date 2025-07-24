import { MainLayout } from '../components/layout/MainLayout';
import { OrderList } from '../pages/orders';

export const orderRoutes = [
  {
    path: '/orders',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <OrderList />,
      },
    ],
  },
];