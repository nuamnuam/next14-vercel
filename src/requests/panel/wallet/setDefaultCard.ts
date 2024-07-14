import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

export type SuccussSetDefaultCardResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { iban: [''] };
};

export type ErrorSetDefaultCardResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function postSetDefaultCard(cardId: number) {
  return Request.post<SuccussSetDefaultCardResponse>(
    `/v1/account/card-numbers/${cardId}/set-default`,
  );
}

export function useSetDefaultCardMutation() {
  return useMutation<
    SuccussSetDefaultCardResponse,
    ErrorSetDefaultCardResponse,
    number
  >({
    mutationFn: async (data) => await postSetDefaultCard(data)(),
    mutationKey: ['set-default-card'],
  });
}
