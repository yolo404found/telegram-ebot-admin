import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryCreate, CategoryUpdate, CategoryFormValues } from './category.schema';
import apiClient from '../../api.client';

const fetchCategories = () => apiClient.get<CategoryFormValues[]>('/categories');
const fetchCategory = (id: number) => apiClient.get<CategoryFormValues>(`/categories/${id}`);
const createCategory = (data: CategoryCreate) => apiClient.post('/categories', data);
const updateCategory = (data: CategoryUpdate) => apiClient.put(`/categories/${data.id}`, data);
const deleteCategory = (id: number) => apiClient.delete(`/categories/${id}`);

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

export const useGetCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};