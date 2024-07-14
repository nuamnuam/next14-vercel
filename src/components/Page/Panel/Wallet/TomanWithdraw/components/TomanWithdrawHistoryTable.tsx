import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import moment from 'jalali-moment';

import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { Button, Icon, Card } from '@/components/Common';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { useTransactions } from '@/requests/panel/wallet/getTransactions';
import { useTransactionHistoryStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import TomanTransactionDetailsModal, {
  tomanTransitionDetailsModalName,
} from '@/components/Common/Transaction/TomanTransactionDetailsModal';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { Table } from '@/components';
import { useLang } from '@/hooks';

export type RowItem = {
  date: string;
  value: string;
  status: React.ReactNode;
  actions: React.ReactNode;
};

const [wallet] = getLang(['wallet']);

const TomanWithdrawHistoryTable: React.FC = () => {
  const [wallet] = useLang(['wallet']);
  const { mutateAsync, isPending: isLoading } = useTransactions();
  const { transactions, page, set_type, setOperation } =
    useTransactionHistoryStore();
  const { showSyncModal } = useModal(tomanTransitionDetailsModalName);

  const getTransactions = useCallback(() => {
    mutateAsync({
      type: 'fiat',
      operation: 'withdraw',
      page,
      per_page: 5,
    });
  }, []);

  useEffect(() => getTransactions(), [getTransactions]);

  const transformedData = useCallback((): RowItem[] => {
    const onRowClick = (item: RowItem) => {
      externalData.set(item);
      showSyncModal();
    };

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

  return (
    <>
      <Card classNames="mt-8 shadow-sm">
        <div className="flex items-center justify-between py-4 px-6">
          <h2 className="m-0 font-medium text-dark-800">
            {wallet.lastTomanWithdraww}
          </h2>
          <Link
            href={'/panel/wallet/transactions-list'}
            onClick={() => {
              set_type('fiat');
              setOperation('withdraw');
            }}
          >
            <Button variant="text">{wallet.showAll}</Button>
          </Link>
        </div>
        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          isLoading={isLoading}
        />
      </Card>
      <TomanTransactionDetailsModal />
    </>
  );
};

export default TomanWithdrawHistoryTable;

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
    classNames: 'text-center',
    columnClassNames: 'text-center',
  },
];
