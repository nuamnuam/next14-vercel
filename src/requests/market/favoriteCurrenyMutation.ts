import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { MARKET } from '../endpoints';

export type SuccussFavoriteCurrencyResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorFavoriteCurrencyResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type FavoriteCurrencyModel = {
  symbol: string;
};

export function putFavoriteCurrency(data: FavoriteCurrencyModel) {
  return Request.post<SuccussFavoriteCurrencyResponse>(
    MARKET.PUT_FAVORITE,
    data,
  );
}

export function useFavoriteCurrencyMutation() {
  return useMutation<
    SuccussFavoriteCurrencyResponse,
    ErrorFavoriteCurrencyResponse,
    FavoriteCurrencyModel
  >({
    mutationFn: async (data) => await putFavoriteCurrency(data)(),
    mutationKey: ['favorite-currency'],
  });
}
