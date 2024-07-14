import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'classnames';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { toPrice, removeExpo, getLang } from '@/utils';
import { Button, Card, Table } from '@/components';
import { useCurrencyQuery } from '@/requests/market/currenciesMutation';
import { useBreakpoint, useCoinIcon, useLang } from '@/hooks';
import type { IPairResult } from '@/hooks/useMarketData';
import type { TableHeaderItem } from '@/components/TableLayout/types';
import { useModal } from '@/hooks/useModal';
import { authStore } from '@/store';
import {
  SingleCoinContentModal,
  singleCoinDetailModalName,
} from '@/components/Page/Panel/Market/components/SingleCoin/components';
import { renderChip } from '@/components/Page/Market/CoinsTable/Market';

import type { HomeProps } from '../../types';

type UpdatedRow = {
  pair: string;
  type?: 'SAME' | 'UP' | 'DOWN';
  dailyChanges?: string;
  lastPrice?: number;
  lastPriceUsd?: number;
};

type Props = {
  updatePairs: (inputs: string[]) => void;
  update: IPairResult[];
} & Pick<HomeProps, 'currencies'>;

const [instantMarket] = getLang(['instantMarket']);

const InstantMarketTable: React.FC<Props> = ({
  updatePairs,
  update,
  currencies,
}) => {
  const [global, instantMarket] = useLang(['global', 'instantMarket']);

  const { token } = authStore();
  const router = useRouter();

  const isLogin = !!token;

  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(
    undefined,
  );
  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [updatedRows, setUpdatedRows] = useState<UpdatedRow[]>([]);

  const { showModal } = useModal(singleCoinDetailModalName);

  const getCoinIcon = useCoinIcon();

  const { isDesktop } = useBreakpoint();

  const { data, isLoading, isFetching } = useCurrencyQuery({
    per_page: 10,
    page: 1,
  });

  useEffect(() => {
    if (data && data.result.length) {
      updatePairs(
        data?.result.map((item) => {
          const value = Object.values(item)?.[0].pair;
          return value;
        }),
      );
    }
  }, [data?.result]);

  const syncWithSocket = useCallback(() => {
    if (update.length && data) {
      let rows: UpdatedRow[] = updatedRows;
      data.result.forEach((pair) => {
        const symbol = Object.keys(pair)?.[0];
        const value = Object.values(pair)?.[0];
        const row: UpdatedRow = {
          pair: symbol,
        };
        update.forEach(({ key, o }) => {
          if (symbol === key) {
            if (Number(o?.au) > value.stats.lastPriceUsd) {
              row.type = 'UP';
            } else if (Number(o.au) < value.stats.lastPriceUsd) {
              row.type = 'DOWN';
            } else {
              row.type = 'SAME';
            }
            //@ts-ignore
            row.dailyChanges = o?.[24] ? o?.[24] : value.stats['24h_ch'];
            row.lastPrice = o.a ? Number(o.a) : value.stats.lastPrice;
            row.lastPriceUsd = o.au ? Number(o.au) : value.stats.lastPriceUsd;
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

  useEffect(() => syncWithSocket(), [syncWithSocket]);

  const handleCoinClick = (asset: string, slug: string) => {
    if (!isDesktop && isLogin) {
      setSelectedAsset(asset);
      setSlug(slug);
      showModal();
    }
  };

  const transformedData = useCallback(() => {
    if (!data?.result.length) return [];

    return data.result.map((item) => {
      const { faBaseAsset, stats, baseAsset, pair, baseAssetSlug } =
        Object.values(item)?.[0];

      const updatedRow = updatedRows.find((item) => item.pair === pair);

      return {
        coin: (
          <a
            href={
              !isLogin || isDesktop
                ? `/${baseAssetSlug.toLowerCase()}`
                : undefined
            }
            className="flex items-center gap-2"
            onClick={() => handleCoinClick(baseAsset, baseAssetSlug)}
          >
            <div className="w-6 lg:block flex flex-col">
              <Image
                src={getCoinIcon(baseAsset)}
                height={24}
                width={24}
                alt={baseAsset}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            </div>
            <div className="flex flex-col items-start lg:hidden">
              <div>
                <span className="text-sm font-medium text-dark-700">
                  {baseAsset}
                </span>
              </div>
              <div>
                <span className="text-xs text-dark-500 font-normal">
                  {faBaseAsset}
                </span>
              </div>
            </div>
            <div className="hidden lg:flex lg:flex-col justify-center items-start">
              <div className="flex">
                <span className="text-sm font-medium text-dark-700">
                  {baseAsset}
                </span>
              </div>
              <div className="flex">
                <span className="text-xs text-dark-500 font-normal">
                  {faBaseAsset}
                </span>
              </div>
            </div>
          </a>
        ),
        lastPrice: (
          <div className="flex flex-col items-end">
            <div className="flex items-center justify-center">
              <span
                className={clsx('ml-2 text-sm font-normal text-dark-600', {
                  'price-up-animate': updatedRow?.type === 'UP',
                  'price-down-animate': updatedRow?.type === 'DOWN',
                })}
              >
                {toPrice(
                  removeExpo(updatedRow?.lastPriceUsd || stats.lastPriceUsd),
                )}
              </span>
              <span className="text-[10px] text-dark-500">
                {instantMarket.usdt}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span
                className={clsx('ml-2 text-sm font-normal text-dark-600', {
                  'price-up-animate': updatedRow?.type === 'UP',
                  'price-down-animate': updatedRow?.type === 'DOWN',
                })}
              >
                {toPrice(removeExpo(updatedRow?.lastPrice || stats.lastPrice))}
              </span>
              <span className="text-[10px] text-dark-500">IRT</span>
            </div>
          </div>
        ),
        price: (
          <div className="flex items-center justify-center gap-2">
            <span
              className={clsx('text-sm font-medium text-dark-700', {
                'price-up-animate': updatedRow?.type === 'UP',
                'price-down-animate': updatedRow?.type === 'DOWN',
              })}
            >
              {toPrice(removeExpo(updatedRow?.lastPrice || stats.lastPrice))}
            </span>
            <span className="text-[10px] font-normal text-dark-500">
              {global.toman}
            </span>
          </div>
        ),
        dollarPrice: (
          <div className="flex items-center justify-center gap-2">
            <span
              className={clsx('text-sm font-medium text-dark-700', {
                'price-up-animate': updatedRow?.type === 'UP',
                'price-down-animate': updatedRow?.type === 'DOWN',
              })}
            >
              {toPrice(
                removeExpo(updatedRow?.lastPriceUsd || stats.lastPriceUsd),
              )}
            </span>
            <span className="text-[10px] font-normal text-dark-500">
              {global.dollar}
            </span>
          </div>
        ),
        responsiveDailyChanges: renderChip(
          Number(updatedRow?.dailyChanges) || stats['24h_ch'] || 0,
          false,
        ),
        desktopDailyChanges: renderChip(
          Number(updatedRow?.dailyChanges) || stats['24h_ch'] || 0,
          false,
        ),
        responsiveActions: null,
        desktopActions: (
          <div className="flex w-full justify-end gap-2 sm:w-auto">
            <Link href={`/panel/instant-trade/buy?asset=${baseAsset}`}>
              <Button>
                <span className="text-sm font-medium">
                  {instantMarket.buySell}
                </span>
              </Button>
            </Link>
            <Link href={`/panel/instant-trade/convert?asset=${baseAsset}`}>
              <Button variant="dark">
                <span className="text-sm font-medium">
                  {instantMarket.convert}
                </span>
              </Button>
            </Link>
          </div>
        ),
      };
    });
  }, [data, updatedRows]);

  return (
    <>
      <Card
        classNames={clsx(
          'max-h-[75vh] lg:max-h-[45rem] overflow-y-auto mb-4 shadow-none rounded-none border-none',
          router.pathname === '/' && '!h-fit !max-h-fit overflow-y-none',
        )}
        style={{ scrollbarWidth: 'thin' }}
      >
        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          headerExtraClassname={clsx('lg:!pr-2')}
          isInitialLoad={isFetching || isLoading}
          showHeader={isDesktop}
          bodyExtraClassname="px-2 py-4 lg:p-4 border-b border-dark-200"
        />
      </Card>
      {selectedAsset && slug ? (
        <SingleCoinContentModal asset={selectedAsset} slug={slug} />
      ) : (
        <></>
      )}
    </>
  );
};

export default InstantMarketTable;

const headerItems: TableHeaderItem[] = [
  {
    title: instantMarket.crypto,
    name: 'coin',
    width: 'w-5/12 lg:w-2/12 text-center',
    classNames: '!pr-0',
    columnClassNames: clsx('flex justify-start text-start lg:px-8'),
  },
  {
    title: instantMarket.lastPrice,
    name: 'lastPrice',
    width: 'block lg:hidden w-4/12 text-center',
    columnClassNames: 'flex justify-end pl-4 lg:pl-0',
  },
  {
    title: instantMarket.priceInToman,
    name: 'price',
    width: 'hidden lg:block w-3/12 text-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: instantMarket.priceInDollar,
    name: 'dollarPrice',
    width: 'hidden lg:block w-2/12 text-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: instantMarket['24h'],
    name: 'responsiveDailyChanges',
    classNames: 'flex justify-center lg:justify-center',
    width: 'block lg:hidden w-3/12 lg:w-2/12 text-center',
    columnClassNames: 'flex justify-end lg:justify-center',
  },
  {
    title: instantMarket['24hChanges'],
    name: 'desktopDailyChanges',
    classNames: 'hidden lg:flex justify-center text-center',
    width: 'w-2/12',
    columnClassNames: 'hidden lg:flex justify-center',
  },
  {
    title: '',
    name: 'responsiveActions',
    width: 'hidden w-3/12',
    columnClassNames:
      'flex lg:hidden justify-start sm:justify-end mt-4 sm:mt-0 flex ',
  },
  {
    title: '',
    name: 'desktopActions',
    width: 'hidden lg:block w-3/12',
    columnClassNames: 'justify-start sm:justify-end mt-4 sm:mt-0 flex text-end',
  },
];
