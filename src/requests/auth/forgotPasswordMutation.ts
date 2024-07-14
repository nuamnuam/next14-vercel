import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type ForgotPasswordModel } from '@/types/auth';

import { LOGIN_ENDPOINTS } from '../endpoints';

export type SuccussForgotPasswordResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorForgotPasswordResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postForgotPassword(data: ForgotPasswordModel) {
  if (data?.mobile_number) {
    return Request.post<SuccussForgotPasswordResponse>(
      LOGIN_ENDPOINTS.FORGOT_PASSWORD,
      data,
    );
  }
  return Request.post<SuccussForgotPasswordResponse>(
    LOGIN_ENDPOINTS.FORGOT_PASSWORD_WITH_EMAIL,
    data,
  );
}

export function useForgotPasswordMutation() {
  return useMutation<
    SuccussForgotPasswordResponse,
    ErrorForgotPasswordResponse,
    ForgotPasswordModel
  >({
    mutationFn: async (data) => await postForgotPassword(data)(),
    mutationKey: ['forgot-password'],
  });
}
