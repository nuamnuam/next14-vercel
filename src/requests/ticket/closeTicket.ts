import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import QUERY_KEYS from '@/constants/query-keys';
import { showToast } from '@/components/ToastProvider';

import { TICKET } from '../endpoints';

export type SuccussCloseTicketResponse = {
  result: [];
  message: string;
  success: boolean;
  code: number;
};

export type ErrorResponse = {
  response: {
    data: {
      code: number;
      success: boolean;
      message: string;
      result: any;
    };
  };
};

export function patchCloseTicket(ticketId: string) {
  return Request.patch(`${TICKET.ALL_TICKET}${ticketId}/status/close`);
}

export function useCloseTicket(ticketId: string) {
  return useMutation<SuccussCloseTicketResponse, ErrorResponse, string>({
    //@ts-ignore
    mutationFn: patchCloseTicket(ticketId),
    mutationKey: QUERY_KEYS?.CLOSE_TICKET,
    onSuccess: (res) => {
      showToast.success(res.message);
      return res;
    },
  });
}
