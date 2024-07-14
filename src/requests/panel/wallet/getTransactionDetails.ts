import { useMutation } from '@tanstack/react-query';

import { ITransactionDetails } from '@/types/wallet';
import { Request } from '@/utils';

import { WALLET } from '../../endpoints';

export type SuccessTransactionDetailsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: ITransactionDetails;
};

export type ErrorTransactionDetailsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export type TransactionId = string;

export function getTransactionDetails(id: string) {
  return Request.get<SuccessTransactionDetailsResponse>(
    WALLET.GET_TRASANCTION_DETAIL(id),
  );
}

export function useTransactionDetails() {
  const api = useMutation<
    SuccessTransactionDetailsResponse,
    ErrorTransactionDetailsResponse,
    string
  >({
    mutationFn: async (id) => await getTransactionDetails(id)(),
    mutationKey: ['wallet-transactions'],
  });

  return { ...api, data: api.data?.result };
}
