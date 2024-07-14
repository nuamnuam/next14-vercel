import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { Request } from '@/utils';
import { type CheckCodeModel } from '@/types/auth';
import { authStore } from '@/store';
import { useGetCallbackURL } from '@/hooks';

import { REGISTER_ENDPOINTS } from '../endpoints';

export type SuccussCheckCodeResponse = {
  message: string;
  result: { token: string };
  success: boolean;
};

export type ErrorCheckCodeResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postCheckCode(data: CheckCodeModel) {
  return Request.post<SuccussCheckCodeResponse>(
    REGISTER_ENDPOINTS.CHECK_CODE,
    data,
  );
}

export function useCheckCodeMutation() {
  const router = useRouter();
  const { setToken } = authStore();

  const callbackURL = useGetCallbackURL();

  return useMutation<
    SuccussCheckCodeResponse,
    ErrorCheckCodeResponse,
    CheckCodeModel
  >({
    mutationFn: async (data) => await postCheckCode(data)(),
    mutationKey: ['register-otp-check'],
    onSuccess: (res) => {
      try {
        if (!res.result.token) return;
        Cookies.set('token', res.result.token);
        setToken(res.result.token);

        router.push(callbackURL);
      } catch (exp) {
        console.log({ exp });
      }
    },
  });
}
