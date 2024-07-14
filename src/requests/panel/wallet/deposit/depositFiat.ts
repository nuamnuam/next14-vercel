import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { useFiatDepositStore } from '@/store';

import { WALLET } from '../../../endpoints';

type RequestBody = {
  amount?: string;
  card_number_id?: string;
  device: 'webapp';
};

export type SuccessDepositFiatResponse = {
  result: { redirect_url: string };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorDepositFiatResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { amount?: string };
};

export function depositFiat() {
  const { selectedCard, amount } = useFiatDepositStore.getState();

  const data: RequestBody = {
    amount,
    card_number_id: selectedCard?.id.toString(),
    device: 'webapp',
  };

  return Request.post<SuccessDepositFiatResponse>(WALLET.DEPOSIT_FIAT, data);
}

export function useDepositFiat() {
  const { selectedCard } = useFiatDepositStore((state) => ({
    selectedCard: state.selectedCard,
  }));

  return useMutation<SuccessDepositFiatResponse, ErrorDepositFiatResponse>({
    mutationFn: async () => await depositFiat()(),
    mutationKey: ['deposit-fiat'],
    onSuccess: (res) => {
      if (res.result.redirect_url) {
        sessionStorage.setItem('payment-card', selectedCard?.card_number!);
        window.location.href = res.result.redirect_url;
      }
    },
  });
}
