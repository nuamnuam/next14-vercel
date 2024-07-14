import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { type Profile } from '@/types/profile';
import useProfileStore from '@/store/useProfileStore';

import { PROFILE } from './endpoints';

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

export function getProfile() {
  return Request.get<SuccussProfileResponse>(PROFILE.GET_PROFILE);
}

export function useProfileMutation() {
  const { setProfile } = useProfileStore();

  return useMutation<SuccussProfileResponse, ErrorProfileResponse>({
    mutationFn: async () => await getProfile()(),
    mutationKey: ['get-profile'],
    onSuccess: (res) => {
      try {
        setProfile(res.result);
      } catch (exp) {
        console.log({ exp });
      }
    },
  });
}
