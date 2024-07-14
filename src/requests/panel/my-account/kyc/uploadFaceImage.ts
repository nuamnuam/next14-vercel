import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { useProfile } from '@/hooks';

import { KYC } from '../../../endpoints';

export type SuccussUploadFaceImageResponse = {
  result: [];
  message: string;
  success: boolean;
  code: number;
};

export type ErrorUploadFaceImageResponse = {
  result: {
    code: number;
    message: string;
    mobile_number?: string;
    success: false;
  };
  message: string;
  success: boolean;
  code: number;
};

export function postUploadFaceImage(data: FormData) {
  return Request.post<SuccussUploadFaceImageResponse>(
    KYC.UPLOAD_FACE_IMAGE,
    data,
  );
}

export function useUploadFaceImageMutation() {
  const { refetch } = useProfile();

  return useMutation<
    SuccussUploadFaceImageResponse,
    ErrorUploadFaceImageResponse,
    FormData
  >({
    mutationFn: async (data) => await postUploadFaceImage(data)(),
    mutationKey: ['upload-face-image'],
    onSuccess: () => {
      refetch();
    },
  });
}
