import { useMutation } from '@tanstack/react-query';

import { Request, externalData } from '@/utils';
import { type CryptoWithdrawOtpResultModel } from '@/types/wallet';
import { useCryptoWithdrawStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { cryptoWithdrawResultModalName } from '@/components/Page/Panel/Wallet/CryptoWithdraw/components/CryptoWithdrawResultModal';
import { otpModalName } from '@/components/Common/OtpModal';

import { useTransactions } from '../getTransactions';
import { WALLET } from '../../../endpoints';

type RequestBody = {
  code: string;
};

export type SuccessCryptoWithdrawOtpResponse = {
  result: CryptoWithdrawOtpResultModel;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorCryptoWithdrawOtpResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { withdrawLimit?: string };
};

export function cryptoWithdrawOtp({ code }: RequestBody) {
  const { selectedCoin, selectedNetwork, withdrawValue, tag, address } =
    useCryptoWithdrawStore.getState();

  const payload = {
    code,
    currency_id: selectedCoin?.currency_id.toString(),
    pb_id: selectedNetwork?.pb_id.toString(),
    amount: withdrawValue,
    address,
    tag,
  };

  return Request.post<SuccessCryptoWithdrawOtpResponse>(
    WALLET.WITHDRAW_OTP,
    payload,
  );
}

export function useCryptoWithdrawOtp() {
  const { showSyncModal } = useModal(cryptoWithdrawResultModalName);
  const { closeSyncModal } = useModal(otpModalName);
  const { mutateAsync } = useTransactions();

  return useMutation<
    SuccessCryptoWithdrawOtpResponse,
    ErrorCryptoWithdrawOtpResponse,
    RequestBody
  >({
    mutationFn: async (data) => await cryptoWithdrawOtp(data)(),
    mutationKey: ['crypto-withdraw-otp'],
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
