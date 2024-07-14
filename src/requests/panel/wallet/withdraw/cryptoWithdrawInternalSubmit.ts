import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type CryptoWithdrawIntenalSubmitResultModel } from '@/types/wallet';
import { useCryptoWithdrawStore } from '@/store';

import { WALLET } from '../../../endpoints';

export type SuccessCryptoWithdrawIntenalSubmitResponse = {
  result: CryptoWithdrawIntenalSubmitResultModel;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCryptoWithdrawInternalSubmitResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { withdrawLimit?: string };
};

export function cryptoWithdrawInternalSubmit() {
  const { selectedCoin, withdrawValue, mobileNumber } =
    useCryptoWithdrawStore.getState();

  const data = {
    currency_id: selectedCoin?.currency_id.toString(),
    mobile_number: mobileNumber?.toString(),
    amount: withdrawValue,
  };

  return Request.post<SuccessCryptoWithdrawIntenalSubmitResponse>(
    WALLET.WITHDRAW_INTERNAL_SUBMIT,
    data,
  );
}

export function useCryptoWithdrawInternalSubmit(callBack?: () => void) {
  return useMutation<
    SuccessCryptoWithdrawIntenalSubmitResponse,
    ErrorCryptoWithdrawInternalSubmitResponse
  >({
    mutationFn: async () => await cryptoWithdrawInternalSubmit()(),
    mutationKey: ['crypto-withdraw-intenal-submit'],
    onSuccess: () => {
      callBack?.();
    },
  });
}
