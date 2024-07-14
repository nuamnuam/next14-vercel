import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import QUERY_KEYS from '@/constants/query-keys';

import { MARKET } from './../endpoints';

export type SuccessPairsResponse = {
  code: number;
  success: boolean;
  message: string;
  result?: {
    symbol: string;
    market_buy_percent: string;
    last_price: string;
    last_price_usdt: string;
    last_update: string;
    bids: number[][];
    asks: number[][];
  };
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

export async function fetchOrderBook(params: Params) {
  try {
    const request = Request.get<SuccessPairsResponse>(MARKET.GET_ORDER_BOOK, {
      params: {
        pair: params.pair,
        limit: 20,
      },
    });

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

export function useOrderBookQuery(pair: string = 'USDTIRT') {
  return useQuery<SuccessPairsResponse, ErrorPairsResponse>({
    queryKey: QUERY_KEYS.GET_ORDER_BOOK(pair),
    queryFn: async () => await fetchOrderBook({ pair }),
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
  });
}
