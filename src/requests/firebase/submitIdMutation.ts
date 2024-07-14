import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { PROFILE } from '../endpoints';

export type TArgs = {
  firebase_id: string;
  device_name: string;
};

export type SuccessResponse = {
  message: string;
  success: boolean;
  code: number;
};

export type ErrorResponse = {
  message: string;
  success: boolean;
  code: number;
};

export function postId(args: TArgs) {
  return Request.post<SuccessResponse>(PROFILE.POST_FIREBASE_TOKEN, args);
}

export function useSubmitFirebaseId() {
  return useMutation<SuccessResponse, ErrorResponse, TArgs>({
    mutationFn: async (data) => await postId(data)(),
  });
}
