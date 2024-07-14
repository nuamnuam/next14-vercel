import React, { FC, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import { Icon, TradingViewChart } from '@/components';
import { useCoinIcon, useLang, useMarketData } from '@/hooks';
import { renderChip } from '@/components/Page/Market/CoinsTable/Market';
import { getPrecisionCount, toPrice } from '@/utils';
import { type ISingleCoin } from '@/requests/single-coin';

type UpdatedPrice = { type?: 'UP' | 'DOWN' | 'SAME'; price?: number };

type Props = {
  coin: ISingleCoin;
  isLoading: boolean;
};

const SingleCoinContent: FC<Props> = ({ coin, isLoading }) => {
  const [market] = useLang(['market']);

  const [lastUpdate, setLastUpdate] = useState<UpdatedPrice | undefined>(
    undefined,
  );

  const { update } = useMarketData([`${coin.key}IRT`]);

  const getCoinIcon = useCoinIcon();

  const updatedCoin = useMemo(() => {
    if (update?.[0]) return update?.[0];
  }, [update]);

  useEffect(() => {
    if (updatedCoin?.o?.au) {
      const result: UpdatedPrice = {};

      if (+updatedCoin?.o?.au > (lastUpdate?.price || 0)) {
        result.type = 'UP';
      } else if (+updatedCoin?.o?.au < (lastUpdate?.price || 0)) {
        result.type = 'DOWN';
      } else {
        result.type = 'SAME';
      }
      result.price = +updatedCoin?.o?.au;
      setLastUpdate(result);
    }
  }, [updatedCoin]);

  useEffect(() => {
    setLastUpdate({ type: 'SAME', price: +(coin?.last_usd_price || 0) });
  }, [coin]);

  return (
    <div className="bg-dark-50">
      <div className={clsx('bg-white', { 'opacity-50': isLoading })}>
        <div className="bg-white  py-6 px-2 flex border-b-4 border-dark-50 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div>
                <Image
                  src={getCoinIcon(coin?.key || '')}
                  width={32}
                  height={32}
                  alt={coin?.key}
                  onError={(e) => {
                    //@ts-ignore
                    e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-danger-400 text-2xl font-bold">
                {toPrice(updatedCoin?.o.a || coin?.last_irt_price || 0)}
              </span>
              <span className="text-dark-500 text-xs">
                {`${toPrice(updatedCoin?.o.au || coin?.last_usd_price || 0)}` +
                  '\u200E' +
                  ' USDT ' +
                  ' ≈ '}
              </span>
            </div>
          </div>
          {renderChip(
            Number(updatedCoin?.o?.[24]) ||
              coin?.marketcap.percent_change_24h ||
              0,
            false,
            undefined,
            getPrecisionCount(
              Number(updatedCoin?.o?.[24]) ||
                coin?.marketcap.percent_change_24h ||
                0,
            ),
          )}
        </div>
        <div className="bg-white pb-6 pt-4 px-2 flex justify-between">
          <ChartBox
            value={toPrice(coin?.marketcap['24h_highPrice'] || 0)!}
            title={market.maxPrice}
            up
          />
          <ChartBox
            value={toPrice(coin?.marketcap['24h_lowPrice'] || 0)!}
            title={market.min}
            down
          />
          <ChartBox
            value={toPrice(updatedCoin?.o.au || coin?.last_usd_price || 0)!}
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
      <div className="bg-white h-[410px] flex flex-col items-start justify-center p-4 mt-6">
        <div className="flex py-4 px-2">
          <p className="font-medium text-base text-dark-800">
            {market.worldMarketChart}
          </p>
        </div>
        <TradingViewChart pair={coin.tradingview_pair} />
      </div>
    </div>
  );
};

export default SingleCoinContent;

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
          'font-medium text-dark-700 flex gap-1 text-sm',
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
