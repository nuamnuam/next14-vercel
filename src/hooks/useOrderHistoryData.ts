import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Channel } from 'pusher-js';

import { usePrivateChannelMutation } from '@/requests/auth/privateChannelMutation';
import { useProfileStore } from '@/store';
import { QUERY_KEYS } from '@/constants';

import usePrivatePusher from './usePrivatePusher';

type IUpdateType = {
  order_id: number;
  price: number;
  status: 'succeeded' | 'failed' | 'submitted';
  commission?: string;
  from_asset_amount?: string;
  to_asset_amount?: string;
  total_qty?: string;
};

export default function useOrderHistoryData() {
  const { initializePrivatePusher } = usePrivatePusher();
  const pusher = initializePrivatePusher();

  const [update, setUpdate] = useState<IUpdateType[]>([]);
  const { profile } = useProfileStore();

  const queryClient = useQueryClient();

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
              channel.bind('orders.status', function (data: any) {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_INFINITE_ASSETS],
                });
                queryClient.invalidateQueries({
                  queryKey: ['get-order-histories'],
                });
                setUpdate([data]);
              });
              channel.bind('orders.refresh', function (data: any) {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_INFINITE_ASSETS],
                });
                queryClient.invalidateQueries({
                  queryKey: ['get-order-histories'],
                });
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

  return { update, setUpdate };
}
