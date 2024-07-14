import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import useAuthStore from '@/store/authStore';
import { QUERY_KEYS } from '@/constants';

import { CAPTCHA_ENDPOINTS } from '../endpoints';
import { useEffect } from 'react';

// every 5 minutes
export const CAPTCHA_REFRESH_INTERVAL = 60000 * 5;

export type CaptchaResponseResult = {
  sensetive: boolean;
  key: string;
  img: string;
};

export type SuccussCaptchaResponse = {
  code: number;
  success: boolean;
  message: string;
  result: CaptchaResponseResult;
};

export type ErrorCaptchaResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getCaptcha() {
  return Request.get<SuccussCaptchaResponse>(CAPTCHA_ENDPOINTS.DEFAULT);
}

export function useCaptchaQuery() {
  const setCaptcha = useAuthStore((state) => state.setCaptcha);

  const query = useQuery<SuccussCaptchaResponse, ErrorCaptchaResponse>({
    queryKey: QUERY_KEYS.CAPTCHA,
    queryFn: async () => await getCaptcha()(),
    refetchInterval: CAPTCHA_REFRESH_INTERVAL,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query?.data?.result && query.isSuccess) {
      setCaptcha(query.data.result);
    }
  }, [query?.data?.result, query.isSuccess]);

  return query;
}
