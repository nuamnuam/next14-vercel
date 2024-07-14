import { useCallback, useEffect, useMemo, useState } from 'react';

import usePusher from './usePusher';

export type IPairResult = {
  '24': string | null;
  a: string;
  au: string;
  b: string;
  bu: string;
  key: string;
};

export default function useAdvanceMarketData(symbols?: string[]) {
  const { initializePusher } = usePusher();
  const pusher = initializePusher();

  const [update, setUpdate] = useState<IPairResult[]>([]);

  const symbolsIsChanged = useMemo(() => {
    const updateKeys = update.map((item) => item.key).sort();
    const symbolsKeys = symbols?.sort() ?? [];
    return JSON.stringify(updateKeys) !== JSON.stringify(symbolsKeys);
  }, [symbols, update]);

  const initPusher = useCallback(() => {
    if (pusher) {
      const channel = pusher.subscribe('pbc');
      try {
        const channelBindPromise = new Promise((resolve) => {
          channel.unbind('ticker_p2p.price');
          resolve('');
        });

        channelBindPromise.then(() => {
          channel.bind('ticker_p2p.price', function (data: any) {
            if (symbols?.length) {
              const updatedSymbols: string[] = [];
              const keys = Object.keys(data);
              symbols?.forEach((symbol) => {
                if (keys.findIndex((key) => key === symbol) > -1)
                  updatedSymbols.push(symbol);
              });
              if (updatedSymbols.length) {
                const result: IPairResult[] = [];
                updatedSymbols.forEach((symbol) => {
                  result.push({
                    key: symbol,
                    ...data?.[symbol],
                  });
                });
                setUpdate(result);
              }
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [symbols, update, symbolsIsChanged]);

  useEffect(() => {
    if (pusher) initPusher();
  }, [initPusher, pusher]);

  const unsubscribe = useCallback(() => {
    pusher?.unsubscribe('channel-public');
  }, []);

  return { update, initPusher, unsubscribe, isLoading: symbolsIsChanged };
}
