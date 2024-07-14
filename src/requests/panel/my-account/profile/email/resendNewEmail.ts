import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussResendNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorResendNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postResendNewEmail(data: ICode) {
  return Request.get<SuccussResendNewEmailResponse>(
    MYACCOUNT_ENDPOINTS.RESEND_NEW_EMAIL,
  );
}

export function useResendNewEmailMutation() {
  return useMutation<
    SuccussResendNewEmailResponse,
    ErrorResendNewEmailResponse,
    ICode
  >({
    mutationFn: async (data) => await postResendNewEmail(data)(),
    mutationKey: ['edit-email'],
  });
}
