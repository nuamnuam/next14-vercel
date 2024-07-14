import { useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { WALLET } from '@/requests/endpoints';
import { Request } from '@/utils';
import { type IBalancesResponse } from '@/types/wallet';
import { QUERY_KEYS } from '@/constants';

export type BalancesParams = {
  with_network: number;
  type: 'deposit' | 'withdraw';
  page: number;
  q: string;
  non_zero_balances: number;
  otc_tradable?: 0 | 1;
};

interface Args {
  q?: string;
  with_network?: number;
  type?: 'deposit' | 'withdraw';
  otc_tradable?: boolean;
  hasNetworkParam?: boolean;
  nonZeroBalances?: boolean;
  enabled?: boolean;
}

export default function useInfiniteBalances({
  q = '',
  with_network = 1,
  type,
  otc_tradable = undefined,
  hasNetworkParam = true,
  nonZeroBalances,
  enabled = true,
}: Args) {
  const totalPagesRef = useRef<number>();

  const getBalances = async (pageParam: number = 1) => {
    try {
      const params: Partial<BalancesParams> = {};
      params.page = pageParam;
      params.q = q;
      params.non_zero_balances = nonZeroBalances ? 1 : 0;
      if (hasNetworkParam) params.with_network = with_network;
      if (type) {
        params.type = type;
      }
      if (!q) delete params.q;
      if (typeof otc_tradable !== 'undefined') params.otc_tradable = 1;

      const request = Request.get(WALLET.GET_BALANCES, {
        params,
      });

      const result = (await request()) as IBalancesResponse;
      totalPagesRef.current = result.pagination.total_pages;
      return result?.result || [];
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading, isSuccess, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: [
        QUERY_KEYS.GET_INFINITE_ASSETS,
        (() => {
          if (!q || q.length === 1) return null;
          return q;
        })(),
        nonZeroBalances,
      ],
      queryFn: async ({ pageParam }) => await getBalances(pageParam),
      refetchOnReconnect: true,
      // keepPreviousData: false,
      retry: false,
      gcTime: 0,
      staleTime: 0,
      enabled,
      getNextPageParam: (_, allPages) => {
        const totalPages = totalPagesRef.current;
        if (totalPages && totalPages <= allPages.length) return;
        return allPages.length + 1;
      },
    });

  const convertedData = useMemo(() => {
    return data?.pages.reduce((acc, cr) => [...acc, ...cr]);
  }, [data]);

  return {
    isLoading,
    isSuccess,
    isFetching,
    hasNextPage,
    fetchNextPage,
    data: convertedData,
  };
}
