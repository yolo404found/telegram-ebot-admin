import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProductDto, ProductFormValues, ProductFormBase } from './product.schema';
import apiClient from '../../api.client';

const fetchProducts = () => apiClient.get<ProductFormValues[]>('/products');
const fetchProduct = (id: number) => apiClient.get<ProductFormValues>(`/products/${id}`);
const createProduct = (data: ProductFormBase | any) => apiClient.post('/products', data);
const updateProduct = (data: UpdateProductDto | any) => apiClient.put(`/products/${data.id}`, data);
const deleteProduct = (id: number) => apiClient.delete(`/products/${id}`);

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useGetProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};