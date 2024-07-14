import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';
import { Request } from '@/utils';

type IResult = {
  code: number;
  success: boolean;
  message: string;
};

export async function fetchConnection() {
  try {
    const request = Request.option<any>('/health/check');
    const data = await request();
    return data;
  } catch (error) {
    return {
      code: 999,
      success: false,
      message: 'Error',
    };
  }
}

export function useConnectionQuery(
  enabled: boolean,
  refetchInterval: number = 10000,
) {
  return useQuery<IResult>({
    queryKey: [QUERY_KEYS.GLOBAL],
    queryFn: async () => await fetchConnection(),
    gcTime: 0,
    refetchOnReconnect: true,
    refetchInterval,
    enabled,
  });
}
