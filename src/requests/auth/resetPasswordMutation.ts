import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type ResetPasswordModel } from '@/types/auth';

import { LOGIN_ENDPOINTS } from '../endpoints';
import { useRouter } from 'next/router';

export type SuccussResetPasswordResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorResetPasswordResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postResetPassword(data: ResetPasswordModel) {
  return Request.post<SuccussResetPasswordResponse>(
    LOGIN_ENDPOINTS.RESET_PASSWORD,
    data,
  );
}

export function useResetPasswordMutation() {
  const router = useRouter();
  return useMutation<
    SuccussResetPasswordResponse,
    ErrorResetPasswordResponse,
    ResetPasswordModel
  >({
    mutationFn: async (data) => await postResetPassword(data)(),
    mutationKey: ['reset-password'],
    onSuccess: (res) => {
      try {
        router.replace({
          pathname: '/auth/login',
          query: { ...router.query },
        });
      } catch (exp) {
        console.log({ exp });
      }
    },
  });
}
