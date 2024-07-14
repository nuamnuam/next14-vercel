import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { Request } from '@/utils';
import { type TwoStepModel } from '@/types/auth';
import { authStore } from '@/store';
import { useGetCallbackURL } from '@/hooks';

import { TWOFA_ENDPOINTS } from '../endpoints';

export type SuccussTwoStepResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorTwoStepResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postTwoStep(data: TwoStepModel) {
  return Request.post<SuccussTwoStepResponse>(TWOFA_ENDPOINTS.CHECK, data);
}

export function useTwoStepMutation() {
  const router = useRouter();
  const { setToken } = authStore();

  const callbackURL = useGetCallbackURL();

  return useMutation<
    SuccussTwoStepResponse,
    ErrorTwoStepResponse,
    TwoStepModel
  >({
    mutationFn: async (code) => await postTwoStep(code)(),
    mutationKey: ['login-two-step'],
    onSuccess: () => {
      try {
        const tempToken = sessionStorage.getItem('temp-token') ?? '';
        Cookies.set('token', tempToken);
        setToken(tempToken);
        router.push(callbackURL);
      } catch (exp) {
        console.log({ exp });
      } finally {
        sessionStorage.setItem('temp-token', '');
      }
    },
  });
}
