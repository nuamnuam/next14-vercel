import { useMutation } from '@tanstack/react-query';

import { type IIbanId } from '@/types/myAccount';
import { Request } from '@/utils';

import { WALLET } from '../../endpoints';
import { useBankIbansQuery } from './getBankIbans';

export type SuccussDeleteIbanResponse = {
  result: [];
  message: string;
  success: boolean;
  code: number;
};

export type ErrorDeleteIbanResponse = {
  result: {
    iban: number;
    message: string;
    result: {
      email: string;
    };
    email?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function deleteDeleteIban(data: IIbanId) {
  return Request.delete<SuccussDeleteIbanResponse>(WALLET.DELETE_IBAN, data);
}

export function useDeleteIbanMutation() {
  const { refetch: refetchIbans } = useBankIbansQuery();

  return useMutation<
    SuccussDeleteIbanResponse,
    ErrorDeleteIbanResponse,
    IIbanId
  >({
    mutationFn: async (data) => await deleteDeleteIban(data)(),
    mutationKey: ['delete-Iban-number'],
    onSuccess: () => {
      refetchIbans();
    },
  });
}
