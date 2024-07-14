import { useInfiniteQuery } from '@tanstack/react-query';
import { CURRENCY } from '@/requests/endpoints';
import { Request } from '@/utils';
import { useMemo, useRef } from 'react';
import { IPaginationBaseModel, IPagination } from '@/types/wallet';
import { ICurrencyModel } from '@/types/currency';

interface ICurrencyListResponse {
  code: number;
  success: boolean;
  message: string;
  result: ICurrencyModel[];
  pagination: IPagination;
}

interface CurrencyListParams extends IPaginationBaseModel {
  with_network?: 0 | 1;
  q?: string;
  type?: 'desposit' | 'withdraw';
  symbol?: string;
  is_fiat?: 0 | 1;
  otc_tradable?: 0 | 1;
}

export const getInfiniteCurrencyList = async (
  params: Partial<CurrencyListParams>,
  pageParam: number = 1,
  totalPagesRef?: any,
) => {
  try {
    const payload = params;
    if (!payload.q) delete params.q;
    const request = Request.get(CURRENCY.LIST, {
      params: { ...payload, page: pageParam },
    });

    const result = (await request()) as ICurrencyListResponse;
    totalPagesRef.current = result.pagination.total_pages;
    return result?.result || [];
  } catch (error) {
    return [];
  }
};

export default function useInfiniteCurrencyList(
  params: Partial<CurrencyListParams>,
) {
  const totalPagesRef = useRef<number>();

  const { data, isLoading, isSuccess, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: [
        'infinite-currency-list',
        (() => {
          if (!params?.q || params?.q?.length === 1) return null;
          return params.q;
        })(),
      ],
      queryFn: async ({ pageParam }) =>
        await getInfiniteCurrencyList(params, pageParam, totalPagesRef),
      refetchOnReconnect: true,
      retry: false,
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
