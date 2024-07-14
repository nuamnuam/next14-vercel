import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { REFERRAL } from '@/requests/endpoints';
import { IInviteCode } from '@/types/referral';

import { useInviteCodeList } from './getInviteCodeList';

type RequestBody = {
  share_percent?: string;
  is_default: boolean;
};

export type SuccussRegisterInviteCodeResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInviteCode;
};

export type ErrorRegisterInviteCodeResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function registerInviteCode({ share_percent, is_default }: RequestBody) {
  return Request.post<SuccussRegisterInviteCodeResponse>(
    REFERRAL.REGISTER_INVITE_CODE,
    {
      share_percent,
      is_default,
    },
  );
}

export function useRegisterInviteCode() {
  const { refetch } = useInviteCodeList();

  return useMutation<
    SuccussRegisterInviteCodeResponse,
    ErrorRegisterInviteCodeResponse,
    RequestBody
  >({
    mutationFn: async (data) => await registerInviteCode(data)(),
    mutationKey: ['register-invite-code'],
    onSuccess: (res) => {
      refetch();
    },
  });
}
