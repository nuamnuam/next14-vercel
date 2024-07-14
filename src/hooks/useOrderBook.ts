import { useCallback, useEffect, useState } from 'react';

import usePusher from './usePusher';

export type IOrderBookResult = {
  a: number[][];
  b: number[][];
  t: string;
};

export default function useOrderBook(pair: string) {
  const { initializePusher } = usePusher();
  const pusher = initializePusher();

  const [currentPair, setCurrentPair] = useState<string | undefined>(undefined);
  const [update, setUpdate] = useState<IOrderBookResult | undefined>(undefined);

  const pair_socket_channel = `order-book.${pair}`;

  const initPusher = useCallback(() => {
    if (pusher) {
      const channel = pusher.subscribe(pair_socket_channel);
      try {
        const channelBindPromise = new Promise((resolve) => {
          channel.unbind(pair_socket_channel);
          resolve('');
        });

        channelBindPromise.then(() => {
          channel.bind(pair_socket_channel, function (data: any) {
            if (pair && data) {
              setUpdate(data);
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [pair, update, pusher]);

  const unsubscribe = useCallback(() => {
    if (currentPair && pusher) {
      pusher.unsubscribe(`order-book.${currentPair}`);
      reset();
    }
    setCurrentPair(pair);
  }, [pair]);

  const reset = () => {
    setUpdate(undefined);
  };

  useEffect(() => unsubscribe(), [unsubscribe]);

  useEffect(() => {
    if (pusher) initPusher();
  }, [initPusher, pusher]);

  return { update, initPusher, unsubscribe };
}
