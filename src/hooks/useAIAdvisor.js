import { useMutation } from '@tanstack/react-query';
import { aiAdvisorAPI } from '../services/api';

export const useAIChat = () => {
  return useMutation({
    mutationFn: (message) => aiAdvisorAPI.chat(message),
    onError: (error) => {
      console.error('AI Chat error:', error);
    },
  });
};