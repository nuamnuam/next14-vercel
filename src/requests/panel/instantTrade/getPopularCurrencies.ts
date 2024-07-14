import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { BalanceCoinModel } from '@/types/wallet';

import { INSTANT_TRADE } from '../../endpoints';

export type SuccessPopularCurrenciesResponse = {
  code: number;
  success: boolean;
  message: string;
  result: BalanceCoinModel[];
};

export type ErrorPopularCurrenciesResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getPopularCurrencies() {
  return Request.get<SuccessPopularCurrenciesResponse>(
    INSTANT_TRADE.POPULAR_CURRENCIES,
  );
}

export function usePopularCurrencies() {
  return useQuery<
    SuccessPopularCurrenciesResponse,
    ErrorPopularCurrenciesResponse
  >({
    queryKey: ['popular-currencies'],
    queryFn: getPopularCurrencies(),
  });
}
