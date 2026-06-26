import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productApi from '@/lib/productApi';

export const useProducts = (params) =>
  useQuery({ queryKey: ['products', params], queryFn: () => productApi.getProducts(params) });

export const useFeatured = () =>
  useQuery({ queryKey: ['products', 'featured'], queryFn: productApi.getFeatured });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: productApi.getCategories });

export const useProduct = (id) =>
  useQuery({ queryKey: ['product', id], queryFn: () => productApi.getProduct(id), enabled: !!id });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};
