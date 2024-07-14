import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type CryptoWithdrawSubmitResultModel } from '@/types/wallet';
import { useCryptoWithdrawStore } from '@/store';

import { WALLET } from '../../../endpoints';

export type SuccessCryptoWithdrawSubmitResponse = {
  result: CryptoWithdrawSubmitResultModel;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCryptoWithdrawSubmitResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { withdrawLimit?: string };
};

export function cryptoWithdrawSubmit() {
  const { selectedCoin, selectedNetwork, withdrawValue, tag, address } =
    useCryptoWithdrawStore.getState();

  const data = {
    currency_id: selectedCoin?.currency_id.toString(),
    pb_id: selectedNetwork?.pb_id.toString(),
    amount: withdrawValue,
    address,
    tag,
  };

  return Request.post<SuccessCryptoWithdrawSubmitResponse>(
    WALLET.WITHDRAW_SUBMIT,
    data,
  );
}

export function useCryptoWithdrawSubmit(callBack?: () => void) {
  return useMutation<
    SuccessCryptoWithdrawSubmitResponse,
    ErrorCryptoWithdrawSubmitResponse
  >({
    mutationFn: async () => await cryptoWithdrawSubmit()(),
    mutationKey: ['crypto-withdraw-submit'],
    onSuccess: () => {
      callBack?.();
    },
  });
}
