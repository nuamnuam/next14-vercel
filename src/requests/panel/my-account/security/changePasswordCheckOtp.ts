import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { type IChangePasswordCheckOTPModel } from '@/types/myAccount';
import { Request } from '@/utils';
import { authStore } from '@/store';

import { SECURITY } from '../../../endpoints';

export type SuccussChangePasswordCheckOTPResponse = {
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

export type ErrorChangePasswordCheckOTPResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postChangePasswordCheckOTP(data: IChangePasswordCheckOTPModel) {
  return Request.post<SuccussChangePasswordCheckOTPResponse>(
    SECURITY.CHANGE_PASSWORD_CHECK_OTP,
    data,
  );
}

export function useChangePasswordCheckOTPMutation() {
  const router = useRouter();
  const { setToken } = authStore();

  return useMutation<
    SuccussChangePasswordCheckOTPResponse,
    ErrorChangePasswordCheckOTPResponse,
    IChangePasswordCheckOTPModel
  >({
    mutationFn: async (data) => await postChangePasswordCheckOTP(data)(),
    mutationKey: ['change-password-check-otp'],
    onSuccess: (res) => {
      Cookies.remove('token');
      setToken('');
      router.push('/auth/login');
    },
  });
}
