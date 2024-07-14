import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { REFERRAL } from '@/requests/endpoints';
import { IInviteCode } from '@/types/referral';

import { useInviteCodeList } from './getInviteCodeList';

type RequestBody = {
  id: string;
  share_percent?: string;
  is_default: boolean;
};

export type SuccussUpdateInviteCodeResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInviteCode;
};

export type ErrorUpdateInviteCodeResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function updateInviteCode({
  id,
  share_percent,
  is_default,
}: RequestBody) {
  return Request.put<SuccussUpdateInviteCodeResponse>(
    REFERRAL.UPDATE_INVITE_CODE(id),
    {
      share_percent,
      is_default,
    },
  );
}

export function useUpdateInviteCode() {
  const { refetch } = useInviteCodeList();

  return useMutation<
    SuccussUpdateInviteCodeResponse,
    ErrorUpdateInviteCodeResponse,
    RequestBody
  >({
    mutationFn: async (data) => await updateInviteCode(data)(),
    mutationKey: ['update-invite-code'],
    onSuccess: () => {
      refetch();
    },
  });
}
