import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';

import { MARKET } from '../endpoints';

export type CoinCategoriesResponseResult = {
  id: number;
  title: string;
  name_fa: string;
  name_en: string;
  priority: string;
  symbols: string[];
  content: string;
  meta_title: string;
  meta_description: string;
};

export interface SuccussCoinCategoriesResponse {
  code: number;
  success: boolean;
  message: string;
  result: CoinCategoriesResponseResult[];
}

export type ErrorCoinCategoriesResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getCoinCategories() {
  return Request.get<SuccussCoinCategoriesResponse>(MARKET.GET_COIN_CATEGORIES);
}

export function useCoinCategoriesMutation() {
  return useQuery<SuccussCoinCategoriesResponse, ErrorCoinCategoriesResponse>({
    queryKey: ['get-coin-categories'],
    queryFn: getCoinCategories(),
  });
}
