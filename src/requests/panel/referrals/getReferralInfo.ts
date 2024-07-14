import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IReferralInfo } from '@/types/referral';

import { REFERRAL } from '../../endpoints';

export type SuccessReferralInfoResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IReferralInfo;
};

export type ErrorReferralInfoResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getReferralInfo() {
  return Request.get<SuccessReferralInfoResponse>(REFERRAL.REFERRAL_INFO);
}

export function useReferralInfo() {
  return useQuery<SuccessReferralInfoResponse, ErrorReferralInfoResponse>({
    queryKey: ['referral-info'],
    gcTime: 0,
    queryFn: getReferralInfo(),
  });
}
