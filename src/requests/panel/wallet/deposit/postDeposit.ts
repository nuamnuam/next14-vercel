import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type PostDepositModel } from '@/types/wallet';
import { useDepositStore } from '@/store';

import { WALLET } from '../../../endpoints';

type RequestBody = {
  currency_id?: string;
  pb_id?: string;
  amount?: string;
  txid?: string;
};

export type SuccessPostDepositResponse = {
  result: PostDepositModel;
  message: string;
  success: boolean;
};

export type ErrorPostDepositResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { depositLimit?: string };
};

export function postDeposit() {
  const { selectedCoin, selectedNetwork, depositValue, txid } =
    useDepositStore.getState();

  const data: RequestBody = {
    currency_id: selectedCoin?.currency_id,
    pb_id: String(selectedNetwork?.pb_id),
    amount: depositValue,
    txid,
  };

  return Request.post<SuccessPostDepositResponse>(WALLET.POST_DEPOSIT, data);
}

export function usePostDeposit(callBack: () => void) {
  const { setTransactionId, selectedNetwork } = useDepositStore((state) => ({
    setTransactionId: state.setTransactionId,
    selectedNetwork: state.selectedNetwork,
  }));

  return useMutation<SuccessPostDepositResponse, ErrorPostDepositResponse>({
    mutationFn: async () => await postDeposit()(),
    mutationKey: ['post-deposit', selectedNetwork?.pb_id],
    onSuccess: (res, req) => {
      setTransactionId(res.result?.transaction_id);
      callBack();
    },
  });
}
