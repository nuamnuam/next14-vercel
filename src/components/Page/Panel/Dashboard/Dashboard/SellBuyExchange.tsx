import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'classnames';

import RadioGroup from '@/components/RadioGroup';
import {
  Card,
  Icon,
  Chip,
  Button,
  ListLoader,
  EmptyTable,
  BoxDivider,
} from '@/components/Common';
import {
  useBreakpoint,
  useCoinIcon,
  useIntersectionObserver,
  useLang,
  useMarketData,
} from '@/hooks';
import { useCurrencies } from '@/requests/market/currenciesMutation';
import type { IAdvanceMarketpair } from '@/types/wallet';
import { toPersianDigits, toPrice, toStraightNumber } from '@/utils';
import { useModal } from '@/hooks/useModal';
import {
  SingleCoinContentModal,
  singleCoinDetailModalName,
} from '../../Market/components/SingleCoin';

const SellBuyExchange: React.FC = () => {
  const [panelDashboard] = useLang(['panelDashboard']);

  const { showModal } = useModal(singleCoinDetailModalName);

  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(
    undefined,
  );
  const [slug, setSlug] = useState<string | undefined>(undefined);

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [updatedItems, setUpdatedItems] = useState<
    Array<Record<string, IAdvanceMarketpair>>
  >([]);

  const [chartProperty, setChartProperty] = useState('fav_coins');
  const [rowChangeType, setRowChangeType] = useState<
    Array<'SAME' | 'UP' | 'DOWN'>
  >([]);
  const { isDesktop } = useBreakpoint();
  const getCoinIcon = useCoinIcon();
  const prevPageRef = useRef<Number | null>(null);
  const elementRef = useRef(null);

  const {
    data: pairs,
    isPending: isLoading,
    mutateAsync,
  } = useCurrencies(true);

  useEffect(() => {
    if (!pairs || isLoading) return;
    setUpdatedItems((prev) => [...prev, ...pairs?.result]);
  }, [pairs?.result?.length, isLoading]);

  const getCurrencies = useCallback(() => {
    if (!router.isReady) return;

    mutateAsync({
      page: prevPageRef.current === page ? 1 : page,
      per_page: isDesktop ? 10 : 6,
      favorite: chartProperty === 'fav_coins',
      sort_by: chartProperty === 'fav_coins' ? 'favorite' : 'is_trend',
      sort_type: 'DESC',
      provider_type: 'otc',
    });
  }, [page, chartProperty, router.isReady]);

  useEffect(() => getCurrencies(), [getCurrencies]);

  const { update } = useMarketData(
    updatedItems.map((item) => {
      const value = Object.values(item)?.[0].pair;
      return value;
    }),
  );
  const syncWithSocket = useCallback(() => {
    if (update.length) {
      const result = updatedItems ?? [];
      const updatedRows: Array<Record<string, IAdvanceMarketpair>> = [];
      const updatedIdx: number[] = [];
      const updatedIdxType: Array<'SAME' | 'UP' | 'DOWN'> = [];
      updatedItems.forEach((pair, idx) => {
        const symbol = Object.keys(pair)?.[0];
        const value = Object.values(pair)?.[0];
        update.forEach(({ key, o }) => {
          if (symbol === key) {
            updatedIdx.push(idx);
            if (o?.au && Number(o.au) > value.stats.lastPriceUsd) {
              updatedIdxType[idx] = 'UP';
            } else if (o?.au && Number(o.au) < value.stats.lastPriceUsd) {
              updatedIdxType[idx] = 'DOWN';
            }
            //@ts-ignore
            return updatedRows.push({
              [symbol]: {
                ...value,
                stats: {
                  ...value.stats,
                  '24h_ch': o?.[24],
                  lastPrice: o?.a ? Number(o.a) : 0,
                  lastPriceUsd: o?.au ? Number(o.au) : value.stats.lastPriceUsd,
                },
              },
            });
          } else {
            updatedIdxType[idx] = 'SAME';
          }
        });
      });

      updatedIdx.forEach((idx, index) => {
        result[idx] = updatedRows[index];
      });

      setUpdatedItems(result);
      setRowChangeType(updatedIdxType);
    }
  }, [update, updatedItems]);

  useEffect(() => syncWithSocket(), [syncWithSocket]);

  useIntersectionObserver(elementRef, () => {
    if (isLoading || !isDesktop) return;
    setPage((prev) => prev + 1);
  });

  useEffect(() => {
    setPage(1);
    setUpdatedItems([]);
  }, [chartProperty]);

  const handleCoinClick = async (asset: string, slug: string) => {
    setSelectedAsset(asset);
    setSlug(slug);
    showModal();
  };

  return (
    <>
      <Card classNames="">
        <div className="flex items-center justify-between p-4 px-8">
          <p className="text-dark-800">
            {panelDashboard.instantBuyingSellingConversion}
          </p>
          <div className="flex items-center justify-center gap-x-7">
            <RadioGroup
              switchTheme
              options={[
                {
                  key: 'fav_coins',
                  label: panelDashboard.myFavorites,
                  value: 'fav_coins',
                },
                {
                  key: 'market_coins',
                  label: panelDashboard.marketTrends,
                  value: 'market_coins',
                },
              ]}
              defaultSelected={chartProperty}
              onChange={setChartProperty}
              className={{ wrapper: 'hidden w-[263px] md:block' }}
            />
            <Button variant="text" className="!px-0">
              <Link href={'/panel/instant-market'}>
                {panelDashboard.allCoins}
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:mt-2 block md:px-9 px-4 md:hidden">
          <RadioGroup
            switchTheme
            options={[
              {
                key: 'fav_coins',
                label: panelDashboard.myFavorites,
                value: 'fav_coins',
              },
              {
                key: 'market_coins',
                label: panelDashboard.marketTrends,
                value: 'market_coins',
              },
            ]}
            defaultSelected={chartProperty}
            onChange={setChartProperty}
            className={{ wrapper: 'w-full' }}
          />
        </div>
        <BoxDivider className="hidden lg:block" />
        {!updatedItems?.length && !isLoading && (
          <div className="flex items-center justify-center w-full">
            <EmptyTable />
          </div>
        )}
        {!updatedItems?.length && isLoading && (
          <ListLoader className="!py-20" />
        )}
        {updatedItems?.length ? (
          <div
            className={clsx(
              'mt-6 lg:pt-8 flex-col px-4 lg:pb-10 lg:mt-0 lg:grid lg:grid-flow-col',
              chartProperty === 'fav_coins'
                ? 'overflow-x-auto'
                : 'overflow-x-hidden',
            )}
            style={{ gridAutoColumns: '17%' }}
          >
            {updatedItems?.map((item, index) => {
              const { faBaseAsset, stats, baseAsset, baseAssetSlug } =
                Object.values(item)?.[0];
              return !isDesktop ? (
                <div
                  key={index}
                  className="mb-4 cursor-pointer [&:not(:last-child)]:border-b-2 border-b-dark-50 md:pl-10 pb-4"
                  onClick={() => handleCoinClick(baseAsset, baseAssetSlug)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start gap-x-2">
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
                      <span className="text-sm font-medium text-dark-700">
                        {faBaseAsset}
                      </span>
                      <span className="text-dark-500 text-2xs inline-block">
                        {baseAsset}
                      </span>
                    </div>
                    <Chip
                      icon={
                        <Icon
                          icon={
                            stats['24h_ch'] > 0
                              ? 'ArrowTop-TwoTone'
                              : 'ArrowDown-TwoTone'
                          }
                          size={16}
                          className={
                            stats['24h_ch'] > 0
                              ? '[&>*]:fill-primary-600'
                              : '[&>*]:fill-danger-400'
                          }
                        />
                      }
                      label={
                        <span className="dir-ltr block">
                          ٪
                          {toPersianDigits(
                            toStraightNumber(
                              Number(stats['24h_ch']).toFixed(2),
                            ),
                          )}
                        </span>
                      }
                      variant={stats['24h_ch'] > 0 ? 'success' : 'danger'}
                      classNames="flex-row-reverse gap-x-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="mt-[10px] text-xs font-medium text-dark-700 flex items-center gap-1 flex-row-reverse">
                      {toPrice(stats.lastPrice)}{' '}
                      <span className="text-dark-400 font-normal">IRT </span>
                    </p>
                    <p className="w-max mt-2 text-xs font-medium text-dark-700 flex items-center gap-1 flex-row-reverse">
                      {toPrice(stats.lastPriceUsd)}{' '}
                      <span className="text-dark-400 font-normal">USDT </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={async () =>
                    await router.push(
                      `/panel/instant-trade/buy?asset=${baseAsset}`,
                    )
                  }
                  className="flex cursor-pointer flex-col items-center justify-start w-40"
                >
                  <img
                    src={getCoinIcon(baseAsset)}
                    alt={baseAsset}
                    width={isDesktop ? 32 : 24}
                    onError={(e) => {
                      //@ts-ignore
                      e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                    }}
                  />
                  <p className="mt-1 text-sm leading-6 font-medium text-dark-700 text-center whitespace-pre">
                    {faBaseAsset}
                  </p>
                  <p className="my-1 text-2xs text-dark-500">{baseAsset}</p>
                  <Chip
                    icon={
                      <Icon
                        icon={
                          stats['24h_ch'] > 0
                            ? 'ArrowTop-TwoTone'
                            : 'ArrowDown-TwoTone'
                        }
                        size={16}
                        className={
                          stats['24h_ch'] > 0
                            ? '[&>*]:fill-primary-600'
                            : '[&>*]:fill-danger-400'
                        }
                      />
                    }
                    label={
                      <span className="dir-ltr block">
                        ٪
                        {toPersianDigits(
                          toStraightNumber(Number(stats['24h_ch']).toFixed(2)),
                        )}
                      </span>
                    }
                    variant={stats['24h_ch'] > 0 ? 'success' : 'danger'}
                    classNames="flex-row-reverse gap-x-2"
                  />
                  <p className="mt-4 mb-2 text-xs font-medium text-dark-700 whitespace-pre">
                    {toPrice(stats.lastPriceUsd)}{' '}
                    <span className="text-dark-400">USDT</span>
                  </p>
                  <p className="w-max text-xs font-medium text-dark-700 whitespace-pre">
                    {toPrice(stats.lastPrice)}{' '}
                    <span className="text-dark-400">IRT</span>
                  </p>
                </div>
              );
            })}
            {!isDesktop && isLoading && <ListLoader className="pb-6 !pt-2" />}
            {!isDesktop &&
              chartProperty !== 'market_coins' &&
              pairs?.pagination?.total_pages &&
              pairs.pagination.total_pages > page && (
                <div className="pb-4">
                  <div
                    className="flex gap-2 items-center justify-center cursor-pointer"
                    onClick={() => setPage((prev) => ++prev)}
                  >
                    <span className="ml-2 text-sm font-medium text-dark-400">
                      {panelDashboard.showMore}
                    </span>
                    <Icon
                      icon="ArrowLeft-TwoTone"
                      size={24}
                      className="[&>*]:fill-dark-400"
                    />
                  </div>
                </div>
              )}
            {pairs?.pagination?.total_pages != page && isDesktop && (
              <ListLoader ref={elementRef} />
            )}
          </div>
        ) : null}
      </Card>
      {selectedAsset && slug ? (
        <SingleCoinContentModal asset={selectedAsset} slug={slug} />
      ) : (
        <></>
      )}
    </>
  );
};

export default SellBuyExchange;
