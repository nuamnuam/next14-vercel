import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussCheckNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCheckNewEmailResponse = {
  result: {
    code: number;
    message: string;
    result: {
      email: string;
    };
    email?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function postCheckNewEmail(data: ICode) {
  return Request.post<SuccussCheckNewEmailResponse>(
    MYACCOUNT_ENDPOINTS.CHECK_NEW_EMAIL,
    data,
  );
}

export function useCheckNewEmailMutation() {
  return useMutation<
    SuccussCheckNewEmailResponse,
    ErrorCheckNewEmailResponse,
    ICode
  >({
    mutationFn: async (data) => await postCheckNewEmail(data)(),
    mutationKey: ['check-new-email'],
  });
}
