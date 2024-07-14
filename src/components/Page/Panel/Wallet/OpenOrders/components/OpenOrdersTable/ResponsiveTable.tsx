import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import moment from 'jalali-moment';

import { useModal } from '@/hooks/useModal';
import { getLang, toPersianDigits, toPrice } from '@/utils';
import type { ISingleOrderHistory } from '@/types/market';
import {
  Button,
  EmptyTable,
  Icon,
  IconButton,
  Spinner,
} from '@/components/Common';
import { useOrderHistoryStore } from '@/store';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useIntersectionObserver, useLang, useProfile } from '@/hooks';
import { useCancelOrderMutation } from '@/requests/market/cancelOrderMutation';
import { useInfiniteOrderHistoriesQuery } from '@/requests/market/orderHistoryQuery';

import OpenOrdersFiltersModal, {
  openOrdersFiltersModalName,
} from './Filters/FiltersModal';
import DetailsModal, { openOrderDetailsModalName } from './DetailsModal';
import Historytype from './Filters/HistoryType';
import { CustomToolTop, ORDER_TYPE_ICONS } from '../..';

export type RowItem = {
  dateMarket: React.ReactNode;
  operation: React.ReactNode;
  valueUnit: React.ReactNode;
  actions: React.ReactNode;
};

interface Props {
  showFilters: boolean;
  hasLoadMore?: boolean;
}

const [wallet] = getLang(['wallet']);

const ResponsiveTable: React.FC<Props> = ({ showFilters, hasLoadMore }) => {
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [orders, setOrders] = useState<ISingleOrderHistory[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | undefined>(
    undefined,
  );

  const { data: userInfo } = useProfile();

  const { showSyncModal: showFiltersModal } = useModal(
    openOrdersFiltersModalName,
  );

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

  const { side, from_date, to_date, pair, type, order_type } =
    useOrderHistoryStore();

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteOrderHistoriesQuery({
      per_page: router.pathname.includes('/open-orders') ? 10 : 5,
      status: '0',
      side,
      pair: pair?.symbol,
      from_date: from_date ? from_date?.replaceAll('/', '-') : undefined,
      to_date: to_date ? to_date?.replaceAll('/', '-') : undefined,
      type,
      order_type,
    });

  useIntersectionObserver(elementRef, () => {
    if (hasNextPage && router.pathname.includes('/open-orders'))
      fetchNextPage();
  });

  useEffect(() => {
    if (data?.pages) {
      const result: ISingleOrderHistory[] = [];
      data.pages.forEach((item) =>
        item.result.forEach((res) => result.push(res)),
      );
      setOrders(result);
    }
  }, [data?.pages]);

  const transformedData = useCallback(() => {
    return orders.map(
      ({
        order_id,
        side,
        price,
        base_asset,
        quote_asset,
        created_at,
        trade_fill_percent,
        amount,
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
          market: (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-sm font-medium text-dark-300">
                  {quote_asset}/
                </span>
                <span className="text-sm font-medium text-dark-700">
                  {base_asset}
                </span>
              </div>
              <span className="mt-1 text-xs text-dark-400">
                {toPersianDigits(
                  moment(created_at).locale('fa').format('YYYY/M/D'),
                )}
              </span>
            </div>
          ),
          operation: (
            <div className="flex flex-col items-center justify-center">
              <TranactionType type={side} />
              <span className="mt-1 text-xs text-dark-400">
                ٪{toPersianDigits(trade_fill_percent)}
              </span>
            </div>
          ),
          valueUnit: (
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-medium text-dark-700">
                {base_asset} {toPrice(amount)}
              </span>
              <span className="mt-1 text-xs text-dark-400">
                {toPrice(price)}
              </span>
            </div>
          ),
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
      {!hasLoadMore ? (
        <div>
          <div className="flex gap-4 py-6 px-2">
            <div className="flex-1">
              <Historytype noLabel />
            </div>
            <IconButton
              className={clsx(showFilters && '!border-primary-600')}
              size="lg"
              onClick={showFiltersModal}
              icon={
                <Icon
                  icon="Filter-OutLined"
                  size={20}
                  className="text-dark-600"
                />
              }
            />
          </div>
          <OpenOrdersFiltersModal />
        </div>
      ) : null}
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
        <div className="overflow-y-auto">
          {transformedData()?.length ? (
            transformedData()?.map((row: any, rowIndex: number) => (
              <div
                key={rowIndex}
                className="flex w-full flex-wrap items-center border-b border-dark-50 p-4 hover:bg-dark-50"
              >
                {row &&
                  (Object.keys(row) as Array<keyof typeof row>).map(
                    (cellName, cellIndex) => (
                      <div
                        className={clsx(
                          'cursor-pointer',
                          headerItems[cellIndex]?.width,
                          headerItems[cellIndex]?.columnClassNames,
                        )}
                        key={`${rowIndex}-${cellIndex}`}
                        onClick={() => {
                          showRowModal(row, cellName);
                        }}
                      >
                        {isLoading ? <></> : row[cellName]}
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
          <div ref={elementRef}>
            {!hasLoadMore && hasNextPage && data?.pages.length ? (
              <div className="flex justify-center items-center py-4">
                <Spinner />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {selectedRowId && (
        <DetailsModal
          order_info={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          refetch={() =>
            setOrders(
              orders.filter(
                (item) => item.order_id !== Number(selectedRowId.split('-')[0]),
              ),
            )
          }
        />
      )}
    </div>
  );
};

export default ResponsiveTable;

const headerItems: TableHeaderItem[] = [
  {
    title: '',
    name: 'order_type',
    width: 'block lg:hidden w-[5%]',
    classNames: 'text-center',
  },
  {
    title: wallet.marketDate,
    name: 'market',
    width: 'block lg:hidden w-[23%]',
    classNames: 'text-center',
  },
  {
    title: wallet.operation,
    name: 'operation',
    width: 'block lg:hidden w-[20%]',
    classNames: 'text-center',
  },
  {
    title: wallet.amountUnitPrice,
    name: 'valueUnit',
    width: 'block lg:hidden w-[35%]',
    classNames: 'text-center',
  },
  {
    title: '',
    name: 'actions',
    width: 'block lg:hidden w-[12%]',
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
