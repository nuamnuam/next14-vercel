import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussResendCurrentEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorResendCurrentEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postResendCurrentEmail(data: ICode) {
  return Request.get<SuccussResendCurrentEmailResponse>(
    MYACCOUNT_ENDPOINTS.RESEND_CURRENT_EMAIL,
  );
}

export function useResendCurrentEmailMutation() {
  return useMutation<
    SuccussResendCurrentEmailResponse,
    ErrorResendCurrentEmailResponse,
    ICode
  >({
    mutationFn: async (data) => await postResendCurrentEmail(data)(),
    mutationKey: ['current-email'],
  });
}
