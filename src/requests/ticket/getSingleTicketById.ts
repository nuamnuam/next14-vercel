import { useQuery } from '@tanstack/react-query';

import { OperationType, TicketStatusTypes } from '@/types/tickets';
import { Request } from '@/utils';
import QUERY_KEYS from '@/constants/query-keys';

import { TICKET } from '../endpoints';

export interface SingleTicketTypes {
  id: number;
  created_at: string;
  updated_at: string;
  department_id: number;
  subject_id: number;
  operation: OperationType | string;
  transaction_id: null | string;
  status: TicketStatusTypes;
  date_string: string;
  items: [
    {
      id: number;
      creator: string;
      created_by: 'user' | 'admin' | 'system';
      description: string;
      attachment: null | string;
      created_at: string;
      date_string: string;
    },
  ];
  review: {
    description: string;
    score: number;
    created_at: string;
  };
}

export interface SingleTicketsResponse {
  code: number;
  success: boolean;
  message: string;
  result: SingleTicketTypes;
}

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

const getSingleTicketById = (ticketId: number) => {
  const response = Request.get<SingleTicketsResponse>(
    `${TICKET.ALL_TICKET}${ticketId}`,
  );
  return response;
};

export function useGetSingleTicketDataQuery(
  ticketId: number,
  enabled: boolean,
) {
  return useQuery<SingleTicketsResponse, ErrorResponse>({
    queryKey: QUERY_KEYS.GET_SINGLE_TICKET,
    queryFn: getSingleTicketById(ticketId),
    gcTime: 0,
    enabled,
  });
}
