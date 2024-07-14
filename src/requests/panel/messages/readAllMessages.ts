import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { MESSAGES } from '@/requests/endpoints';

export type SuccussCheckCodeResponse = {
  message: string;
  result: any;
  success: boolean;
};

export type ErrorCheckCodeResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postReadAllMessages() {
  return Request.post<SuccussCheckCodeResponse>(MESSAGES.READ_ALL);
}

export function useReadAllMessagesMutation() {
  return useMutation<SuccussCheckCodeResponse, ErrorCheckCodeResponse>({
    mutationFn: async () => await postReadAllMessages()(),
    mutationKey: ['post-read-all-messages'],
  });
}
