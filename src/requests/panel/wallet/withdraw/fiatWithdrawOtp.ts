import { useMutation } from '@tanstack/react-query';

import { Request, toEnglishDigits } from '@/utils';
import { useModal } from '@/hooks/useModal';
import { otpModalName } from '@/components/Common/OtpModal';
import useFiatWithdrawStore from '@/store/useFiatWithdrawStore';
import { tomanWithdrawResultModalName } from '@/components/Page/Panel/Wallet/TomanWithdraw/components/TomanWithdrawResultModal';

import { WALLET } from '../../../endpoints';

type RequestBody = {
  code: string;
};

export type SuccessFiatWithdrawOtpResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorFiatWithdrawOtpResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { withdrawLimit?: string };
};

export function fiatWithdrawOtp({ code }: RequestBody) {
  const { withdrawValue, selectedIban } = useFiatWithdrawStore.getState();

  const payload = {
    code: toEnglishDigits(code),
    iban_id: selectedIban?.id.toString(),
    amount: withdrawValue,
  };

  return Request.post<SuccessFiatWithdrawOtpResponse>(
    WALLET.WITHDRAW_FIAT_OTP,
    payload,
  );
}

export function useFiatWithdrawOtp() {
  const { setTransactionId } = useFiatWithdrawStore();

  const { showSyncModal: showResultModal } = useModal(
    tomanWithdrawResultModalName,
  );
  const { closeSyncModal: closeOtpModal } = useModal(otpModalName);

  return useMutation<
    SuccessFiatWithdrawOtpResponse,
    ErrorFiatWithdrawOtpResponse,
    RequestBody
  >({
    mutationFn: async (data) => await fiatWithdrawOtp(data)(),
    mutationKey: ['fiat-withdraw-otp'],
    onSuccess: (res) => {
      setTransactionId(res.result?.transaction_id);
      showResultModal();
      closeOtpModal();
    },
  });
}
