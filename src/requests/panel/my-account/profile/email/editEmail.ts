import { useMutation } from '@tanstack/react-query';

import { type IEmail } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussEditEmailResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorEditEmailResponse = {
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

export function postEditEmail(data: IEmail) {
  return Request.post<SuccussEditEmailResponse>(
    MYACCOUNT_ENDPOINTS.EDIT_EMAIL,
    data,
  );
}

export function useEditEmailMutation() {
  return useMutation<SuccussEditEmailResponse, ErrorEditEmailResponse, IEmail>({
    mutationFn: async (data) => await postEditEmail(data)(),
    mutationKey: ['edit-email'],
  });
}
