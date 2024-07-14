import React, { useCallback, useRef } from 'react';
import moment from 'jalali-moment';

import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { useModal } from '@/hooks/useModal';
import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { useInfiniteTransactions, useIntersectionObserver } from '@/hooks';
import CryptoTransactionDetailsModal, {
  cryptoTransitionDetailsModalName,
} from '@/components/Common/Transaction/CryptoTransactionDetailsModal';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { Table } from '@/components/TableLayout';

export type RowItem = {
  title_date: React.ReactNode;
  amount?: string;
  status: React.ReactNode;
};

interface Props {
  isLoading: boolean;
}

const [wallet] = getLang(['wallet']);

const ResponsiveTable: React.FC<Props> = ({ isLoading }) => {
  const elementRef = useRef(null);

  const { showSyncModal: showDetailsModal } = useModal(
    cryptoTransitionDetailsModalName,
  );

  const { data, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteTransactions();

  useIntersectionObserver(elementRef, fetchNextPage);

  const transformedData = useCallback((): RowItem[] => {
    if (!data) return [];
    return data.map((item) => ({
      title_date: (
        <div className="flex flex-col gap-1 items-center justify-center">
          <span className="text-xs text-dark-600 leading-4">
            {item.currency_symbol}
          </span>
          <span className="text-xs text-dark-400 font-light leading-4">
            {toPersianDigits(
              moment(item.date).locale('fa').format('HH:mm:ss YYYY/M/D'),
            )}
          </span>
        </div>
      ),
      amount: toPrice(Math.abs(item.amount)) || '',
      status: <TranactionStatus status={item.status} className="!w-fit" />,
    }));
  }, [isLoading, data]);

  const onRowClick = (rowIndex: number) => {
    externalData.set(data?.[rowIndex]);
    showDetailsModal();
  };

  return (
    <div>
      <Table
        data={transformedData() || []}
        headerItems={headerItems}
        isLoading={isLoading}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        ref={elementRef}
        onRowClick={onRowClick}
      />
      <CryptoTransactionDetailsModal />
    </div>
  );
};

export default ResponsiveTable;

const headerItems: TableHeaderItem[] = [
  {
    title: wallet.cryptoDate,
    name: 'title_date',
    width: 'w-1/3',
    classNames: 'text-center',
    columnClassNames: 'flex items-center justify-center',
  },
  {
    title: wallet.amount,
    name: 'amount',
    width: 'w-1/3',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.status,
    name: 'status',
    width: 'w-1/3',
    classNames: 'text-center',
    columnClassNames: 'flex justify-center items-center',
  },
];
