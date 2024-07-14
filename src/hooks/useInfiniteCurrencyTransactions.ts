import { useInfiniteQuery } from '@tanstack/react-query';
import { WALLET } from '@/requests/endpoints';
import { Request } from '@/utils';
import { useEffect, useMemo, useRef } from 'react';
import { ICurrencyTransaction, IPagination } from '@/types/wallet';

export interface SuccussCurrencyTransactionsResponse {
  code: number;
  success: boolean;
  message: string;
  result: ICurrencyTransaction[];
  pagination: IPagination;
}

export type ErrorCurrencyTransactionsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export type CurrencyTransactionsParams = {
  pageParam?: number;
  operation?: 'trade' | 'wallet' | 'all';
  currency_id?: number;
};

export default function useInfiniteCurrencyTransactions({
  operation,
  currency_id,
}: CurrencyTransactionsParams) {
  const totalPagesRef = useRef<number>();

  useEffect(() => {
    totalPagesRef.current = 1;
  }, [operation, currency_id]);

  const getCurrencyTransactions = async (
    params: CurrencyTransactionsParams,
  ) => {
    try {
      const request = Request.get(WALLET.CURRENCY_TRANSACTIONS, {
        params: {
          page: params?.pageParam,
          operation: params?.operation,
          currency_id: params?.currency_id,
        },
      });

      const result = (await request()) as SuccussCurrencyTransactionsResponse;
      totalPagesRef.current = result.pagination.total_pages;
      return result?.result || [];
    } catch (error) {
      return [];
    }
  };

  const api = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['infinite-currency-transactions', operation, currency_id],
    queryFn: async ({ pageParam }) =>
      await getCurrencyTransactions({ pageParam, operation, currency_id }),
    refetchOnReconnect: true,
    gcTime: 0,
    enabled: !!currency_id,
    getNextPageParam: (_, allPages) => {
      const totalPages = totalPagesRef.current;
      if (totalPages && totalPages <= allPages.length) return;
      return allPages.length + 1;
    },
  });

  const convertedData = useMemo(() => {
    return api.data?.pages.reduce((acc, cr) => [...acc, ...cr]);
  }, [api.data]);

  return {
    ...api,
    data: convertedData,
  };
}
