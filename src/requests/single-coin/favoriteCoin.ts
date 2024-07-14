import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { CURRENCY } from '../endpoints';

export type SuccussFavoriteCoinResponse = {
  code: number;
  message: string;
  result: [];
  success: boolean;
};

export type ErrorFavoriteCoinResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function favoriteCoin(data: { symbol: string }) {
  return Request.post<SuccussFavoriteCoinResponse>(
    CURRENCY.FAVORITE_COIN,
    data,
  );
}

export function useFavoriteCoin() {
  return useMutation<
    SuccussFavoriteCoinResponse,
    ErrorFavoriteCoinResponse,
    { symbol: string }
  >({
    mutationFn: async (data) => await favoriteCoin(data)(),
    mutationKey: ['favorite-coin'],
  });
}
