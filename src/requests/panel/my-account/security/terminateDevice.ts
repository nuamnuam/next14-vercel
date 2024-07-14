import { useMutation } from '@tanstack/react-query';

import { Request } from '@/utils';

export type SuccussTerminateDeviceResponse = {
  code: number;
  success: boolean;
  message: string;
  result: { iban: [''] };
};

export type ErrorTerminateDeviceResponse = {
  code: number;
  success: boolean;
  message: string;
  result: any;
};

export function postTerminateDevice(sessionId: string) {
  return Request.post<SuccussTerminateDeviceResponse>(
    `/activities/sessions/${sessionId}/terminate`,
  );
}

export function useTerminateDeviceMutation() {
  return useMutation<
    SuccussTerminateDeviceResponse,
    ErrorTerminateDeviceResponse,
    string
  >({
    mutationFn: async (data) => await postTerminateDevice(data)(),
    mutationKey: ['terminate-device'],
  });
}
