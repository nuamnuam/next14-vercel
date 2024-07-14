import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussConfirmNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorConfirmNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postConfirmNewEmail(data: ICode) {
  return Request.post<SuccussConfirmNewEmailResponse>(
    MYACCOUNT_ENDPOINTS.CHECK_NEW_EMAIL,
    data,
  );
}

export function useConfirmNewEmailMutation() {
  return useMutation<
    SuccussConfirmNewEmailResponse,
    ErrorConfirmNewEmailResponse,
    ICode
  >({
    mutationFn: async (data) => await postConfirmNewEmail(data)(),
    mutationKey: ['confirm-new-email'],
  });
}
