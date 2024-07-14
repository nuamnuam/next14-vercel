import React, { useCallback, useRef } from 'react';
import moment from 'jalali-moment';

import TomanTransactionDetailsModal, {
  tomanTransitionDetailsModalName,
} from '@/components/Common/Transaction/TomanTransactionDetailsModal';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { Table } from '@/components';
import { useModal } from '@/hooks/useModal';
import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { useInfiniteTransactions, useIntersectionObserver } from '@/hooks';
import { type TableHeaderItem } from '@/components/TableLayout/types';

export type RowItem = {
  date: string;
  value?: string;
  status: React.ReactNode;
};

interface Props {
  isLoading: boolean;
}

const [wallet] = getLang(['wallet']);

const ResponsiveTable: React.FC<Props> = ({ isLoading }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const { showSyncModal: showDetailsModal } = useModal(
    tomanTransitionDetailsModalName,
  );

  const { data, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteTransactions();

  useIntersectionObserver(elementRef, fetchNextPage);

  const transformedData = useCallback((): RowItem[] => {
    if (!data) return [];
    return data.map((item) => ({
      date: toPersianDigits(
        moment(item.date).locale('fa').format('HH:mm:ss YYYY/M/D'),
      ),
      value: toPrice(Math.abs(item.amount)) || '',
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
      <TomanTransactionDetailsModal />
    </div>
  );
};

export default ResponsiveTable;

const headerItems: TableHeaderItem[] = [
  {
    title: wallet.date,
    name: 'date',
    width: 'w-1/3',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.amount,
    name: 'value',
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
