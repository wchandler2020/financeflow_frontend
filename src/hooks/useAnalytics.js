import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/api';

export const useMonthlyTrends = (months = 6) => {
  return useQuery({
    queryKey: ['analytics', 'monthly-trends', months],
    queryFn: async () => {
      const response = await analyticsAPI.getMonthlyTrends(months);
      return response.data;
    },
  });
};

export const useCategoryTrends = (months = 6) => {
  return useQuery({
    queryKey: ['analytics', 'category-trends', months],
    queryFn: async () => {
      const response = await analyticsAPI.getCategoryTrends(months);
      return response.data;
    },
  });
};

export const useTopSpendingMonths = (limit = 5) => {
  return useQuery({
    queryKey: ['analytics', 'top-spending-months', limit],
    queryFn: async () => {
      const response = await analyticsAPI.getTopSpendingMonths(limit);
      return response.data;
    },
  });
};