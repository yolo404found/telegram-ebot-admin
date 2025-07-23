import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api.client';
import { AdminCreate, AdminUpdate, AdminFormValues } from './admin.schema';

// API endpoints
const fetchAdmins = () => apiClient.get<AdminFormValues[]>('/admins');
const fetchAdmin = (id: number) => apiClient.get<AdminFormValues>(`/admins/${id}`);
const createAdmin = (data: AdminCreate) => apiClient.post('/admins', data);
const updateAdmin = (data: AdminUpdate) => apiClient.put(`/admins/${data.id}`, data);
const deleteAdmin = (id: number) => apiClient.delete(`/admins/${id}`);

// React Query hooks
export const useGetAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  });
};

export const useGetAdmin = (id: number) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: () => fetchAdmin(id),
    enabled: !!id,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', variables.id] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};