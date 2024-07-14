import { useQuery } from '@tanstack/react-query';

import { Request } from '@/utils';
import { SETTINGS } from '@/requests/endpoints';
import { QUERY_KEYS } from '@/constants';

export type AlertItem = {
  alert_type: string;
  cta: {
    text?: string;
    web_action?: string;
    app_action?: string;
    full_width?: boolean;
  };
  display_status: { web: number; app: number; responsive: number };
  feature: string;
  message: string;
  priority: number;
  section: string;
  slug: string;
  status: number;
  title?: string;
  step?: string;
};

export type SuccessSettingsAlertsResponse = {
  message: string;
  success: boolean;
  code: number;
  result: AlertItem[];
};

export type ErrorSettingsAlertResponse = {
  code: number;
  success: boolean;
  message: string;
};

function getSettingAlerts() {
  return Request.get<SuccessSettingsAlertsResponse>(SETTINGS.ALERTS);
}

export default function useSettingAlerts() {
  return useQuery<SuccessSettingsAlertsResponse, ErrorSettingsAlertResponse>({
    queryKey: QUERY_KEYS.SETTING_ALERTS,
    queryFn: getSettingAlerts(),
    gcTime: 5000,
    refetchOnReconnect: true,
  });
}
