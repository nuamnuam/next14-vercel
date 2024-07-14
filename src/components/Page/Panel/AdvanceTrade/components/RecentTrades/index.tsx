import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'classnames';

import { Table } from '@/components';
import {
  SingleTradeResult,
  useRecentTradesQuery,
} from '@/requests/advance-trade/recentTradesQuery';
import { useAdvanceTradeStore } from '@/store';
import type { TableHeaderItem } from '@/components/TableLayout/types';
import { getLang, toPersianDigits, toPrice } from '@/utils';
import { useLang, useRecentTrades } from '@/hooks';

const [advancedTrade] = getLang(['advancedTrade']);

const RecentTrades = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const [trades, setTrades] = useState<SingleTradeResult[]>([]);

  const { baseAsset, quoteAsset } = useAdvanceTradeStore();

  const { data, isLoading, isFetching } = useRecentTradesQuery(
    `${baseAsset}${quoteAsset}`,
  );

  const { update } = useRecentTrades(`${baseAsset}${quoteAsset}`);

  const syncData = useCallback(() => {
    let result: SingleTradeResult[] = [];

    if (update && update.length) {
      result = update.map(({ a, p, s, t }) => {
        return {
          amount: a,
          price: p,
          side: s,
          time: t,
          base_asset: baseAsset,
          quote_asset: quoteAsset,
        };
      });
    } else {
      result = data?.result || [];
    }

    setTrades(result?.slice(0, 20));
  }, [update, data]);

  useEffect(() => {
    syncData();
  }, [syncData]);

  const transformedData = useCallback(() => {
    return trades?.map(({ time, price, side, amount }) => {
      return {
        price: (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span
                className={clsx('text-xs font-normal', {
                  'text-primary-600': side === 'BUY',
                  'text-danger-400': side === 'SELL',
                })}
              >
                {toPrice(price)}
              </span>
            </div>
          </div>
        ),
        volume: (
          <div className="flex items-center justify-center">
            <span className="ml-2 text-xs font-normal text-dark-600">
              {toPrice(amount)}
            </span>
          </div>
        ),
        time: (
          <span className="ml-2 text-xs font-normal text-dark-600">
            {toPersianDigits(time)}
          </span>
        ),
      };
    });
  }, [trades]);

  return (
    <div className="bg-white rounded-lg">
      <span className="text-dark-800 px-6 py-4 hidden lg:block">
        {advancedTrade.ordersList}
      </span>
      <div
        className="lg:h-[345px] overflow-y-auto"
        style={{ scrollbarWidth: 'thin' }}
      >
        <Table
          data={transformedData() || []}
          headerItems={headerItems(baseAsset, quoteAsset)}
          isLoading={isLoading}
          isFetching={isFetching}
          headerExtraClassname="!pl-4 lg:!pl-0 lg:px-0 !py-1 !bg-dark-50"
          bodyExtraClassname="!px-4 lg:!px-0 py-1.5 border-none"
        />
      </div>
    </div>
  );
};

export default RecentTrades;

const headerItems = (
  baseAsset: string,
  quoteAsset: string,
): TableHeaderItem[] => [
  {
    title: `${advancedTrade.price} ${quoteAsset}`,
    name: 'price',
    width: 'flex w-[34%] justify-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: `${advancedTrade.amount} ${baseAsset}`,
    name: 'volume',
    width: 'flex w-[34%] justify-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: advancedTrade.time,
    name: 'time',
    width: 'flex w-[32%] justify-center',
    columnClassNames: 'flex justify-center',
  },
];
