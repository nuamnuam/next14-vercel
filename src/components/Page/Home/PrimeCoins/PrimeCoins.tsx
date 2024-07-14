import React, { FC, useCallback, useEffect, useState } from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

import { Spinner, Card, Tabs } from '@/components';
import { useCoinIcon } from '@/hooks';
import useTopCoins from '@/requests/home/topCoin';
import {
  fixFloatingNum,
  getLang,
  getPrecisionCount,
  toPersianDigits,
  toPrice,
} from '@/utils';
import type { IPairResult } from '@/hooks/useMarketData';

import { renderChip } from '../../Market/CoinsTable/Market';

type IUpdateRow = {
  key: string;
  au: number;
  changes: number;
  type?: 'UP' | 'DOWN' | 'SAME';
};

export type CoinItem = {
  sortType: 'desc' | 'asc';
  sortBy: 'is_trend' | 'changes' | 'is_new';
};

const [home] = getLang(['home']);

const tabItems = [
  {
    name: 'NEWEST',
    label: home.trends,
  },
  {
    name: 'TREND',
    label: home.mostProfit,
  },
  {
    name: 'INCREASE_CHANGES',
    label: home.mostLoss,
  },
  {
    name: 'DECREASE_CHANGES',
    label: home.newest,
  },
];

const coinsItems: CoinItem[] = [
  {
    sortType: 'desc',
    sortBy: 'is_trend',
  },
  {
    sortType: 'desc',
    sortBy: 'changes',
  },
  {
    sortType: 'asc',
    sortBy: 'changes',
  },
  {
    sortType: 'desc',
    sortBy: 'is_new',
  },
];

enum TABS {
  NEWEST = 'NEWEST',
  TREND = 'TREND',
  INCREASE_CHANGES = 'INCREASE_CHANGES',
  DECREASE_CHANGES = 'DECREASE_CHANGES',
}

type Props = {
  updatePairs: (inputs: string[]) => void;
  update: IPairResult[];
};

const PrimeCoins: FC<Props> = ({ updatePairs, update }) => {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.NEWEST);

  const topCoin = {
    [TABS.NEWEST]: coinsItems[0],
    [TABS.TREND]: coinsItems[1],
    [TABS.INCREASE_CHANGES]: coinsItems[2],
    [TABS.DECREASE_CHANGES]: coinsItems[3],
  }[activeTab];

  return (
    <Card classNames="pb-2">
      <div className="border-b border-dark-50 p-4 pb-0">
        <Tabs
          items={tabItems}
          onChange={(name: string) => {
            setActiveTab(name as TABS);
          }}
        />
      </div>

      <CoinTabContent
        sortBy={topCoin.sortBy}
        sortType={topCoin.sortType}
        updatePairs={updatePairs}
        update={update}
      />
    </Card>
  );
};

const CoinTabContent = ({
  sortBy,
  sortType,
  update,
  updatePairs,
}: CoinItem & Props) => {
  const [updatedRows, setUpdatedRows] = useState<IUpdateRow[]>([]);

  const { isLoading, data } = useTopCoins({
    sort_by: sortBy,
    sort_type: sortType,
  });
  const topCoins = data?.result
    .map((coin) => Object.values(coin)[0])
    .slice(0, 4);

  const updateRows = useCallback(() => {
    if (update.length) {
      let result: IUpdateRow[] = updatedRows;
      update.forEach(({ key, o }) => {
        const prevValue = updatedRows.find((item) => item.key === key);
        const row: IUpdateRow = {
          key,
          changes: o[24],
          au: Number(o.au),
          type: 'SAME',
        };
        if (prevValue) {
          if (prevValue.au < Number(o.au)) row.type = 'DOWN';
          else row.type = 'UP';
          result = [...result.filter((item) => item.key !== key), row];
        } else {
          result.push(row);
        }
      });
      setUpdatedRows(result);
    }
  }, [update]);

  const updateSelectedPairs = useCallback(() => {
    if (topCoins?.length) updatePairs(topCoins?.map((coin) => coin.pair));
  }, [sortBy]);

  const transformedCoinCards = useCallback(() => {
    return topCoins?.map((coin, index) => {
      const update = updatedRows.find(({ key }) => key === coin.pair);
      return {
        icon: coin.baseAsset,
        title: coin.faBaseAsset,
        changePercent: update?.changes || coin.stats['24h_ch'],
        name: coin.baseAsset,
        price: update?.au || coin.stats.lastPriceUsd,
        number: index + 1,
        type: update?.type,
        slug: coin.baseAssetSlug,
      };
    });
  }, [updatedRows, topCoins]);

  useEffect(() => {
    updateRows();
  }, [updateRows]);

  useEffect(() => {
    updateSelectedPairs();
  }, [updateSelectedPairs]);

  if (!data?.result || isLoading)
    return (
      <div className="flex items-center justify-center lg:min-h-[95px] md:min-h-[190px] min-h-[400px]">
        <Spinner />
      </div>
    );

  return (
    <div className="px-4">
      <div
        className={clsx(
          'w-full grid sm:grid-cols-2 lg:grid-cols-4 overflow-x-auto h-[400px] md:h-auto lg:overflow-auto gap-[10%] py-4 sm:gap-8 lg:gap-0',
        )}
      >
        {transformedCoinCards()?.map((coin, index) => {
          return (
            <CoinCard
              key={coin.name}
              icon={coin.icon}
              title={coin.title}
              changePercent={coin.changePercent}
              name={coin.name}
              price={coin.price}
              number={index + 1}
              type={coin?.type}
              slug={coin.slug}
            />
          );
        })}
      </div>
    </div>
  );
};

const CoinCard = ({
  icon,
  title,
  price,
  changePercent,
  name,
  number,
  type,
  slug,
}: {
  icon: any;
  title: string | undefined;
  price: number;
  changePercent: number;
  name: string;
  type?: 'UP' | 'DOWN' | 'SAME';
  slug: string;
} & { number: number }) => {
  const getCoinIcon = useCoinIcon();

  return (
    <Link
      href={`${slug.toLowerCase()}`}
      className={clsx('lg:px-8', number !== 4 && 'lg:border-l')}
    >
      <div className="mb-[10px] flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={getCoinIcon(icon)}
            height={24}
            width={24}
            alt="media"
            onError={(e) => {
              //@ts-ignore
              e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
            }}
          />
          <span className="mr-2 text-sm font-medium text-dark-700">
            {title}
          </span>
        </div>

        <span className="mr-2 text-sm font-medium text-dark-700">{name}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-bold text-dark-700">
          <span className="text-dark-500 font-normal text-xs mr-1">USDT</span>
          <span
            className={
              type === 'DOWN'
                ? 'price-down-animate'
                : type === 'UP'
                ? 'price-up-animate'
                : ''
            }
          >
            {toPersianDigits(
              toPrice(fixFloatingNum(price, getPrecisionCount(price))),
            )}
          </span>
        </span>
        {renderChip(changePercent, false, undefined)}
      </div>
    </Link>
  );
};

export default PrimeCoins;
