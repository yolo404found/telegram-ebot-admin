import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//routes
import { adminRoutes } from './admin.route';
import { categoryRoutes } from './category.route';
import { productRoutes } from './product.route';
import { customerRoutes } from './customer.route';
import { orderRoutes } from './order.route';

const router = createBrowserRouter([...adminRoutes,...categoryRoutes,...productRoutes,...customerRoutes,...orderRoutes])

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};