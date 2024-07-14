import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IBalancesResponse } from '@/types/wallet';
import { useGlobalStore, useWalletBalanceStore } from '@/store';
import { QUERY_KEYS } from '@/constants';

import { WALLET } from '../../endpoints';
import { useEffect } from 'react';

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
  q?: string;
  non_zero_balances?: number;
  singleCoin?: boolean;
};

export async function getBalancesList(data: BalancesParams) {
  const params = {
    type: data.type,
    page: data.page ?? 1,
    q: data.q && data.q !== '' ? data.q : undefined,
    non_zero_balances: data.non_zero_balances ?? 1,
    ...(data.with_network && { with_network: data.with_network }),
  };

  const request = Request.get<SuccessBalancesResponse>(WALLET.GET_BALANCES, {
    params,
  });

  const result = await request();
  return result;
}

export function useBalancesList(data: BalancesParams, enabled: boolean = true) {
  const { setUserCredit } = useGlobalStore();
  const { setBalances } = useWalletBalanceStore((state) => ({
    setBalances: state.setBalances,
  }));

  const query = useQuery<SuccessBalancesResponse, ErrorBalancesResponse>({
    queryKey: QUERY_KEYS.GET_GLOBAL_BALANCES_LIST(data),
    queryFn: async () => await getBalancesList(data),
    enabled,
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query.data?.result && query.isSuccess) {
      const tomanCoin = query.data?.result?.find(
        (coin) => coin.symbol.toUpperCase() === 'IRT',
      );

      if (tomanCoin) setUserCredit(tomanCoin);
      if (data.singleCoin) {
      }
      setBalances(query.data);
    }
  }, [query.data?.result, query.isSuccess]);

  return query;
}
