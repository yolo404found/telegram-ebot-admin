import { MainLayout } from "../components/layout/MainLayout";
import { CustomerList } from "../pages/customers";

export const customerRoutes = [
  {
    path: '/customers',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <CustomerList />,
      },
    ],
  },
];