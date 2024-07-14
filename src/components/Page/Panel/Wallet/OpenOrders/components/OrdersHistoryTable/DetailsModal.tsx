import React, { useMemo } from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import moment from 'jalali-moment';
import { Collapse } from '@mui/material';

import { Modal, Icon, Button, Chip, Alert, Spinner } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useOrderDetail } from '@/requests/market/orderDetailQuery';
import {
  convertScientific,
  externalData,
  toPersianDigits,
  toPrice,
  toStraightNumber,
} from '@/utils';
import useSettingValue, { SETTINGS } from '@/hooks/useSettingValue';
import { useLang } from '@/hooks';

import { CustomToolTop, ORDER_TYPE_ICONS } from '../..';
import { useRouter } from 'next/router';

export const openOrderDetailsModalName = 'open-order-details-modal';

interface Props {
  order_info: string;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DetailsModal: React.FC<Props> = ({ order_info, setSelectedRowId }) => {
  const [wallet] = useLang(['wallet']);

  const router = useRouter();

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const currencyIconBaseUrl = useSettingValue(SETTINGS.CURRENCY_ICON_BASE_URL);
  const { closeSyncModal } = useModal(openOrderDetailsModalName);

  const order_id = Number(order_info.split('-')[0]);
  const order_type = order_info.split('-')[1];
  const Type = ORDER_TYPE_ICONS[order_type as 'P2P' | 'OTC' | 'CONVERT'];

  const { data, isLoading } = useOrderDetail(order_id);
  const orderDetail = data?.result;

  const handleDecimal = (val: number = 0, symbol: string) => {
    if (symbol === 'IRT') return toStraightNumber(Number(val).toFixed(0));
    if (symbol === 'USDT') return toStraightNumber(Number(val).toFixed(2));
    return toStraightNumber(Number(val));
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
              <span>
                {toPrice(
                  convertScientific(toStraightNumber(orderDetail.price)) || 0,
                )}
              </span>
              <span>{orderDetail.price_unit}</span>
            </div>
          ) : null,
      },
      {
        key: wallet.totalFee,
        value: (
          <div className="flex gap-1">
            <span>(٪{toPrice(orderDetail.commission_percent)})</span>
            <span>
              {toPrice(
                convertScientific(
                  handleDecimal(
                    Number(orderDetail.commission),
                    orderDetail.commission_asset,
                  ),
                ) || 0,
              )}
            </span>
            <span>{orderDetail.commission_asset}</span>
          </div>
        ),
      },
      {
        key: wallet.feeLevelDiscount,
        value: `٪${toPrice(orderDetail.commission_discount)}`,
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
              {orderDetail.receiving_qty &&
              Number(orderDetail.receiving_qty) > 0
                ? toPrice(
                    convertScientific(
                      handleDecimal(
                        +(orderDetail.receiving_qty || 0),
                        orderDetail?.to_asset_symbol,
                      ),
                    ) || 0,
                  )
                : '۰'}
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

  const tradeItems = useMemo(() => {
    if (!orderDetail || !orderDetail?.trades?.length) return [];
    return orderDetail?.trades.map((trade) => {
      return [
        {
          key: wallet.date,
          value: (
            <span className="text-dark-700 text-xs font-normal">
              {toPersianDigits(
                moment(trade.trade_create_at)
                  .locale('fa')
                  .format('HH:mm:ss YYYY/M/D'),
              )}
            </span>
          ),
        },
        {
          key: wallet.orderAmount,
          value: (
            <span className="text-dark-700 text-xs font-normal">
              {orderDetail.to_asset_symbol}{' '}
              {toPrice(convertScientific(trade.trade_qty) || 0)}
            </span>
          ),
        },
        {
          key: wallet.unitPrice,
          value: (
            <span className="text-dark-700 text-xs font-normal">
              {orderDetail.from_asset_symbol}{' '}
              {toPrice(convertScientific(Number(trade.trade_price)) || 0)}
            </span>
          ),
        },
        {
          key: wallet.totalPrice,
          value: (
            <span className="text-dark-700 text-xs font-normal">
              {orderDetail.from_asset_symbol}{' '}
              {toPrice(convertScientific(trade.trade_total) || 0)}
            </span>
          ),
        },
        {
          key: wallet.commission,
          value: (
            <span className="text-dark-700 text-xs font-normal">
              {orderDetail.to_asset_symbol}{' '}
              {toPrice(convertScientific(trade.trade_commission) || 0)}
            </span>
          ),
        },
      ];
    });
  }, [orderDetail]);

  const onTicketClick = () => {
    const payload = {
      type: 'O',
      transactionId: orderDetail?.order_id,
      subjectId: orderDetail?.ticket_default_subject_id,
      departmentId: orderDetail?.ticket_department_id,
      callbackUrl: router.pathname,
    };

    externalData.set({ type: 'ticket', data: payload });
  };

  return (
    <Modal
      name={openOrderDetailsModalName}
      onClose={() => {
        setSelectedRowId(undefined);
        closeSyncModal();
      }}
      hasCloseAction
      sync
      titleWrapperClassName="!pt-9"
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
                      <span className="block w-1/2 text-xs text-dark-400">
                        {item.key}
                      </span>
                      <span className="block max-w-[50%] break-words text-left text-xs text-dark-700">
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
            <div className="bg-gold-1 py-2 px-4 rounded-lg flex items-center justify-between">
              <Alert
                message={wallet.needSupport}
                variant="warning"
                className="!p-0"
              />
              <Link
                href={
                  orderDetail?.ticket_id
                    ? `/panel/support/tickets/${orderDetail.ticket_id}`
                    : '/panel/support/new-ticket'
                }
              >
                <Button size="sm" variant="secondary" onClick={onTicketClick}>
                  {orderDetail?.ticket_id
                    ? wallet.showTicket
                    : wallet.sendTicket}
                </Button>
              </Link>
            </div>
            <div
              className="flex items-center justify-between py-3 cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="block w-1/2 text-md text-primary-600 text-bold">
                <Icon
                  icon="CheckList-OutLined"
                  size={20}
                  className="[&>*]:fill-primary-600 ml-2"
                />
                {wallet.doneTrades}
              </span>
              <span className="block max-w-[50%] break-words text-left text-md text-dark-600">
                <Icon
                  icon={expanded ? 'Up-OutLined' : 'Down-OutLined'}
                  size={12}
                  className="text-primary-600"
                />
              </span>
            </div>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <div>
                {tradeItems.map((item) => {
                  return (
                    <div className="bg-dark-50 p-2 rounded-md my-4">
                      {item.map((row, idx) => {
                        const isLastrow = idx === item.length - 1;
                        return (
                          <>
                            <div className="flex items-center justify-between py-3">
                              <span className="block w-1/2 text-xs text-dark-300">
                                {row.key}
                              </span>
                              <span className="block max-w-[50%] break-words text-left text-xs text-dark-600">
                                {row.value}
                              </span>
                            </div>
                            {!isLastrow && <hr className="divide-dark-500" />}
                          </>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </Collapse>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DetailsModal;
