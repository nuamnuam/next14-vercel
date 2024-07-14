import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IFiatIdDepositInfoResult } from '@/types/wallet';

import { WALLET } from '../../../endpoints';

export type SuccessGetFiatIdDepositInfoResponse = {
  result: IFiatIdDepositInfoResult;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorGetFiatIdDepositInfoResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function getFiatIdDepositInfo() {
  return Request.get<SuccessGetFiatIdDepositInfoResponse>(
    WALLET.GET_FIAT_ID_DEPOSIT_INFO,
  );
}

export function useFiatIdDepositInfo(enabled: boolean = false) {
  return useQuery<
    SuccessGetFiatIdDepositInfoResponse,
    ErrorGetFiatIdDepositInfoResponse
  >({
    queryKey: ['fiat-id-deposit-info'],
    queryFn: getFiatIdDepositInfo(),
    enabled,
  });
}
