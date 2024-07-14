import React, { useMemo } from 'react';
import clsx from 'classnames';
import moment from 'jalali-moment';

import { Modal, Icon, Button, Chip, Spinner } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useOrderDetail } from '@/requests/market/orderDetailQuery';
import { toPersianDigits, toPrice, toStraightNumber } from '@/utils';
import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';
import { useCancelOrderMutation } from '@/requests/market/cancelOrderMutation';

import { CustomToolTop, ORDER_TYPE_ICONS } from '../..';
import { useLang } from '@/hooks';

export const openOrderDetailsModalName = 'open-order-details-modal';

interface Props {
  order_info: string;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: () => void;
}

const DetailsModal: React.FC<Props> = ({
  order_info,
  setSelectedRowId,
  refetch,
}) => {
  const [wallet] = useLang(['wallet']);

  const order_id = Number(order_info.split('-')[0]);
  const order_type = order_info.split('-')[1];
  const Type = ORDER_TYPE_ICONS[order_type as 'P2P' | 'OTC' | 'CONVERT'];

  const currencyIconBaseUrl = useSettingValue(SETTINGS.CURRENCY_ICON_BASE_URL);
  const { closeSyncModal } = useModal(openOrderDetailsModalName);
  const { mutateAsync, isPending: isCancelling } = useCancelOrderMutation();
  const { data, isLoading } = useOrderDetail(order_id);

  const orderDetail = data?.result;

  const handleDecimal = (val: number = 0, symbol: string) => {
    if (symbol === 'IRT') return toStraightNumber(Number(val).toFixed(0));
    if (symbol === 'USDT') return toStraightNumber(Number(val).toFixed(2));
    return toStraightNumber(Number(val));
  };

  const handleCancelOrder = async (order_id: number) => {
    refetch();
    closeSyncModal();
    setSelectedRowId(undefined);
    await mutateAsync({ order_id, order_type });
  };

  const items = useMemo(() => {
    if (!orderDetail) return [];
    return [
      {
        key: wallet.orderId,
        value: toPersianDigits(orderDetail.order_id),
      },
      {
        key: wallet.side,
        value: (
          <span
            className={clsx(
              'text-sm',
              orderDetail.side === 'BUY'
                ? 'text-primary-600'
                : 'text-danger-600',
            )}
          >
            {orderDetail.side === 'BUY' ? wallet.buy : wallet.sell}
          </span>
        ),
      },
      {
        key: wallet.orderType,
        value:
          orderDetail.type === 'MARKET'
            ? wallet.marketPrice
            : wallet.fixedPrice,
      },
      {
        key: wallet.unitPrice,
        value:
          orderDetail?.price || Number(orderDetail?.price) == 0 ? (
            <div className="flex gap-1">
              <span>{toPrice(toStraightNumber(orderDetail.price) || 0)}</span>
              <span>{orderDetail.price_unit}</span>
            </div>
          ) : null,
      },
      {
        key: wallet.filledAmount,
        value: (
          <div className="flex gap-1">
            <span>(٪{toPrice(orderDetail.trade_fill_percent)})</span>
            <span>
              {+orderDetail?.trade_fill_amount
                ? toPrice(
                    handleDecimal(
                      +orderDetail?.trade_fill_amount ?? 0,
                      orderDetail?.base_asset || '',
                    ),
                  )
                : toPrice(0)}
            </span>
            <span>{orderDetail.base_asset || ''}</span>
          </div>
        ),
      },
      {
        key: wallet.totalPrice,
        value: (
          <div className="flex gap-1">
            <span>
              {Number(orderDetail.total_qty) > 0
                ? toPrice(
                    handleDecimal(
                      +(orderDetail.total_qty || 0),
                      orderDetail?.quote_asset || '',
                    ),
                  )
                : toPrice(0)}
            </span>
            <span>{orderDetail?.quote_asset || ''}</span>
          </div>
        ),
      },
      {
        key: wallet.earned,
        value: (
          <div className="flex gap-1">
            <span>
              {Number(orderDetail.receiving_qty) > 0
                ? toPrice(
                    handleDecimal(
                      +(orderDetail.receiving_qty || 0),
                      orderDetail?.to_asset_symbol,
                    ),
                  )
                : toPrice(0)}
            </span>
            <span>{orderDetail?.to_asset_symbol}</span>
          </div>
        ),
      },
      {
        key: wallet.createdAt,
        value: (
          <div className="flex gap-1">
            <span>
              {orderDetail.created_at
                ? toPersianDigits(
                    moment(orderDetail.created_at)
                      .locale('fa')
                      .format('HH:mm:ss YYYY/M/D'),
                  )
                : '---'}
            </span>
          </div>
        ),
      },
      {
        key: wallet.status,
        value:
          orderDetail.status === 1 ? (
            <Chip label={wallet.ended} variant="success" />
          ) : (
            <Chip label={wallet.inProgress} variant="warning" />
          ),
      },
    ];
  }, [orderDetail]);

  return (
    <Modal
      name={openOrderDetailsModalName}
      onClose={() => {
        setSelectedRowId(undefined);
        closeSyncModal();
      }}
      hasCloseAction
      contentAddtionalClassNames="!pt-0 -mt-5"
      titleWrapperClassName="!pt-9"
      sync
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="rounded-[13px] bg-gray-100 flex items-center justify-center p-2">
                <CustomToolTop title={Type.title}>
                  <span>
                    <Type.Icon />
                  </span>
                </CustomToolTop>
              </div>
              <h2 className="text-center font-bold text-dark-700">
                {Type.title}
              </h2>
            </div>
            <div className="bg-dark-50 py-4 px-6 flex items-center justify-between rounded-lg mb-2">
              <div className="flex flex-col flex-1">
                <div className="flex gap-2 justify-end mb-2">
                  <span className="text-dark-700 font-medium">
                    {orderDetail?.to_asset_symbol}
                  </span>
                  <img
                    src={`${currencyIconBaseUrl}/${orderDetail?.to_asset_symbol}.svg`}
                    width={20}
                    height={20}
                    alt="media"
                  />
                </div>
                {orderDetail?.to_asset_amount && (
                  <span className="text-dark-600 font-medium text-sm text-left">
                    {toPrice(
                      handleDecimal(
                        +orderDetail?.to_asset_amount ?? 0,
                        orderDetail?.to_asset_symbol,
                      ),
                    )}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center flex-1">
                <Icon
                  icon="Right-OutLined"
                  size={24}
                  className="text-dark-100"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex gap-2 justify-end mb-2">
                  <span className="text-dark-700 font-medium">
                    {orderDetail?.from_asset_symbol}
                  </span>
                  <img
                    src={`${currencyIconBaseUrl}/${orderDetail?.from_asset_symbol}.svg`}
                    width={20}
                    height={20}
                    alt="media"
                  />
                </div>
                {orderDetail?.from_asset_amount && (
                  <span className="text-dark-600 font-medium text-sm text-left">
                    {toPrice(
                      handleDecimal(
                        +orderDetail?.from_asset_amount ?? 0,
                        orderDetail?.from_asset_symbol,
                      ),
                    )}
                  </span>
                )}
              </div>
            </div>
            <div>
              {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                if (!item.value) return null;
                return (
                  <>
                    <div className="flex items-center justify-between py-3">
                      <span className="block w-1/2 text-xs text-dark-300">
                        {item.key}
                      </span>
                      <span className="block max-w-[50%] break-words text-left text-xs text-dark-600">
                        {item.value}
                      </span>
                    </div>
                    {!isLast ? (
                      <hr className="w-full h-[.5px] border border-dark-50 bg-dark-50" />
                    ) : null}
                  </>
                );
              })}
            </div>
          </div>
          <ModalFooter>
            <div className="flex gap-4 mt-4">
              <Button
                size="lg"
                fullWidth
                className="flex-1"
                onClick={() => {
                  setSelectedRowId(undefined);
                  closeSyncModal();
                }}
                variant="dark"
              >
                {wallet.cancel}
              </Button>
              <Button
                size="lg"
                fullWidth
                className="flex-1 border-danger-500 bg-danger-500 hover:border-danger-600 hover:bg-danger-600 focus:border-danger-600 focus:bg-danger-600"
                onClick={async () => await handleCancelOrder(order_id)}
                isLoading={isCancelling}
              >
                {wallet.cancelOrder}
              </Button>
            </div>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
};

export default DetailsModal;
