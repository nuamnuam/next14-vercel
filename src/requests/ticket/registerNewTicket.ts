import { useMutation } from '@tanstack/react-query';

import { showToast } from '@/components/ToastProvider';
import QUERY_KEYS from '@/constants/query-keys';
import { formUploader } from '@/utils';

import { TICKET } from '../endpoints';

export type SuccussRegisterNewTicketResponse = {
  result: { ticket_id: string };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export type NewTicketFormDataTypes = {
  ticket_department_subject_id: number;
  description: string;
  attachment?: any;
  operation?: string;
  transaction_id?: number;
};

export async function postNewTicket(data: FormData) {
  const response = await formUploader(data, TICKET.ALL_TICKET);
  if (response.error) {
    return await Promise.reject(response.error);
  } else {
    return response.data;
  }
}

export function useRegisterNewTicket() {
  return useMutation<SuccussRegisterNewTicketResponse, ErrorResponse, FormData>(
    {
      mutationFn: async (data) => await postNewTicket(data),
      mutationKey: QUERY_KEYS.REGISTER_NEW_TICKET,
      onSuccess: (res) => {
        showToast.success(res.message);
      },
    },
  );
}

export async function answerToTicket(data: FormData) {
  const response = await formUploader(data, TICKET.ANSWER_TICKET);
  if (response.error) {
    return await Promise.reject(response.error);
  } else {
    return response.data;
  }
}
export function useAnswerToTicket() {
  return useMutation<SuccussRegisterNewTicketResponse, ErrorResponse, FormData>(
    {
      mutationFn: async (data) => await answerToTicket(data),
      mutationKey: QUERY_KEYS.ANSWER_TICKET,
      onSuccess: (res) => {
        showToast.success(res.message);
      },
    },
  );
}
