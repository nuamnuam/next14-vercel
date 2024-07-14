import { useQuery } from '@tanstack/react-query';

import type { IAdvanceMarkeResponse } from '@/types/wallet';
import { Request } from '@/utils';
import { MARKET } from '@/requests/endpoints';

export type SuccessSingleCurrnecyMarketResponse = IAdvanceMarkeResponse;

export type ErrorSingleCurrnecyMarketResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

interface Args {
  baseAsset?: string;
  providerType: 'otc' | 'p2p' | 'exchange';
  search?: string;
}

export async function getCurrnecyMarket({
  baseAsset,
  providerType = 'otc',
  search,
}: Args) {
  const request = Request.get<SuccessSingleCurrnecyMarketResponse>(
    MARKET.GET_PAIRS,
    {
      params: {
        page: 1,
        per_page: 1,
        base_asset: baseAsset,
        provider_type: providerType,
        search,
      },
    },
  );

  const result = await request();
  return result;
}

export default function useSingleCurrencyMarket(data: Args) {
  const api = useQuery<
    SuccessSingleCurrnecyMarketResponse,
    ErrorSingleCurrnecyMarketResponse
  >({
    queryFn: async () => await getCurrnecyMarket(data),
    queryKey: ['single-currency-market', data],
  });

  return { ...api, data: Object.values(api.data?.result?.[0] ?? {})[0] };
}
