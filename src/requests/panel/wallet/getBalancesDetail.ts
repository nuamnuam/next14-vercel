import { Request } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { WALLET } from '../../endpoints';
import { type IBalanceDetail } from '@/types/wallet';

export type SuccessBalancesDetailResponse = {
  result: IBalanceDetail[];
};

export type ErrorBalancesDetailResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getBalancesDetail() {
  return Request.get<SuccessBalancesDetailResponse>(WALLET.GET_BALANCES_DETAIL);
}

export function useBalancesDetail() {
  return useMutation<
    SuccessBalancesDetailResponse,
    ErrorBalancesDetailResponse
  >({
    mutationFn: async () => await getBalancesDetail()(),
    mutationKey: ['get-balances-detail'],
  });
}
