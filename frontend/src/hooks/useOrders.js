import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as orderApi from '@/lib/orderApi';

export const useOrders = (params) =>
  useQuery({ queryKey: ['orders', params], queryFn: () => orderApi.getOrders(params) });

export const useOrder = (id) =>
  useQuery({ queryKey: ['order', id], queryFn: () => orderApi.getOrder(id), enabled: !!id });

export const useCreateOrder = () =>
  useMutation({ mutationFn: orderApi.createOrder });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderApi.updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};
