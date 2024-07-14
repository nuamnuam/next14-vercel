import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import clsx from 'classnames';

import { Table, Card, ListLoader } from '@/components';
import { fixFloatingNum, getLang, toPrice } from '@/utils';
import { useCoinIcon, useAdvanceMarketData } from '@/hooks';
import { useInfinitePairsQuery } from '@/requests/advance-market/pairsQuery';
import { authStore, useAdvanceMarketStore } from '@/store';
import useInfiniteScroll from '@/hooks/useInfinitescroll';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useModal } from '@/hooks/useModal';
import PairDetailModal, {
  pairDetailModalName,
} from '@/components/Page/Panel/Market/components/PairDetailModal';

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

const [market] = getLang(['market']);

const TableContent = ({ pairsCoin }: Props) => {
  const { token } = authStore();
  const isLogin = !!token;
  const router = useRouter();
  const { showModal } = useModal(pairDetailModalName);

  const { search } = useAdvanceMarketStore();
  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } =
    useInfinitePairsQuery({
      search,
      base_asset: pairsCoin,
    });

  const [pair, setPair] = useState<
    { baseAsset: string; quoteAsset: string; slug: string } | undefined
  >(undefined);
  const [updatedRows, setUpdatedRows] = useState<UpdatedRow[]>([]);

  const getCoinIcon = useCoinIcon();

  const { update } = useAdvanceMarketData(
    data?.pages
      ?.map((pair) => {
        return pair?.result.map((item) => {
          const value = Object.values(item)?.[0].pair;
          return value;
        });
      })
      .flat(1),
  );

  const { ref, page } = useInfiniteScroll(
    !router.pathname.includes('advance-market')
      ? 1
      : data?.pages?.[0].pagination.total_pages || 1,
  );

  const syncWithSocket = useCallback(() => {
    if (update.length && data) {
      let rows: UpdatedRow[] = updatedRows;
      data.pages.map((pair) => {
        pair.result.forEach((pair) => {
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
      });
      setUpdatedRows(rows);
    }
  }, [update]);

  const handleOnRowClick = (
    baseAsset: string,
    quoteAsset: string,
    slug: string,
  ) => {
    if (router.pathname !== '/') {
      setPair({ baseAsset, quoteAsset, slug });
      return showModal();
    }
    return router.push(
      isLogin
        ? `/panel/advance-trade/${baseAsset}${quoteAsset}`
        : `/advance-trade/${baseAsset}${quoteAsset}`,
    );
  };

  const transformedData = useCallback(() => {
    if (!data?.pages.length) return [];

    return data.pages
      ?.map((pair) => {
        return pair.result.map((item) => {
          const { faName, stats, baseAsset, quoteAsset, pair, baseAssetSlug } =
            Object.values(item)?.[0];

          const updatedRow = updatedRows.find((item) => item.pair === pair);

          return {
            market: (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  handleOnRowClick(baseAsset, quoteAsset, baseAssetSlug)
                }
              >
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
                  <span className="text-xs text-dark-500">{faName}</span>
                </div>
              </div>
            ),
            responsiveLastPrice: (
              <div
                onClick={() =>
                  handleOnRowClick(baseAsset, quoteAsset, baseAssetSlug)
                }
                className="flex items-center justify-center"
              >
                <span
                  className={clsx(
                    'ml-2 text-sm font-medium text-dark-600 lg:font-bold',
                    updatedRow?.type === 'UP' ? 'price-up-animate' : '',
                    updatedRow?.type === 'DOWN' ? 'price-down-animate' : '',
                  )}
                >
                  {toPrice(
                    fixFloatingNum(updatedRow?.lastPrice ?? stats.lastPrice, 2),
                  )}
                </span>
                <span className="text-[10px] text-dark-500">{quoteAsset}</span>
              </div>
            ),
            responsiveDailyChanges: renderChip(
              updatedRow?.dailyChanges
                ? Number(updatedRow?.dailyChanges)
                : stats['24h_ch'] || 0,
              false,
              () => handleOnRowClick(baseAsset, quoteAsset, baseAssetSlug),
              2,
            ),
          };
        });
      })
      .flat(1);
  }, [data, updatedRows]);

  //EFFECTS
  useEffect(() => syncWithSocket(), [syncWithSocket]);
  useEffect(() => {
    if (hasNextPage && router.pathname !== '/') fetchNextPage();
  }, [page]);

  return (
    <>
      <Card
        classNames={clsx(
          'max-h-max lg:max-h-[25rem] overflow-y-auto mb-4 shadow-none border-none',
          router.pathname === '/' && '!h-fit !max-h-fit overflow-y-none',
        )}
        style={{ scrollbarWidth: 'thin' }}
      >
        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          showHeader={!!pairsCoin}
          isInitialLoad={isFetching || isLoading}
        />
        {(hasNextPage || isFetching) &&
          router.pathname.includes('advance-market') && (
            <div className="py-6">
              <ListLoader ref={ref} />
            </div>
          )}
      </Card>
      {pair?.baseAsset && pair.quoteAsset ? (
        <PairDetailModal
          baseAsset={pair.baseAsset}
          quoteAsset={pair.quoteAsset}
          slug={pair.slug}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TableContent;

const headerItems: TableHeaderItem[] = [
  {
    title: market.market,
    name: 'market',
    width: 'w-[42%] lg:w-[20%]',
    columnClassNames: 'flex justify-start',
  },
  {
    title: market.price,
    name: 'responsiveLastPrice',
    width: 'flex w-[30%] justify-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: market['24hChanges'],
    name: 'responsiveDailyChanges',
    width: 'flex w-[28%] justify-end',
    columnClassNames: 'flex justify-end',
  },
];
