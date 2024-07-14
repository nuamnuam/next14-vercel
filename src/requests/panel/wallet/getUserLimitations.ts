import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IUserLimitations } from '@/types/wallet';
import { useProfile } from '@/hooks';

import { WALLET } from '../../endpoints';

export type SuccussUserLimitationsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IUserLimitations;
};

export type ErrorUserLimitationsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getUserLimitations() {
  return Request.get<SuccussUserLimitationsResponse>(
    WALLET.GET_USER_LIMITATIONS,
  );
}

export function useUserLimitations() {
  const { data: userInfo } = useProfile();

  const api = useQuery<
    SuccussUserLimitationsResponse,
    ErrorUserLimitationsResponse
  >({
    queryKey: ['get-user-limitations', userInfo?.email, userInfo?.kyc_info],
    queryFn: getUserLimitations(),
  });

  return {
    ...api,
    fiatLimitations: api.data?.result?.messages?.limitations?.fiat,
    cryptoLimitations: api.data?.result?.messages?.limitations?.crypto,
  };
}
