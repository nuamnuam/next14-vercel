import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { CURRENCY } from '../endpoints';

export type ISingleCoin = {
  balance_decimal: string;
  currency_id: number;
  is_depositable: boolean;
  is_fiat: number;
  is_withdrawable: number;
  otc_tradeable: number;
  p2p_tradeable: number;
  p2p_tradingview_pair: string;
  position: number;
  price_decimal: string;
  slug: string;
  symbol: string;
  title: string;
};
export interface SuccessSingleCoinResponse {
  code: number;
  success: boolean;
  message: string;
  result: ISingleCoin[];
}

export type ErrorCurrencySingleResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export async function getSingleCurrency(slug: string) {
  const request = Request.get<SuccessSingleCoinResponse>(
    CURRENCY.GET_SINGLE_CURRENCY_WITH_SLUG(slug),
  );

  const result = await request();
  return result;
}

export function useSingleCurrencyWithSlug(slug?: string) {
  const router = useRouter();

  const query = useQuery<
    SuccessSingleCoinResponse,
    ErrorCurrencySingleResponse
  >({
    queryKey: ['get-currency-single-with-slug', slug],
    queryFn: async () => await getSingleCurrency(slug as string),
    enabled: !!slug,
  });

  if (query.isSuccess) {
    if (!query.data.result.length) router.push('/404');
    if (slug === 'irt' || slug === 'IRT' || slug === 'toman')
      router.push('/404');
  }

  if (query.isError) {
    router.push('/404');
  }

  return query;
}
