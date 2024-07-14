import { useMutation } from '@tanstack/react-query';

import { type ICardNumber } from '@/types/myAccount';
import { Request } from '@/utils';

import { KYC } from '../../../endpoints';

export type SuccussAddCardResponse = {
  result: { iban: { iban: string } };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorAddCardResponse = {
  result: {
    card_number: number;
    message: string;
    result: {
      email: string;
    };
    email?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function postAddCard(data: ICardNumber) {
  return Request.post<SuccussAddCardResponse>(KYC.ADD_CARD_NUMBER, data);
}

export function useAddCardInfoMutation() {
  return useMutation<SuccussAddCardResponse, ErrorAddCardResponse, ICardNumber>(
    {
      mutationFn: async (data) => await postAddCard(data)(),
      mutationKey: ['add-card-number-info'],
    },
  );
}
