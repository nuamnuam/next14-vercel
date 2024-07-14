import { useMutation } from '@tanstack/react-query';

import {
  IPaginationBaseModel,
  type ITransactionsResponse,
} from '@/types/wallet';
import { Request } from '@/utils';
import { useTransactionHistoryStore } from '@/store';

import { WALLET } from '../../endpoints';

export type SuccessTransactionsResponse = ITransactionsResponse;

export type ErrorTransactionsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export interface TransactionsParams extends IPaginationBaseModel {
  type: 'fiat' | 'crypto';
  operation?: 'deposit' | 'withdraw';
  from_date?: string;
  txid?: string;
  to_date?: string;
  currency_id?: number;
  status?: '0' | '1';
}

export function getTransactions(params: TransactionsParams) {
  return Request.get<SuccessTransactionsResponse>(WALLET.GET_TRASANCTIONS, {
    params: {
      ...params,
      page: params.page || 1,
      per_page: 10,
    },
  });
}

export function useTransactions() {
  const { set_transactions } = useTransactionHistoryStore();

  return useMutation<
    SuccessTransactionsResponse,
    ErrorTransactionsResponse,
    TransactionsParams
  >({
    mutationFn: async (data) => await getTransactions(data)(),
    mutationKey: ['wallet-transactions'],
    onSuccess: (res) => {
      set_transactions(res);
    },
  });
}
