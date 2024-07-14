import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { REFERRAL } from '@/requests/endpoints';
import { IInviteCode } from '@/types/referral';

type RequestBody = {
  referral_code?: string;
};

export type SuccussSetReferralCodeResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInviteCode;
};

export type ErrorSetReferralCodeResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { referral_code?: string };
};

export function setReferralCode({ referral_code }: RequestBody) {
  return Request.post<SuccussSetReferralCodeResponse>(
    REFERRAL.SET_REFERRAL_CODE,
    {
      referral_code,
    },
  );
}

export function useSetReferralCode() {
  return useMutation<
    SuccussSetReferralCodeResponse,
    ErrorSetReferralCodeResponse,
    RequestBody
  >({
    mutationFn: async (data) => await setReferralCode(data)(),
    mutationKey: ['set-referral-code'],
  });
}
