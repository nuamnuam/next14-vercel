import { useMutation } from '@tanstack/react-query';

import { type EditProfileModel } from '@/types/myAccount';
import { Request } from '@/utils';
import { useProfile } from '@/hooks';

import { MYACCOUNT_ENDPOINTS } from '../../../endpoints';

export type SuccussEditProfileSettingResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorEditProfileSettingResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function editSetting(data: EditProfileModel) {
  return Request.put<SuccussEditProfileSettingResponse>(
    MYACCOUNT_ENDPOINTS.EDIT_SETTING,
    data,
  );
}

export function useEditSettingMutation() {
  const { refetch } = useProfile();
  return useMutation<
    SuccussEditProfileSettingResponse,
    ErrorEditProfileSettingResponse,
    EditProfileModel
  >({
    mutationFn: async (data) => await editSetting(data)(),
    mutationKey: ['edit-profile-setting'],
    onSuccess: () => {
      refetch();
    },
  });
}
