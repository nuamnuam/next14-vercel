import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IInviteCode } from '@/types/referral';

import { REFERRAL } from '../../endpoints';

export type SuccessInviteCodeListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInviteCode[];
};

export type ErrorInviteCodeListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getInviteCodeList() {
  return Request.get<SuccessInviteCodeListResponse>(REFERRAL.INVITE_CODE);
}

export function useInviteCodeList() {
  return useQuery<SuccessInviteCodeListResponse, ErrorInviteCodeListResponse>({
    queryKey: ['invite-code-list'],
    gcTime: 0,
    queryFn: getInviteCodeList(),
  });
}
