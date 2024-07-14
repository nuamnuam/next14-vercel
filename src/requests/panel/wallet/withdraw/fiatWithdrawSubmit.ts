import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type CryptoWithdrawSubmitResultModel } from '@/types/wallet';

import { WALLET } from '../../../endpoints';

export type SuccessCryptoWithdrawFiatSubmitResponse = {
  result: CryptoWithdrawSubmitResultModel;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCryptoWithdrawFiatSubmitResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { withdrawLimit?: string };
};

export function cryptoWithdrawFiatSubmit() {
  const data = {
    amount: '1000',
    iban_id: '1',
  };

  return Request.post<SuccessCryptoWithdrawFiatSubmitResponse>(
    WALLET.WITHDRAW_SUBMIT,
    data,
  );
}

export function useCryptoWithdrawSubmit(callBack?: () => void) {
  return useMutation<
    SuccessCryptoWithdrawFiatSubmitResponse,
    ErrorCryptoWithdrawFiatSubmitResponse
  >({
    mutationFn: async () => await cryptoWithdrawFiatSubmit()(),
    mutationKey: ['crypto-withdraw-submit'],
    onSuccess: () => {
      callBack?.();
    },
  });
}
