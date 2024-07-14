import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IIbanFormModel } from '@/types/wallet';

import { WALLET } from '../../endpoints';

export type SuccussAddNewIbanResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { iban: [''] };
};

export type ErrorAddNewIbanResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function postAddNewIban(data: IIbanFormModel) {
  return Request.post<SuccussAddNewIbanResponse>(WALLET.ADD_NEW_IBAN, data);
}

export function useAddNewIbanMutation() {
  return useMutation<
    SuccussAddNewIbanResponse,
    ErrorAddNewIbanResponse,
    IIbanFormModel
  >({
    mutationFn: async (data) => await postAddNewIban(data)(),
    mutationKey: ['add-new-iban'],
  });
}
