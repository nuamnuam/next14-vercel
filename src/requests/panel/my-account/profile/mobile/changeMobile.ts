import { useMutation } from '@tanstack/react-query';

import { type IMobileNumber } from '@/types/myAccount';
import { Request } from '@/utils';

import { MYACCOUNT_ENDPOINTS } from '../../../../endpoints';

export type SuccussChangeMobileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorChangeMobileResponse = {
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

export function postChangeMobile(data: IMobileNumber) {
  return Request.post<SuccussChangeMobileResponse>(
    MYACCOUNT_ENDPOINTS.CHECK_NEW_MOBILE_NUMBER,
    data,
  );
}

export function useChangeMobileMutation() {
  return useMutation<
    SuccussChangeMobileResponse,
    ErrorChangeMobileResponse,
    IMobileNumber
  >({
    mutationFn: async (data) => await postChangeMobile(data)(),
    mutationKey: ['edit-email'],
  });
}
