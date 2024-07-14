import { useEffect, useMemo } from 'react';

import { useSellPairStore } from '@/store';
import type { BalanceCoinModel, IAdvanceMarketpair } from '@/types/wallet';
import { convertScientific, toStraightNumber } from '@/utils';

interface Args {
  quoteAsset: string;
  baseAsset: string;
  pairDetail: IAdvanceMarketpair;
  userPrice: number;
  quote: BalanceCoinModel;
  asset: BalanceCoinModel;
  priceType: 'LIMIT' | 'MARKET';
}

const useSell = ({
  quoteAsset = 'IRT',
  pairDetail,
  userPrice = 0,
  quote,
  asset,
  priceType = 'LIMIT',
}: Args) => {
  const { quoteValue, assetValue, setQuoteValue, setAssetValue, resetState } =
    useSellPairStore();

  const assetPrice = useMemo(() => {
    if (quoteAsset === 'IRT')
      return +toStraightNumber(+pairDetail?.stats?.lastPrice ?? 0);

    if (quoteAsset === 'USDT') {
      return +toStraightNumber(+pairDetail?.stats.lastPriceUsd ?? 0);
    }
    return 0;
  }, [quoteAsset, quote, asset, quoteValue, assetValue, pairDetail]);

  const onAssetValueChange = (amount: number | undefined) => {
    if (!quote) return;
    setAssetValue(amount);
    let quoteValue = 0;
    if (priceType === 'MARKET') {
      quoteValue = (amount || 0) * assetPrice;
    }
    if (priceType === 'LIMIT') {
      quoteValue = (amount || 0) * (userPrice ?? 0);
    }
    setQuoteValue(Number(toStraightNumber(quoteValue)));
  };

  useEffect(() => {
    if (!asset || !quote) return;
    const currentAssetValue = assetValue ?? 0;

    if (priceType === 'MARKET') {
      setQuoteValue(
        Number(
          toStraightNumber(
            convertScientific(currentAssetValue * assetPrice) || 0,
          ),
        ),
      );
    }
    if (priceType === 'LIMIT') {
      if (!userPrice) {
        setQuoteValue(0);
        return;
      }

      setQuoteValue(
        Number(
          toStraightNumber(
            convertScientific(currentAssetValue * userPrice) || 0,
          ),
        ),
      );
    }
  }, [priceType, userPrice]);

  const isSubmitDisabled = useMemo(() => {
    return (
      !quote ||
      !asset ||
      !quoteValue ||
      !assetValue ||
      !pairDetail ||
      +quoteValue >
        +(+pairDetail.maxNotional === 0 ? Infinity : pairDetail.maxNotional) ||
      +quoteValue < +pairDetail.minNotional ||
      +assetValue > +(pairDetail.maxQty == 0 ? Infinity : pairDetail.maxQty) ||
      +assetValue < +pairDetail.minQty ||
      +assetValue > +asset?.balance_available
    );
  }, [quote, asset, assetValue, quoteValue, pairDetail, priceType, userPrice]);

  return {
    quoteValue,
    quoteMin: pairDetail?.minNotional,
    quoteMax:
      +pairDetail?.maxNotional === 0 ? Infinity : pairDetail?.maxNotional,
    quoteDecimal:
      quote?.symbol === 'IRT'
        ? 0
        : quote?.symbol === 'USDT'
        ? 2
        : Number(pairDetail?.tickSize ?? 0),
    assetValue,
    assetMin: pairDetail?.minQty,
    assetMax: +pairDetail?.maxQty === 0 ? Infinity : pairDetail?.maxQty,
    assetDecimal:
      asset?.symbol === 'USDT' ? 2 : Number(pairDetail?.stepSize ?? 0),
    assetPrice,
    pairDetail,
    isSubmitDisabled,
    priceType,
    tickSize: Number(pairDetail?.tickSize) ?? 0,
    onAssetValueChange,
    resetState,
  };
};

export default useSell;
