import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import moment from 'jalali-moment';

import { useModal } from '@/hooks/useModal';
import type { ISingleOrderHistory } from '@/types/market';
import { getLang, toPersianDigits, toPrice } from '@/utils';
import useOrderHistoryStore from '@/store/useOrderHistoryStore';
import { Button, EmptyTable, Pagination, Spinner } from '@/components';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useCancelOrderMutation } from '@/requests/market/cancelOrderMutation';
import { useLang, useProfile } from '@/hooks';
import { useOrderHistoriesQuery } from '@/requests/market/orderHistoryQuery';

import DetailsModal, { openOrderDetailsModalName } from './DetailsModal';
import Filters from './Filters';
import { CustomToolTop, ORDER_TYPE_ICONS } from '../..';

export type RowItem = {
  date: string;
  market: string | React.ReactNode;
  type: React.ReactNode;
  priceType: string;
  value: string;
  unitPrice: string;
  totalPrice: string;
  filledPrice: string;
  actions: React.ReactNode;
};

interface Props {
  showFilters: boolean;
  hasLoadMore?: boolean;
}

const [wallet] = getLang(['wallet']);

const DesktopTable: React.FC<Props> = ({ showFilters, hasLoadMore }) => {
  const router = useRouter();
  const [orders, setOrders] = useState<ISingleOrderHistory[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | undefined>(
    undefined,
  );

  const { page, side, from_date, to_date, pair, type, order_type, set_page } =
    useOrderHistoryStore();

  const { data, isLoading } = useOrderHistoriesQuery({
    page,
    per_page: router.pathname.includes('/open-orders') ? 10 : 5,
    status: '0',
    side,
    pair: pair?.symbol,
    from_date: from_date ? from_date?.replaceAll('/', '-') : undefined,
    to_date: to_date ? to_date?.replaceAll('/', '-') : undefined,
    type,
    order_type,
  });

  const { data: userInfo } = useProfile();

  const { showSyncModal: showDetailsModal } = useModal(
    openOrderDetailsModalName,
  );

  const { mutateAsync } = useCancelOrderMutation();

  const showRowModal = (row: RowItem, cellName: string | number | symbol) => {
    if (cellName === 'actions') {
      showDetailsModal();
      return;
    }
    setSelectedRowId((row?.actions as any).key);
    return showDetailsModal();
  };

  useEffect(() => {
    if (data?.result) {
      setOrders(data?.result);
    }
  }, [data?.result]);

  const transformedData = useCallback(() => {
    return orders.map(
      ({
        order_id,
        type,
        side,
        price,
        base_asset,
        quote_asset,
        created_at,
        amount,
        amount_unit,
        trade_fill_percent,
        total,
        order_type,
      }: ISingleOrderHistory) => {
        const OrderType = ORDER_TYPE_ICONS[order_type];
        return {
          order_type: (
            <CustomToolTop title={OrderType.title}>
              <span>
                <OrderType.Icon />
              </span>
            </CustomToolTop>
          ),
          date: toPersianDigits(
            moment(created_at).locale('fa').format('HH:mm:ss YYYY/M/D'),
          ),
          market: `${base_asset}/${quote_asset}`,
          type: <TranactionType type={side} />,
          priceType: type === 'MARKET' ? wallet.marketPrice : wallet.fixedPrice,
          value: `${amount_unit} ${toPrice(amount)}`,
          unitPrice: `${toPrice(price)}`,
          totalPrice: ` ${quote_asset} ${toPrice(total)}`,
          filledPrice: `٪${toPersianDigits(trade_fill_percent)}`,
          actions: (
            <Button
              key={`${order_id}-${order_type}`}
              onClick={async () => {
                if (!userInfo?.settings.order_delete_confirm) {
                  setOrders(
                    orders.filter((item) => item.order_id !== order_id),
                  );
                  return await mutateAsync({ order_id, order_type });
                }
                setSelectedRowId(`${order_id}-${order_type}`);
                return showDetailsModal();
              }}
              variant="secondary"
              className="!text-danger-400 !border-danger-400 hover:text-danger-400 hover:border-danger-400 hover:bg-transparent"
            >
              {wallet.cancelOpenOrder}
            </Button>
          ),
        };
      },
    );
  }, [orders]);

  return (
    <div>
      <div
        className={clsx(
          'select-none px-10 pt-4 pb-5',
          !showFilters && 'hidden',
        )}
      >
        <Filters />
      </div>
      <div aria-label="market-table">
        <div className="flex bg-dark-50 py-3 px-8 lg:px-4">
          {headerItems.map((item) => (
            <div
              className={clsx(
                'text-xs text-dark-600',
                item?.classNames,
                item?.width,
              )}
            >
              {item.title}
            </div>
          ))}
        </div>
        {orders.length ? (
          transformedData()?.map((row: any, rowIndex: number) => (
            <div
              key={rowIndex}
              className="flex w-full flex-wrap items-center border-b border-dark-50 p-4 hover:bg-dark-50/50"
            >
              {row &&
                (Object?.keys(row) as Array<keyof typeof row>).map(
                  (cellName, cellIndex) => (
                    <div
                      className={clsx(
                        'cursor-pointer',
                        headerItems[cellIndex].width,
                        headerItems[cellIndex].columnClassNames,
                      )}
                      key={`${rowIndex}-${cellIndex}`}
                      onClick={() => {
                        showRowModal(row, cellName);
                      }}
                    >
                      {isLoading ? (
                        <Skeleton
                          inline
                          width={60}
                          height={36}
                          style={{ borderRadius: '0.5rem' }}
                        />
                      ) : (
                        row[cellName]
                      )}
                    </div>
                  ),
                )}
            </div>
          ))
        ) : isLoading ? (
          <div className="h-10 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <EmptyTable />
        )}
        {!hasLoadMore && data?.result.length ? (
          <Pagination
            count={data.pagination.total_pages}
            page={page}
            onChange={(page) => set_page(page)}
            classNames="flex justify-center p-[14px]"
          />
        ) : null}
      </div>
      {selectedRowId && (
        <DetailsModal
          order_info={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          refetch={() =>
            setOrders(
              orders.filter(
                ({ order_id }) =>
                  order_id !== Number(selectedRowId.split('-')[0]),
              ),
            )
          }
        />
      )}
    </div>
  );
};

export default DesktopTable;

const headerItems: TableHeaderItem[] = [
  {
    title: '',
    name: 'order_type',
    width: 'hidden lg:block w-[5%]',
    columnClassNames: 'text-center',
  },
  {
    title: wallet.date,
    name: 'date',
    width: 'hidden lg:block w-[15%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.market,
    name: 'market',
    width: 'hidden lg:block w-[10%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.side,
    name: 'type',
    width: 'hidden lg:block w-[10%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.type,
    name: 'priceType',
    width: 'hidden lg:block w-[10%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.orderAmount,
    name: 'value',
    width: 'hidden lg:block w-4/12 lg:w-[10%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.unitPrice,
    name: 'unitPrice',
    width: 'hidden lg:block w-4/12 lg:w-[10%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.totalPrice,
    name: 'totalPrice',
    width: 'hidden lg:block w-4/12 lg:w-[14%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.completed,
    name: 'filledPrice',
    width: 'hidden lg:block w-4/12 lg:w-[8%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: '',
    name: 'actions',
    width: 'hidden lg:block w-[8%]',
    columnClassNames: 'text-center',
  },
];

interface TranactionTypeProps {
  type: 'BUY' | 'SELL';
}

const TranactionType: React.FC<TranactionTypeProps> = ({ type }) => {
  const [wallet] = useLang(['wallet']);
  const renderChip = useMemo(() => {
    switch (type) {
      case 'SELL':
        return <span className="text-xs text-danger-600">{wallet.sell}</span>;
      case 'BUY':
        return <span className="text-xs text-primary-600">{wallet.buy}</span>;
    }
  }, [type]);

  return <>{renderChip}</>;
};

// SYNCED
