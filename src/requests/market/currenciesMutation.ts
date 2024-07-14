import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import type {
  IAdvanceMarkeResponse,
  IPaginationBaseModel,
} from '@/types/wallet';
import { Request } from '@/utils';
import useMarketStore from '@/store/marketStore';
import QUERY_KEYS from '@/constants/query-keys';

import { MARKET } from './../endpoints';

export type SuccessCurrneciesResponse = IAdvanceMarkeResponse;

export type ErrorCurrneciesResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export interface CurrneciesParams extends IPaginationBaseModel {
  favorite?: boolean;
  sort_by?: string;
  sort_type?: 'ASC' | 'DESC';
  provider_type?: string;
  category_id?: number | string;
  search?: string;
}

export function getCurrnecies(params: CurrneciesParams) {
  return Request.get<SuccessCurrneciesResponse>(MARKET.GET_PAIRS, {
    params: {
      provider_type: 'otc',
      ...params,
      favorite: params.favorite ? Number(params.favorite) : undefined,
      page: params.page || 1,
      per_page: params.per_page || 10,
      category_id: Number.isNaN(params.category_id)
        ? undefined
        : params.category_id,
    },
  });
}

export function useCurrencies(hasInfinitScoll?: boolean) {
  const { pairs, set_pairs, set_loading } = useMarketStore();
  return useMutation<
    SuccessCurrneciesResponse,
    ErrorCurrneciesResponse,
    CurrneciesParams
  >({
    mutationFn: async (data) => await getCurrnecies(data)(),
    mutationKey: ['get-market-currencies'],
    onMutate: () => set_loading(true),
    onSuccess: (data: IAdvanceMarkeResponse) => {
      if (hasInfinitScoll) {
        const existingPairs = pairs.result.map((obj) => Object.keys(obj)[0]);
        const distinct_result = data.result.filter((item) => {
          const assetPair = Object.values(item)[0].pair;
          if (existingPairs.some((pair) => pair === assetPair)) {
            return false;
          }
          return true;
        });
        set_pairs({
          ...data,
          result: [...pairs.result, ...distinct_result],
        });
        return set_loading(false);
      }
      set_pairs(data);
      return set_loading(false);
    },
  });
}

export async function fetchCurrnecies(params: CurrneciesParams) {
  try {
    const request = Request.get<SuccessCurrneciesResponse>(MARKET.GET_PAIRS, {
      params: {
        ...params,
        search: params.search != '' ? params.search : undefined,
        favorite: params.favorite ? Number(params.favorite) : undefined,
        page: params.page || 1,
        per_page: params.per_page || 5,
        category_id:
          typeof params.category_id === 'string'
            ? undefined
            : params.category_id,
        provider_type: 'otc',
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

export function useInfiniteCurrenciesQuery({
  search = '',
  favorite = false,
  category_id,
  sort_type = undefined,
  sort_by,
  per_page = 20,
}: {
  search?: string;
  favorite?: boolean;
  category_id?: number | string;
  sort_by?: string;
  sort_type?: 'ASC' | 'DESC' | undefined;
  per_page?: number;
}) {
  return useInfiniteQuery<SuccessCurrneciesResponse, ErrorCurrneciesResponse>({
    initialPageParam: 0,
    queryKey: QUERY_KEYS.CURRENCIES({
      search,
      favorite,
      category_id,
      sort_by: sort_by ?? '',
      sort_type: sort_type ?? '',
    }),
    queryFn: async ({ pageParam }) =>
      await fetchCurrnecies({
        page: pageParam as number,
        per_page,
        favorite,
        category_id,
        sort_by,
        sort_type,
        search,
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
    gcTime: 5000,
  });
}

export function useCurrencyQuery({
  search = '',
  favorite = false,
  category_id,
  sort_type = undefined,
  sort_by,
  page = 1,
  per_page = 10,
  enabled = true,
}: {
  search?: string;
  favorite?: boolean;
  category_id?: number | string;
  sort_by?: string;
  sort_type?: 'ASC' | 'DESC' | undefined;
  page: number;
  per_page: number;
  enabled?: boolean;
}) {
  return useQuery<SuccessCurrneciesResponse, ErrorCurrneciesResponse>({
    queryKey: QUERY_KEYS.CURRENCIES({
      search: search ?? '',
      favorite,
      category_id: category_id ?? '',
      sort_by: sort_by ?? '',
      sort_type: sort_type ?? '',
      page,
    }),
    queryFn: async () =>
      await fetchCurrnecies({
        page,
        per_page,
        favorite,
        category_id,
        sort_by,
        sort_type,
        search,
      }),
    gcTime: 5000,
  });
}
