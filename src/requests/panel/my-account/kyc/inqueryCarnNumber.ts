import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import { KYC } from '../../../endpoints';

export type SuccussInqueryCardNumberResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { iban: [''] };
};

export type ErrorInqueryCardNumberResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getInqueryCardNumber(data: string) {
  return Request.get<SuccussInqueryCardNumberResponse>(KYC.INQUERY_BANK_CARD, {
    params: { card_number: data },
  });
}

export function useInqueryCardNumberMutation() {
  return useMutation<
    SuccussInqueryCardNumberResponse,
    ErrorInqueryCardNumberResponse,
    string
  >({
    mutationFn: async (data) => await getInqueryCardNumber(data)(),
    mutationKey: ['inquery-card-number'],
  });
}
