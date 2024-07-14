import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { IPaginationBaseModel } from '@/types/wallet';
import { Request } from '@/utils';
import { authStore } from '@/store';
import { type IOrderHistorysResponse } from '@/types/market';
import QUERY_KEYS from '@/constants/query-keys';

import { MARKET } from '../endpoints';

export type SuccessOrderHistoryResponse = IOrderHistorysResponse;

export type ErrorOrderHistoryResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export interface OrderHistoryParams extends IPaginationBaseModel {
  type?: 'MARKET' | 'LIMIT';
  order_type?: 'OTC' | 'P2P' | 'CONVERT';
  side?: 'BUY' | 'SELL';
  from_date?: string;
  to_date?: string;
  pair?: string;
  status?: '0' | '1';
}

export async function fetchOrderHistory(params: OrderHistoryParams) {
  try {
    const request = Request.get<SuccessOrderHistoryResponse>(
      MARKET.ORDER_HISTORY,
      {
        params: {
          ...params,
          page: params.page || 1,
          per_page: params.per_page || 5,
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
      result: [],
      pagination: {
        total: 0,
        count: 0,
        per_page: 0,
        current_page: 0,
        total_pages: 0,
        links: {
          next: null,
        },
      },
    };
  }
}

export function useOrderHistoriesQuery(params: OrderHistoryParams) {
  const { token } = authStore();
  return useQuery<SuccessOrderHistoryResponse, ErrorOrderHistoryResponse>({
    queryKey: QUERY_KEYS.GET_ORDER_HISTORIES(params),
    queryFn: async () => await fetchOrderHistory(params),
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
    enabled: !!token,
  });
}

export function useInfiniteOrderHistoriesQuery(params: OrderHistoryParams) {
  const { token } = authStore();
  return useInfiniteQuery<
    SuccessOrderHistoryResponse,
    ErrorOrderHistoryResponse
  >({
    initialPageParam: 1,
    queryKey: QUERY_KEYS.GET_ORDER_HISTORIES(params),
    queryFn: async ({ pageParam }) =>
      await fetchOrderHistory({ ...params, page: pageParam as number }),
    getNextPageParam: (last_page, all_pages) => {
      if (
        last_page?.pagination.current_page < last_page?.pagination.total_pages
      ) {
        return all_pages.length + 1;
      } else {
        return undefined;
      }
    },
    gcTime: 0,
    staleTime: 0,
    refetchOnReconnect: true,
    enabled: !!token,
  });
}
