import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../services/api';

export const useTransactions = (params) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const response = await transactionApi.getAll(params);
      return response.data;
    },
  });
};

export const useTransactionSummary = () => {
  return useQuery({
    queryKey: ['transaction-summary'],
    queryFn: async () => {
      const response = await transactionApi.getSummary();
      return response.data;
    },
  });
};

export const useSpendingByCategory = () => {
  return useQuery({
    queryKey: ['spending-by-category'],
    queryFn: async () => {
      const response = await transactionApi.getByCategory();
      return response.data;
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['spending-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['spending-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};