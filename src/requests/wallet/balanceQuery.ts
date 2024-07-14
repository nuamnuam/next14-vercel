import { useQuery } from '@tanstack/react-query';

import QUERY_KEYS from '@/constants/query-keys';
import { Request } from '@/utils';
import { type IBalancesResponse } from '@/types/wallet';

import { WALLET } from '../endpoints';

export type SuccessBalancesResponse = IBalancesResponse;

export type ErrorBalancesResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export type BalancesParams = {
  type?: 'deposit' | 'withdraw';
  page?: number;
  with_network?: 0 | 1;
  symbol: string;
  non_zero_balances?: number;
};

export async function fetchBalances(data: BalancesParams) {
  try {
    const params: BalancesParams = {
      type: data.type,
      page: data.page ?? 1,
      symbol: data.symbol,
      ...(data.with_network && { with_network: data.with_network }),
    };

    const request = Request.get<SuccessBalancesResponse>(WALLET.GET_BALANCES, {
      params,
    });
    const result = await request();
    return result || [];
  } catch (error) {
    return {
      code: 0,
      success: false,
      message: 'Error while fetching balances',
      result: [],
      pagination: {
        total: 0,
        count: 0,
        per_page: 0,
        current_page: 0,
        total_pages: 0,
        links: {
          next: '',
        },
      },
    };
  }
}

export function useBalanceQuery(asset: string, enabled: boolean) {
  return useQuery<SuccessBalancesResponse, ErrorBalancesResponse>({
    queryKey: QUERY_KEYS.GET_BALANCE(asset),
    queryFn: async () =>
      await fetchBalances({ symbol: asset, with_network: 0 }),
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
    enabled,
  });
}
