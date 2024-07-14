import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useEffectOnce } from 'react-use';

import {
  BalanceProgress,
  Button,
  Icon,
  IconButton,
  InputAlert,
  ResponsivePageHeader,
} from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { BalanceCoinModel } from '@/types/wallet';
import { useBreakpoint, useLang } from '@/hooks';
import CoinsContent from '@/components/Common/Coins/CoinsContent';
import TwinInput from '@/components/Common/TwinInput';
import OpenOrdersContent from '@/components/Page/Panel/Wallet/OpenOrders/components/OpenOrdersContent';
import { useModal } from '@/hooks/useModal';
import { useOrderHistoryStore } from '@/store';
import { toPrice } from '@/utils';

import OrderResultModal, {
  orderResultModalName,
} from '../../../OrderResultModal';
import { useInstanceTrade } from '../../../../../../../hooks';
import { PriceSection } from './../../../components';
import FastOrderResTabs from '../../../components/FastOrderResTabs';
import FaildOrderModal from '../../../FailedOrderModal';

const FastOrderBuyContent: React.FC = () => {
  const [instantTrade] = useLang(['instantTrade']);

  const { query, events, pathname, push, replace } = useRouter();
  const queryAsset = query.asset as string;
  const queryQuoteValue = query.quote_value as string;
  const queryAssetValue = query.asset_value as string;

  const { isDesktop } = useBreakpoint();

  // const [selectedAsset, setSelectedAsset] = useState<BalanceCoinModel>();
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('BTC');
  const [isQuerySetted, setIsQuerySetted] = useState(false);
  const { refetch, set_refetch, resetFilters, resetHistories } =
    useOrderHistoryStore();

  const { closeSyncModal } = useModal(orderResultModalName);

  useEffect(() => {
    if (!queryAsset) return;
    setSelectedAssetSymbol(queryAsset);
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
  } = useInstanceTrade({
    providerType: 'otc',
    quoteAsset: 'IRT',
    baseAsset: selectedAssetSymbol,
    side: 'BUY',
  });

  useEffectOnce(() => {
    closeSyncModal();
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

  const quoteCaption = () => {
    if (!singleCoinMarket || !quoteValue) return false;
    if (+quoteValue > +quoteMax)
      return (
        <InputAlert
          message={`${instantTrade.maxBuyThisCoin} ${toPrice(quoteMax)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+quoteValue < +quoteMin)
      return (
        <InputAlert
          message={`${instantTrade.minBuyThisCoin} ${toPrice(quoteMin)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (quote && +quoteValue > +quote.balance_available)
      return <InputAlert message={instantTrade.noBalance} variant="danger" />;
  };

  const assetCaption = () => {
    if (!asset?.is_withdrawable)
      return (
        <InputAlert message={instantTrade.cantWithdraw} variant="warning" />
      );
    if (!singleCoinMarket || !assetValue) return false;
    if (+assetValue > +assetMax)
      return (
        <InputAlert
          message={`${instantTrade.maxBuyThisCrypto} ${toPrice(assetMax)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+assetValue < +assetMin)
      return (
        <InputAlert
          message={`${instantTrade.minBuyThisCrypto} ${toPrice(assetMin)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
  };

  const handleSelectAsset = (coin: BalanceCoinModel) => {
    if (!coin.otc_tradeable) return;
    // setSelectedAsset(coin);
    replace({
      pathname,
      query: { asset: coin.symbol },
    });
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
                showFavorites
                otcTradeable={true}
                ignoredCoins={['IRT']}
                withNetworks={false}
                setItemClassNames={(coin) =>
                  !coin.otc_tradeable ? 'opacity-70 !cursor-not-allowed' : ''
                }
                hasNetworkParam={false}
              />
            </div>
            <div className="w-full p-4 md:py-8 md:px-10 lg:w-7/12 lg:flex flex-col">
              <div className="mb-4">
                <TwinInput
                  label={instantTrade.iPay}
                  value={quoteValue}
                  setValue={onQuoteValueChange}
                  decimal={quoteDecimal}
                  selectedCoin={quote}
                  otcTradeable={true}
                  caption={quoteCaption()}
                  error={
                    quoteValue && quote
                      ? quoteValue > +quoteMax ||
                        quoteValue < +quoteMin ||
                        quoteValue > +quote?.balance_available
                      : false
                  }
                />
              </div>
              <div className="mb-14">
                <BalanceProgress
                  total={Number(quote?.balance_available ?? 0)}
                  value={quoteValue ?? 0}
                  decimal={quoteDecimal}
                  onChange={onQuoteValueChange}
                  max={Number(quote?.balance_available ?? 0)}
                  symbol={instantTrade.toman}
                  label={instantTrade.myBalance}
                />
              </div>
              <div className="mb-6">
                <TwinInput
                  type="modal"
                  label={instantTrade.iEarn}
                  hasList={!isDesktop}
                  value={assetValue}
                  setValue={onAssetValueChange}
                  decimal={assetDecimal}
                  otcTradeable={true}
                  selectedCoin={asset}
                  setSelectedCoin={handleSelectAsset}
                  ignoredCoins={['IRT']}
                  showFavorites
                  loading={assetCoinLoading}
                  error={
                    assetValue && singleCoinMarket
                      ? +assetValue > +assetMax || +assetValue < +assetMin
                      : false
                  }
                  caption={assetCaption()}
                  setItemClassNames={(coin) =>
                    !coin.otc_tradeable ? 'opacity-70 !cursor-not-allowed' : ''
                  }
                />
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
                  {instantTrade.buy}
                </Button>
              </ModalFooter>
            </div>
          </div>
        </div>
        {isDesktop ? (
          <div className={!isDesktop ? 'mb-24' : ''}>
            <OpenOrdersContent hasLoadMore wrapperClassname="lg:!p-0" />
          </div>
        ) : (
          <></>
        )}

        <OrderResultModal />
        <FaildOrderModal />
      </div>
    </>
  );
};

export default FastOrderBuyContent;
