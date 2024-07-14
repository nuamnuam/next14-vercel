import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';
import { Request } from '@/utils';

import { SETTINGS } from '../endpoints';

export type TBank = {
  name: string;
  identifier: string;
  iban_identifier: string;
  swift_code: string;
  website: string;
  fa_name: string;
  logo: {
    colored: string;
    mono: string;
  };
  quick_withdrawal: number;
  card_codes: string[];
};

type TSuccessResult = {
  code: number;
  success: boolean;
  message: string;
  result: TBank[];
};

type TFailedResult = {
  code: number;
  success: boolean;
  message: string;
};

export async function fetchBanks() {
  try {
    const request = Request.get<TSuccessResult>(SETTINGS.BANKS);
    const data = await request();
    return data;
  } catch (error) {
    return {
      code: 999,
      success: false,
      message: 'Error',
      result: [],
    };
  }
}

export function useBanksQuery() {
  return useQuery<TSuccessResult, TFailedResult>({
    queryKey: [QUERY_KEYS.BANKS],
    queryFn: async () => await fetchBanks(),
    gcTime: 3000,
    refetchOnReconnect: true,
  });
}
