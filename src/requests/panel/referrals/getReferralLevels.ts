import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { IReferralLevel } from '@/types/referral';

import { REFERRAL } from '../../endpoints';

export type SuccessReferralLevelsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IReferralLevel[];
};

export type ErrorReferralLevelsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getReferralLevels() {
  return Request.get<SuccessReferralLevelsResponse>(REFERRAL.LEVELS_LIST);
}

export function useReferralLevels() {
  return useQuery<SuccessReferralLevelsResponse, ErrorReferralLevelsResponse>({
    queryKey: ['referral-levels'],
    queryFn: getReferralLevels(),
  });
}
