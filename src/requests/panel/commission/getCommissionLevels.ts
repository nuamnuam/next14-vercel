import { Request } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { COMMISSION } from '../../endpoints';
import { ICommissionLevel } from '@/types/commission';

export type SuccessCommissionLevelsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: ICommissionLevel[];
};

export type ErrorCommissionLevelsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: string | {};
};

export function getCommissionLevels() {
  return Request.get<SuccessCommissionLevelsResponse>(
    COMMISSION.COMMISSION_LEVELS,
  );
}

export function useCommissionLevels() {
  return useQuery<
    SuccessCommissionLevelsResponse,
    ErrorCommissionLevelsResponse
  >({
    queryKey: ['commission-levels'],
    queryFn: getCommissionLevels(),
  });
}
