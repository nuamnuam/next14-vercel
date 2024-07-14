import { Request } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { WALLET } from '../../endpoints';
import { type IResponseIban } from '@/types/wallet';

export type SuccussBankIbansResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IResponseIban[];
};

export type ErrorBankIbansResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function useBankIbansQuery() {
  function getBankIbans() {
    return Request.get<SuccussBankIbansResponse>(WALLET.GET_BANK_IBANS);
  }

  return useQuery<SuccussBankIbansResponse, ErrorBankIbansResponse>({
    queryKey: ['get-Bank-Ibans'],
    gcTime: 0,
    queryFn: getBankIbans(),
  });
}
