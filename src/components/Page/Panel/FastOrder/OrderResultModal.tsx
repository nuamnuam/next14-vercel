import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import clsx from 'classnames';
import { Modal, Icon, Button, Chip } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang, useOrderHistoryData } from '@/hooks';
import {
  convertScientific,
  externalData,
  toPersianDigits,
  toPrice,
  toStraightNumber,
} from '@/utils';
import { IOrderResult } from '@/types/instanceTrade';
import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';

import { failedOrderModalName } from './FailedOrderModal';

export const orderResultModalName = 'order-result-modal';

const OrderResultModal: React.FC = () => {
  const [global, instantTrade] = useLang(['global', 'instantTrade']);

  const statusRef = useRef<string | undefined>(undefined);

  const currencyIconBaseUrl = useSettingValue(SETTINGS.CURRENCY_ICON_BASE_URL);
  const { update } = useOrderHistoryData();

  const { isDesktop } = useBreakpoint();
  const { closeSyncModal } = useModal(orderResultModalName);
  const { showSyncModal: showFailedOrderModal } =
    useModal(failedOrderModalName);
  const orderData = externalData.get() as IOrderResult;

  const handleDecimal = (val: number = 0, symbol: string) => {
    if (symbol === 'IRT') return toStraightNumber(Number(val).toFixed(0));
    if (symbol === 'USDT') return toStraightNumber(Number(val).toFixed(2));
    return toStraightNumber(Number(val));
  };

  const refreshedOrder = useMemo(() => {
    const order = orderData?.order_id
      ? update.find(({ order_id }) => order_id === Number(orderData.order_id))
      : undefined;
    if (order) {
      return order;
    }
    return undefined;
  }, [update, orderData]);

  const handleOrderStatus = useCallback(() => {
    const order = orderData?.order_id
      ? update.find(({ order_id }) => order_id === Number(orderData.order_id))
      : undefined;
    if (
      order &&
      order.status === 'failed' &&
      statusRef.current !== orderData.order_id
    ) {
      statusRef.current = orderData.order_id;
      closeSyncModal();
      showFailedOrderModal();
    }
  }, [update, orderData]);

  const items = useCallback(() => {
    if (!orderData) return [];
    return [
      {
        key: instantTrade.orderId,
        value: toPersianDigits(orderData.order_id),
      },
      {
        key: instantTrade.side,
        value: (
          <span
            className={clsx(
              'text-sm',
              orderData.side === 'BUY' ? 'text-primary-600' : 'text-danger-600',
            )}
          >
            {orderData.side === 'BUY' ? instantTrade.buy : instantTrade.sell}
          </span>
        ),
      },
      {
        key: instantTrade.orderType,
        value:
          orderData.type === 'MARKET'
            ? instantTrade.marketPrice
            : instantTrade.fixedPrice,
      },
      {
        key: instantTrade.unitPrice,
        value:
          orderData?.price || orderData?.price == 0 ? (
            <div className="flex gap-1">
              <span>
                {refreshedOrder?.price
                  ? toPrice(toStraightNumber(refreshedOrder.price))
                  : orderData.price
                  ? toPrice(toStraightNumber(orderData.price))
                  : 0}
              </span>
              <span>{orderData.price_unit}</span>
            </div>
          ) : null,
      },
      {
        key: instantTrade.fee,
        value: (
          <div className="flex gap-1">
            <span>(٪{toPrice(orderData.commission_percent)})</span>
            <span>
              {refreshedOrder?.commission
                ? toPrice(
                    handleDecimal(
                      Number(convertScientific(refreshedOrder.commission)),
                      orderData.commission_asset,
                    ),
                  )
                : toPrice(
                    handleDecimal(
                      Number(convertScientific(orderData.commission)),
                      orderData.commission_asset,
                    ),
                  )}
            </span>
            <span>{orderData.commission_asset}</span>
          </div>
        ),
      },
      {
        key: instantTrade.feeDiscount,
        value: `٪${toPrice(orderData.commission_discount)}`,
      },
      {
        key: instantTrade.earnedPrice,
        value: (
          <div className="flex gap-1">
            <span>
              {refreshedOrder?.total_qty
                ? toPrice(
                    handleDecimal(
                      +refreshedOrder.total_qty,
                      orderData?.to_asset_symbol,
                    ),
                  )
                : toPrice(
                    handleDecimal(
                      +orderData.total_qty,
                      orderData?.to_asset_symbol,
                    ),
                  )}
            </span>
            <span>{orderData?.to_asset_symbol}</span>
          </div>
        ),
      },
      {
        key: instantTrade.status,
        value:
          orderData.status === 1 || refreshedOrder?.status === 'succeeded' ? (
            <Chip label={instantTrade.done} variant="success" />
          ) : (
            <Chip label={instantTrade.pending} variant="warning" />
          ),
      },
    ];
  }, [orderData, refreshedOrder]);

  useEffect(() => handleOrderStatus(), [handleOrderStatus]);

  return (
    <Modal
      sync
      name={orderResultModalName}
      onClose={closeSyncModal}
      contentAddtionalClassNames="!pt-0 -mt-5"
      titleWrapperClassName="!pt-9"
      maxWidth={382}
      hasCloseAction
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="rounded-[13px] bg-primary-50 flex items-center justify-center p-2">
            <Icon
              icon="CheckCircle-OutLined"
              size={24}
              className="[&>*]:fill-primary-500"
            />
          </div>
          <h2 className="text-center font-bold text-dark-700">
            {instantTrade.orderSubmitted}
          </h2>
        </div>
        <div className="bg-dark-50 py-4 px-6 flex items-center justify-between rounded-lg mb-2">
          <div className="flex flex-col flex-1">
            <div className="flex gap-2 justify-end mb-2">
              <span className="text-dark-700 font-medium">
                {orderData?.to_asset_symbol}
              </span>
              <img
                src={`${currencyIconBaseUrl}/${orderData?.to_asset_symbol}.svg`}
                width={20}
                height={20}
                alt="media"
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            </div>
            <span className="text-dark-600 font-medium text-sm text-left">
              {refreshedOrder?.to_asset_amount
                ? toPrice(
                    handleDecimal(
                      +refreshedOrder?.to_asset_amount ?? 0,
                      orderData?.to_asset_symbol,
                    ),
                  )
                : toPrice(
                    handleDecimal(
                      +orderData?.to_asset_amount ?? 0,
                      orderData?.to_asset_symbol,
                    ),
                  )}
            </span>
          </div>
          <div className="flex items-center justify-center flex-1">
            <Icon icon="Right-OutLined" size={24} className="text-dark-100" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex gap-2 justify-end mb-2">
              <span className="text-dark-700 font-medium">
                {orderData?.from_asset_symbol}
              </span>
              <img
                src={`${currencyIconBaseUrl}/${orderData?.from_asset_symbol}.svg`}
                width={20}
                height={20}
                alt="media"
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
            </div>
            <span className="text-dark-600 font-medium text-sm text-left">
              {refreshedOrder?.from_asset_amount
                ? toPrice(
                    handleDecimal(
                      +refreshedOrder?.from_asset_amount ?? 0,
                      orderData?.from_asset_symbol,
                    ),
                  )
                : toPrice(
                    handleDecimal(
                      +orderData?.from_asset_amount ?? 0,
                      orderData?.from_asset_symbol,
                    ),
                  )}
            </span>
          </div>
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
      </div>
      <ModalFooter>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          fullWidth
          onClick={() => closeSyncModal()}
          className="lg:mt-1"
        >
          {global.confirm}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderResultModal;
