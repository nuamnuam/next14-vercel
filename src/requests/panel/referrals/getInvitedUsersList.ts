import { useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IInvitedUser } from '@/types/referral';
import { IPagination } from '@/types/wallet';

import { REFERRAL } from '../../endpoints';

export type SuccessInvitedUsersListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IInvitedUser[];
  pagination: IPagination;
};

export type ErrorInvitedUsersListResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

let dataClone: IInvitedUser[] = [];

export function useInvitedUsersList({
  invite_code,
  page = 1,
  hasInfinitScoll,
}: {
  invite_code?: string;
  page?: number;
  hasInfinitScoll?: boolean;
}) {
  useEffect(() => {
    if (!hasInfinitScoll) return;
    dataClone = [];
  }, [invite_code]);

  function getInvitedUsersList() {
    return Request.get<SuccessInvitedUsersListResponse>(
      REFERRAL.INVITED_USER_LIST,
      {
        params: {
          page,
          per_page: 5,
          ...(invite_code && invite_code !== 'all' && { invite_code }),
        },
      },
    );
  }

  const api = useQuery<
    SuccessInvitedUsersListResponse,
    ErrorInvitedUsersListResponse
  >({
    queryKey: ['invited-users-list', invite_code],
    queryFn: getInvitedUsersList(),
    gcTime: 0,
    placeholderData: keepPreviousData,
  });

  if (api.isSuccess) {
    if (hasInfinitScoll) dataClone.push(...api.data.result);
    else dataClone = api.data.result;
  }

  return { ...api, data: { ...api.data, result: dataClone } };
}
