import React, { FC, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'classnames';

import { Icon, Spinner } from '@/components/Common';
import { toPrice } from '@/utils';
import { useCoinIcon, useLang } from '@/hooks';
import { type IAdvanceMarkeResponse } from '@/types/wallet';
import useAdvanceMarketTopCoins from '@/requests/advance-market/topCoinsQuery';
import { FallChartIcon, HotChartIcon, RoseChartIcon } from '@/components/Icons';

import { renderChip } from '.';

type Props = {
  withNewestPairs?: boolean;
};

const ChartBoxes: FC<Props> = ({ withNewestPairs = true }) => {
  const [market] = useLang(['market']);

  const BASE_PARAMS: { per_page: number; provider_type: 'p2p' | 'otc' } = {
    per_page: 2,
    provider_type: 'p2p',
  };

  const { data: trendPairs, isLoading: isTrendPairsLoading } =
    useAdvanceMarketTopCoins({
      sort_by: 'is_trend',
      sort_type: 'desc',
      ...BASE_PARAMS,
    });

  const { data: lowestChangedPairs, isLoading: isLowestChangedPairsLoading } =
    useAdvanceMarketTopCoins({
      sort_by: 'changes',
      sort_type: 'desc',
      ...BASE_PARAMS,
    });

  const { data: toppestPairs, isLoading: isToppestPairsLoading } =
    useAdvanceMarketTopCoins({
      sort_by: 'changes',
      sort_type: 'asc',
      ...BASE_PARAMS,
    });

  const { data: newestPairs, isLoading: isNewestPairsLoading } =
    useAdvanceMarketTopCoins({
      sort_by: 'is_new',
      sort_type: 'desc',
      ...BASE_PARAMS,
      enabled: withNewestPairs,
    });

  const transformItems = (pairs: IAdvanceMarkeResponse | undefined) => {
    return (
      pairs?.result.map((item) => {
        const pair = Object.values(item)?.[0];
        return {
          type: +pair.stats['24h_ch'] >= 0 ? 'up' : ('down' as 'up' | 'down'),
          percent: +pair.stats['24h_ch'] || 0,
          value: +pair.stats.lastPrice,
          base_asset: pair.baseAsset,
          qoute_asset: pair.quoteAsset,
          slug: pair.baseAssetSlug,
        };
      }) || []
    );
  };

  return (
    <div className="flex items-center justify-between gap-6 px-2 pt-8 bg-white">
      <SingleBox
        title={market.mostProfit}
        isLoading={isToppestPairsLoading}
        boxType="primary"
        icon={<Icon icon="ChartUp-OutLined" size={24} />}
        items={transformItems(toppestPairs)}
      />
      <SingleBox
        title={market.mostLoss}
        isLoading={isLowestChangedPairsLoading}
        boxType="danger"
        icon={<Icon icon="ChartUp-OutLined" size={24} />}
        items={transformItems(lowestChangedPairs)}
      />
      <SingleBox
        title={market.trends}
        isLoading={isTrendPairsLoading}
        boxType="warning"
        icon={<Icon icon="Chart-OutLined" size={24} />}
        items={transformItems(trendPairs)}
      />
    </div>
  );
};

interface SingleBoxProps {
  icon: React.ReactNode;
  title: string;
  boxType?: 'primary' | 'warning' | 'danger';
  items: Array<{
    type: 'up' | 'down';
    percent: number;
    value: number;
    base_asset: string;
    qoute_asset: string;
    slug: string;
  }>;
  isLoading: boolean;
}

const SingleBox: React.FC<SingleBoxProps> = ({
  title,
  items,
  boxType,
  isLoading,
}) => {
  const getCoinIcon = useCoinIcon();

  const renderTitle = useCallback(() => {
    let classname = '';
    let icon;
    switch (boxType) {
      case 'primary':
        classname = 'text-primary-600';
        icon = RoseChartIcon;
        break;
      case 'danger':
        classname = 'text-danger-400';
        icon = FallChartIcon;
        break;
      case 'warning':
        classname = 'text-warning-600';
        icon = HotChartIcon;
        break;
      default:
        classname = 'text-dark-600';
    }

    return (
      <div
        className={clsx(
          'mb-6 flex items-center justify-between gap-4',
          classname,
        )}
      >
        <span className="text-sm font-normal">{title}</span>
        {icon?.()}
      </div>
    );
  }, [title]);

  return (
    <div className="flex-1 rounded-lg border border-dark-50 p-4 bg-white">
      {renderTitle()}
      {isLoading ? (
        <div className="flex justify-center items-center my-8">
          <Spinner />
        </div>
      ) : (
        <>
          {items.map((item, index) => (
            <div
              className={clsx(
                'flex items-center justify-between',
                index === 0 && items.length > 1
                  ? 'border-b border-dark-50 pb-4'
                  : 'pt-4',
              )}
              key={index}
            >
              <div className="flex flex-col gap-1 w-3/12">
                <Link
                  href={`/${item.slug}`}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center">
                    <div>
                      <Image
                        src={getCoinIcon(item.base_asset)}
                        width={24}
                        height={24}
                        alt={item.base_asset}
                        onError={(e) => {
                          //@ts-ignore
                          e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-dark-700">
                    {item.base_asset}
                  </span>
                </Link>
              </div>
              <div className="flex flex-col w-3/12 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-dark-600">
                    {toPrice(item.value)}
                  </span>
                  <span className="text-xs font-normal text-dark-600">
                    {item.qoute_asset}
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-3/12 items-end">
                {renderChip(item.percent || 0, true)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ChartBoxes;
