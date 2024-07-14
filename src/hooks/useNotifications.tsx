import { useEffect, useState } from 'react';
import { Channel } from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ToastProvider';
import { usePrivateChannelMutation } from '@/requests/auth/privateChannelMutation';
import { useProfileStore } from '@/store';

import usePrivatePusher from './usePrivatePusher';

export default function useNotifications() {
  const { initializePrivatePusher } = usePrivatePusher();
  const pusher = initializePrivatePusher();

  const queryClient = useQueryClient();

  const [count, setCount] = useState<number | undefined>(undefined);

  const { profile } = useProfileStore();

  const { mutateAsync } = usePrivateChannelMutation();

  const getChannel = async () => {
    return await new Promise((resolve) => {
      if (pusher) {
        const channel: Channel = pusher.subscribe(
          `private-user-${profile.tracking_id}`,
        );
        resolve(channel);
      }
    });
  };

  const getToken = async (socket_id: string) => {
    const data = await mutateAsync({
      socket_id,
      channel_name: `private-user-${profile.tracking_id}`,
    });
    return data;
  };

  useEffect(() => {
    (async () => {
      const initPusher = async () => {
        const channel = (await getChannel()) as Channel;
        channel.bind('pusher:subscription_succeeded', async () => {
          if (channel.pusher.connection.socket_id) {
            const { auth } = await getToken(
              channel.pusher.connection.socket_id,
            );
            if (auth) {
              channel.trigger('client-pusher:subscribe', {
                auth,
                channel: `private-user-${profile.tracking_id}`,
              });
              channel.bind('notifications', function (data: any) {
                queryClient.invalidateQueries({
                  queryKey: ['get-all-messages'],
                });
                showToast.info(
                  <div>
                    {data.title ? <h2>{data.title}</h2> : <></>}
                    {data.message ? (
                      <p className="mt-2">{data.message}</p>
                    ) : (
                      <></>
                    )}
                  </div>,
                );
              });
              channel.bind('db_notifications', function (data: any) {
                queryClient.invalidateQueries({
                  queryKey: ['get-all-messages'],
                });
                setCount(data);
              });
            } else {
              throw new Error('Failed to authenticate subscription');
            }
          }
        });
      };
      if (profile.tracking_id && pusher) await initPusher();
    })();
    return () => {
      pusher?.unsubscribe(`private-user-${profile?.tracking_id}`);
    };
  }, [profile.tracking_id, pusher]);

  return { count };
}
