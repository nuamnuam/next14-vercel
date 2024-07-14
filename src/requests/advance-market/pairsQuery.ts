import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  type IPaginationBaseModel,
  type IAdvanceMarkeResponse,
} from '@/types/wallet';
import { Request } from '@/utils';
import QUERY_KEYS from '@/constants/query-keys';

import { MARKET } from './../endpoints';

export type SuccessPairsResponse = IAdvanceMarkeResponse;

export type ErrorPairsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export interface PairsParams extends IPaginationBaseModel {
  search?: string;
  quote_asset?: string;
  provider_type?: string;
  exists_symbol?: string;
  base_asset?: string;
}

export async function fetchPairs(params: PairsParams) {
  try {
    const request = Request.get<SuccessPairsResponse>(MARKET.GET_PAIRS, {
      params: {
        ...params,
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search || undefined,
      },
    });

    const data = await request();
    return data || [];
  } catch (error) {
    return {
      code: 0,
      success: false,
      message: 'Error while fetching pairs',
      result: [],
      pagination: {
        total: 0,
        count: 0,
        per_page: 0,
        current_page: 0,
        total_pages: 0,
        links: {
          next: null,
        },
      },
    };
  }
}

export function usePairsQuery(
  page: number,
  per_page: number,
  search: string = '',
  enabled: boolean,
  provider_type: 'p2p' | 'otc' = 'p2p',
  base_asset?: string,
) {
  return useQuery<SuccessPairsResponse, ErrorPairsResponse>({
    queryKey: QUERY_KEYS.GET_PAIRS(search, page, per_page, base_asset || ''),
    queryFn: async () =>
      await fetchPairs({ page, per_page, search, provider_type, base_asset }),
    gcTime: 1000,
    enabled,
  });
}

export function useInfinitePairsQuery({
  search = '',
  base_asset,
  quote_asset,
  provider_type = 'p2p',
  exists_symbol,
  enabled = true,
}: {
  search?: string;
  base_asset?: string;
  quote_asset?: string;
  provider_type?: string;
  exists_symbol?: string;
  enabled?: boolean;
}) {
  return useInfiniteQuery<SuccessPairsResponse, ErrorPairsResponse>({
    initialPageParam: 1,
    queryKey: QUERY_KEYS.GET_PAIRS(search),
    queryFn: async ({ pageParam }) =>
      await fetchPairs({
        page: pageParam as number,
        per_page: 20,
        search,
        provider_type,
        ...(exists_symbol && { exists_symbol }),
        ...(base_asset && { base_asset }),
        ...(quote_asset && { search: quote_asset }),
      }),
    getNextPageParam: (last_page, all_pages) => {
      if (
        last_page?.pagination.current_page < last_page?.pagination.total_pages
      ) {
        return all_pages.length + 1;
      } else {
        return undefined;
      }
    },
    gcTime: 1000,
    refetchOnReconnect: true,
    enabled,
  });
}
