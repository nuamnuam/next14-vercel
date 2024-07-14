import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IResponseCard } from '@/types/wallet';

import { WALLET } from '../../endpoints';

export type SuccussBankCardsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IResponseCard[];
};

export type ErrorBankCardsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function useBankCardsQuery() {
  function getBankCards() {
    return Request.get<SuccussBankCardsResponse>(WALLET.GET_BANK_CARDS);
  }

  return useQuery<SuccussBankCardsResponse, ErrorBankCardsResponse>({
    queryKey: ['get-Bank-Cards'],
    gcTime: 0,
    queryFn: getBankCards(),
  });
}
