import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussCheckCurrentMobileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCheckCurrentMobileResponse = {
  result: {
    code: number;
    message: string;
    mobile_number?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function postCheckCurrentMobile(data: ICode) {
  return Request.post<SuccussCheckCurrentMobileResponse>(
    MYACCOUNT_ENDPOINTS.CHECK_CURRENT_MOBILE,
    data,
  );
}

export function useCheckCurrentMobileMutation() {
  return useMutation<
    SuccussCheckCurrentMobileResponse,
    ErrorCheckCurrentMobileResponse,
    ICode
  >({
    mutationFn: async (data) => await postCheckCurrentMobile(data)(),
    mutationKey: ['check-current-mobile'],
  });
}
