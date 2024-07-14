import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IInviteCode } from '@/types/referral';

import { REFERRAL } from '../../endpoints';

export type SuccessInviteCodeDetailsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInviteCode;
};

export type ErrorInviteCodeDetailsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getInviteCodeDetails(code: string) {
  return Request.get<SuccessInviteCodeDetailsResponse>(
    REFERRAL.INVITED_CODE_DETAILS(code),
  );
}

export function useInviteCodeDetails() {
  return useMutation<
    SuccessInviteCodeDetailsResponse,
    ErrorInviteCodeDetailsResponse,
    string
  >({
    mutationFn: async (data) => await getInviteCodeDetails(data)(),
    mutationKey: ['invite-code-details'],
  });
}
