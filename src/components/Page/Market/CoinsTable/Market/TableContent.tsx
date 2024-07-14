import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import clsx from 'classnames';

import { fixFloatingNum, getLang, toPrice } from '@/utils';
import { Button, Card, Pagination, Table } from '@/components';
import { useCoinIcon, useAdvanceMarketData, useLang } from '@/hooks';
import { usePairsQuery } from '@/requests/advance-market/pairsQuery';
import { authStore, useAdvanceMarketStore } from '@/store';
import { type TableHeaderItem } from '@/components/TableLayout/types';

import { renderChip } from '.';

type UpdatedRow = {
  pair: string;
  type?: 'SAME' | 'UP' | 'DOWN';
  dailyChanges?: string;
  lastPrice?: number;
};

interface Props {
  pairsCoin?: string | undefined;
}

const TableContent = ({ pairsCoin = undefined }: Props) => {
  const [market] = useLang(['market']);

  const { token } = authStore();
  const router = useRouter();

  const { search, page, per_page, set_page } = useAdvanceMarketStore();

  const { data, isLoading, isFetching } = usePairsQuery(
    page,
    per_page,
    search,
    true,
    'p2p',
    pairsCoin,
  );

  const isLogin = !!token;

  const [updatedRows, setUpdatedRows] = useState<UpdatedRow[]>([]);

  const getCoinIcon = useCoinIcon();

  const { update } = useAdvanceMarketData(
    data?.result?.map((pair) => {
      const value = Object.values(pair)?.[0].pair;
      return value;
    }),
  );

  const syncWithSocket = useCallback(() => {
    if (update.length && data) {
      let rows: UpdatedRow[] = updatedRows;
      data.result.map((pair) => {
        const symbol = Object.keys(pair)?.[0];
        const value = Object.values(pair)?.[0];
        const row: UpdatedRow = {
          pair: symbol,
        };
        update.forEach((upd) => {
          if (symbol === upd.key) {
            if (Number(upd?.a) > value.stats.lastPriceUsd) {
              row.type = 'UP';
            } else if (Number(upd.a) < value.stats.lastPriceUsd) {
              row.type = 'DOWN';
            } else {
              row.type = 'SAME';
            }
            //@ts-ignore
            row.dailyChanges = upd?.[24] ? upd?.[24] : value.stats['24h_ch'];
            row.lastPrice = upd.a ? Number(upd.a) : value.stats.lastPrice;
            if (rows.find(({ pair }) => pair === symbol)) {
              return (rows = [
                ...rows.filter(({ pair }) => pair !== symbol),
                row,
              ]);
            }
            return rows.push(row);
          }
        });
      });
      setUpdatedRows(rows);
    }
  }, [update]);

  const transformedData = useCallback(() => {
    if (!data?.result.length) return [];

    return data.result?.map((item) => {
      const { faName, stats, baseAsset, quoteAsset, pair, baseAssetSlug } =
        Object.values(item)?.[0];

      const updatedRow = updatedRows.find((item) => item.pair === pair);

      return {
        market: (
          <Link href={`/${baseAssetSlug}`} className="flex items-center gap-2">
            <div className="flex items-center">
              <div>
                <Image
                  src={getCoinIcon(quoteAsset)}
                  width={24}
                  height={24}
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
                  width={24}
                  height={24}
                  alt={baseAsset}
                  onError={(e) => {
                    //@ts-ignore
                    e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-dark-700">
                {baseAsset}
                <span className="text-dark-700">/{quoteAsset}</span>
              </span>
              <span className="text-xs font-normal text-dark-500">
                {faName}
              </span>
            </div>
          </Link>
        ),
        desktopLastPrice: (
          <div className="flex items-center justify-center">
            <span
              className={clsx(
                'ml-2 text-sm font-medium text-dark-700',
                updatedRow?.type === 'UP' ? 'price-up-animate' : '',
                updatedRow?.type === 'DOWN' ? 'price-down-animate' : '',
              )}
            >
              {toPrice(
                fixFloatingNum(updatedRow?.lastPrice ?? stats.lastPrice, 2),
              )}
            </span>
            <span className="text-[10px] font-normal text-dark-500">
              {quoteAsset}
            </span>
          </div>
        ),
        desktopDailyChanges: renderChip(
          updatedRow?.dailyChanges
            ? Number(updatedRow?.dailyChanges)
            : stats['24h_ch'] || 0,
        ),
        turnover: (
          <span className="ml-2 text-[12px] text-dark-600 font-normal">
            {stats?.['24h_volume']
              ? toPrice(fixFloatingNum(stats?.['24h_volume'], 2))
              : '----'}
          </span>
        ),
        weeklyChanges: renderChip(stats['7d_change'] || 0),
        actions: (
          <div className="flex w-full justify-end gap-2 sm:w-auto">
            <Button
              onClick={async () =>
                await router.push(
                  isLogin
                    ? `/panel/advance-trade/${baseAsset}${quoteAsset}`
                    : `/advance-trade/${baseAsset}${quoteAsset}`,
                )
              }
            >
              {market.doTrade}
            </Button>
          </div>
        ),
      };
    });
  }, [data, updatedRows]);

  //EFFECTS
  useEffect(() => syncWithSocket(), [syncWithSocket]);

  return (
    <Card
      classNames={clsx(
        'max-h-[75vh] lg:max-h-fit shadow-none overflow-y-auto',
        router.pathname === '/' && '!h-fit !max-h-fit overflow-y-none',
      )}
      style={{ scrollbarWidth: 'thin' }}
    >
      <Table
        data={transformedData() || []}
        headerItems={headerItems}
        isLoading={isLoading}
        isFetching={isFetching}
      />
      {router.pathname.includes('advance-market') ? (
        <Pagination
          classNames="flex justify-center py-5"
          page={page}
          count={data?.pagination.total_pages || 1}
          onChange={(page) => {
            set_page(page);
          }}
        />
      ) : (
        <></>
      )}
    </Card>
  );
};

export default TableContent;

const [market] = getLang(['market']);

const headerItems: TableHeaderItem[] = [
  {
    title: market.market,
    name: 'market',
    width: 'w-[36%] lg:w-[20%]',
  },
  {
    title: market.lastPrice,
    name: 'desktopLastPrice',
    width: 'hidden lg:block lg:w-[18%] text-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: market['24hChanges'],
    name: 'desktopDailyChanges',
    width: 'hidden lg:flex lg:w-[18%] justify-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: market['24hVolume'],
    name: 'turnover',
    classNames: 'flex justify-end lg:justify-center',
    width: 'hidden lg:flex w-[18%] text-center',
    columnClassNames: 'flex justify-end lg:justify-center',
  },
  {
    title: market.weeklyChanges,
    name: 'weeklyChanges',
    classNames: 'flex justify-end lg:justify-center',
    width: 'hidden lg:flex lg:w-[18%] text-center',
    columnClassNames: 'flex justify-end lg:justify-center',
  },

  {
    title: '',
    name: 'actions',
    width: 'hidden lg:block lg:w-[16%]',
    columnClassNames: 'justify-start sm:justify-end mt-4 sm:mt-0 flex ',
  },
];
