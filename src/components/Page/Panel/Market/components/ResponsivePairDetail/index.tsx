import React, { FC, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import { Icon } from '@/components';
import { useCoinIcon, useLang, usePairDetail } from '@/hooks';
import { usePairsQuery } from '@/requests/advance-market/pairsQuery';
import { renderChip } from '@/components/Page/Market/CoinsTable/Market';
import { toPrice } from '@/utils';

type UpdatedPrice = { type?: 'UP' | 'DOWN' | 'SAME'; price?: number };

type Props = {
  baseAsset: string;
  quoteAsset: string;
};

const ResponsivePairDetail: FC<Props> = ({ baseAsset, quoteAsset }) => {
  const [market] = useLang(['market']);

  const [lastUpdate, setLastUpdate] = useState<UpdatedPrice | undefined>(
    undefined,
  );

  const { data, isLoading } = usePairsQuery(
    1,
    1,
    `${baseAsset}${quoteAsset}`,
    !!baseAsset,
  );

  const { update } = usePairDetail(`${baseAsset}${quoteAsset}`);

  const getCoinIcon = useCoinIcon();

  const pair = useMemo(() => {
    if (data?.result?.[0]) return Object.values(data?.result?.[0])?.[0];
  }, [data]);

  useEffect(() => {
    if (update?.in_usd) {
      const result: UpdatedPrice = {};

      if (+update.in_usd > (lastUpdate?.price || 0)) {
        result.type = 'UP';
      } else if (+update.in_usd < (lastUpdate?.price || 0)) {
        result.type = 'DOWN';
      } else {
        result.type = 'SAME';
      }
      result.price = +update.in_usd;
      setLastUpdate(result);
    }
  }, [update]);

  useEffect(() => {
    setLastUpdate({ type: 'SAME', price: +(pair?.stats.in_usd || 0) });
  }, [pair]);

  return (
    <div
      className={clsx('bg-white md:rounded-lg', { 'opacity-50': isLoading })}
    >
      <div className="bg-white rounded-lg py-6 px-2 flex border-b border-dark-50 justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div>
              <Image
                src={getCoinIcon(quoteAsset)}
                width={32}
                height={32}
                alt={quoteAsset}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            </div>
            <div className="-mr-2">
              <Image
                src={getCoinIcon(baseAsset)}
                width={32}
                height={32}
                alt={baseAsset}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-danger-400 text-2xl font-bold">
              {toPrice(update?.l || pair?.stats.lastPrice || 0)}
            </span>
            <span className="text-dark-500 text-xs">
              {`${toPrice(update?.lu || pair?.stats.lastPriceUsd || 0)}` +
                '\u200E' +
                ' USDT ' +
                ' ≈ '}
            </span>
          </div>
        </div>
        {renderChip(Number(update?.['24h_ch']) || pair?.stats['24h_ch'] || 0)}
      </div>
      <div className="bg-white rounded-lg pb-6 pt-4 px-2 flex justify-between">
        <ChartBox
          value={
            toPrice(update?.['24h_hp'] || pair?.stats['24h_highPrice'] || 0)!
          }
          title={market.maxPrice}
          up
        />
        <ChartBox
          value={
            toPrice(update?.['24h_lp'] || pair?.stats['24h_lowPrice'] || 0)!
          }
          title={market.min}
          down
        />
        <ChartBox
          value={
            toPrice(update?.['24h_v'] || pair?.stats['24h_volume'] || 0) +
            '\u200E  ' +
            baseAsset
          }
          title={market.tradesVolume}
        />
        <ChartBox
          value={toPrice(update?.in_usd || pair?.stats.lastPriceUsd || 0)!}
          title={market.worldPrice}
          className={
            lastUpdate?.type === 'UP'
              ? 'price-up-animate'
              : lastUpdate?.type === 'DOWN'
              ? 'price-down-animate'
              : ''
          }
        />
      </div>
    </div>
  );
};

export default ResponsivePairDetail;

interface ChartBoxProps {
  title: string;
  value: string;
  primary?: boolean;
  up?: boolean;
  down?: boolean;
  className?: string;
}

const ChartBox: React.FC<ChartBoxProps> = ({
  title,
  value,
  primary = false,
  up,
  down,
  className = '',
}) => {
  return (
    <div className="flex flex-col gap-1 items-center">
      <span
        className={clsx(
          'font-medium text-dark-700 flex gap-1 text-2xs',
          primary && 'text-primary-600',
          className,
        )}
      >
        {value}
        {up && (
          <Icon
            icon="ArrowTop-TwoTone"
            size={16}
            className="[&>*]:fill-primary-400"
          />
        )}
        {down && (
          <Icon
            icon="ArrowDown-TwoTone"
            size={16}
            className="[&>*]:fill-danger-400"
          />
        )}
      </span>
      <span className="text-dark-300 text-2xs">{title}</span>
    </div>
  );
};
