import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { Request } from '@/utils';
import { authStore } from '@/store';
import { queryClient } from '@/requests';

import { LOGIN_ENDPOINTS } from '../endpoints';

export type SuccussLogoutResponse = {
  message: string;
  success: boolean;
};

export type ErrorLogoutResponse = {
  message: string;
  success: boolean;
  code: number;
};

export function postLogout() {
  return Request.post<SuccussLogoutResponse>(LOGIN_ENDPOINTS.LOGOUT);
}

export function useLogoutMutation() {
  const { setToken } = authStore();

  return useMutation<SuccussLogoutResponse, ErrorLogoutResponse>({
    mutationFn: async () => {
      return await postLogout()();
    },
    mutationKey: ['logout'],
    onSuccess: () => {
      try {
        Cookies.remove('token');
        setToken('');
        queryClient.removeQueries();
      } catch (exp) {
        console.log({ exp });
      }
    },
  });
}
