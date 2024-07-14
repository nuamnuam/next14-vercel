import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';
import { useProfile } from '@/hooks';

import { KYC } from '../../../endpoints';

export type SuccussUploadFaceVideoResponse = {
  result: [];
  message: string;
  success: boolean;
  code: number;
};

export type ErrorUploadFaceVideoResponse = {
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

export function postUploadFaceVideo(data: FormData) {
  return Request.post<SuccussUploadFaceVideoResponse>(
    KYC.UPLOAD_FACE_VIDEO,
    data,
  );
}

export function useUploadFaceVideoMutation() {
  const { refetch } = useProfile();

  return useMutation<
    SuccussUploadFaceVideoResponse,
    ErrorUploadFaceVideoResponse,
    FormData
  >({
    mutationFn: async (data) => await postUploadFaceVideo(data)(),
    mutationKey: ['upload-face-video'],
    onSuccess: (res) => {
      refetch();
    },
  });
}
