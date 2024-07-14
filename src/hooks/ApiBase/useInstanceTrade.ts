import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useMarketData, useSingleCurrencyMarket } from '@/hooks';
import { useOrderMutation } from '@/requests/panel/instantTrade/postOrder';
import { useInstanceTradeStore } from '@/store';
import { BalanceCoinModel } from '@/types/wallet';
import { convertScientific, fixFloatingNum, toStraightNumber } from '@/utils';
import { useBalanceQuery } from '@/requests/wallet/balanceQuery';

interface Args {
  providerType: 'otc' | 'p2p' | 'exchange';
  quoteAsset: string;
  baseAsset: string;
  side: 'BUY' | 'SELL';
}

const useInstanceTrade = ({
  providerType = 'otc',
  quoteAsset = 'IRT',
  baseAsset = 'BTC',
  side,
}: Args) => {
  const queryClient = useQueryClient();

  const [fadePrice, setFadePrice] = useState(false);
  const [modifiedInput, setModifiedInput] = useState<'quote' | 'asset'>(
    'quote',
  );
  const quoteCoin = useBalanceQuery(quoteAsset, true);
  const assetCoin = useBalanceQuery(baseAsset, true);

  const {
    quote,
    asset,
    quoteValue,
    assetValue,
    priceType,
    userPrice,
    setQuote,
    setAsset,
    setQuoteValue,
    setAssetValue,
    setPriceType,
    setUserPrice,
    resetState,
  } = useInstanceTradeStore();

  const { mutateAsync: submitOrder, isPending: submitOrderLoading } =
    useOrderMutation();

  const {
    data: singleCoinMarket,
    isLoading: singleCoinMarketLoading,
    refetch: fetchSingleCoinMarket,
  } = useSingleCurrencyMarket({ baseAsset, providerType });

  useEffect(() => {
    resetState();
  }, [asset]);

  useEffect(() => {
    if (quoteCoin && quoteCoin.data?.result?.[0])
      setQuote(quoteCoin.data?.result?.[0]);
    if (assetCoin && assetCoin.data?.result?.[0])
      setAsset(assetCoin.data?.result?.[0]);
  }, [quoteCoin.data?.result, assetCoin.data?.result]);

  const pairString = useMemo(() => {
    if (!quote || !asset) return [];
    return [`${asset.symbol}${quote.symbol}`];
  }, [quote, asset]);

  useEffect(() => {
    if (!pairString?.length) return;
    fetchSingleCoinMarket();
  }, [pairString]);

  const { update: socketMarketData, isLoading: socketMarketLoading } =
    useMarketData(pairString);

  const onSelectAsset = (coin: BalanceCoinModel) => {
    if (!coin.otc_tradeable) return;
    setAsset(coin);
  };

  const assetPrice = useMemo(() => {
    if (quoteAsset === 'IRT')
      return +toStraightNumber(
        socketMarketData?.[0]?.key === pairString?.[0]
          ? +socketMarketData?.[0]?.o?.a
          : +singleCoinMarket?.stats?.lastPrice ?? 0,
      );

    if (quoteAsset === 'USDT') {
      return +toStraightNumber(
        socketMarketData?.[0]?.key === pairString?.[0]
          ? +socketMarketData?.[0]?.o?.a
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
    socketMarketData,
    singleCoinMarket,
  ]);

  useEffect(() => {
    if (!quote || !asset) return;
    setFadePrice(true);
    const fadeTimeout = setTimeout(() => setFadePrice(false), 700);
    if (
      !socketMarketData?.length ||
      !quoteValue ||
      !assetPrice ||
      priceType === 'LIMIT'
    ) {
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
  }, [socketMarketData?.[0]?.o?.a]);

  const onQuoteValueChange = (amount: number) => {
    if (!asset) return;
    setModifiedInput('quote');
    setQuoteValue(amount);

    let assetValue = 0;
    if (priceType === 'MARKET') {
      assetValue = +amount / assetPrice;
    }
    if (priceType === 'LIMIT') {
      if (!userPrice) return;
      assetValue = +amount / userPrice;
    }
    setAssetValue(Number(toStraightNumber(convertScientific(assetValue) || 0)));
  };
  const onAssetValueChange = (amount: number) => {
    if (!quote) return;
    setModifiedInput('asset');
    setAssetValue(amount);
    let quoteValue = 0;
    if (priceType === 'MARKET') {
      quoteValue = amount * assetPrice;
    }
    if (priceType === 'LIMIT') {
      quoteValue = amount * (userPrice ?? 0);
    }
    setQuoteValue(Number(toStraightNumber(quoteValue)));
  };

  useEffect(() => {
    if (!asset || !quote) return;
    const currentQuote = quoteValue ?? 0;
    const currentAssetValue = assetValue ?? 0;

    if (priceType === 'MARKET') {
      if (modifiedInput === 'quote') {
        if (!assetPrice) return;
        setAssetValue(
          currentQuote / assetPrice
            ? Number(
                toStraightNumber(
                  convertScientific(currentQuote / assetPrice) || 0,
                ),
              )
            : undefined,
        );
      }
      if (modifiedInput === 'asset') {
        setQuoteValue(
          Number(
            toStraightNumber(
              convertScientific(currentAssetValue * assetPrice) || 0,
            ),
          ),
        );
      }
    }
    if (priceType === 'LIMIT') {
      if (modifiedInput === 'quote') {
        if (!userPrice) {
          setAssetValue(0);
          return;
        }
        setAssetValue(
          Number(
            toStraightNumber(convertScientific(currentQuote / userPrice) || 0),
          ),
        );
      }
      if (modifiedInput === 'asset') {
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
    }
  }, [priceType, userPrice]);

  const isSubmitDisabled = useMemo(() => {
    return (
      !quote ||
      !asset ||
      !quoteValue ||
      !assetValue ||
      (side === 'BUY' && !asset?.is_withdrawable) ||
      !singleCoinMarket ||
      +quoteValue >
        +(+singleCoinMarket.maxNotional === 0
          ? Infinity
          : singleCoinMarket.maxNotional) ||
      +quoteValue < +singleCoinMarket.minNotional ||
      +assetValue >
        +(singleCoinMarket.maxQty == 0 ? Infinity : singleCoinMarket.maxQty) ||
      +assetValue < +singleCoinMarket.minQty ||
      (side === 'BUY'
        ? +quoteValue > +quote?.balance_available
        : +assetValue > +asset?.balance_available) ||
      !asset.otc_tradeable ||
      (priceType === 'LIMIT' && !userPrice) ||
      singleCoinMarketLoading
    );
  }, [
    quote,
    asset,
    assetValue,
    quoteValue,
    singleCoinMarket,
    priceType,
    userPrice,
    singleCoinMarketLoading,
    side,
  ]);

  const onSubmit = async () => {
    const quoteDecimal =
      quote?.symbol === 'IRT'
        ? 0
        : quote?.symbol === 'USDT'
        ? 2
        : Number(singleCoinMarket?.tickSize ?? 0);

    const assetDecimal =
      asset?.symbol === 'USDT' ? 2 : Number(singleCoinMarket?.stepSize ?? 0);
    const { success } = await submitOrder({
      pair: pairString[0],
      side,
      qty:
        modifiedInput === 'quote'
          ? fixFloatingNum(quoteValue || 0, quoteDecimal)?.toString()
          : fixFloatingNum(assetValue || 0, assetDecimal)?.toString(),
      is_quote: modifiedInput === 'quote' ? 1 : 0,
    });

    if (success) {
      resetState();
      queryClient.invalidateQueries({ queryKey: ['get-order-histories'] });
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
    socketMarketData,
    socketMarketLoading,
    fadePrice,
    userPrice,
    isSubmitDisabled,
    isSubmitLoading: singleCoinMarketLoading || submitOrderLoading,
    priceType,
    assetCoinLoading: assetCoin?.isLoading,
    onQuoteValueChange,
    onAssetValueChange,
    onSelectAsset,
    setPriceType,
    setUserPrice,
    onSubmit,
    resetState,
  };
};
export default useInstanceTrade;
