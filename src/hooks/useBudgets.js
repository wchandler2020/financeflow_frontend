import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetAPI } from '../services/api';

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetAPI.getAll();
      return response.data;
    },
  });
};

export const useCurrentBudgets = () => {
  return useQuery({
    queryKey: ['budgets', 'current'],
    queryFn: async () => {
      const response = await budgetAPI.getCurrent();
      return response.data;
    },
  });
};

export const useBudgetsByMonth = (month, year) => {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: async () => {
      const response = await budgetAPI.getByMonth(month, year);
      return response.data;
    },
    enabled: !!month && !!year,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: budgetAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: ({ id, data }) => budgetAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: budgetAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};