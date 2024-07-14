import { useSettings } from '@/hooks';

type ValueOf<T> = T[keyof T];

export const SETTINGS = {
  LIVECHAT_STATUS: 'Livechat-status',
  KYC_FACE_VIDEO: 'kyc-face-video',
  KYC_FACE_IMAGE: 'kyc-face-image',
  SENTRY_WEB_STATUS: 'sentry-web-status',
  SENTRY_WEB_DSN: 'sentry-web-dsn',
  TITLE: 'Title',
  CURRENCY_ICON_BASE_URL: 'currencies-base-url',
  META_DESCRIPTION: 'meta-description',
  FAV_ICON: 'fav-icon',
  ROBOT_INDEX: 'roboot-index',
  META_JSON: 'meta-json',
  SOCKET_HOST: 'websocket-host',
  SOCKET_APP_KEY: 'websocket-app_key',
  SOCKET_AUTH_URL: 'websocket_broadcasting_auth_url',
  APP_VERSION: 'app-version-pwa',
};

export default function useSettingValue(
  key: ValueOf<typeof SETTINGS> | Array<ValueOf<typeof SETTINGS>>,
) {
  const { data } = useSettings();

  if (!key) return null;

  if (Array.isArray(key)) {
    const result = key.map((item) => {
      return data?.find((setting) => setting.key === item)?.value;
    });
    return result;
  }

  if (key === SETTINGS.APP_VERSION) {
    return data?.find((setting) => setting.key === key);
  }

  return data?.find((setting) => setting.key === key)?.value;
}
