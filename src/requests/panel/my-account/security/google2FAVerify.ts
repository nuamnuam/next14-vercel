import { useMutation } from '@tanstack/react-query';

import { showToast } from '@/components/ToastProvider';
import { type ICode } from '@/types/myAccount';
import { Request } from '@/utils';

import { SECURITY } from '../../../endpoints';

export type SuccussGoogle2FAVerifyResponse = {
  result: {
    two_step?: {
      status: boolean;
      type: string;
      channel: string;
    };
  };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorGoogle2FAVerifyResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postGoogle2FAVerify(data: ICode) {
  return Request.post<SuccussGoogle2FAVerifyResponse>(
    SECURITY.GOOGLE_2FA_VERIFY,
    data,
  );
}

export function useGoogle2FAVerifyMutation() {
  return useMutation<
    SuccussGoogle2FAVerifyResponse,
    ErrorGoogle2FAVerifyResponse,
    ICode
  >({
    mutationFn: async (data) => await postGoogle2FAVerify(data)(),
    mutationKey: ['google-2fa-verify'],
  });
}
