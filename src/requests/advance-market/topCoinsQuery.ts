import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { MARKET } from '@/requests/endpoints';
import { type IAdvanceMarkeResponse } from '@/types/wallet';
import QUERY_KEYS from '@/constants/query-keys';

export type SuccessTopCoinsResponse = IAdvanceMarkeResponse;

export type ErrorTopCoinsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

interface Args {
  provider_type?: 'otc' | 'p2p';
  sort_by: string;
  sort_type: string;
  per_page?: number;
  enabled?: boolean;
}

export function getAdvanceMarketTopCoins({
  provider_type = 'p2p',
  sort_by,
  sort_type,
  per_page = 4,
}: Args) {
  return Request.get<SuccessTopCoinsResponse>(MARKET.GET_PAIRS, {
    params: {
      page: 1,
      per_page,
      provider_type,
      sort_type,
      sort_by,
    },
  });
}

export default function useAdvanceMarketTopCoins({
  sort_by,
  sort_type,
  provider_type,
  per_page = 2,
  enabled = true,
}: Args) {
  return useQuery<SuccessTopCoinsResponse, ErrorTopCoinsResponse>({
    queryKey: QUERY_KEYS.GET_TOP_COINS(sort_by, sort_type),
    queryFn: getAdvanceMarketTopCoins({
      sort_by,
      sort_type,
      per_page,
      provider_type,
    }),
    enabled,
  });
}
