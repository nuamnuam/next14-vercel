import React, { FC, useCallback, useEffect, useState } from 'react';

import { colors } from '@/designTokens';
import { useOrderBookQuery } from '@/requests/advance-trade/orderBookQuery';
import { toPrice } from '@/utils';
import { EmptyTable, Spinner } from '@/components';
import { useLang, useOrderBook } from '@/hooks';

import PercentBar from './PercentBar';
import { IAskBid } from '../../../AdvanceTrade/types';

type Props = {
  baseAsset: string;
  quoteAsset: string;
};

const ResponsiveOrderBook: FC<Props> = ({ baseAsset, quoteAsset }) => {
  const [market] = useLang(['market']);
  const [asks, setAsks] = useState<IAskBid[]>([]);
  const [bids, setBids] = useState<IAskBid[]>([]);

  const { data, isLoading } = useOrderBookQuery(`${baseAsset}${quoteAsset}`);

  const { update: orderBookUpdate } = useOrderBook(`${baseAsset}${quoteAsset}`);

  const transformedAsksData = useCallback(() => {
    let totalQty: number = 0;
    let result = [];

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

    setAsks(result.reverse());
  }, [data, orderBookUpdate]);

  const transformedBidsData = useCallback(() => {
    let totalQty: number = 0;
    let result = [];

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

    setBids(result);
  }, [data, orderBookUpdate]);

  useEffect(() => {
    transformedAsksData();
    transformedBidsData();
  }, [transformedAsksData, transformedBidsData]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="text-dark-800 p-4 flex items-center justify-between">
        <div className="flex-1">
          <PercentBar
            buyPercent={
              Math.floor(Number(data?.result?.market_buy_percent)) || 0
            }
            width="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="grid col-span-1">
          <table className="w-full h-fit">
            <thead className="sticky top-0">
              <div className="grid grid-cols-2 bg-dark-50 text-dark-600 text-xs">
                <div className="grid cols-span-1 px-4 py-1.5 lg:py-2">
                  <span className="text-center font-normal">
                    {market.price} {quoteAsset}
                  </span>
                </div>
                <div className="grid cols-span-1 px-4 py-1.5 lg:py-2">
                  <span className="text-center font-normal">
                    {market.amount} {baseAsset}
                  </span>
                </div>
              </div>
            </thead>
            <tbody className="bg-white">
              {asks.length ? (
                asks.map(
                  ({ baseAssetPrice, qouteAssetQty, fillPercent }, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 lg:border-b border-dark-50 text-center text-xs"
                      style={{
                        background: `linear-gradient(to left, transparent ${
                          100 - fillPercent
                        }%, ${colors.danger[50]} ${100 - fillPercent}%)`,
                      }}
                    >
                      <div className="grid col-span-1 px-4 py-1.5 lg:py-2">
                        <span className="text-danger-400 text-center">
                          {toPrice(baseAssetPrice)}
                        </span>
                      </div>
                      <div className="grid col-span-1 px-4  py-1.5 lg:py-2">
                        <span className="text-center">
                          {toPrice(qouteAssetQty)}
                        </span>
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
                      <EmptyTable />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="grid col-span-1">
          <table className="w-full h-fit">
            <thead className="sticky top-0">
              <div className="grid grid-cols-2 bg-dark-50 text-dark-600 text-xs">
                <div className="grid cols-span-1 px-4 py-1.5 lg:py-2">
                  <span className="text-center font-normal">
                    {market.price} {quoteAsset}
                  </span>
                </div>
                <div className="grid cols-span-1 px-4 py-1.5 lg:py-2">
                  <span className="text-center font-normal">
                    {market.amount} {baseAsset}
                  </span>
                </div>
              </div>
            </thead>
            <tbody className="bg-white">
              {bids.length ? (
                bids.map(
                  ({ baseAssetPrice, qouteAssetQty, fillPercent }, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 w-full lg:border-b border-dark-50 text-center text-xs"
                      style={{
                        background: `linear-gradient(to right, transparent ${
                          100 - fillPercent
                        }%, ${colors.primary[50]} ${100 - fillPercent}%)`,
                      }}
                    >
                      <div className="grid col-span-1 px-4 py-1.5 lg:py-2">
                        <span className="text-primary-400 text-center">
                          {toPrice(baseAssetPrice)}
                        </span>
                      </div>
                      <div className="grid col-span-1 px-4  py-1.5 lg:py-2">
                        <span className="text-center">
                          {toPrice(qouteAssetQty)}
                        </span>
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
                      <EmptyTable />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveOrderBook;
