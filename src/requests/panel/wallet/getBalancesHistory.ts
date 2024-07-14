import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IBalanceHistoryResponse } from '@/types/wallet';
import { useWalletBalanceStore } from '@/store';
import { QUERY_KEYS } from '@/constants';

import { WALLET } from '../../endpoints';
import { useEffect } from 'react';

export type SuccessBalancesHistoryResponse = {
  success: boolean;
  message: string;
  result: IBalanceHistoryResponse;
};

export type ErrorBalancesHistoryResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export async function getBalancesHistory() {
  const request = Request.get<SuccessBalancesHistoryResponse>(
    WALLET.GET_BALANCES_HISTORY,
  );
  const data = await request();
  return data;
}

export function useBalancesHistory() {
  const { setBalanceHistory } = useWalletBalanceStore();

  const query = useQuery<
    SuccessBalancesHistoryResponse,
    ErrorBalancesHistoryResponse
  >({
    queryKey: [QUERY_KEYS.GET_BALANCE_HISTORY],
    queryFn: async () => await getBalancesHistory(),
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query.isSuccess && query.data.result) {
      setBalanceHistory(query.data.result);
    }
  }, [query.data?.result, query.isSuccess]);

  return { ...query };
}
