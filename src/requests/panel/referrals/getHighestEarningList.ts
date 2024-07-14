import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IHighestEarning } from '@/types/referral';

import { REFERRAL } from '../../endpoints';

export type SuccessHighestEarningListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IHighestEarning[];
};

export type ErrorHighestEarningListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getHighestEarningList(currnet_month: number = 0) {
  return Request.get<SuccessHighestEarningListResponse>(
    REFERRAL.HIGHEST_EARNING,
    {
      params: {
        current_month: currnet_month ? 1 : 0,
      },
    },
  );
}

export function useHighestEarningList({
  currnet_month,
}: {
  currnet_month: number;
}) {
  return useQuery<
    SuccessHighestEarningListResponse,
    ErrorHighestEarningListResponse
  >({
    queryKey: ['highest-earning-list', currnet_month],
    queryFn: getHighestEarningList(currnet_month),
    gcTime: 0,
    staleTime: 0,
  });
}
