import React, { useEffect, useMemo, useState } from 'react';

import { useCalculator, useLang } from '@/hooks';
import { ICurrencyModel } from '@/types/currency';
import type { IPairResult } from '@/hooks/useMarketData';

import { SwimTab } from '../Common';
import Card from '../Common/Card';
import Buy from './Buy';
import Sell from './Sell';
import Convert from './Convert';

const CALC_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
  CONVERT: 'CONVERT',
};

interface Props {
  assetSymbol?: string;
  update?: IPairResult[];
  updatePairs?: (input: string[]) => void;
}

const Calculator = ({ assetSymbol, update, updatePairs }: Props) => {
  const [wallet] = useLang(['wallet']);

  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL' | 'CONVERT'>('BUY');
  const [selectedAsset, setSelectedAsset] = useState<ICurrencyModel>();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>(
    assetSymbol || 'BTC',
  );
  const [convertSide, setConvertSide] = useState<'BUY' | 'SELL'>('BUY');

  const tabItems = [
    {
      id: CALC_TYPES.BUY,
      label: wallet.buy,
    },
    {
      id: CALC_TYPES.SELL,
      label: wallet.sell,
    },
    {
      id: CALC_TYPES.CONVERT,
      label: wallet.convert,
    },
  ];
  const {
    quote,
    quoteValue,
    quoteDecimal,
    asset,
    assetValue,
    assetDecimal,
    assetPrice,
    singleCoinMarketLoading,
    onQuoteValueChange,
    onAssetValueChange,
    onSubmit,
    resetState,
  } = useCalculator({
    providerType: activeTab === 'CONVERT' ? 'exchange' : 'otc',
    quoteAsset: activeTab === 'CONVERT' ? 'USDT' : 'IRT',
    baseAsset: selectedAssetSymbol,
    side: activeTab === 'CONVERT' ? convertSide : activeTab,
    update,
    updatePairs,
  });

  useEffect(() => {
    if (!selectedAsset) return;
    setSelectedAssetSymbol(selectedAsset?.symbol);
  }, [selectedAsset]);

  useEffect(() => {
    resetState();
  }, [activeTab]);

  const handleSelectAsset = (coin: ICurrencyModel) => {
    if (!coin.otc_tradeable) return;
    setSelectedAsset(coin);
  };

  const onSwitchClick = (sourceTab: 'BUY' | 'SELL' | 'CONVERT') => {
    switch (sourceTab) {
      case 'BUY':
        setActiveTab('SELL');
        break;
      case 'SELL':
        setActiveTab('BUY');
        break;
      case 'CONVERT':
        setConvertSide((prev) => (prev === 'BUY' ? 'SELL' : 'BUY'));
        break;
      default:
        break;
    }
    resetState();
  };

  const renderContent = useMemo(() => {
    return {
      [CALC_TYPES.BUY]: (
        <Buy
          quote={quote}
          quoteValue={quoteValue}
          quoteDecimal={quoteDecimal}
          asset={asset}
          assetValue={assetValue}
          assetDecimal={assetDecimal}
          assetPrice={assetPrice}
          onQuoteValueChange={onQuoteValueChange}
          onAssetValueChange={onAssetValueChange}
          onAssetSelect={handleSelectAsset}
          onSwitchClick={onSwitchClick}
          onSubmit={onSubmit}
          isLoading={singleCoinMarketLoading}
        />
      ),
      [CALC_TYPES.SELL]: (
        <Sell
          quote={quote}
          quoteValue={quoteValue}
          quoteDecimal={quoteDecimal}
          asset={asset}
          assetValue={assetValue}
          assetDecimal={assetDecimal}
          assetPrice={assetPrice}
          onQuoteValueChange={onQuoteValueChange}
          onAssetValueChange={onAssetValueChange}
          onAssetSelect={handleSelectAsset}
          onSwitchClick={onSwitchClick}
          onSubmit={onSubmit}
          isLoading={singleCoinMarketLoading}
        />
      ),
      [CALC_TYPES.CONVERT]: (
        <Convert
          quote={quote}
          quoteValue={quoteValue}
          quoteDecimal={quoteDecimal}
          asset={asset}
          assetValue={assetValue}
          assetDecimal={assetDecimal}
          assetPrice={assetPrice}
          onQuoteValueChange={onQuoteValueChange}
          onAssetValueChange={onAssetValueChange}
          onAssetSelect={handleSelectAsset}
          onSwitchClick={onSwitchClick}
          convertSide={convertSide}
          setConvertSide={setConvertSide}
          onSubmit={onSubmit}
          isLoading={singleCoinMarketLoading}
        />
      ),
    }[activeTab];
  }, [
    activeTab,
    quote,
    quoteValue,
    quoteDecimal,
    asset,
    assetValue,
    assetDecimal,
    assetPrice,
    selectedAsset,
    selectedAssetSymbol,
    convertSide,
    handleSelectAsset,
    onQuoteValueChange,
    onAssetValueChange,
    onSwitchClick,
    setConvertSide,
    onSubmit,
  ]);

  return (
    <Card classNames="shadow-card w-full lg:w-[415px] lg:max-w-[415px] select-none">
      <SwimTab
        items={tabItems}
        className="border-b border-dark-50"
        initial={activeTab}
        callback={(tab: 'BUY' | 'SELL' | 'CONVERT' | string) => {
          if (tab !== 'BUY' && tab !== 'SELL' && tab !== 'CONVERT') return;
          setActiveTab(tab);
        }}
      />
      <div className="px-6 pt-4 pb-6">{renderContent}</div>
    </Card>
  );
};

export default Calculator;
