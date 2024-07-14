import React, { useEffect } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { convertScientific, toPrice } from '@/utils';
import {
  Alert,
  Button,
  FormInput,
  LabelValue,
  Spinner,
} from '@/components/Common';
import useOrderCommission from '@/requests/market/orderCommission';
import { IPairResult } from '@/hooks/useMarketData';
import type { BalanceCoinModel, IAdvanceMarketpair } from '@/types/wallet';
import { useLang } from '@/hooks';

interface Props {
  quote?: BalanceCoinModel;
  quoteValue?: number;
  asset?: BalanceCoinModel;
  assetPrice?: number;
  socketMarketData: IPairResult[];
  currencyMarket: IAdvanceMarketpair;
  isPriceChanging: boolean;
  isPriceLoading: boolean;
  userPrice?: number;
  priceType?: 'MARKET' | 'LIMIT';
  setUserPrice?: (val: number) => void;
  setPriceType?: (val: 'MARKET' | 'LIMIT') => void;
}

const PriceSection: React.FC<Props> = ({
  quote,
  asset,
  assetPrice,
  socketMarketData,
  currencyMarket,
  isPriceChanging,
  isPriceLoading,
  priceType,
  userPrice,
  setPriceType,
  setUserPrice,
}) => {
  const [instantTrade, advancedTrade] = useLang([
    'instantTrade',
    'advancedTrade',
  ]);

  const { isLoading: orderCommissionLoading, data: orderCommission } =
    useOrderCommission(currencyMarket?.pair_id);

  useEffect(() => {
    if (!userPrice && assetPrice) {
      setUserPrice?.(assetPrice);
    }
  }, [assetPrice]);

  return (
    <>
      <div>
        <div className="flex items-center gap-4">
          <Button
            variant={priceType === 'MARKET' ? 'secondary' : 'text'}
            onClick={() => {
              setPriceType?.('MARKET');
            }}
          >
            {instantTrade.marketPrice}
          </Button>
          <Button
            variant={priceType === 'LIMIT' ? 'secondary' : 'text'}
            onClick={() => {
              setPriceType?.('LIMIT');
            }}
          >
            {instantTrade.myPrice}
          </Button>
        </div>
      </div>
      {priceType === 'LIMIT' && (
        <>
          {!asset?.p2p_tradeable ? (
            <div className="mt-4">
              <FormInput
                placeholder={instantTrade.enterYourPrice}
                leftIcon={
                  quote?.symbol === 'IRT' ? advancedTrade.toman : 'USDT'
                }
                onlyNumber
                decimal={+currencyMarket?.tickSize ?? 0}
                seprator
                value={userPrice}
                onChange={setUserPrice}
                defaultValue={convertScientific(assetPrice || 0)}
              />
            </div>
          ) : (
            <Alert
              ActionComponent={
                <Link
                  href={`/panel/advance-trade/${asset.p2p_pair}`}
                  className="!text-dark-700"
                >
                  <Button
                    className="hover:border-dark-200"
                    variant={'secondary'}
                    childrenClassname="!text-dark-700"
                  >
                    {advancedTrade.advancedTrade}
                  </Button>
                </Link>
              }
              className="items-center my-8"
              variant="warning"
              message={instantTrade.denyToSetBidPrice}
            />
          )}
        </>
      )}

      <div className="mt-6">
        <LabelValue
          label={instantTrade.marketPrice}
          classNames="mb-2"
          value={
            isPriceLoading ? (
              <Spinner />
            ) : (
              <>
                {quote && asset ? (
                  <span
                    className={clsx(
                      'block dir-ltr transition-all duration-700',
                      isPriceChanging && 'text-danger-400',
                    )}
                  >{`۱ ${asset?.symbol} = ${toPrice(
                    convertScientific(assetPrice ?? 0) || 0,
                  )} ${quote?.symbol}`}</span>
                ) : (
                  <></>
                )}
              </>
            )
          }
        />
        <LabelValue
          label={instantTrade.fee}
          value={
            orderCommissionLoading ? (
              <Spinner />
            ) : (
              `٪${toPrice(orderCommission?.result?.commission_percent ?? 0)}`
            )
          }
          classNames="mb-2"
        />
        <LabelValue
          label={instantTrade.feeDiscount}
          value={
            orderCommissionLoading ? (
              <Spinner />
            ) : (
              `٪${toPrice(orderCommission?.result?.discounted_percent ?? 0)}`
            )
          }
          classNames="mb-2"
        />
      </div>
    </>
  );
};

export default PriceSection;
