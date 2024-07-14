import { useMutation } from '@tanstack/react-query';

import { type IChangePasswordGetOTPModel } from '@/types/myAccount';
import { Request } from '@/utils';

import { SECURITY } from '../../../endpoints';

export type SuccussChangePasswordGetOTPResponse = {
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

export type ErrorChangePasswordGetOTPResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postChangePasswordGetOTP(data: IChangePasswordGetOTPModel) {
  return Request.post<SuccussChangePasswordGetOTPResponse>(
    SECURITY.TWO_STEP_CHANGE_GET_OTP,
    data,
  );
}

export function useChangePasswordGetOTPMutation() {
  return useMutation<
    SuccussChangePasswordGetOTPResponse,
    ErrorChangePasswordGetOTPResponse,
    IChangePasswordGetOTPModel
  >({
    mutationFn: async (data) => await postChangePasswordGetOTP(data)(),
    mutationKey: ['change-password-check-otp'],
  });
}
