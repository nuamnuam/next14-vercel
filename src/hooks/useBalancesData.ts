import { useEffect } from 'react';
import { Channel } from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';

import { usePrivateChannelMutation } from '@/requests/auth/privateChannelMutation';
import { useProfileStore } from '@/store';

import usePrivatePusher from './usePrivatePusher';

type IUpdateType = {
  currency_id: number;
  currency_symbol: string;
  balance: string;
  balance_freeze: string;
  balance_available: string;
  estimated_usdt: string;
};

export default function useBalancesData() {
  const { initializePrivatePusher } = usePrivatePusher();
  const pusher = initializePrivatePusher();

  const { mutateAsync } = usePrivateChannelMutation();

  const queryClient = useQueryClient();

  const { profile } = useProfileStore();

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
              channel.bind('balances', function (data: IUpdateType) {
                console.log({ data });
                queryClient.invalidateQueries({ queryKey: ['get-balance'] });
                queryClient.invalidateQueries({
                  queryKey: ['get-global-balances-list'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['get-infinite-balances'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['get-global-balance'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['get-balance-history'],
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
}
