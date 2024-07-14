import { useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { TicketResultTypes } from '@/types/tickets';
import { Request } from '@/utils';
import { IPagination } from '@/types/wallet';
import QUERY_KEYS from '@/constants/query-keys';

import { TICKET } from '../endpoints';
interface SuccessResponse {
  code: number;
  success: boolean;
  message: string;
  result: TicketResultTypes[];
  pagination: IPagination;
}

export type ErrorResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {};
};

let dataClone: TicketResultTypes[] = [];

export interface TicketsParams {
  page?: number;
  status?: number | string;
}

export function useTicketsQuery({
  status,
  page = 1,
  hasInfinitScoll,
}: {
  status: number | string;
  page: number;
  hasInfinitScoll: boolean;
}) {
  useEffect(() => {
    if (!hasInfinitScoll) return;
    dataClone = [];
  }, [status]);

  function fetchTickets() {
    const params = {
      page,
      per_page: 10,
      ...(status !== 'all' && { status: Number(status) }),
    };
    return Request.get<SuccessResponse>(TICKET.ALL_TICKET, {
      params,
    });
  }

  const api = useQuery<SuccessResponse, ErrorResponse>({
    queryKey: QUERY_KEYS.GET_TICKETS(status, page),
    queryFn: fetchTickets(),
    placeholderData: keepPreviousData,
    gcTime: 0,
  });

  if (api.isSuccess) {
    if (hasInfinitScoll) dataClone.push(...api.data.result);
    else dataClone = api.data.result;
  }

  return { ...api, data: { ...api.data, result: dataClone } };
}
