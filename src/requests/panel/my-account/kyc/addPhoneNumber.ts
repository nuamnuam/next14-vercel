import { useMutation } from '@tanstack/react-query';

import {
  type IPhoneNumberModel,
  type EditProfileModel,
} from '@/types/myAccount';
import { Request } from '@/utils';
import { useProfile } from '@/hooks';

import { MYACCOUNT_ENDPOINTS } from '../../../endpoints';

export type SuccussAddPhoneNumberResponse = {
  result: EditProfileModel;
  message: string;
  success: boolean;
  code: number;
};

export type ErrorAddPhoneNumberResponse = {
  result: {
    area_code?: string;
    main_number?: string;
    message: string;
    mobile_number?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function postAddPhoneNumber(data: IPhoneNumberModel) {
  return Request.put<SuccussAddPhoneNumberResponse>(
    MYACCOUNT_ENDPOINTS.EDIT_PROFILE,
    data,
  );
}

export function useAddPhoneNumberMutation() {
  const { refetch } = useProfile();

  return useMutation<
    SuccussAddPhoneNumberResponse,
    ErrorAddPhoneNumberResponse,
    IPhoneNumberModel
  >({
    mutationFn: async (data) => await postAddPhoneNumber(data)(),
    mutationKey: ['add-kyc-phone-number'],
    onSuccess: (res) => {
      refetch();
    },
  });
}
