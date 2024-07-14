import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type IProfileInfo } from '@/types/myAccount';

import { MYACCOUNT_ENDPOINTS } from '../../../endpoints';

export type SuccussProfileResponse = {
  code: number;
  success: boolean;
  message: string;
  result: IProfileInfo;
};

export type ErrorProfileResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getProfile() {
  return Request.get<SuccussProfileResponse>(MYACCOUNT_ENDPOINTS.GET_PROFILE);
}

export function useProfileMutation() {
  return useMutation<SuccussProfileResponse, ErrorProfileResponse>({
    mutationFn: async () => await getProfile()(),
    mutationKey: ['get-profile'],
  });
}
