import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IInviteGift } from '@/types/referral';
import { IPagination } from '@/types/wallet';

import { REFERRAL } from '../../endpoints';

export type SuccessGiftsListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInviteGift[];
  pagination: IPagination;
};

export type ErrorGiftsListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

let dataClone: IInviteGift[] = [];

export function useGiftsList({
  page = 1,
  hasInfinitScoll,
}: {
  page?: number;
  hasInfinitScoll?: boolean;
}) {
  function getGiftsList() {
    return Request.get<SuccessGiftsListResponse>(REFERRAL.GIFTS_LIST, {
      params: {
        page,
        per_page: 5,
      },
    });
  }

  const api = useQuery<SuccessGiftsListResponse, ErrorGiftsListResponse>({
    queryKey: ['gifts-list', page],
    gcTime: 0,
    placeholderData: keepPreviousData,
    queryFn: getGiftsList(),
  });

  if (api.isSuccess) {
    if (hasInfinitScoll) {
      if (page === 1) dataClone = api.data.result;
      else dataClone.push(...api.data.result);
    } else dataClone = api.data.result;
  }

  return { ...api, data: { ...api.data, result: dataClone } };
}
