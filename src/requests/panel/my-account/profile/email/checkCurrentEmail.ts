import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussCheckCurrentEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCheckCurrentEmailResponse = {
  result: {
    code: string;
    message: string;
    email?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
  response: {
    data: {};
  };
};

export function postCheckCurrentEmail(data: ICode) {
  return Request.post<SuccussCheckCurrentEmailResponse>(
    MYACCOUNT_ENDPOINTS.CHECK_CURRENT_EMAIL,
    data,
  );
}

export function useCheckCurrentEmailMutation() {
  return useMutation<
    SuccussCheckCurrentEmailResponse,
    ErrorCheckCurrentEmailResponse,
    ICode
  >({
    mutationFn: async (data) => await postCheckCurrentEmail(data)(),
    mutationKey: ['check-current-email'],
  });
}
