import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { Request } from '@/utils';
import { type CheckOtpModel } from '@/types/auth';

import { LOGIN_ENDPOINTS } from '../endpoints';

export type SuccussCheckOtpResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorCheckOtpResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postCheckOtp(data: CheckOtpModel) {
  if (data?.mobile_number) {
    return Request.post<SuccussCheckOtpResponse>(
      LOGIN_ENDPOINTS.CHECK_MOBILE_OTP,
      data,
    );
  }
  return Request.post<ErrorCheckOtpResponse>(
    LOGIN_ENDPOINTS.CHECK_EMAIL_OTP,
    data,
  );
}

export function useCheckOtpMutation() {
  const router = useRouter();
  return useMutation<
    SuccussCheckOtpResponse,
    ErrorCheckOtpResponse,
    CheckOtpModel
  >({
    mutationFn: async (data) => await postCheckOtp(data)(),
    mutationKey: ['forgot-password-otp-check'],
    onSuccess: (res) => {
      if (!res.result.token) return;
      try {
        sessionStorage.setItem('temp-token', res.result.token);
        Request.setToken(res.result.token);
        router.push({
          pathname: '/auth/reset-password',
          query: { ...router.query },
        });
      } catch (exp) {
        console.log({ exp });
      }
    },
    onError: () => {
      Request.setToken('');
    },
  });
}
