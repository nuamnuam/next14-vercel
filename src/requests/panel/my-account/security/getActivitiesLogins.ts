import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IActivity } from '@/types/myAccount';
import { QUERY_KEYS } from '@/constants';

import { SECURITY } from '../../../endpoints';

export type SuccussGetActivitiesLoginsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IActivity[];
  meta: {
    active_count: number;
  };
  pagination: {
    count: number;
    current_page: number;
    links: {};
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type ErrorGetActivitiesLoginsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getGetActivitiesLogins(page: number = 1) {
  return Request.get<SuccussGetActivitiesLoginsResponse>(
    SECURITY.GET_ACTIVITIES_LOGINS,
    {
      params: { page },
    },
  );
}

export function useActivityLoginsQuery(page: number = 1) {
  return useQuery<
    SuccussGetActivitiesLoginsResponse,
    ErrorGetActivitiesLoginsResponse
  >({
    queryFn: async () => await getGetActivitiesLogins(page)(),
    queryKey: QUERY_KEYS.ACTIVE_DEVICES(page),
    gcTime: 3000,
    refetchOnReconnect: true,
  });
}
