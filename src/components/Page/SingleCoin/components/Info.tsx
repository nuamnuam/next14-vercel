import { FC, useMemo } from 'react';
import Image from 'next/image';

import { useCoinIcon, useLang, useMarketData } from '@/hooks';
import type { ISingleCoin } from '@/requests/single-coin';
import type { IPairResult } from '@/hooks/useMarketData';
import { Skeleton } from '@/components/Common';
import { toPersianDigits, toPrice } from '@/utils';

type Props = {
  currency: ISingleCoin;
  DATA: any;
  update?: IPairResult[];
};

const Info: FC<Props> = ({ currency, DATA, update }) => {
  const [singleCoin] = useLang(['singleCoin']);

  const { last_usd_price, last_irt_price, marketcap, key } = currency;

  const coinIcon = useCoinIcon();

  const updatedCoin = useMemo(() => {
    const result = update?.find((item) => item.key === `${key}IRT`);
    if (result) return result;
  }, [update]);

  const coinInformations = useMemo(() => {
    return [
      {
        title: singleCoin.coinName,
        value: DATA.name ? `${DATA.name}/${DATA.name_en}` : '',
      },
      { title: singleCoin.symbol, value: DATA.symbol || '' },
      { title: singleCoin.marketRank, value: marketcap.rank },
      {
        title: `${singleCoin.lastPrice} ${DATA.name || ''} ${
          singleCoin.inDollor
        }`,
        value: '$' + (updatedCoin?.o.au || last_usd_price || ''),
      },
      {
        title: `${singleCoin.lastPrice} ${DATA.name || ''} ${
          singleCoin.inToman
        }`,
        value: updatedCoin?.o.a || last_irt_price || '',
      },
      { title: singleCoin.turnOver, value: '$' + marketcap.market_cap_usd },
      {
        title: singleCoin.lowestHighest24H,
        value: '$' + marketcap['24h_highPrice'],
      },
      {
        title: singleCoin.lowestHighest7D,
        value: '$' + marketcap['24h_lowPrice'],
      },
      {
        title: singleCoin.marketDominance,
        value: marketcap.market_cap_dominance + '%',
      },
      {
        title: singleCoin.availableCurrency,
        value: `${Number(Number(marketcap.max_supply) / 1_000_000).toFixed(
          2,
        )}M / ${Number(
          Number(marketcap.circulating_supply) / 1_000_000,
        ).toFixed(2)}M`,
      },
    ];
  }, [updatedCoin]);

  return (
    <div className="flex flex-col gap-4 mt-3">
      {coinInformations.map(({ title, value }, index) => (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium leading-6 text-dark-500">
            {title}
          </h3>
          {!DATA || !currency ? (
            <Skeleton type="text" />
          ) : (
            <p className="flex justify-end items-center gap-x-4 text-sm font-medium leading-6 text-dark-700">
              {!value?.includes('null')
                ? toPersianDigits(toPrice(value ?? ''))
                : singleCoin.unknown}
              {index === 0 && (
                <Image
                  src={coinIcon(DATA.symbol)}
                  width={24}
                  height={24}
                  alt={DATA.symbol}
                  onError={(e) => {
                    //@ts-ignore
                    e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                  }}
                />
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Info;
