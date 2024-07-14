import React, { useCallback } from 'react';
import moment from 'jalali-moment';
import Image from 'next/image';

import { Icon, Pagination, Table } from '@/components';
import TranactionStatus from '@/components/Common/Transaction/TransactionStatus';
import { useModal } from '@/hooks/useModal';
import { useTransactionHistoryStore } from '@/store';
import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { useCoinIcon } from '@/hooks';
import CryptoTransactionDetailsModal, {
  cryptoTransitionDetailsModalName,
} from '@/components/Common/Transaction/CryptoTransactionDetailsModal';
import { type TableHeaderItem } from '@/components/TableLayout/types';

export type RowItem = {
  date: string;
  title: string | React.ReactNode;
  value: string;
  status: React.ReactNode;
  actions: React.ReactNode;
};

interface Props {
  isLoading: boolean;
}

const [wallet] = getLang(['wallet']);

const DesktopTable: React.FC<Props> = ({ isLoading }) => {
  const { transactions, set_page } = useTransactionHistoryStore();
  const getCoinIcon = useCoinIcon();

  const { showSyncModal: showDetailsModal } = useModal(
    cryptoTransitionDetailsModalName,
  );

  const transformedData = useCallback((): RowItem[] => {
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
            alt="media"
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
        <span className="cursor-pointer">
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
      {!isLoading && transactions?.result?.length ? (
        <Pagination
          count={transactions?.pagination?.total_pages ?? 1}
          page={transactions?.pagination?.current_page ?? 1}
          onChange={(page) => set_page(page)}
          classNames="flex justify-center p-[14px]"
        />
      ) : null}
      <CryptoTransactionDetailsModal />
    </div>
  );
};

export default DesktopTable;

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
    columnClassNames: 'flex justify-center items-center',
  },
  {
    title: '',
    name: 'actions',
    width: 'w-1/5',
    columnClassNames: 'text-center',
  },
];
