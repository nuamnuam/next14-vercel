import { useMutation } from '@tanstack/react-query';

import { type IChangePasswordModel } from '@/types/myAccount';
import { Request } from '@/utils';

import { SECURITY } from '../../../endpoints';

export type SuccussChangePasswordResponse = {
  result: {
    two_step: {
      status: boolean;
      type: string;
      channel: string;
    };
  };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorChangePasswordResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postChangePassword(data: IChangePasswordModel) {
  return Request.post<SuccussChangePasswordResponse>(
    SECURITY.CHANGE_PASSWORD,
    data,
  );
}

export function useChangePasswordMutation() {
  return useMutation<
    SuccussChangePasswordResponse,
    ErrorChangePasswordResponse,
    IChangePasswordModel
  >({
    mutationFn: async (data) => await postChangePassword(data)(),
    mutationKey: ['edit-profile'],
  });
}
