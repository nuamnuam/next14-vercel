import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { useProfile } from '@/hooks';

import { KYC } from '../../../endpoints';

export type SuccussUploadNationalCardResponse = {
  result: { national_card_image?: string };
  message: string;
  success: boolean;
  code: number;
};

export type ErrorUploadNationalCardResponse = {
  result: {
    code: number;
    message: string;
    national_card_image?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function postUploadNationalCard(data: FormData) {
  return Request.post<SuccussUploadNationalCardResponse>(
    KYC.UPLOAD_NATIONAL_CARD_IMAGE,
    data,
  );
}

export function useUploadNationalCardMutation() {
  const { refetch } = useProfile();

  return useMutation<
    SuccussUploadNationalCardResponse,
    ErrorUploadNationalCardResponse,
    FormData
  >({
    mutationFn: async (data) => await postUploadNationalCard(data)(),
    mutationKey: ['upload-national-card-image'],
    onSuccess: (res) => {
      refetch();
    },
  });
}
