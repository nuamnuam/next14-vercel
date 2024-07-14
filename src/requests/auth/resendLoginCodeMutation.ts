import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { TWOFA_ENDPOINTS } from '../endpoints';

export type SuccussResendLoginCodeResponse = {
  message: string;
  result: {
    token?: string;
    two_step?: {
      status: boolean;
      type: 'sms' | 'email' | 'google2fa';
      channel: string;
    };
  };
  success: boolean;
};

export type ErrorResendLoginCodeResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postResendLoginCode() {
  return Request.post<SuccussResendLoginCodeResponse>(TWOFA_ENDPOINTS.RESEND);
}

export function useResendLoginCodeMutation() {
  return useMutation<
    SuccussResendLoginCodeResponse,
    ErrorResendLoginCodeResponse
  >({
    mutationFn: async () => await postResendLoginCode()(),
    mutationKey: ['login-resend-otp'],
  });
}
