import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { useBreakpoint, useSingleCurrencyMarket } from '@/hooks';
import { useCalculatorStore } from '@/store';
import { convertScientific, toStraightNumber } from '@/utils';
import { ICurrencyModel } from '@/types/currency';

import useSingleCurrencyCoin from './useSingleCurrencyCoin';
import { IPairResult } from '../useMarketData';

interface Args {
  providerType: 'otc' | 'p2p' | 'exchange';
  quoteAsset: string;
  baseAsset: string;
  side: 'BUY' | 'SELL';
  update?: IPairResult[];
  updatePairs?: (input: string[]) => void;
}

const useCalculator = ({
  providerType = 'otc',
  quoteAsset = 'IRT',
  baseAsset = 'BTC',
  side,
  update,
  updatePairs,
}: Args) => {
  const { isDesktop } = useBreakpoint();
  const router = useRouter();

  const [fadePrice, setFadePrice] = useState(false);
  const [modifiedInput, setModifiedInput] = useState<'quote' | 'asset'>(
    'quote',
  );

  const previousUpdateRef = useRef<IPairResult>();

  const quoteCoin = useSingleCurrencyCoin(quoteAsset);
  const assetCoin = useSingleCurrencyCoin(baseAsset);

  const {
    quote,
    asset,
    quoteValue,
    assetValue,
    setQuote,
    setAsset,
    setQuoteValue,
    setAssetValue,
    resetState,
  } = useCalculatorStore();

  const {
    data: singleCoinMarket,
    isLoading: singleCoinMarketLoading,
    refetch: fetchSingleCoinMarket,
  } = useSingleCurrencyMarket({ providerType: 'otc', baseAsset });

  useEffect(() => {
    resetState();
  }, [asset]);

  useEffect(() => {
    if (quoteCoin) setQuote(quoteCoin);
    if (assetCoin) setAsset(assetCoin);
  }, [quoteCoin, assetCoin]);

  const pairString = useMemo(() => {
    if (!baseAsset || !quoteAsset) return [];
    updatePairs?.([`${baseAsset}${quoteAsset}`]);
    previousUpdateRef.current = undefined;
    return [`${baseAsset}${quoteAsset}`];
  }, [baseAsset, quoteAsset]);

  const updatedPrice = useMemo(() => {
    const result = update?.find(({ key }) => key === pairString?.[0]);
    if (result) {
      previousUpdateRef.current = result;
      return result;
    }
    if (previousUpdateRef.current) return previousUpdateRef.current;
  }, [update, pairString]);

  useEffect(() => {
    if (!pairString?.length) return;
    fetchSingleCoinMarket();
  }, [pairString?.[0]]);

  const onSelectAsset = (coin: ICurrencyModel) => {
    if (!coin.otc_tradeable) return;
    setAsset(coin);
  };

  const assetPrice = useMemo(() => {
    if (quoteAsset === 'IRT')
      return +toStraightNumber(
        updatedPrice
          ? +updatedPrice?.o?.a
          : singleCoinMarketLoading
          ? 0
          : +singleCoinMarket?.stats?.lastPrice ?? 0,
      );

    if (quoteAsset === 'USDT') {
      return +toStraightNumber(
        updatedPrice
          ? +updatedPrice?.o?.a
          : singleCoinMarketLoading
          ? 0
          : +singleCoinMarket?.stats.lastPriceUsd ?? 0,
      );
    }
    return 0;
  }, [
    quoteAsset,
    quote,
    asset,
    quoteValue,
    assetValue,
    singleCoinMarket,
    updatedPrice,
  ]);

  useEffect(() => {
    if (!quote || !asset) return;
    setFadePrice(true);
    const fadeTimeout = setTimeout(() => setFadePrice(false), 700);
    if (!update?.length || !quoteValue || !assetPrice) {
      return;
    }
    if (modifiedInput === 'quote') {
      setAssetValue(
        Number(
          toStraightNumber(convertScientific(quoteValue / assetPrice) || 0),
        ),
      );
    }
    if (modifiedInput === 'asset') {
      setQuoteValue(Number(toStraightNumber((assetValue ?? 0) * assetPrice)));
    }
    return () => clearTimeout(fadeTimeout);
  }, [update?.[0]?.o?.a]);

  const onQuoteValueChange = (amount: number) => {
    if (!asset) return;
    setModifiedInput('quote');
    setQuoteValue(amount);

    const assetValue = +amount / assetPrice;
    setAssetValue(Number(toStraightNumber(convertScientific(assetValue) || 0)));
  };
  const onAssetValueChange = (amount: number) => {
    if (!quote) return;
    setModifiedInput('asset');
    setAssetValue(amount);
    const quoteValue = amount * assetPrice;
    setQuoteValue(Number(toStraightNumber(quoteValue)));
  };

  const onSubmit = () => {
    if (providerType === 'p2p') {
      router.push({
        pathname: '/panel/instant-trade/convert',
        query: {
          asset: asset?.symbol,
          side: side.toLowerCase(),
          ...(quoteValue || assetValue
            ? modifiedInput === 'quote'
              ? { quote_value: quoteValue }
              : { asset_value: assetValue }
            : null),
        },
      });
    }
    if (providerType === 'otc') {
      router.push({
        pathname: `/panel/instant-trade/${side.toLowerCase()}`,
        query: {
          asset: asset?.symbol,
          ...(!isDesktop && {
            modal: `fastorder-${side.toLowerCase()}-content-modal`,
          }),
          ...(quoteValue || assetValue
            ? modifiedInput === 'quote'
              ? { quote_value: quoteValue }
              : { asset_value: assetValue }
            : null),
        },
      });
    }
  };

  return {
    quote,
    quoteValue,
    quoteMin: singleCoinMarket?.minNotional,
    quoteMax:
      +singleCoinMarket?.maxNotional === 0
        ? Infinity
        : singleCoinMarket?.maxNotional,
    quoteDecimal:
      quote?.symbol === 'IRT'
        ? 0
        : quote?.symbol === 'USDT'
        ? 2
        : Number(singleCoinMarket?.tickSize ?? 0),
    asset,
    assetValue,
    assetMin: singleCoinMarket?.minQty,
    assetMax:
      +singleCoinMarket?.maxQty === 0 ? Infinity : singleCoinMarket?.maxQty,
    assetDecimal:
      asset?.symbol === 'USDT' ? 2 : Number(singleCoinMarket?.stepSize ?? 0),
    assetPrice,
    singleCoinMarket,
    singleCoinMarketLoading,
    fadePrice,
    isSubmitLoading: singleCoinMarketLoading,
    onQuoteValueChange,
    onAssetValueChange,
    onSelectAsset,
    onSubmit,
    resetState,
  };
};

export default useCalculator;
