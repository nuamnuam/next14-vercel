import { useMutation } from '@tanstack/react-query';

import { type RegisterModel } from '@/types/auth';
import { Request } from '@/utils';

import { REGISTER_ENDPOINTS } from '../endpoints';

export type SuccussRegisterResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorRegisterResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postRegister(data: RegisterModel) {
  return Request.post<SuccussRegisterResponse>(REGISTER_ENDPOINTS.SIGNUP, data);
}

export function useRegisterMutation() {
  return useMutation<
    SuccussRegisterResponse,
    ErrorRegisterResponse,
    RegisterModel
  >({
    mutationFn: async (data) => await postRegister(data)(),
    mutationKey: ['register'],
  });
}
