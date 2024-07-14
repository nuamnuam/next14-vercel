import { Request } from '@/utils';
import { useMutation } from '@tanstack/react-query';

export type SuccussSetDefaultIbanResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { iban: [''] };
};

export type ErrorSetDefaultIbanResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function postSetDefaultIban(ibanId: number) {
  return Request.post<SuccussSetDefaultIbanResponse>(
    `/v1/account/ibans/${ibanId}/set-default`,
  );
}

export function useSetDefaultIbanMutation() {
  return useMutation<
    SuccussSetDefaultIbanResponse,
    ErrorSetDefaultIbanResponse,
    number
  >({
    mutationFn: async (data) => await postSetDefaultIban(data)(),
    mutationKey: ['set-default-iban'],
  });
}
