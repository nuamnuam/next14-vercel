import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { MARKET } from '@/requests/endpoints';
import type { IAdvanceMarkeResponse } from '@/types/wallet';

export type SuccessTopCoinsResponse = IAdvanceMarkeResponse;

export type ErrorTopCoinsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

interface Args {
  provider_type?: 'otc' | 'exchange';
  sort_by: string;
  sort_type: string;
  per_page?: number;
}

export function getTopCoins({
  provider_type = 'otc',
  sort_by,
  sort_type,
  per_page = 4,
}: Args) {
  return Request.get<SuccessTopCoinsResponse>(MARKET.GET_PAIRS, {
    params: {
      page: 1,
      per_page,
      provider_type,
      sort_by,
      sort_type,
    },
  });
}

export default function useTopCoins({
  sort_by,
  sort_type,
  provider_type,
  per_page = 4,
}: Args) {
  return useQuery<SuccessTopCoinsResponse, ErrorTopCoinsResponse>({
    queryKey: ['top-coins', sort_by, sort_type],
    queryFn: getTopCoins({ sort_by, sort_type, per_page, provider_type }),
  });
}
