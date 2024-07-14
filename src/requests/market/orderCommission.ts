import { useQuery } from '@tanstack/react-query';

import QUERY_KEYS from '@/constants/query-keys';
import { Request } from '@/utils';
import { authStore } from '@/store';

import { MARKET } from '../endpoints';

export type SuccessOrderCommissionResponse = {
  result: { commission_percent: number; discounted_percent: number };
  message: string;
  success: boolean;
};

export type ErrorOrderCommissionResponse = {
  code: number;
  success: boolean;
  message: string;
  result: unknown;
};

function getOrderCommission(pairId: number) {
  const response = Request.get<SuccessOrderCommissionResponse>(
    MARKET.ORDER_COMMISSION(pairId),
  );
  return response;
}

export default function useOrderCommission(pairId: number | undefined) {
  const { token } = authStore();
  const isLogin = !!token;

  return useQuery<SuccessOrderCommissionResponse, ErrorOrderCommissionResponse>(
    {
      queryKey: [QUERY_KEYS.ORDER_COMMISSION, pairId],
      queryFn: getOrderCommission(pairId!),
      gcTime: 0,
      enabled: !!pairId && isLogin,
    },
  );
}
