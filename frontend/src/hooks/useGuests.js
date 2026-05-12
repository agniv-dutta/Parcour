import { useQuery } from '@tanstack/react-query';
import { guestsApi } from '../api/client';

export const useGuest = (id) => {
  return useQuery({
    queryKey: ['guest', id],
    queryFn: () => guestsApi.getGuest(id),
    enabled: !!id,
  });
};
