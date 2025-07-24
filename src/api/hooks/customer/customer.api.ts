import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api.client';
import { CustomerCreate, CustomerFormValues, CustomerUpdate } from './customer.schema';

// API endpoints
const fetchCustomers = () => apiClient.get<CustomerFormValues[]>('/customers');
const fetchCustomer = (id: number) => apiClient.get<CustomerFormValues>(`/customers/${id}`);
const createCustomer = (data: CustomerCreate) => apiClient.post('/customers', data);
const updateCustomer = (data: CustomerUpdate) => apiClient.put(`/customers/${data.id}`, data);
const deleteCustomer = (id: number) => apiClient.delete(`/customers/${id}`);

// React Query hooks
export const useGetCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });
};

export const useGetCustomer = (id: number) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};