import { useMutation } from '@tanstack/react-query';

import { type IMobileNumber } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../endpoints';

export type SuccussCheckNewMobileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCheckNewMobileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postCheckNewMobile(data: IMobileNumber) {
  return Request.put<SuccussCheckNewMobileResponse>(
    MYACCOUNT_ENDPOINTS.CHECK_NEW_MOBILE_NUMBER,
    data,
  );
}

export function useUseCheckMobileMutation() {
  return useMutation<
    SuccussCheckNewMobileResponse,
    ErrorCheckNewMobileResponse,
    IMobileNumber
  >({
    mutationFn: async (data) => await postCheckNewMobile(data)(),
    mutationKey: ['check-New-mobile'],
  });
}
