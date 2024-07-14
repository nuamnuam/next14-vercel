import { useQuery } from '@tanstack/react-query';

import QUERY_KEYS from '@/constants/query-keys';
import { Request } from '@/utils';

import { TICKET } from '../endpoints';

export type SuccussGetReviewResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { review: string; score: number; create_at: string };
};

export type ErrorGetReviewResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

export function getTicketReview(id: string) {
  return Request.get<SuccussGetReviewResponse>(TICKET.GET_REVIEW(id));
}

export function useGetReviewQuery(id: string) {
  return useQuery<SuccussGetReviewResponse, ErrorGetReviewResponse>({
    queryKey: QUERY_KEYS.GET_REVIEW,
    queryFn: getTicketReview(id),
  });
}
