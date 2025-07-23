import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { adminRoutes } from './admin.route';
import { categoryRoutes } from './category.route';
import { productRoutes } from './product.route';

const router = createBrowserRouter([...adminRoutes,...categoryRoutes,...productRoutes])

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};