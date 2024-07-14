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
import { useBreakpoint, useLang } from '@/hooks';
import CoinsContent from '@/components/Common/Coins/CoinsContent';
import TwinInput from '@/components/Common/TwinInput';
import { toPrice } from '@/utils';
import OrderResultModal, {
  orderResultModalName,
} from '../../../OrderResultModal';
import { useInstanceTrade } from '../../../../../../../hooks';
import { BalanceCoinModel } from '@/types/wallet';
import { PriceSection } from '../../../components';
import { useModal } from '@/hooks/useModal';
import { useEffectOnce } from 'react-use';
import { useRouter } from 'next/router';
import FastOrderResTabs from '../../../components/FastOrderResTabs';
import OpenOrdersContent from '@/components/Page/Panel/Wallet/OpenOrders/components/OpenOrdersContent';
import { useOrderHistoryStore } from '@/store';

import FaildOrderModal from '../../../FailedOrderModal';

const FastOrderSellContent: React.FC = () => {
  const [instantTrade] = useLang(['instantTrade']);

  const { pathname, query, events, push, replace } = useRouter();

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
    side: 'SELL',
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
    if (!quote?.is_withdrawable)
      return (
        <InputAlert message={instantTrade.cantWithdraw} variant="warning" />
      );
    if (!singleCoinMarket || !quoteValue) return false;
    if (+quoteValue > +quoteMax)
      return (
        <InputAlert
          message={`${instantTrade.maxSellThisCoin} ${toPrice(quoteMax)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+quoteValue < +quoteMin)
      return (
        <InputAlert
          message={`${instantTrade.minSellThisCoin} ${toPrice(quoteMin)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
  };

  const assetCaption = () => {
    if (!singleCoinMarket || !assetValue) return false;
    if (+assetValue > +assetMax)
      return (
        <InputAlert
          message={`${instantTrade.maxSellThisCrypto} ${toPrice(assetMax)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+assetValue < +assetMin)
      return (
        <InputAlert
          message={`${instantTrade.minSellThisCrypto} ${toPrice(assetMin)} ${
            instantTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (asset && +assetValue > +asset.balance_available)
      return <InputAlert message={instantTrade.noBalance} variant="danger" />;
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
                ignoredCoins={['IRT']}
                otcTradeable={true}
                showBalance
                setItemClassNames={(coin) =>
                  !coin.otc_tradeable ? 'opacity-70 !cursor-not-allowed' : ''
                }
                hasNetworkParam={false}
              />
            </div>
            <div className="w-full p-4 md:py-8 md:px-10 lg:w-7/12 lg:flex flex-col">
              <div className="mb-4">
                <TwinInput
                  type="modal"
                  ignoredCoins={['IRT']}
                  otcTradeable={true}
                  label={instantTrade.iPay}
                  value={assetValue}
                  setValue={onAssetValueChange}
                  selectedCoin={asset}
                  setSelectedCoin={handleSelectAsset}
                  decimal={assetDecimal}
                  hasList={!isDesktop}
                  showBalance
                  loading={assetCoinLoading}
                  error={
                    assetValue && singleCoinMarket
                      ? +assetValue > +assetMax ||
                        +assetValue < +assetMin ||
                        assetValue > +asset?.balance_available!
                      : false
                  }
                  caption={assetCaption()}
                  setItemClassNames={(coin) =>
                    !coin.otc_tradeable ? 'opacity-70 !cursor-not-allowed' : ''
                  }
                />
              </div>
              <div className="mb-14">
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
              </div>
              <div className="mb-6">
                <TwinInput
                  label={instantTrade.iEarn}
                  value={quoteValue}
                  setValue={onQuoteValueChange}
                  decimal={quoteDecimal}
                  selectedCoin={quote}
                  error={
                    quoteValue
                      ? quoteValue > +quoteMax || quoteValue < +quoteMin
                      : false
                  }
                  caption={quoteCaption()}
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
                  {instantTrade.sell}
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

export default FastOrderSellContent;
