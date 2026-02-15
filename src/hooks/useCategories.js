import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../services/api';

export const useCategories = (type) => {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const response = type
        ? await categoryApi.getByType(type)
        : await categoryApi.getAll();
      return response.data;
    },
  });
};
