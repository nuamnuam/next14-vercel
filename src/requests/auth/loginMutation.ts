import { useMutation } from '@tanstack/react-query';

import { type LoginModel } from '@/types/auth';
import { Request } from '@/utils';
import { LOGIN_ENDPOINTS } from '../endpoints';

export type ITwo_STEP = {
  status: boolean;
  type: 'sms' | 'email' | 'google2fa';
  channel: string;
};

export type IResult = {
  token: string;
  stream_key: string;
  two_step: ITwo_STEP;
};

export type SuccussLoginResponse = {
  result: IResult;
  message: string;
  success: boolean;
};

export type ErrorLoginResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postLogin(data: LoginModel) {
  if (data?.mobile_number)
    return Request.post<SuccussLoginResponse>(
      LOGIN_ENDPOINTS.LOGIN_WITH_PASSWORD,
      data,
    );
  return Request.post<SuccussLoginResponse>(
    LOGIN_ENDPOINTS.LOGIN_WITH_EMAIL,
    data,
  );
}

export function useLoginMutation() {
  return useMutation<SuccussLoginResponse, ErrorLoginResponse, LoginModel>({
    mutationFn: async (data) => await postLogin(data)(),
    mutationKey: ['login'],
    onSuccess: (res) => {
      if (!res.result.token) return;
      try {
        sessionStorage.setItem('temp-token', res.result.token);
        Request.setToken(res.result.token);
      } catch (exp) {
        console.log({ exp });
      }
    },
  });
}
