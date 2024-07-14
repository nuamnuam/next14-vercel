import { QueryClient } from '@tanstack/react-query';

const TWENTY_FOUR_HOURS_MS = 86400000;
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: false,
      staleTime: TWENTY_FOUR_HOURS_MS,
    },
  },
});
