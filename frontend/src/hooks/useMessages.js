import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '../api/client';

export const useMessages = (params) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesApi.getMessages(params),
  });
};

export const useMessageDetail = (id) => {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => messagesApi.getMessageDetail(id),
    enabled: !!id,
  });
};
