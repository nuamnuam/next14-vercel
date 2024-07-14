import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import {
  BalanceProgress,
  Button,
  FormGroup,
  FormInput,
  InputAlert,
  PairInput,
} from '@/components';
import { useSell, useProfile, useBreakpoint, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
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
import { useSubmitP2POrderMutation } from '@/requests/advance-trade/submitOrderMutation';

import {
  PreSellOrderResultModal,
  preSellOrderResultModalName,
} from '../../Modals/';

const Sell = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { token } = authStore();
  const isLogin = !!token;

  const { isDesktop } = useBreakpoint();
  const { data: userInfo } = useProfile();

  const { baseAsset, quoteAsset, pair, quoteBalance, assetBalance, sellPrice } =
    useAdvanceTradeStore();
  const { price, type, amount, qty, set_price, set_qty, set_amount, reset } =
    useSubmitSellP2POrderStore();
  const buyStore = useSubmitBuyP2POrderStore();

  const { showSyncModal, closeSyncModal } = useModal(
    preSellOrderResultModalName,
  );

  const { mutateAsync, isPending: isLoading } = useSubmitP2POrderMutation();

  // MARKET
  const {
    assetDecimal,
    assetValue,
    assetMax,
    assetMin,
    pairDetail,
    isSubmitDisabled,
    onAssetValueChange,
    quoteMax,
    quoteMin,
    quoteDecimal,
    tickSize,
  } = useSell({
    baseAsset,
    quoteAsset,
    pairDetail: pair!,
    userPrice: price || 0,
    quote: quoteBalance!,
    asset: assetBalance!,
    priceType: type,
  });

  const lastPrice = sellPrice || 0;

  // HANDLERS
  const submitOrder = async () => {
    try {
      const pair = `${baseAsset}${quoteAsset}`;
      const { result } = await mutateAsync({
        type,
        side: 'SELL',
        pair,
        qty: fixFloatingNum(amount, assetDecimal).toString(),
        user_price: type === 'LIMIT' && price ? price.toString() : undefined,
      });
      if (result) {
        queryClient.invalidateQueries({ queryKey: ['get-order-histories'] });
        reset(type);
        buyStore.reset(type);
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
          message={`${advancedTrade.maxSellThis} ${toPrice(assetMax)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+assetValue < +assetMin)
      return (
        <InputAlert
          message={`${advancedTrade.minSellThis} ${toPrice(assetMin)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (assetBalance && +assetValue > +assetBalance.balance_available)
      return <InputAlert message={advancedTrade.noBalance} variant="danger" />;
  };

  const qtyCaption = () => {
    if (!qty) return false;
    if (+qty > +quoteMax)
      return (
        <InputAlert
          message={`${advancedTrade.maxSellThis} ${toPrice(quoteMax)} ${
            advancedTrade.isUnits
          }`}
          variant="danger"
        />
      );
    if (+qty < +quoteMin)
      return (
        <InputAlert
          message={`${advancedTrade.minSellThis} ${toPrice(quoteMin)} ${
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
      if (type === 'LIMIT') {
        result = assetValue * (price || 0);
      } else if (type === 'MARKET' && lastPrice) {
        result = assetValue * Number(lastPrice);
      }
    }
    set_qty(Number(fixFloatingNum(result, quoteDecimal)));
  }, [lastPrice, price, type, amount]);

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
    onAssetValueChange(undefined);
  }, [quoteAsset, baseAsset]);

  useEffect(() => {
    getTotalValue();
  }, [getTotalValue]);

  useEffect(() => {
    reset(type);
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
          name="price"
          placeholder={
            type === 'MARKET'
              ? advancedTrade.bestMarketPrice
              : advancedTrade.sellPrice
          }
          onlyNumber
          decimal={type === 'MARKET' ? quoteDecimal : tickSize}
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
          placeholder={advancedTrade.sellAmount}
          label={undefined}
          value={assetValue}
          setValue={onAssetValueChange}
          decimal={assetDecimal}
          selectedCoin={assetBalance}
          caption={quoteCaption()}
          leftIcon={baseAsset}
          error={
            assetValue && assetBalance
              ? assetValue > +assetMax ||
                assetValue < +assetMin ||
                assetValue > +assetBalance?.balance_available
              : false
          }
        />
      </FormGroup>
      <BalanceProgress
        total={Number(assetBalance?.balance_available ?? 0)}
        value={assetValue ?? 0}
        decimal={assetDecimal}
        onChange={onAssetValueChange}
        max={Number(assetBalance?.balance_available ?? 0)}
        symbol={baseAsset}
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
          className={
            'bg-danger-500 border-danger-500 hover:bg-danger-600 focus:border-danger-600 focus:bg-danger-600 hover:border-danger-600'
          }
          onClick={handleSubmit}
          isLoading={isLoading}
          disableWithoutAffect
        >
          {advancedTrade.sell} {baseAsset}
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

      <PreSellOrderResultModal
        assetDecimal={assetDecimal}
        onAssetValueChange={onAssetValueChange}
        lastPrice={lastPrice}
      />
    </>
  );
};

export default Sell;
