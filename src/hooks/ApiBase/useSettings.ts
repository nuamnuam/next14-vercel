import { useQuery } from '@tanstack/react-query';
import { Request } from '@/utils';
import { SETTINGS } from '@/requests/endpoints';
import { type SettingItem } from '@/types/settings';

export type SuccessSettingsResponse = {
  result: SettingItem[];
  message: string;
  success: boolean;
};

export type ErrorSettingsResponse = {
  code: number;
  success: boolean;
  message: string;
  result: {
    section?: string;
  };
};

export function getSettings() {
  return Request.get<SuccessSettingsResponse>(SETTINGS.DEFAULT, {
    params: { section: 'site' },
  });
}

export default function useSettings() {
  const api = useQuery<SuccessSettingsResponse, ErrorSettingsResponse>({
    queryKey: ['settings'],
    queryFn: getSettings(),
  });

  return { ...api, data: api.data?.result };
}
