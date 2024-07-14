import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import QUERY_KEYS from '@/constants/query-keys';

import { MARKET } from './../endpoints';

export type SingleTradeResult = {
  base_asset: string;
  quote_asset: string;
  side: 'BUY' | 'SELL';
  amount: string;
  price: string;
  time: string;
};

export type SuccessPairsResponse = {
  code: number;
  success: boolean;
  message: string;
  result?: SingleTradeResult[];
};

export type ErrorPairsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export interface Params {
  pair: string;
}

export async function fetchRecentTrade(params: Params) {
  try {
    const request = Request.get<SuccessPairsResponse>(
      MARKET.GET_RECENT_TRADES,
      {
        params: {
          pair: params.pair,
        },
      },
    );

    const data = await request();
    return data || [];
  } catch (error) {
    return {
      code: 0,
      success: false,
      message: 'Error while fetching pairs',
      result: undefined,
    };
  }
}

export function useRecentTradesQuery(pair: string = 'USDTIRT') {
  return useQuery<SuccessPairsResponse, ErrorPairsResponse>({
    queryKey: QUERY_KEYS.GET_RECENT_TRADES(pair),
    queryFn: async () => await fetchRecentTrade({ pair }),
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
  });
}
