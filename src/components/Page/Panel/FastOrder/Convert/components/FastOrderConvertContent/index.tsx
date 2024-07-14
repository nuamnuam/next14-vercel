import React, { useEffect, useState } from 'react';
import {
  BalanceProgress,
  Button,
  Icon,
  IconButton,
  InputAlert,
  ResponsivePageHeader,
} from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useInstanceTrade, useLang } from '@/hooks';
import CoinsContent from '@/components/Common/Coins/CoinsContent';
import TwinInput from '@/components/Common/TwinInput';
import { BalanceCoinModel } from '@/types/wallet';
import OrderResultModal, {
  orderResultModalName,
} from '../../../OrderResultModal';
import { useModal } from '@/hooks/useModal';
import { useEffectOnce } from 'react-use';
import { PriceSection } from '../../../components';
import { toPrice } from '@/utils';
import { useRouter } from 'next/router';
import FastOrderResTabs from '../../../components/FastOrderResTabs';
import OpenOrdersContent from '@/components/Page/Panel/Wallet/OpenOrders/components/OpenOrdersContent';
import { useOrderHistoryStore } from '@/store';

import FaildOrderModal from '../../../FailedOrderModal';

const FastOrderConvertContent: React.FC = () => {
  const [instantTrade] = useLang(['instantTrade']);

  const { pathname, query, events, push, replace } = useRouter();
  const queryAsset = query.asset as string;
  const queryQuoteValue = query.quote_value as string;
  const queryAssetValue = query.asset_value as string;
  const querySide = query.side as string;

  const { refetch, set_refetch, resetFilters, resetHistories } =
    useOrderHistoryStore();

  const { isDesktop } = useBreakpoint();

  // const [selectedAsset, setSelectedAsset] = useState<BalanceCoinModel>();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('BTC');
  const [isQuerySetted, setIsQuerySetted] = useState(false);
  const [convertSide, setConvertSide] = useState<'BUY' | 'SELL'>(
    (querySide && (querySide === 'buy' || querySide === 'sell')
      ? querySide.toUpperCase()
      : 'BUY') as 'BUY' | 'SELL',
  );
  const { closeSyncModal } = useModal(orderResultModalName);

  useEffect(() => {
    if (!queryAsset) return;
    setSelectedAssetSymbol(queryAsset === 'USDT' ? 'BTC' : queryAsset);
  }, [queryAsset]);

  // useEffect(() => {
  //   if (!selectedAsset) return;
  //   setSelectedAssetSymbol(selectedAsset?.symbol);
  // }, [selectedAsset]);

  const {
    quote,
    quoteValue,
    quoteDecimal,
    asset,
    assetValue,
    assetDecimal,
    assetPrice,
    singleCoinMarket,
    singleCoinMarketLoading,
    socketMarketData,
    socketMarketLoading,
    fadePrice,
    userPrice,
    isSubmitDisabled,
    isSubmitLoading,
    quoteMin,
    quoteMax,
    assetMin,
    assetMax,
    priceType,
    assetCoinLoading,
    onQuoteValueChange,
    onAssetValueChange,
    setPriceType,
    setUserPrice,
    onSubmit,
    resetState,
  } = useInstanceTrade({
    providerType: 'exchange',
    quoteAsset: 'USDT',
    baseAsset: selectedAssetSymbol,
    side: convertSide,
  });

  useEffectOnce(() => {
    closeSyncModal;
  });

  useEffect(() => {
    if (
      (!queryQuoteValue && !queryAssetValue) ||
      !asset ||
      !quote ||
      !assetPrice ||
      isQuerySetted
    )
      return;
    if (queryQuoteValue) onQuoteValueChange(Number(queryQuoteValue));
    else if (queryAssetValue) onAssetValueChange(Number(queryAssetValue));
    setIsQuerySetted(true);
  }, [assetPrice]);

  const switchInputs = () => {
    resetState();
    setConvertSide((prev) => (prev === 'BUY' ? 'SELL' : 'BUY'));
  };

  const handleSelectAsset = (coin: BalanceCoinModel) => {
    if (!coin.otc_tradeable) return;
    // setSelectedAsset(coin);
    replace({
      pathname,
      query: { asset: coin.symbol },
    });
  };

  const quoteInput = () => {
    const error = () => {
      if (quoteValue && (+quoteValue > +quoteMax || +quoteValue < +quoteMin)) {
        return true;
      }
      if (convertSide === 'BUY') {
        return quoteValue ? quoteValue > +quote?.balance_available! : false;
      }
    };

    const caption = () => {
      if (convertSide === 'SELL') {
        if (!quote?.is_withdrawable) {
          return (
            <InputAlert message={instantTrade.cantWithdraw} variant="warning" />
          );
        }
      }
      if (quoteValue && quoteValue > +quoteMax) {
        return (
          <InputAlert
            message={`${instantTrade.maxConvertThisCrypto} ${toPrice(
              quoteMax,
            )} ${instantTrade.isUnits}`}
            variant="danger"
          />
        );
      }
      if (quoteValue && quoteValue < +quoteMin) {
        return (
          <InputAlert
            message={`${instantTrade.minConvertThisCrypto} ${toPrice(
              quoteMin,
            )} ${instantTrade.isUnits}`}
            variant="danger"
          />
        );
      }
      if (convertSide === 'BUY') {
        if (quoteValue && quoteValue > +quote?.balance_available!) {
          return (
            <InputAlert message={instantTrade.noBalance} variant="danger" />
          );
        }
      }
    };

    return (
      <TwinInput
        label={
          convertSide === 'SELL'
            ? instantTrade.convertTo
            : instantTrade.convertFrom
        }
        value={quoteValue}
        setValue={onQuoteValueChange}
        decimal={quoteDecimal}
        selectedCoin={quote}
        error={error()}
        caption={caption()}
        otcTradeable={true}
      />
    );
  };

  const assetInput = () => {
    const error = () => {
      if (convertSide === 'SELL') {
        return assetValue ? assetValue > +asset?.balance_available! : false;
      }
      return assetValue
        ? assetValue > +assetMax || assetValue < +assetMin
        : false;
    };

    const caption = () => {
      if (!asset?.is_withdrawable && convertSide === 'BUY') {
        return (
          <InputAlert message={instantTrade.cantWithdraw} variant="warning" />
        );
      }
      if (convertSide === 'SELL') {
        if (asset && assetValue && assetValue > +asset?.balance_available) {
          return (
            <InputAlert message={instantTrade.noBalance} variant="danger" />
          );
        }
      }
      if (assetValue && assetValue > +assetMax) {
        return (
          <InputAlert
            message={`${instantTrade.maxConvertThisCrypto} ${toPrice(
              assetMax,
            )} ${instantTrade.isUnits}`}
            variant="danger"
          />
        );
      }
      if (assetValue && assetValue < +assetMin) {
        return (
          <InputAlert
            message={`${instantTrade.minConvertThisCrypto} ${toPrice(
              assetMin,
            )} ${instantTrade.isUnits}`}
            variant="danger"
          />
        );
      }
    };

    return (
      <TwinInput
        type="modal"
        label={
          convertSide === 'SELL'
            ? instantTrade.convertFrom
            : instantTrade.convertTo
        }
        hasList={!isDesktop}
        value={assetValue}
        setValue={onAssetValueChange}
        decimal={assetDecimal}
        otcTradeable={true}
        selectedCoin={asset}
        setSelectedCoin={handleSelectAsset}
        ignoredCoins={['IRT', 'USDT']}
        error={error()}
        caption={caption()}
        showBalance
        showFavorites
        loading={assetCoinLoading}
        setItemClassNames={(coin) =>
          !coin.otc_tradeable ? 'opacity-70 !cursor-not-allowed' : ''
        }
      />
    );
  };

  const balanceProgress = () => {
    if (convertSide === 'SELL') {
      return (
        <BalanceProgress
          total={Number(asset?.balance_available ?? 0)}
          value={assetValue ?? 0}
          onChange={onAssetValueChange}
          max={Number(asset?.balance_available ?? 0)}
          symbol={asset?.symbol}
          label={instantTrade.myBalance}
          isLoading={!asset || singleCoinMarketLoading}
          decimal={asset?.balance_decimal}
        />
      );
    }
    return (
      <BalanceProgress
        total={Number(quote?.balance_available ?? 0)}
        value={quoteValue ?? 0}
        onChange={onQuoteValueChange}
        max={Number(quote?.balance_available ?? 0)}
        symbol={quote?.symbol}
        label={instantTrade.myBalance}
        isLoading={!quote || singleCoinMarketLoading}
        decimal={quoteDecimal}
      />
    );
  };

  useEffect(() => {
    const handleRouteChange = () => {
      resetFilters();
      resetHistories();
    };

    events.on('routeChangeStart', handleRouteChange);

    return () => {
      events.off('routeChangeStart', handleRouteChange);
    };
  }, [events]);

  return (
    <>
      <ResponsivePageHeader
        title={instantTrade.fastOrder}
        onBack={() => push('/panel/wallet/my-wallet')}
        extra={
          <IconButton
            className="border-dark-200 text-dark-600"
            size="lg"
            icon={<Icon icon="History-OutLined" size={16} />}
            onClick={() => {
              push('/panel/open-orders');
            }}
          />
        }
      />
      <div className="px-4 sm:px-8 lg:p-0">
        <div className="w-full pb-[6rem] lg:rounded-b-lg lg:bg-white lg:pb-0">
          <div className="mx-auto mt-4 flex flex-col lg:flex-row rounded-lg bg-white sm:w-[462px] md:mt-8 lg:mx-0 lg:mt-0 lg:w-full lg:rounded-t-none">
            <FastOrderResTabs />
            <div className="hidden w-full lg:block lg:w-5/12 lg:border-l lg:py-8">
              <CoinsContent
                onSelect={handleSelectAsset}
                ignoredCoins={['IRT', 'USDT']}
                withNetworks={false}
                showFavorites
                showBalance
                otcTradeable={true}
                setItemClassNames={(coin) =>
                  !coin.otc_tradeable ? 'opacity-70 !cursor-not-allowed' : ''
                }
                hasNetworkParam={false}
              />
            </div>
            <div className="w-full p-4 md:py-8 md:px-10 lg:w-7/12 lg:flex flex-col">
              <div className="mb-4">
                {convertSide === 'SELL' ? assetInput() : quoteInput()}
              </div>
              <div className="mb-10">{balanceProgress()}</div>
              <div className="mb-6 flex justify-center">
                <IconButton
                  className="border-dark-200"
                  onClick={switchInputs}
                  icon={
                    <Icon
                      icon="ConvertReverse-Filled"
                      size={16}
                      className="text-dark-200"
                    />
                  }
                />
              </div>
              <div className="mb-6">
                {convertSide === 'SELL' ? quoteInput() : assetInput()}
              </div>
              <PriceSection
                quote={quote}
                quoteValue={quoteValue}
                asset={asset}
                assetPrice={assetPrice}
                socketMarketData={socketMarketData}
                currencyMarket={singleCoinMarket}
                isPriceChanging={fadePrice}
                isPriceLoading={socketMarketLoading && singleCoinMarketLoading}
                userPrice={userPrice}
                setUserPrice={setUserPrice}
                priceType={priceType}
                setPriceType={setPriceType}
              />
              <ModalFooter fullScreen>
                <Button
                  fullWidth
                  size={isDesktop ? 'lg' : 'md'}
                  disabled={isSubmitDisabled}
                  isLoading={isSubmitLoading}
                  onClick={async () => {
                    await onSubmit();
                    set_refetch(!refetch);
                  }}
                >
                  {instantTrade.convert}
                </Button>
              </ModalFooter>
            </div>
          </div>
        </div>
        {isDesktop ? (
          <div className={!isDesktop ? 'mb-24' : ''}>
            <OpenOrdersContent hasLoadMore wrapperClassname="lg:!p-0" />
          </div>
        ) : null}

        <OrderResultModal />
        <FaildOrderModal />
      </div>
    </>
  );
};

export default FastOrderConvertContent;
