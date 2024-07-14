import React, { useCallback } from 'react';
import moment from 'jalali-moment';

import { Icon, Pagination, Table } from '@/components';
import TomanTransactionDetailsModal, {
  tomanTransitionDetailsModalName,
} from '@/components/Common/Transaction/TomanTransactionDetailsModal';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { useModal } from '@/hooks/useModal';
import { useTransactionHistoryStore } from '@/store';
import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { type TableHeaderItem } from '@/components/TableLayout/types';

export type RowItem = {
  date: string;
  value?: string;
  status: React.ReactNode;
  actions: React.ReactNode;
};

interface Props {
  isLoading: boolean;
}

const [wallet] = getLang(['wallet']);

const DesktopTable: React.FC<Props> = ({ isLoading }) => {
  const { transactions, set_page } = useTransactionHistoryStore();

  const { showSyncModal: showDetailsModal } = useModal(
    tomanTransitionDetailsModalName,
  );

  const transformedData = useCallback((): RowItem[] => {
    return transactions.result.map((item) => ({
      date: toPersianDigits(
        moment(item.date).locale('fa').format('HH:mm:ss YYYY/M/D'),
      ),
      value: toPrice(Math.abs(item.amount)) || '',
      status: <TranactionStatus status={item.status} className="!w-fit" />,
      actions: (
        <span className="cursor-pointer" onClick={() => onRowClick(item)}>
          <Icon icon="Left-OutLined" size={16} className="text-dark-400" />
        </span>
      ),
    }));
  }, [isLoading, transactions]);

  const onRowClick = (item: RowItem) => {
    externalData.set(item);
    showDetailsModal();
  };

  return (
    <div>
      <Table
        data={transformedData() || []}
        headerItems={headerItems}
        isLoading={isLoading}
        bodyExtraClassname="cursor-pointer"
        onRowClick={(idx) => onRowClick(transactions.result[idx])}
      />
      {transformedData().length ? (
        <Pagination
          count={transactions?.pagination?.total_pages ?? 1}
          page={transactions?.pagination?.current_page ?? 1}
          onChange={(page) => set_page(page)}
          classNames="flex justify-center p-[14px]"
        />
      ) : null}
      <TomanTransactionDetailsModal />
    </div>
  );
};

export default DesktopTable;

const headerItems: TableHeaderItem[] = [
  {
    title: wallet.date,
    name: 'date',
    width: 'w-1/4',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.amount,
    name: 'value',
    width: 'w-1/4',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.status,
    name: 'status',
    width: 'w-1/4',
    classNames: 'text-center',
    columnClassNames: 'flex justify-center items-center',
  },
  {
    title: wallet.details,
    name: 'actions',
    width: 'w-1/4',
    classNames: 'text-center ',
    columnClassNames: 'text-center',
  },
];
