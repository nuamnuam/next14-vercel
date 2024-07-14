import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'jalali-moment';

import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { Icon, Card, Table } from '@/components';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { useTransactions } from '@/requests/panel/wallet/getTransactions';
import { useTransactionHistoryStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import CryptoTransactionDetailsModal, {
  cryptoTransitionDetailsModalName,
} from '@/components/Common/Transaction/CryptoTransactionDetailsModal';
import { useCoinIcon, useLang } from '@/hooks';
import { type TableHeaderItem } from '@/components/TableLayout/types';

export type RowItem = {
  date: string;
  title: string | React.ReactNode;
  value: string;
  status: React.ReactNode;
  actions: React.ReactNode;
};

const [wallet] = getLang(['wallet']);

const CryptoWithdrawHistoryTable: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const { mutateAsync, isPending: isLoading } = useTransactions();
  const { transactions, page, setOperation, set_type } =
    useTransactionHistoryStore();
  const { showSyncModal } = useModal(cryptoTransitionDetailsModalName);
  const getCoinIcon = useCoinIcon();

  const getTransactions = useCallback(() => {
    mutateAsync({
      type: 'crypto',
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
      title: (
        <div className="flex items-center gap-2">
          <Image
            src={getCoinIcon(item)}
            height={24}
            width={24}
            alt={item?.currency_symbol || 'coin'}
            onError={(e) => {
              //@ts-ignore
              e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
            }}
          />
          <span className=""></span>
          <span className="text-sm text-dark-700 font-medium">
            {item.currency_title}
          </span>
          <span className="text-2xs text-dark-500">{item.currency_symbol}</span>
        </div>
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
        <div className="flex items-center justify-between pt-7 pb-5 pr-6 pl-8">
          <h2 className="m-0 font-medium text-dark-800">
            {wallet.lastCryptoWithdraw}
          </h2>
          <Link
            href={'/panel/wallet/transactions-list'}
            className="text-sm font-medium text-dark-600"
            onClick={() => {
              set_type('crypto');
              setOperation('withdraw');
            }}
          >
            {wallet.showAll}
          </Link>
        </div>
        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          isLoading={isLoading}
        />
      </Card>
      <CryptoTransactionDetailsModal />
    </>
  );
};

export default CryptoWithdrawHistoryTable;

const headerItems: TableHeaderItem[] = [
  {
    title: wallet.date,
    name: 'date',
    width: 'w-1/5',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.coinName,
    name: 'title',
    width: 'w-1/5',
    classNames: 'text-center',
    columnClassNames: 'flex justify-center',
  },
  {
    title: wallet.amount,
    name: 'value',
    width: 'w-1/5',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-600 text-center',
  },
  {
    title: wallet.status,
    name: 'status',
    width: 'w-1/5',
    classNames: 'text-center',
    columnClassNames: 'text-center flex items-center justify-center',
  },
  {
    title: '',
    name: 'actions',
    width: 'w-1/5',
    columnClassNames: 'text-center',
  },
];
