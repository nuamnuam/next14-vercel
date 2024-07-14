import { useMutation } from '@tanstack/react-query';

import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { SECURITY } from '../../../endpoints';

export type SuccussConfirmOTPResponse = {
  result: {
    two_step: {
      status: boolean;
      type: string;
      channel: string;
    };
  };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorConfirmOTPResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postConfirmOTP(data: ICode) {
  return Request.post<SuccussConfirmOTPResponse>(
    SECURITY.CONFIRM_OPT_CODE,
    data,
  );
}

export function useConfirmOTPMutation() {
  return useMutation<SuccussConfirmOTPResponse, ErrorConfirmOTPResponse, ICode>(
    {
      mutationFn: async (data) => await postConfirmOTP(data)(),
      mutationKey: ['change-password-check-otp'],
    },
  );
}
