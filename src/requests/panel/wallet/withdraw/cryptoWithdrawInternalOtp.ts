import { useMutation } from '@tanstack/react-query';

import { Request, externalData } from '@/utils';
import { type CryptoWithdrawIntenalOtpResultModel } from '@/types/wallet';
import { useCryptoWithdrawStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { cryptoWithdrawResultModalName } from '@/components/Page/Panel/Wallet/CryptoWithdraw/components/CryptoWithdrawResultModal';
import { otpModalName } from '@/components/Common/OtpModal';

import { useTransactions } from '../getTransactions';
import { WALLET } from '../../../endpoints';

type RequestBody = {
  code: string;
};

export type SuccessCryptoWithdrawIntenalOtpResponse = {
  result: CryptoWithdrawIntenalOtpResultModel;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCryptoWithdrawInternalOtpResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { withdrawLimit?: string };
};

export function cryptoWithdrawInternalOtp({ code }: RequestBody) {
  const { selectedCoin, withdrawValue, mobileNumber } =
    useCryptoWithdrawStore.getState();

  const payload = {
    code,
    currency_id: selectedCoin?.currency_id.toString(),
    mobile_number: mobileNumber,
    amount: withdrawValue,
  };

  return Request.post<SuccessCryptoWithdrawIntenalOtpResponse>(
    WALLET.WITHDRAW_INTERNAL_OTP,
    payload,
  );
}

export function useCryptoWithdrawInternalOtp() {
  const { showSyncModal } = useModal(cryptoWithdrawResultModalName);
  const { closeSyncModal } = useModal(otpModalName);
  const { mutateAsync } = useTransactions();

  return useMutation<
    SuccessCryptoWithdrawIntenalOtpResponse,
    ErrorCryptoWithdrawInternalOtpResponse,
    RequestBody
  >({
    mutationFn: async (data) => await cryptoWithdrawInternalOtp(data)(),
    mutationKey: ['crypto-withdraw-intenal-otp'],
    onSuccess: (res, req) => {
      externalData.set(res.result.transaction_id);
      closeSyncModal();
      showSyncModal();
      mutateAsync({
        type: 'crypto',
        operation: 'withdraw',
        page: 1,
        per_page: 5,
      });
    },
  });
}
