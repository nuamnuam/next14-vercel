import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';

export type PrivateChannelModel = {
  socket_id: string;
  channel_name: string;
};

export type SuccussPrivateChannelResponse = {
  auth: string;
};

export type ErrorPrivateChannelResponse = {
  result: any;
  message: string;
  success: boolean;
  code: number;
};

export function postPrivateChannel(data: PrivateChannelModel, url: string) {
  return Request.post<SuccussPrivateChannelResponse>(url, data, {
    baseURL: '',
  });
}

export function usePrivateChannelMutation() {
  const authUrl = useSettingValue(SETTINGS.SOCKET_AUTH_URL);
  return useMutation<
    SuccussPrivateChannelResponse,
    ErrorPrivateChannelResponse,
    PrivateChannelModel
  >({
    mutationFn: async (data) =>
      await postPrivateChannel(data, authUrl as string)(),
    mutationKey: ['private-channel'],
  });
}
