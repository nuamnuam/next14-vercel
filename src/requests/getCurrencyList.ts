import { useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IPagination, IPaginationBaseModel } from '@/types/wallet';
import { ICurrencyModel } from '@/types/currency';

import { CURRENCY } from './endpoints';

export interface SuccessCurrencyListResponse {
  code: number;
  success: boolean;
  message: string;
  result: ICurrencyModel[];
  pagination: IPagination;
}

export type ErrorCurrencyListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

interface CurrencyListParams extends IPaginationBaseModel {
  with_network?: 0 | 1;
  q?: string;
  type?: 'deposit' | 'withdraw';
  symbol?: string;
  is_fiat?: 0 | 1;
}

export function getCurrencyList(params: Partial<CurrencyListParams>) {
  if (!params?.q) delete params?.q;

  return Request.get<SuccessCurrencyListResponse>(CURRENCY.LIST, {
    params: {
      page: 1,
      per_page: 10,
      ...params,
    },
  });
}

let dataClone: ICurrencyModel[] = [];

export function useCurrencyList(
  params: Partial<CurrencyListParams>,
  hasInfinitScoll?: boolean,
) {
  useEffect(() => {
    if (!hasInfinitScoll) return;

    dataClone = [];
  }, [params?.q]);

  const api = useQuery<SuccessCurrencyListResponse, ErrorCurrencyListResponse>({
    queryKey: ['currency-list', params],
    queryFn: getCurrencyList(params),
    placeholderData: keepPreviousData,
    gcTime: 0,
  });

  if (api.isSuccess) {
    if (hasInfinitScoll) dataClone.push(...api.data.result);
    else dataClone = api.data.result;
  }

  return { ...api, data: { ...api.data, result: dataClone } };
}
