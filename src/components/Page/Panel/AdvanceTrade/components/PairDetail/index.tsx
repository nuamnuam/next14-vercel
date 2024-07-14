import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import { DoubleText, Icon } from '@/components/Common';
import { useAdvanceTradeStore } from '@/store';
import { useCoinIcon, useLang } from '@/hooks';
import { toPersianDigits, toPrice } from '@/utils';
import { IAdvanceMarketpair } from '@/types/wallet';
import usePairDetail from '@/hooks/usePairDetail';

type UpdatedPrice = { type?: 'UP' | 'DOWN' | 'SAME'; price?: number };

type Props = {
  pair: IAdvanceMarketpair | undefined;
  isLoading: boolean;
};

const PairDetail: FC<Props> = ({ isLoading, pair }) => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const [lastUpdate, setLastUpdate] = useState<UpdatedPrice | undefined>(
    undefined,
  );

  const getCoinIcon = useCoinIcon();

  const { quoteAsset, baseAsset } = useAdvanceTradeStore();

  const { update } = usePairDetail(`${baseAsset}${quoteAsset}`);

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

  const handleNegativeNumberUI = (value: string | number) => {
    const input = value.toString();
    if (input.includes('-')) {
      const splittedValue = input.split('-');
      return `${splittedValue} -`.replaceAll(',', '');
    }
    return value;
  };

  return (
    <div
      className={clsx('bg-white rounded-lg flex w-full lg:h-[82px]', {
        'opacity-50': isLoading || !pair,
      })}
    >
      <div
        className={
          'p-6 border-l border-dashed border-dark-100 flex items-center gap-4 w-[300px]'
        }
      >
        <div className="flex items-start">
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
        <div className="flex flex-col justify-center items-start">
          <DoubleText
            firstText={baseAsset}
            secondText={quoteAsset}
            size="lg"
            classNames="font-normal lg:text-[20px]"
          />
          <span className="text-dark-500 text-sm">
            {pair?.faBaseAsset}/{pair?.faQuoteAsset}
          </span>
        </div>
      </div>
      <div className="p-6 flex items-center justify-between flex-auto">
        <ChartBox
          value={toPrice(update?.l || pair?.stats.lastPrice || 0)!}
          title={
            `${toPrice(update?.lu || pair?.stats.lastPriceUsd || 0)}` +
            '\u200E' +
            ' USDT ' +
            ' ≈ '
          }
          primary
          className="lg:text-sm lg:font-medium"
        />
        <VerticalDivider />
        <ChartBox
          value={`${toPersianDigits(
            handleNegativeNumberUI(
              update?.['24h_ch'] || pair?.stats['24h_ch'] || 0,
            ),
          )} ٪`}
          title={advancedTrade['24hChanges']}
          className={
            update?.['24h_ch']
              ? Number(update?.['24h_ch']) > 0
                ? '!text-primary-500'
                : '!text-danger-500'
              : pair?.stats['24h_ch']! > 0
              ? '!text-primary-500'
              : '!text-danger-500'
          }
        />
        <VerticalDivider />
        <ChartBox
          value={
            toPrice(update?.['24h_hp'] || pair?.stats['24h_highPrice'] || 0)!
          }
          title={advancedTrade['24hMaxChanges']}
          up
        />
        <VerticalDivider />
        <ChartBox
          value={
            toPrice(update?.['24h_lp'] || pair?.stats['24h_lowPrice'] || 0)!
          }
          title={advancedTrade['24hMinChanges']}
          down
        />
        <VerticalDivider />
        <ChartBox
          value={`${toPrice(
            update?.['24h_v'] || pair?.stats['24h_volume'] || 0,
          )} ${baseAsset}`}
          title={advancedTrade.tradesVolume}
        />
        <VerticalDivider />
        <ChartBox
          value={toPrice(update?.in_usd || pair?.stats.in_usd || 0)!}
          title={advancedTrade.worldPrice}
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

export default PairDetail;

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
    <div className="flex flex-col gap-1">
      <span
        className={clsx(
          'font-medium text-dark-700 flex gap-1',
          primary && 'text-primary-500',
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
      <span className="text-dark-500 text-xs">{title}</span>
    </div>
  );
};

const VerticalDivider = () => (
  <div className="flex flex-col border-l border-dark-50 h-full" />
);
