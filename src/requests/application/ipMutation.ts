import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { PROFILE } from '../endpoints';

type TArgs = {
  ip: string;
};

export type SuccessResponse = {
  message: string;
  success: boolean;
};

export type ErrorResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postIP(data: TArgs) {
  return Request.post<SuccessResponse>(PROFILE.POST_IP, data);
}

export function useSubmitIPMutation() {
  return useMutation<SuccessResponse, ErrorResponse, TArgs>({
    mutationFn: async (data) => await postIP(data)(),
  });
}
