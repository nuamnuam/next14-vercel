import { useCallback } from 'react';
import Pusher from 'pusher-js';

import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';

let pusherInstance: Pusher | null = null;

const usePusher = () => {
  const { SOCKET_APP_KEY, SOCKET_AUTH_URL, SOCKET_HOST } = SETTINGS;

  const [app_key, host] = useSettingValue([
    SOCKET_APP_KEY,
    SOCKET_HOST,
    SOCKET_AUTH_URL,
  ]) as string[];

  const initializePusher = useCallback(() => {
    if (!pusherInstance) {
      if (app_key && host) {
        if (!pusherInstance) {
          pusherInstance = new Pusher(app_key, {
            cluster: 'eu',
            wsHost: host,
            forceTLS: true,
          });
        }
      }
    }
    return pusherInstance;
  }, [app_key, host]);

  return { initializePusher };
};

export default usePusher;
