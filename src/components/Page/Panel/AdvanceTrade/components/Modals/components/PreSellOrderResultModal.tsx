import React, { useCallback, useState } from 'react';

import { Modal, Icon, Button, CheckBox, Spinner } from '@/components';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang } from '@/hooks';
import {
  convertScientific,
  fixFloatingNum,
  handleDecimal,
  toPrice,
} from '@/utils';
import {
  useAdvanceTradeStore,
  useOrderHistoryStore,
  useSubmitBuyP2POrderStore,
  useSubmitSellP2POrderStore,
} from '@/store';
import useOrderCommission from '@/requests/market/orderCommission';
import { useSubmitP2POrderMutation } from '@/requests/advance-trade/submitOrderMutation';
import { useEditSettingMutation } from '@/requests/panel/my-account/profile/editSetting';

import { preSellOrderResultModalName } from '..';

type Props = {
  assetDecimal: number;
  lastPrice: number;
  onAssetValueChange: (amount: number | undefined) => void;
};

const PreSellOrderResultModal: React.FC<Props> = ({
  assetDecimal,
  lastPrice,
  onAssetValueChange,
}) => {
  const [global, advancedTrade] = useLang(['global', 'advancedTrade']);

  const [showPreOrderModal, setShowPreOrderModal] = useState<boolean>(false);

  const { quoteAsset, baseAsset, pair } = useAdvanceTradeStore();
  const { type, qty, price, amount, reset } = useSubmitSellP2POrderStore();
  const buyStore = useSubmitBuyP2POrderStore();
  const { refetch, set_refetch } = useOrderHistoryStore();

  const { isLoading, data: orderCommission } = useOrderCommission(
    pair?.pair_id,
  );
  const { mutateAsync, isPending: isMutating } = useSubmitP2POrderMutation();
  const { mutateAsync: mutateSetting } = useEditSettingMutation();

  const { isDesktop } = useBreakpoint();

  const { closeSyncModal } = useModal(preSellOrderResultModalName);

  const updateSetting = async () => {
    const formData = {
      settings: {
        order_submit_confirm: false,
      },
    };
    await mutateSetting(formData);
  };

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
        if (showPreOrderModal) {
          updateSetting();
        }
        set_refetch(!refetch);
        reset(type);
        buyStore.reset(type);
        onAssetValueChange(undefined);
        closeSyncModal();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const items = useCallback(() => {
    if (!quoteAsset) return [];
    const commission =
      amount *
      (type === 'MARKET' ? lastPrice : price || 0) *
      (Number(orderCommission?.result.commission_percent) / 100 || 1);

    const precision = Number(pair?.quotePrecision) || 0;

    return [
      {
        key: advancedTrade.market,
        value: (
          <span className="text-sm text-dark-600">
            {baseAsset}/{quoteAsset}
          </span>
        ),
      },
      {
        key: advancedTrade.orderTYpe,
        value: (
          <span className="text-sm text-dark-600">
            {type === 'MARKET'
              ? advancedTrade.marketPrice
              : advancedTrade.fixedPrice}
          </span>
        ),
      },
      {
        key: advancedTrade.unitPrice,
        value: (
          <span className="text-sm text-dark-600">
            {type === 'MARKET'
              ? advancedTrade.marketPrice
              : toPrice(price || 0)}
          </span>
        ),
      },
      {
        key: advancedTrade.amount,
        value: (
          <span className="flex justify-center text-sm text-dark-600">
            <div className="flex gap-1">
              {toPrice(handleDecimal(amount, precision))}
              <span>{baseAsset}</span>
            </div>
          </span>
        ),
      },
      {
        key: advancedTrade.fee,
        value: (
          <span className="flex justify-center text-sm text-dark-600">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="flex gap-1">
                <span>
                  (٪{toPrice(orderCommission?.result.commission_percent || 0)})
                </span>
                <span>
                  {toPrice(
                    handleDecimal(
                      Number(convertScientific(commission)),
                      precision,
                    ) || 0,
                  )}
                </span>
                <span>{quoteAsset}</span>
              </div>
            )}
          </span>
        ),
      },
      {
        key: advancedTrade.earnAmount,
        value: (
          <span className="flex justify-center text-sm text-dark-600 gap-1">
            {toPrice(
              handleDecimal(
                amount * (type === 'MARKET' ? lastPrice : price || 0) -
                  commission,
                precision,
              ),
            )}
            <span>{quoteAsset}</span>
          </span>
        ),
      },
    ];
  }, [
    quoteAsset,
    baseAsset,
    type,
    price,
    qty,
    pair?.pair_id,
    amount,
    orderCommission,
    lastPrice,
  ]);

  return (
    <>
      <Modal
        sync
        name={preSellOrderResultModalName}
        onClose={closeSyncModal}
        contentAddtionalClassNames="!pt-0 -mt-5"
        titleWrapperClassName="!pt-9"
        maxWidth={382}
      >
        <div className="flex flex-col">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div
              className={`rounded-[13px] bg-danger-50 flex items-center justify-center p-4`}
            >
              <Icon
                icon={'Sell-OutLined'}
                size={24}
                className={`[&>*]:fill-danger-500`}
              />
            </div>
            <h2 className="text-center font-bold text-dark-700">
              {advancedTrade.sellOrder}
            </h2>
            <hr className="w-full border-t border-dark-50 bg-dark-50" />
          </div>
          <div>
            {items().map((item) => {
              if (!item.value) return null;
              return (
                <div className="flex items-center justify-between py-3">
                  <span className="block w-1/2 text-xs text-dark-300">
                    {item.key}
                  </span>
                  <span className="block max-w-[50%] break-words text-left text-xs text-dark-600">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
          <hr className="w-full border-t border-dark-50 bg-dark-50" />
          <div className="py-2">
            <CheckBox
              label={
                <div className="text-sm text-dark-700">
                  {advancedTrade.dontShowThisPage}
                </div>
              }
              isChecked={showPreOrderModal}
              handleInputChange={() => setShowPreOrderModal(true)}
              error={false}
            />
          </div>
        </div>
        <ModalFooter>
          <div className="w-full flex gap-4 lg:mt-1">
            <Button
              size={isDesktop ? 'lg' : 'md'}
              fullWidth
              variant="dark"
              onClick={() => closeSyncModal()}
              className="flex flex-col"
            >
              {global.cancel}
            </Button>
            <Button
              size={isDesktop ? 'lg' : 'md'}
              fullWidth
              onClick={submitOrder}
              className="flex flex-col"
              isLoading={isMutating}
            >
              {advancedTrade.submitOrder}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PreSellOrderResultModal;
