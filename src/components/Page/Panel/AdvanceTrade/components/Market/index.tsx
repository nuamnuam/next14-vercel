import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import clsx from 'classnames';

import { Table, FormInput, Icon } from '@/components';
import { fixFloatingNum, getLang, toPrice } from '@/utils';
import { useInfinitePairsQuery } from '@/requests/advance-market/pairsQuery';
import { renderChip } from '@/components/Page/Market/CoinsTable/Market';
import {
  useAdvanceMarketData,
  useBreakpoint,
  useCoinIcon,
  useDebounceValue,
  useInfinitescroll,
  useLang,
} from '@/hooks';
import type { TableHeaderItem } from '@/components/TableLayout/types';

type UpdatedRow = {
  pair: string;
  type?: 'SAME' | 'UP' | 'DOWN';
  dailyChanges?: string;
  lastPrice?: number;
};

type Props = {
  closeModal?: () => void;
};

const [advancedTrade] = getLang(['advancedTrade']);

const Market: FC<Props> = ({ closeModal }) => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const router = useRouter();

  const [search, setSearch] = useState<string>('');

  const debouncedSearch = useDebounceValue(search, 500);

  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } =
    useInfinitePairsQuery({ search: debouncedSearch });

  const [updatedRows, setUpdatedRows] = useState<UpdatedRow[]>([]);

  const getCoinIcon = useCoinIcon();
  const { isDesktop } = useBreakpoint();

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

  const { ref, page } = useInfinitescroll(
    data?.pages?.[0].pagination.total_pages || 1,
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

  const handleRowClick = async (baseAsset: string, quoteAsset: string) => {
    closeModal?.();
    if (router.pathname.includes('panel')) {
      if (isDesktop)
        return await router.push(
          `/panel/advance-trade/${baseAsset}${quoteAsset}`,
        );
      return await router.push(
        `/panel/advance-trade/${baseAsset}${quoteAsset}`,
      );
    }
    if (isDesktop)
      return await router.push(`/advance-trade/${baseAsset}${quoteAsset}`);
    return await router.push(`/advance-trade/${baseAsset}${quoteAsset}`);
  };

  const transformedData = useCallback(() => {
    if (!data?.pages.length) return [];

    return data.pages
      ?.map((pair) => {
        return pair.result.map((item) => {
          const { stats, baseAsset, quoteAsset, faName, pair } =
            Object.values(item)?.[0];
          const updatedRow = updatedRows.find((item) => item.pair === pair);
          return {
            market: (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div>
                    <Image
                      src={getCoinIcon(quoteAsset)}
                      width={18}
                      height={18}
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
                      width={18}
                      height={18}
                      alt={baseAsset}
                      onError={(e) => {
                        //@ts-ignore
                        e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className={'text-xs font-medium text-dark-700'}>
                    {baseAsset}
                    <span className={'text-dark-300'}>/{quoteAsset}</span>
                  </span>
                  {!isDesktop ? (
                    <span className="text-xs font-medium text-dark-500">
                      {faName}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ),
            responsiveLastPrice: (
              <div className="flex items-center justify-center">
                <span
                  className={clsx(
                    'ml-2 text-xs font-normal text-dark-600',
                    !isDesktop ? '!text-sm' : '',
                    updatedRow?.type === 'UP' ? 'price-up-animate' : '',
                    updatedRow?.type === 'DOWN' ? 'price-down-animate' : '',
                  )}
                >
                  {toPrice(
                    fixFloatingNum(updatedRow?.lastPrice ?? stats.lastPrice, 2),
                  )}
                </span>
              </div>
            ),
            responsiveDailyChanges: renderChip(
              updatedRow?.dailyChanges
                ? Number(updatedRow?.dailyChanges)
                : stats['24h_ch'] || 0,
              false,
            ),
            onRowClick: async () => await handleRowClick(baseAsset, quoteAsset),
          };
        });
      })
      .flat(1);
  }, [data, updatedRows]);

  useEffect(() => syncWithSocket(), [syncWithSocket]);
  useEffect(() => {
    if (hasNextPage) fetchNextPage();
  }, [page]);

  return (
    <div className="bg-white rounded-lg">
      <div className={clsx('px-6 py-2', !isDesktop ? '!px-0' : '')}>
        <FormInput
          placeholder={advancedTrade.search}
          hasClear
          value={search}
          onChange={(value) => setSearch(value)}
          defaultValue={''}
          size="sm"
          fullWidth
          rightIcon={
            <Icon icon="Search-OutLined" size={16} className="text-dark-600" />
          }
        />
      </div>
      <div>
        <div
          className="h-[410px] overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          <Table
            data={transformedData() || []}
            headerItems={headerItems}
            isLoading={isLoading}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            ref={ref}
            headerExtraClassname={clsx(
              'bg-white text-sm font-normal !text-dark-100 border-b-2 border-dark-50 lg:bg-dark-50 lg:border-none',
              '!px-0 !pl-2',
              !isDesktop ? '!px-6' : '!px-0',
            )}
            bodyExtraClassname="!px-4 !py-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Market;

const headerItems: TableHeaderItem[] = [
  {
    title: advancedTrade.market,
    name: 'market',
    width:
      'flex w-[36%] md:w-[38%] justify-center md:justify-start lg:justify-center ',
    columnClassNames: 'flex !justify-start',
    classNames:
      '!text-dark-200 !text-sm !font-normal lg:!text-dark-600 lg:!text-xs',
  },
  {
    title: advancedTrade.price,
    name: 'responsiveLastPrice',
    width: 'flex w-[36%] md:w-[34%] justify-center',
    columnClassNames: 'flex justify-center',
    classNames:
      '!text-dark-200 !text-sm !font-normal lg:!text-dark-600 lg:!text-xs',
  },
  {
    title: advancedTrade['24h'],
    name: 'responsiveDailyChanges',
    width: 'flex w-[28%] md:w-[28%] justify-center',
    columnClassNames: 'flex justify-end',
    classNames:
      '!text-dark-200 !text-sm !font-normal lg:!text-dark-600 lg:!text-xs',
  },
];
