import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { UserStats } from '@/types/profile';

import { MARKET } from '../endpoints';

export type SuccessUserStatsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: UserStats;
};

export type ErrorUserStatsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getUserStats() {
  return Request.get<SuccessUserStatsResponse>(MARKET.USER_STATS);
}

export function useUserStats() {
  return useQuery<SuccessUserStatsResponse, ErrorUserStatsResponse>({
    queryKey: ['user-stats'],
    gcTime: 0,
    queryFn: getUserStats(),
  });
}
