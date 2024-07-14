import { Request } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { SECURITY } from '../../../endpoints';
import { useProfile } from '@/hooks';

export type SuccussShowTwoStep2FResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {
    two_step?: {
      status?: boolean;
      type?: string;
      channel?: string;
    };
  };
};

export type ErrorShowTwoStep2FResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function getShowTwoStep2F() {
  return Request.get<SuccussShowTwoStep2FResponse>(SECURITY.TWO_STEP_SHOW_2F);
}

export function useShowTwoStep2FMutation() {
  const { refetch } = useProfile();
  return useMutation<SuccussShowTwoStep2FResponse, ErrorShowTwoStep2FResponse>({
    mutationFn: async () => await getShowTwoStep2F()(),
    mutationKey: ['get-ShowTwoStep2F'],
    onSuccess: (res, req) => {
      refetch();
    },
  });
}
