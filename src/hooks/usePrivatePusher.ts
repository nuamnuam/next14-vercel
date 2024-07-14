import { useCallback } from 'react';
import Pusher from 'pusher-js';

import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';
import { useProfileStore } from '@/store';

let privatePusherInstance: Pusher | null = null;

const usePrivatePusher = () => {
  const { SOCKET_APP_KEY, SOCKET_AUTH_URL, SOCKET_HOST } = SETTINGS;

  const [app_key, host, auth_url] = useSettingValue([
    SOCKET_APP_KEY,
    SOCKET_HOST,
    SOCKET_AUTH_URL,
  ]) as string[];

  const { profile } = useProfileStore();

  const initializePrivatePusher = useCallback(() => {
    if (!privatePusherInstance && profile?.tracking_id) {
      if (app_key && host && auth_url) {
        privatePusherInstance = new Pusher(app_key, {
          cluster: 'eu',
          wsHost: host,
          forceTLS: true,
          authEndpoint: auth_url,
          auth: {
            headers: {
              Accept: 'application/json',
              Authorization:
                typeof window !== 'undefined'
                  ? 'Bearer ' +
                    JSON.parse(window.localStorage.getItem('auth-state')!)
                      ?.state.token
                  : '',
            },
          },
        });
      }
    }
    return privatePusherInstance;
  }, [app_key, host, auth_url]);

  return { initializePrivatePusher };
};

export default usePrivatePusher;
