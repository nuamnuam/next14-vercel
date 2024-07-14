import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';
import { Request } from '@/utils';
import { LangFileNames } from '@/language/langTypes';

type ErrorResult = {
  code: number;
  success: boolean;
  message: string;
};

export async function fetchLanguage(
  scope: string,
  baseURL: string,
  locale: string,
) {
  try {
    const request = Request.get<any>(`/${locale}/${scope}.json`, { baseURL });
    const data = await request();
    return data;
  } catch (error) {
    return {
      code: 999,
      success: false,
      message: 'Error',
    };
  }
}

export function useLangQuery(
  scope: LangFileNames[],
  baseURL: string,
  locale: string = 'fa',
) {
  const mappedQueries = scope.map((item) => {
    return useQuery<Record<string, string>, ErrorResult>({
      queryKey: QUERY_KEYS.TRANSLATION(item, locale),
      queryFn: async () => await fetchLanguage(item, baseURL, locale),
      gcTime: 3000,
      refetchOnReconnect: true,
      enabled: !!scope && !!baseURL,
    });
  });
  return mappedQueries;
}
