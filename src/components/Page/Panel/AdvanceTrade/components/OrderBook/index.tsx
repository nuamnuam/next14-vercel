import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'classnames';

import { EmptyTable, Icon, Spinner } from '@/components';
import { colors } from '@/designTokens';
import { useBreakpoint, useLang, useOrderBook, usePairDetail } from '@/hooks';
import {
  useAdvanceTradeStore,
  useSubmitBuyP2POrderStore,
  useSubmitSellP2POrderStore,
} from '@/store';
import { useOrderBookQuery } from '@/requests/advance-trade/orderBookQuery';
import { toPrice } from '@/utils';

import PercentBar from './PercentBar';
import { IAskBid } from '../../types';

const OrderBook = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const [currentChart, setCurrentChart] = useState<'BOTH' | 'ASKS' | 'BIDS'>(
    'BOTH',
  );
  const [asks, setAsks] = useState<IAskBid[]>([]);
  const [bids, setBids] = useState<IAskBid[]>([]);

  const { isDesktop } = useBreakpoint();

  const { baseAsset, quoteAsset, pair, set_buyPrice, set_sellPrice } =
    useAdvanceTradeStore();
  const buyStore = useSubmitBuyP2POrderStore();
  const sellStore = useSubmitSellP2POrderStore();

  const { data, isLoading } = useOrderBookQuery(`${baseAsset}${quoteAsset}`);

  const { update } = usePairDetail(`${baseAsset}${quoteAsset}`);
  const { update: orderBookUpdate } = useOrderBook(`${baseAsset}${quoteAsset}`);

  const transformedAsksData = useCallback(() => {
    let totalQty: number = 0;
    let result = [];

    const originDataLength = data?.result?.asks.length;
    if (originDataLength) {
      set_buyPrice(data?.result?.asks?.[0][0]);
    } else {
      set_buyPrice(pair?.stats.lastPrice || 0);
    }

    const source = orderBookUpdate?.a.length
      ? orderBookUpdate?.a
      : data?.result?.asks;

    source?.forEach((ask) => {
      totalQty += Number(ask?.[1]);
    });

    result =
      source?.map((ask) => {
        return {
          baseAssetPrice: ask?.[0] || 0,
          qouteAssetQty: ask?.[1] || 0,
          total: Math.ceil(ask?.[0] * ask?.[1]),
          fillPercent: (ask?.[1] / totalQty) * 100,
        };
      }) || [];

    setAsks(
      isDesktop
        ? result.splice(0, currentChart !== 'BOTH' ? 30 : 16).reverse()
        : result.splice(0, currentChart !== 'BOTH' ? 12 : 6).reverse(),
    );
  }, [data, orderBookUpdate, currentChart]);

  const transformedBidsData = useCallback(() => {
    let totalQty: number = 0;
    let result = [];

    const originDataLength = data?.result?.bids.length;
    if (originDataLength) {
      set_sellPrice(data?.result?.bids?.[0][0]);
    } else {
      set_sellPrice(pair?.stats.lastPrice || 0);
    }

    const source = orderBookUpdate?.b.length
      ? orderBookUpdate?.b
      : data?.result?.bids;

    source?.forEach((bid) => {
      totalQty += Number(bid?.[1]);
    });

    result =
      source?.map((bid) => {
        return {
          baseAssetPrice: bid?.[0] || 0,
          qouteAssetQty: bid?.[1] || 0,
          total: Math.ceil(bid?.[0] * bid?.[1]),
          fillPercent: (bid?.[1] / totalQty) * 100,
        };
      }) || [];

    setBids(
      isDesktop
        ? result.splice(0, currentChart !== 'BOTH' ? 30 : 15)
        : result.splice(0, currentChart !== 'BOTH' ? 12 : 6),
    );
  }, [data, orderBookUpdate]);

  useEffect(() => {
    transformedAsksData();
    transformedBidsData();
  }, [transformedAsksData, transformedBidsData]);

  const handleOnRowClick = (price: number, side: 'ASK' | 'BID') => {
    if (side === 'ASK') return buyStore.set_price(price);
    return sellStore.set_price(price);
  };

  const orders_side =
    Math.floor(Number(data?.result?.market_buy_percent)) > 50 ? 'BUY' : 'SELL';

  return (
    <div className="bg-white rounded-lg">
      <div className="text-dark-800 px-2 pb-2 lg:p-4 flex items-center justify-between">
        {isDesktop && (
          <PercentBar
            buyPercent={
              Math.floor(Number(data?.result?.market_buy_percent)) || 0
            }
          />
        )}
        <div className="flex gap-4 md:gap-1 mr-auto">
          <span className="p-1">
            <Icon
              onClick={() => setCurrentChart('BIDS')}
              icon="BuyOrders-OutLined"
              size={20}
              className={clsx(
                'text-dark-100 cursor-pointer hover:text-dark-300',
                currentChart === 'BIDS'
                  ? '[&>*:nth-child(1)]:text-primary-500'
                  : '',
              )}
            />
          </span>
          <span className="p-1">
            <Icon
              onClick={() => setCurrentChart('ASKS')}
              icon="SellOrders-OutLined"
              size={20}
              className={clsx(
                'text-dark-100 cursor-pointer hover:text-dark-300',
                currentChart === 'ASKS'
                  ? '[&>*:nth-child(1)]:text-danger-500'
                  : '',
              )}
            />
          </span>
          <span className="p-1">
            <Icon
              onClick={() => setCurrentChart('BOTH')}
              icon="OrdersList-OutLined"
              size={20}
              className={clsx(
                'cursor-pointer text-dark-100',
                currentChart === 'BOTH'
                  ? '[&>*:nth-child(1)]:text-dark-100 [&>*:nth-child(2)]:text-danger-500 [&>*:nth-child(3)]:text-primary-500'
                  : '',
              )}
            />
          </span>
        </div>
      </div>
      <div className="overflow-y-auto">
        {currentChart === 'ASKS' || currentChart === 'BOTH' ? (
          <table className="w-full">
            <thead className="sticky top-0">
              <div className="grid w-full grid-cols-2 lg:grid-cols-3 justify-between bg-dark-50 text-dark-600 text-[10px] !px-[8px] !py-[8px] font-normal">
                <div className="grid col-span-1 text-right lg:text-start">
                  {advancedTrade.price} {quoteAsset}
                </div>
                <div className="grid col-span-1 text-end lg:text-center">
                  {advancedTrade.amount} {baseAsset}
                </div>
                {isDesktop && (
                  <div className="grid col-span-1 !bg-transparent text-end">
                    {advancedTrade.allPrice} ({quoteAsset})
                  </div>
                )}
              </div>
            </thead>
            <tbody>
              {asks.length ? (
                asks
                  .slice(
                    0,
                    isDesktop ? asks.length : currentChart === 'BOTH' ? 6 : 12,
                  )
                  .map(
                    (
                      { qouteAssetQty, baseAssetPrice, total, fillPercent },
                      index,
                    ) => (
                      <div
                        key={index}
                        className={clsx(
                          'flex flex-col w-full order-book-animation',
                        )}
                        style={getAnimatedGradient(fillPercent, 'ASK')}
                        onClick={() => handleOnRowClick(baseAssetPrice, 'ASK')}
                      >
                        <div className="grid w-full grid-cols-2 lg:grid-cols-3 justify-between text-xs !px-[8px] !py-[4px] cursor-pointer">
                          <div className="grid col-span-1">
                            <span className="text-danger-400 !text-start !bg-transparent">
                              {toPrice(baseAssetPrice)}
                            </span>
                          </div>
                          <div className="grid col-span-1">
                            <span className="text-end lg:!text-center !bg-transparent">
                              {toPrice(qouteAssetQty)}
                            </span>
                          </div>
                          {isDesktop && (
                            <div className="grid col-span-1">
                              <span className="text-end">{toPrice(total)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )
              ) : (
                <tr>
                  <td colSpan={3}>
                    {isLoading ? (
                      <div className="flex justify-center py-6">
                        <Spinner />
                      </div>
                    ) : (
                      <EmptyTable className="h-fit pt-2" iconSize={45} />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : null}

        <div className="flex items-center justify-center lg:justify-between p-4">
          <span className="text-xs text-dark-400 hidden lg:block">
            {`${toPrice(update?.lu || data?.result?.last_price_usdt || 0)}` +
              '\u200E' +
              ' USDT ' +
              ' ≈ '}
          </span>
          <span
            className={clsx(
              'text-danger-400 font-bold text-center block lg:inline-block',
              orders_side === 'BUY' ? 'text-primary-400' : '',
            )}
          >
            {toPrice(update?.l || data?.result?.last_price || 0)}
          </span>
        </div>
        {currentChart === 'BIDS' || currentChart === 'BOTH' ? (
          <table className="w-full">
            {currentChart === 'BIDS' ? (
              <thead className="sticky top-0">
                <div className="grid w-full grid-cols-2 lg:grid-cols-3 justify-between bg-dark-50 text-dark-600 text-[10px] !px-[8px] !py-[8px] font-normal">
                  <div className="grid col-span-1 text-start lg:text-start">
                    {advancedTrade.price} {quoteAsset}
                  </div>
                  <div className="grid col-span-1 text-end lg:text-center">
                    {advancedTrade.amount} {baseAsset}
                  </div>
                  {isDesktop && (
                    <div className="grid col-span-1 !bg-transparent text-end">
                      {advancedTrade.allPrice}({quoteAsset})
                    </div>
                  )}
                </div>
              </thead>
            ) : null}
            <tbody>
              {bids.length ? (
                bids
                  .slice(
                    0,
                    isDesktop ? bids.length : currentChart === 'BOTH' ? 6 : 12,
                  )
                  .map(
                    (
                      { qouteAssetQty, baseAssetPrice, total, fillPercent },
                      index,
                    ) => (
                      <div
                        key={index}
                        className={clsx(
                          'flex flex-col w-full order-book-animation',
                        )}
                        style={getAnimatedGradient(fillPercent, 'BID')}
                        onClick={() => handleOnRowClick(baseAssetPrice, 'BID')}
                      >
                        <div className="grid w-full grid-cols-2 lg:grid-cols-3 justify-between text-xs !px-[8px] !py-[4px] cursor-pointer">
                          <div className="grid col-span-1">
                            <span className="text-primary-400 !text-start !bg-transparent">
                              {toPrice(baseAssetPrice)}
                            </span>
                          </div>
                          <div className="grid col-span-1">
                            <span className="text-end lg:!text-center !bg-transparent">
                              {toPrice(qouteAssetQty)}
                            </span>
                          </div>
                          {isDesktop && (
                            <div className="grid col-span-1">
                              <span className="text-end">{toPrice(total)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )
              ) : (
                <tr>
                  <td colSpan={3}>
                    {isLoading ? (
                      <div className="flex justify-center py-6">
                        <Spinner />
                      </div>
                    ) : (
                      <EmptyTable className="h-fit pt-2" iconSize={45} />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};

export default OrderBook;

export const getAnimatedGradient = (
  fillPercent: number = 0,
  type: 'ASK' | 'BID',
) => {
  return {
    background: `linear-gradient(to right, transparent ${100 - fillPercent}%, ${
      type === 'ASK' ? colors.danger[50] : colors.primary[50]
    } ${100 - fillPercent}%)`,
  };
};
