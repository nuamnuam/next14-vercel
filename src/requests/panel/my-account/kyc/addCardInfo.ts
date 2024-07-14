import { useMutation } from '@tanstack/react-query';

import { type ICardNumber } from '@/types/myAccount';
import { Request } from '@/utils';
import { useProfile } from '@/hooks';

import { KYC } from '../../../endpoints';

export type SuccussAddCardResponse = {
  result: [];
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

export function useAddCardMutation() {
  const { refetch } = useProfile();

  return useMutation<SuccussAddCardResponse, ErrorAddCardResponse, ICardNumber>(
    {
      mutationFn: async (data) => await postAddCard(data)(),
      mutationKey: ['add-card-number'],
      onSuccess: () => {
        refetch();
      },
    },
  );
}
