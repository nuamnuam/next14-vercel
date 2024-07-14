import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { PROFILE } from '../endpoints';

export type TArgs = {
  id: string;
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

export function deleteId(args: TArgs) {
  return Request.delete<SuccessResponse>(
    PROFILE.DELETE_FIREBASE_TOKEN(args.id),
  );
}

export function useDeleteFirebaseId() {
  return useMutation<SuccessResponse, ErrorResponse, TArgs>({
    mutationFn: async (data) => await deleteId(data)(),
  });
}
