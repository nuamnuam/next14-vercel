import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { CURRENCY } from '../endpoints';

export type ISingleCoin = {
  currency_id: number;
  key: string;
  update_at: string;
  category: [
    {
      id: number;
      name_fa: string;
      name_en: string;
      priority: number;
      meta_title: string;
      meta_description: string;
      content: string;
    },
  ];
  last_irt_price: string;
  last_usd_price: string;
  otc_tradeable: true;
  p2p_tradeable: false;
  marketcap: {
    rank: string;
    website: null;
    percent_change_24h: null;
    '24h_volume_usd': string;
    market_cap_usd: string;
    market_cap_dominance: string;

    total_supply: string;
    max_supply: string;
    circulating_supply: string;
    fully_diluted_mcap: string;
    '24h_highPrice': null;
    '24h_lowPrice': null;
  };
  related_currencies: Array<{
    title: string;
    symbol: string;
    percent_change_24h: null;
  }>;

  tradingview_pair: string;
  p2p_tradingview_pair?: string;
  favorite: false;
};
export interface SuccessSingleCoinResponse {
  code: number;
  success: boolean;
  message: string;
  result: ISingleCoin;
}

export type ErrorCurrencySingleResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function getCurrencySingle(symbol: string) {
  return Request.get<SuccessSingleCoinResponse>(
    CURRENCY.GET_SINGLE_CURRENCY(symbol),
  );
}

export function useSingleCurrency(symbol?: string) {
  const router = useRouter();

  const query = useQuery<
    SuccessSingleCoinResponse,
    ErrorCurrencySingleResponse
  >({
    queryKey: ['get-single-currency', symbol],
    queryFn: async () => await getCurrencySingle(symbol as string)(),
    enabled: !!symbol,
  });

  if (query.isSuccess) {
    if (symbol === 'irt' || symbol === 'IRT') router.push('/404');
  }

  if (query.isError) {
    router.push('/404');
  }

  return { ...query };
}
