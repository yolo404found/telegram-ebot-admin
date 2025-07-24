import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api.client';
import { OrderCreate, OrderUpdate, OrderFormValues } from './order.schema';

// API endpoints
const fetchOrders = () => apiClient.get<OrderFormValues[]>('/orders');
const fetchOrder = (id: number) => apiClient.get<OrderFormValues>(`/orders/${id}`);
const createOrder = (data: OrderCreate) => apiClient.post('/orders', data);
const updateOrder = (data: OrderUpdate) => apiClient.put(`/orders/${data.id}`, data);
const deleteOrder = (id: number) => apiClient.delete(`/orders/${id}`);

// React Query hooks
export const useGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
};

export const useGetOrder = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),    
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};