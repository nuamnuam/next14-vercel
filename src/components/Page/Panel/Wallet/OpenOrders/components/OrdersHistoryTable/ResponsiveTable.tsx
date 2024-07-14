import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import moment from 'jalali-moment';

import { EmptyTable, Icon, IconButton, Spinner } from '@/components/Common';
import OpenOrdersFiltersModal, {
  openOrdersFiltersModalName,
} from './Filters/FiltersModal';
import { getLang, toPersianDigits, toPrice } from '@/utils';
import { useModal } from '@/hooks/useModal';
import { ISingleOrderHistory } from '@/types/market';
import { useOrderHistoryStore } from '@/store';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useInfiniteOrderHistoriesQuery } from '@/requests/market/orderHistoryQuery';
import { useIntersectionObserver, useLang } from '@/hooks';

import DetailsModal, { openOrderDetailsModalName } from './DetailsModal';
import Historytype from './Filters/HistoryType';
import { CustomToolTop, ORDER_TYPE_ICONS } from '../..';

interface Props {
  showFilters: boolean;
  hasLoadMore?: boolean;
}

const [wallet] = getLang(['wallet']);

const ResponsiveTable: React.FC<Props> = ({ showFilters, hasLoadMore }) => {
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [selectedRowId, setSelectedRowId] = useState<string | undefined>(
    undefined,
  );

  const { showSyncModal: showFiltersModal } = useModal(
    openOrdersFiltersModalName,
  );
  const { showSyncModal: showDetailsModal } = useModal(
    openOrderDetailsModalName,
  );

  const { side, from_date, to_date, pair, type, order_type } =
    useOrderHistoryStore();

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteOrderHistoriesQuery({
      per_page: router.pathname.includes('/open-orders') ? 10 : 5,
      status: '1',
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

  const transformedData = useCallback(() => {
    return data?.pages
      .map((page) => {
        return page.result.map(
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
                <div
                  key={`${order_id}-${order_type}`}
                  className="flex flex-col items-center justify-center"
                >
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
            };
          },
        );
      })
      .flat(1);
  }, [data]);

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
                {(Object.keys(row) as Array<keyof typeof row>).map(
                  (cellName, cellIndex) => (
                    <div
                      className={clsx(
                        'cursor-pointer',
                        headerItems[cellIndex].width,
                        headerItems[cellIndex].columnClassNames,
                      )}
                      key={`${rowIndex}-${cellIndex}`}
                      onClick={() => {
                        setSelectedRowId((row?.market).key);
                        showDetailsModal();
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
    width: 'block lg:hidden w-[10%]',
    classNames: 'text-center',
  },
  {
    title: wallet.marketDate,
    name: 'market',
    width: 'block lg:hidden w-[25%]',
    classNames: 'text-center',
  },
  {
    title: wallet.operation,
    name: 'operation',
    width: 'block lg:hidden w-[30%]',
    classNames: 'text-center',
  },
  {
    title: wallet.amountUnitPrice,
    name: 'valueUnit',
    width: 'block lg:hidden w-[35%]',
    classNames: 'text-center',
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
