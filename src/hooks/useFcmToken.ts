import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';

import { firebaseApp, getDeviceType } from '@/utils';
import { useSubmitFirebaseId } from '@/requests/firebase/submitIdMutation';
import { authStore, useProfileStore } from '@/store';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('');

  const { token: userToken } = authStore();
  const { profile } = useProfileStore();
  const isLoggedIn = !!userToken;

  const { mutateAsync } = useSubmitFirebaseId();

  const storeFirebaseToken = async () => {
    const deviceType = getDeviceType();
    await mutateAsync({
      firebase_id: token,
      device_name: deviceType,
    });
  };

  useEffect(() => {
    if (isLoggedIn && token && profile.firebase_id !== token) {
      storeFirebaseToken();
    }
  }, [token, isLoggedIn, profile]);

  const retrieveToken = async () => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = getMessaging(firebaseApp);

        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);

        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey:
              'BIbQJXwhdiQDvGcK6FmrQSd5GJTeUKchQmoZ2XwMbfSF7HHaxu4K64QNmA5pdp451T30tMEKMVGJQcnKYFOdSRc',
          });
          if (currentToken) {
            setToken(currentToken);
          } else {
            console.log(
              'No registration token available. Request permission to generate one.',
            );
          }
        }
      }
    } catch (error) {
      console.log('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    retrieveToken();
  }, []);

  return { token, notificationPermissionStatus, retrieveToken };
};

export default useFcmToken;
