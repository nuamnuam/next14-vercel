import React, { useRef } from 'react';
import clsx from 'classnames';
import moment from 'jalali-moment';

import {
  getLang,
  maxDecimal,
  toPersianDigits,
  toPrice,
  toStraightNumber,
} from '@/utils';
import useInfiniteCurrencyTransactions from '@/hooks/useInfiniteCurrencyTransactions';
import { useIntersectionObserver } from '@/hooks';
import { Card, Table } from '@/components';
import { BalanceCoinModel } from '@/types/wallet';
import { type TableHeaderItem } from '@/components/TableLayout/types';

interface TransactionLabels {
  buy: string;
  sell: string;
  deposit: string;
  withdraw: string;
  [key: string]: string;
}

const [wallet] = getLang(['wallet']);

const transactionLabel: TransactionLabels = {
  buy: wallet.buy,
  sell: wallet.sell,
  deposit: wallet.deposit,
  withdraw: wallet.withdraw,
};

interface Props {
  coinData?: BalanceCoinModel;
  operation: 'all' | 'trade' | 'wallet';
}

const CoinTransactionsTable: React.FC<Props> = ({ coinData, operation }) => {
  const elementRef = useRef(null);

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteCurrencyTransactions({
      currency_id: Number(coinData?.currency_id ?? 0),
      operation,
    });

  useIntersectionObserver(elementRef, fetchNextPage);

  const transformedData = () => {
    return data?.map((item) => ({
      coin: (
        <div className="flex flex-col">
          <span className="text-xs leading-6 text-dark-600">
            {transactionLabel[item.label]}
          </span>
          <span className="text-xs leading-5 text-dark-400 dir-ltr block text-right">
            {toPersianDigits(
              moment(item.date).format('jYYYY/jMM/jDD - HH:mm:ss'),
            )}
          </span>
        </div>
      ),
      totalBalance: (
        <span
          className={clsx(
            'text-sm',
            item.amount_type === 1 ? 'text-primary-600' : 'text-danger-500',
          )}
        >
          {toPrice(
            toStraightNumber(
              maxDecimal(item.amount, coinData?.balance_decimal),
            ),
          )}{' '}
          {item.amount_type === 1 ? '+' : '-'}
        </span>
      ),
    }));
  };

  return (
    <>
      <Table
        data={transformedData() || []}
        headerItems={headerItems}
        isLoading={isLoading}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        ref={elementRef}
      />
    </>
  );
};

export default CoinTransactionsTable;

const headerItems: TableHeaderItem[] = [
  {
    title: wallet.transaction,
    name: 'coin',
    width: 'w-1/2',
    classNames: 'mr-6',
  },
  {
    title: wallet.amount,
    name: 'totalBalance',
    width: 'w-1/2',
    columnClassNames: 'flex justify-end',
    classNames: 'flex justify-end',
  },
];
