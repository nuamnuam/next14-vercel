import { useMutation } from '@tanstack/react-query';

import QUERY_KEYS from '@/constants/query-keys';
import { showToast } from '@/components/ToastProvider';
import { Request } from '@/utils';

import { TICKET } from '../endpoints';

interface SendReviewBodyTypes {
  ticket_id: number;
  score: number;
  review: string;
}

export type SuccessSendReview = {
  code: number;
  success: boolean;
  message: string;
  result: { score: number; review: string; created_at: string };
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

export function sendReview(data: SendReviewBodyTypes) {
  return Request.post<SuccessSendReview>(TICKET.SEND_REVIEW, data);
}

export function useSendReview() {
  return useMutation<SuccessSendReview, ErrorResponse, SendReviewBodyTypes>({
    mutationFn: async (data) => await sendReview(data)(),
    mutationKey: QUERY_KEYS.SEND_REVIEW,
    onSuccess: (res) => {
      showToast.success(res.message);
    },
  });
}
