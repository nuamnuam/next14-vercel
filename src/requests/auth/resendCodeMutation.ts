import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type ResendCodeModel } from '@/types/auth';

import { REGISTER_ENDPOINTS } from '../endpoints';

export type SuccussResendCodeResponse = {
  message: string;
  result: { token: string };
  success: boolean;
};

export type ErrorResendCodeResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postResendCode(data: ResendCodeModel) {
  return Request.post<SuccussResendCodeResponse>(
    REGISTER_ENDPOINTS.RESEND_CODE,
    data,
  );
}

export function useResendCodeMutation() {
  return useMutation<
    SuccussResendCodeResponse,
    ErrorResendCodeResponse,
    ResendCodeModel
  >({
    mutationFn: async (data) => await postResendCode(data)(),
  });
}
