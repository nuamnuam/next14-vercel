import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { ContactUsFormModel } from '@/types/contactUs';

import { CONTACT_US } from '../endpoints';

export type SuccussCheckCodeResponse = {
  code: number;
  message: string;
  result: [];
  success: boolean;
};

export type ErrorCheckCodeResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postContactUsForm(data: ContactUsFormModel) {
  return Request.post<SuccussCheckCodeResponse>(CONTACT_US.POST_FORM, data);
}

export function usePostContactUsForm() {
  return useMutation<
    SuccussCheckCodeResponse,
    ErrorCheckCodeResponse,
    ContactUsFormModel
  >({
    mutationFn: async (data) => await postContactUsForm(data)(),
    mutationKey: ['contact-us-form'],
  });
}
