import { useMutation } from '@tanstack/react-query';

import { type IEmail } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussSetNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorSetNewEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postSetNewEmail(data: IEmail) {
  return Request.post<SuccussSetNewEmailResponse>(
    MYACCOUNT_ENDPOINTS.NEW_EMAIL,
    data,
  );
}

export function useSetNewEmailMutation() {
  return useMutation<
    SuccussSetNewEmailResponse,
    ErrorSetNewEmailResponse,
    IEmail
  >({
    mutationFn: async (data) => await postSetNewEmail(data)(),
    mutationKey: ['add-email'],
  });
}
