import { getMessaging, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

import { useFcmToken } from '@/hooks';
import { firebaseApp } from '@/utils';

export default function FcmTokenComp() {
  const { notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload) => {
          return new Notification(payload.data?.title || '', {
            body: payload.data?.body,
            icon: payload.data?.icon,
          });
        });
        return () => {
          unsubscribe();
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null;
}
