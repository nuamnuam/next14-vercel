import { useMutation } from '@tanstack/react-query';

import { type IId } from '@/types/myAccount';
import { Request } from '@/utils';

import { WALLET } from '../../endpoints';
import { useBankCardsQuery } from './getBankCards';

export type SuccussDeleteCardResponse = {
  result: [];
  message: string;
  success: boolean;
  code: number;
};

export type ErrorDeleteCardResponse = {
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

export function deleteDeleteCard(data: IId) {
  return Request.delete<SuccussDeleteCardResponse>(
    WALLET.DELETE_BANK_CARD,
    data,
  );
}

export function useDeleteCardMutation() {
  const { refetch: refetchCards } = useBankCardsQuery();

  return useMutation<SuccussDeleteCardResponse, ErrorDeleteCardResponse, IId>({
    mutationFn: async (data) => await deleteDeleteCard(data)(),
    mutationKey: ['delete-card-number'],
    onSuccess: () => {
      refetchCards();
    },
  });
}
