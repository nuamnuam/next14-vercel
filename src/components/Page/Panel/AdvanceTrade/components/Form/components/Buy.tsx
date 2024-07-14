import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

import {
  BalanceProgress,
  Button,
  FormGroup,
  FormInput,
  InputAlert,
  PairInput,
} from '@/components';
import { useBreakpoint, useBuy, useLang, useProfile } from '@/hooks';
import {
  authStore,
  useAdvanceTradeStore,
  useSubmitBuyP2POrderStore,
  useSubmitSellP2POrderStore,
} from '@/store';
import {
  fixFloatingNum,
  handleDecimal,
  normalizeScientificNumber,
  toPrice,
} from '@/utils';
import { useModal } from '@/hooks/useModal';
import { useSubmitP2POrderMutation } from '@/requests/advance-trade/submitOrderMutation';

import {
  PreBuyOrderResultModal,
  preBuyOrderResultModalName,
} from '../../Modals';

const Buy = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { token } = authStore();
  const isLogin = !!token;

  const { isDesktop } = useBreakpoint();
  const { data: userInfo } = useProfile();

  const { baseAsset, quoteAsset, pair, assetBalance, quoteBalance, buyPrice } =
    useAdvanceTradeStore();
  const { price, type, amount, qty, set_price, set_qty, set_amount, reset } =
    useSubmitBuyP2POrderStore();
  const sellStore = useSubmitSellP2POrderStore();

  const { showSyncModal, closeSyncModal } = useModal(
    preBuyOrderResultModalName,
  );

  const { mutateAsync, isPending: isLoading } = useSubmitP2POrderMutation();

  // MARKET
  const {
    quoteValue,
    assetDecimal,
    assetValue,
    assetMax,
    assetMin,
    pairDetail,
    isSubmitDisabled,
    quoteDecimal,
    quoteMax,
    quoteMin,
    tickSize,
    onAssetValueChange,
    onQuoteValueChange,
  } = useBuy({
    quoteAsset,
    pairDetail: pair!,
    userPrice: price || 0,
    quote: quoteBalance!,
    asset: assetBalance!,
    priceType: type,
  });

  const lastPrice = buyPrice || 0;

  // HANDLERS
  const submitOrder = async () => {
    try {
      const pair = `${baseAsset}${quoteAsset}`;
      const { result } = await mutateAsync({
        type,
        side: 'BUY',
        pair,
        qty: fixFloatingNum(amount, assetDecimal).toString(),
        user_price: type === 'LIMIT' && price ? price.toString() : undefined,
      });
      if (result) {
        queryClient.invalidateQueries({ queryKey: ['get-order-histories'] });
        reset(type);
        sellStore.reset(type);
        onAssetValueChange(undefined);
        closeSyncModal();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleSubmit = async () => {
    if (userInfo?.settings.order_submit_confirm) {
      return showSyncModal();
    }
    return await submitOrder();
  };

  const quoteCaption = () => {
    if (!pairDetail || !assetValue) return false;

    if (+assetValue > +assetMax)
      return (
        <InputAlert
          message={`${advancedTrade.maxBuyThis} ${toPrice(assetMax)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+assetValue < +assetMin)
      return (
        <InputAlert
          message={`${advancedTrade.minBuyThis} ${toPrice(assetMin)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
  };

  const qtyCaption = () => {
    if (!qty) return false;
    if (quoteBalance && qty && +qty > +quoteBalance.balance_available)
      return <InputAlert message={advancedTrade.noBalance} variant="danger" />;
    if (+qty > +quoteMax)
      return (
        <InputAlert
          message={`${advancedTrade.maxBuyThis} ${toPrice(quoteMax)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+qty < +quoteMin)
      return (
        <InputAlert
          message={`${advancedTrade.minBuyThis} ${toPrice(quoteMin)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
  };

  const onTotalValueChange = (value: number) => {
    if (price || lastPrice) {
      return onAssetValueChange(value / (price || lastPrice));
    }
  };

  // EFFECTS
  const getTotalValue = useCallback(() => {
    let result = 0;
    if (assetValue) {
      if (type === 'LIMIT' && price) {
        result = assetValue * (price || 0);
      } else if (type === 'MARKET') {
        result =
          assetValue *
          Number(
            quoteAsset === 'USDT'
              ? pair?.stats.lastPriceUsd
              : pair?.stats.lastPrice,
          );
      }
    }
    set_qty(Number(fixFloatingNum(result, quoteDecimal)));
  }, [lastPrice, price, type, amount, assetValue]);

  useEffect(() => {
    set_amount(assetValue || 0);
  }, [assetValue]);

  useEffect(() => {
    if (lastPrice) {
      set_price(
        Number(handleDecimal(lastPrice, Number(pair?.quotePrecision) || 0)),
      );
    }
  }, [lastPrice]);

  useEffect(() => {
    reset('LIMIT');
    onQuoteValueChange(undefined);
    onAssetValueChange(undefined);
  }, [quoteAsset, baseAsset]);

  useEffect(() => {
    getTotalValue();
  }, [getTotalValue]);

  useEffect(() => {
    reset(type);
    onQuoteValueChange(undefined);
    onAssetValueChange(undefined);
    if (type === 'LIMIT') {
      set_price(
        Number(handleDecimal(lastPrice, Number(pair?.quotePrecision) || 0)),
      );
    }
  }, [type]);

  return (
    <>
      <FormGroup>
        <FormInput
          size={isDesktop ? 'lg' : 'sm'}
          decimal={type === 'MARKET' ? quoteDecimal : tickSize}
          name="price"
          placeholder={
            type === 'MARKET'
              ? advancedTrade.bestMarketPrice
              : advancedTrade.buyPrice
          }
          onlyNumber
          className="mt-1"
          leftIcon={type === 'LIMIT' ? quoteAsset : ''}
          value={
            type === 'LIMIT' && price ? toPrice(price.toString()) : undefined
          }
          onChange={(value) => set_price(value)}
          disabled={type === 'MARKET'}
          caption={
            type === 'MARKET' ? (
              <InputAlert message={advancedTrade.bestMarketPriceMsg} />
            ) : (
              <></>
            )
          }
        />
      </FormGroup>
      <FormGroup>
        <PairInput
          size={isDesktop ? 'lg' : 'sm'}
          placeholder={advancedTrade.buyAmount}
          label={undefined}
          value={assetValue}
          setValue={onAssetValueChange}
          decimal={assetDecimal}
          selectedCoin={assetBalance}
          caption={quoteCaption()}
          leftIcon={baseAsset}
          error={
            assetValue && quoteValue && quoteBalance
              ? assetValue > +assetMax ||
                assetValue < +assetMin ||
                quoteValue > +quoteBalance?.balance_available
              : false
          }
        />
      </FormGroup>
      <BalanceProgress
        total={Number(quoteBalance?.balance_available ?? 0)}
        value={quoteValue ?? 0}
        decimal={quoteDecimal}
        onChange={onQuoteValueChange}
        max={Number(quoteBalance?.balance_available ?? 0)}
        symbol={quoteAsset}
        label={advancedTrade.balance}
        showPercent={isDesktop}
      />
      <FormGroup>
        <FormInput
          size={isDesktop ? 'lg' : 'sm'}
          name="total"
          placeholder={advancedTrade.equal}
          onlyNumber
          className="mt-1 lg:mt-6"
          leftIcon={quoteAsset}
          disabled={type === 'MARKET' ? !lastPrice : !price}
          value={
            qty ? toPrice(normalizeScientificNumber(qty.toString())) : undefined
          }
          onChange={onTotalValueChange}
          decimal={quoteDecimal}
          caption={qtyCaption()}
        />
      </FormGroup>
      {isLogin ? (
        <Button
          fullWidth
          size={isDesktop ? 'lg' : 'md'}
          disabled={
            type === 'LIMIT' ? !price || isSubmitDisabled : isSubmitDisabled
          }
          onClick={handleSubmit}
          isLoading={isLoading}
          disableWithoutAffect
        >
          {advancedTrade.buy} {baseAsset}
        </Button>
      ) : (
        <Button
          fullWidth
          size={isDesktop ? 'lg' : 'md'}
          variant="dashed"
          className="text-dark-700 text-sm font-medium"
          onClick={async () => await router.push('/auth/login')}
        >
          {advancedTrade.loginRegister}
        </Button>
      )}

      <PreBuyOrderResultModal
        assetDecimal={assetDecimal}
        onAssetValueChange={onAssetValueChange}
      />
    </>
  );
};

export default Buy;
