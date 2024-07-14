import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { authStore } from '@/store';
import QUERY_KEYS from '@/constants/query-keys';
import { IPagination } from '@/types/wallet';

import { MESSAGES } from '../../endpoints';

export type MessageType = 'notification' | 'announcement';

export type Message = {
  date: string;
  message: string;
  title: string | null;
  type: MessageType;
  url?: string;
  is_pin?: boolean;
};

export type SuccessResponse = {
  code: number;
  message: string;
  result: { notifications: Message[]; unread_notifications_count: number };
  success: boolean;
  pagination: IPagination;
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

export const fetchMessages = async (
  pageParam: number = 1,
  type: MessageType = 'notification',
): Promise<SuccessResponse> => {
  try {
    const params = {
      page: pageParam,
      per_page: 10,
      type,
    };
    const request = Request.get(MESSAGES.ALL, {
      params,
    });
    const result = await request();

    return (result as SuccessResponse) || [];
  } catch (error) {
    return {
      code: 0,
      success: false,
      message: 'Error fetching messages',
      result: {
        notifications: [],
        unread_notifications_count: 0,
      },
      pagination: {
        total: 0,
        count: 0,
        per_page: 0,
        current_page: 0,
        total_pages: 0,
        links: {
          next: '',
        },
      },
    };
  }
};

export const useMessagesQuery = (
  page: number = 1,
  type: MessageType = 'notification',
) => {
  const { token } = authStore();
  return useQuery<SuccessResponse, ErrorResponse>({
    queryKey: QUERY_KEYS.GET_MESSAGES(page, type),
    queryFn: async () => await fetchMessages(page, type),
    refetchOnReconnect: true,
    enabled: !!token,
  });
};

export const useInfiniteMessagesQuery = (
  type: MessageType = 'notification',
) => {
  const { token } = authStore();
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: QUERY_KEYS.GET_MESSAGES(undefined, type),
    queryFn: async ({ pageParam }) => await fetchMessages(pageParam, type),
    refetchOnReconnect: true,
    enabled: !!token,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      if (
        lastPage?.pagination.current_page < lastPage?.pagination.total_pages
      ) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });
};
