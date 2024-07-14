import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { ISmallAssetsResult } from '@/types/wallet';
import { WALLET } from '@/requests/endpoints';

export type SuccussGetSmallAssetsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: ISmallAssetsResult;
};

export type ErrorGetSmallAssetsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function getSmallAssets() {
  return Request.get<SuccussGetSmallAssetsResponse>(WALLET.GET_SMALL_ASSETS);
}

export function useGetSmallAssets() {
  return useQuery<SuccussGetSmallAssetsResponse, ErrorGetSmallAssetsResponse>({
    queryKey: ['get-small-assets'],
    queryFn: getSmallAssets(),
  });
}
