import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { PROFILE } from '@/requests/endpoints';
import { type Profile } from '@/types/profile';
import useAuthStore from '@/store/authStore';

export type SuccussProfileResponse = {
  code: number;
  success: boolean;
  message: string;
  result: Profile;
};

export type ErrorProfileResponse = {
  code: number;
  message: string;
  success: boolean;
};

export default function useProfile() {
  const { token } = useAuthStore();
  function getProfile() {
    return Request.get<SuccussProfileResponse>(PROFILE.GET_PROFILE);
  }

  const api = useQuery<SuccussProfileResponse, ErrorProfileResponse>({
    queryKey: ['user-profile'],
    queryFn: getProfile(),
    enabled: !!token,
    gcTime: 0,
  });

  return { ...api, data: api.data?.result };
}
