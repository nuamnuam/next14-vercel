import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { type EditProfileModel } from '@/types/myAccount';
import { Request, toEnglishDigits } from '@/utils';
import { useBreakpoint, useProfile } from '@/hooks';

import { MYACCOUNT_ENDPOINTS } from '../../../endpoints';

export type SuccussEditProfileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorEditProfileResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function putEditProfile(data: EditProfileModel) {
  if (data.national_code) {
    data.national_code = toEnglishDigits(data.national_code);
  }
  return Request.put<SuccussEditProfileResponse>(
    MYACCOUNT_ENDPOINTS.EDIT_PROFILE,
    data,
  );
}

export function useEditProfileMutation(redirect: boolean = true) {
  const { refetch } = useProfile();
  const router = useRouter();
  const { isDesktop } = useBreakpoint();

  return useMutation<
    SuccussEditProfileResponse,
    ErrorEditProfileResponse,
    EditProfileModel
  >({
    mutationFn: async (data) => await putEditProfile(data)(),
    mutationKey: ['edit-profile'],
    onSuccess: (res) => {
      refetch();
      if (isDesktop || !redirect) return;
      router.push('/panel/my-account/profile');
    },
  });
}
