import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import clsx from 'classnames';

import {
  useBalancesData,
  useBreakpoint,
  useCoinIcon,
  useLang,
  useNotifications,
  usePairDetail,
} from '@/hooks';
import {
  DoubleText,
  Icon,
  IconButton,
  ResponsivePageHeader,
} from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { usePairsQuery } from '@/requests/advance-market/pairsQuery';
import { useBalanceQuery } from '@/requests/wallet/balanceQuery';
import { authStore, useAdvanceTradeStore } from '@/store';
import { toPrice } from '@/utils';
import { useBalances } from '@/requests/panel/wallet/getBalances';

import {
  PairDetail,
  Market,
  RecentTrades,
  Charts,
  Form,
  OrderBook,
  PairsModal,
} from '..';
import { advancedMarketPairsModalName } from '../PairsModal';
import OpenOrdersContent from '../../../Wallet/OpenOrders/components/OpenOrdersContent';
import ExtraModal, { advancedTradeExtraModalName } from '../ExtraModal';

const AdvanceTradeContent: React.FC = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  useNotifications();
  useBalancesData();
  useBalances({ q: 'IRT' });

  const router = useRouter();

  const { token } = authStore();
  const isLogin = !!token;

  const {
    set_quoteAsset,
    set_baseAsset,
    set_pair,
    set_assetBalance,
    set_quoteBalance,
  } = useAdvanceTradeStore();

  const getCoinIcon = useCoinIcon();
  const { isDesktop } = useBreakpoint();
  const isPanelAdvancedTrade = router.pathname.startsWith('/panel');

  useEffect(() => {
    if (router.isReady && !router.query.pair) {
      if (isPanelAdvancedTrade) router.replace('/panel/advance-trade/USDTIRT');
      else {
        router.replace('/advance-trade/USDTIRT');
      }
    }
  }, [router.query]);

  const { data, isLoading } = usePairsQuery(
    1,
    1,
    router.query.pair as string,
    router.isReady,
  );

  const { reset, update } = usePairDetail(router.query.pair as string);

  const pair = useMemo(() => {
    if (data?.code === 200 && !data.result.length && router.isReady) {
      router.push('USDTIRT');
    }
    if (data?.result?.[0]) return Object.values(data?.result?.[0])?.[0];
  }, [data]);

  const { data: quoteBalance } = useBalanceQuery(
    pair?.quoteAsset!,
    router.isReady && isLogin,
  );
  const { data: assetBalance } = useBalanceQuery(
    pair?.baseAsset!,
    router.isReady && isLogin,
  );

  useEffect(() => {
    if (pair) {
      reset();
      set_quoteAsset(pair.quoteAsset);
      set_baseAsset(pair.baseAsset);
      set_pair(pair);
      document.title = `${advancedTrade.trade} ${pair.faBaseAsset} ${
        advancedTrade.inBaseMarket
      } ${pair.faQuoteAsset} | ${toPrice(update?.l || pair.stats.lastPrice)}`;
    }
    return () => {
      document.title = advancedTrade.title;
    };
  }, [pair]);

  useEffect(() => {
    if (quoteBalance?.result?.[0]) {
      set_quoteBalance(quoteBalance?.result?.[0]);
    } else {
      set_quoteBalance(undefined);
    }
    if (assetBalance?.result?.[0]) {
      set_assetBalance(assetBalance?.result?.[0]);
    } else {
      set_assetBalance(undefined);
    }
  }, [quoteBalance, assetBalance]);

  const { showSyncModal } = useModal(advancedMarketPairsModalName);
  const { showModal: showExtraModal } = useModal(advancedTradeExtraModalName);

  return (
    <>
      {isPanelAdvancedTrade && (
        <ResponsivePageHeader
          title={advancedTrade.advancedTrade}
          onBack={() => router.back()}
          extra={
            <div className="flex gap-4">
              {isLogin ? (
                <IconButton
                  icon={<Icon icon="History-OutLined" size={20} className="" />}
                  size="lg"
                  className="border-dark-200"
                  onClick={async () => await router.push('/panel/open-orders')}
                />
              ) : (
                <></>
              )}
              <IconButton
                icon={
                  <Icon icon="VolumeChart-OutLined" size={20} className="" />
                }
                size="lg"
                className="border-dark-200"
                onClick={showExtraModal}
              />
            </div>
          }
          classNames="!mb-0"
        />
      )}
      <div className="sm:px-8 lg:p-0">
        <div
          className={clsx(
            'flex flex-col lg:gap-6',
            !isPanelAdvancedTrade && !isDesktop && 'border-t border-dark-100',
            !isPanelAdvancedTrade && isDesktop && 'container',
          )}
        >
          {isDesktop && <PairDetail pair={pair} isLoading={isLoading} />}
          <div className="bg-white lg:bg-transparent rounded-lg gap-6 pb-4 lg:pb-0">
            <div className="px-4 pt-4 sm:px-10 block lg:hidden">
              <div
                className="border border-dark-100 rounded-lg flex items-center justify-between h-12 px-3"
                onClick={() => showSyncModal()}
              >
                <div className="flex items-center">
                  <div>
                    <Image
                      src={getCoinIcon(pair?.quoteAsset || 'IRT')}
                      width={20}
                      height={20}
                      alt={pair?.quoteAsset || 'IRT'}
                      onError={(e) => {
                        //@ts-ignore
                        e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                      }}
                    />
                  </div>
                  <div className="-mr-2 ml-2">
                    <Image
                      src={getCoinIcon(pair?.baseAsset || 'USDT')}
                      width={20}
                      height={20}
                      alt={pair?.baseAsset || 'USDT'}
                      onError={(e) => {
                        //@ts-ignore
                        e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                      }}
                    />
                  </div>
                  <DoubleText
                    firstText={pair?.baseAsset || 'USDT'}
                    secondText={pair?.quoteAsset || 'IRT'}
                    size="sm"
                  />
                </div>
                <Icon
                  icon="Down-OutLined"
                  size={14}
                  className="text-dark-200 transition duration-300"
                />
              </div>
            </div>
            <div className="flex gap-6 pt-4 pb-0 px-4 sm:px-10 sm:py-8 lg:p-0">
              {isDesktop && (
                <div
                  className={clsx('flex flex-col gap-6 w-1/4', {
                    'opacity-50': isLoading || !pair,
                  })}
                >
                  <Market />
                  <RecentTrades />
                </div>
              )}

              <div
                className={clsx(
                  'flex flex-col gap-6 w-[55%]',
                  isLoading ? 'opacity-50 cursor-wait' : '',
                )}
              >
                {isDesktop && <Charts />}
                <Form />
              </div>

              <div
                className={clsx('flex flex-col gap-6 w-[45%] lg:w-1/4', {
                  'opacity-50': isLoading || !pair,
                })}
              >
                <OrderBook />
              </div>
            </div>
          </div>
          <OpenOrdersContent hasLoadMore wrapperClassname="p-0" />
        </div>
        <PairsModal />
        <ExtraModal />
      </div>
    </>
  );
};

export default AdvanceTradeContent;
