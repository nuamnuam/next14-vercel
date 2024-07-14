import { useInfiniteQuery } from '@tanstack/react-query';
import { WALLET } from '@/requests/endpoints';
import { Request } from '@/utils';
import { useMemo, useRef } from 'react';
import { ITransactionsResponse, IPaginationBaseModel } from '@/types/wallet';
import { useTransactionHistoryStore } from '@/store';

export type SuccessTransactionsResponse = ITransactionsResponse;

export type ErrorTransactionsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export interface TransactionsParams extends IPaginationBaseModel {
  type: 'fiat' | 'crypto';
  operation?: 'deposit' | 'withdraw';
  from_date?: string;
  to_date?: string;
  currency_id?: number;
  status?: '0' | '1';
}

export default function useInfiniteTransactions() {
  const totalPagesRef = useRef<number>();
  const { type, operation, from_date, to_date, status, currency_id, txid } =
    useTransactionHistoryStore();
  const getTransactions = async (pageParam: number = 1) => {
    try {
      const params: Partial<TransactionsParams> = {
        page: pageParam,
        type,
        per_page: 15,
        operation,
        status: status !== '-1' ? status : undefined,
        ...(from_date && { from_date: from_date?.replaceAll('/', '-') }),
        ...(to_date && { to_date: to_date?.replaceAll('/', '-') }),
        ...(currency_id && { currency_id }),
        ...(txid && { txid }),
      };
      const request = Request.get(WALLET.GET_TRASANCTIONS, {
        params,
      });

      const result = (await request()) as SuccessTransactionsResponse;
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
        'infinite-transactions',
        operation,
        status,
        from_date,
        to_date,
        txid,
        currency_id,
      ],
      queryFn: async ({ pageParam }) => await getTransactions(pageParam),
      refetchOnReconnect: true,
      gcTime: 0,
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
