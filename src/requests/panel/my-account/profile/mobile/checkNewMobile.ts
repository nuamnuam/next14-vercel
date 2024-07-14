import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussCheckNewMobileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCheckNewMobileResponse = {
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

export function postCheckNewMobile(data: ICode) {
  return Request.post<SuccussCheckNewMobileResponse>(
    MYACCOUNT_ENDPOINTS.CHECk_NEW_MOBILE,
    data,
  );
}

export function useCheckNewMobileMutation() {
  return useMutation<
    SuccussCheckNewMobileResponse,
    ErrorCheckNewMobileResponse,
    ICode
  >({
    mutationFn: async (data) => await postCheckNewMobile(data)(),
    mutationKey: ['check-New-mobile'],
  });
}
