import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'classnames';
import { useRouter } from 'next/router';

import { useBreakpoint, useLang } from '@/hooks';
import {
  Card,
  Icon,
  IconButton,
  ResponsivePageHeader,
} from '@/components/Common';
import CryptoTransactionsTable from '../CryptoTransactionsTable';
import { useTransactionHistoryStore } from '@/store';
import { useTransactions } from '@/requests/panel/wallet/getTransactions';

import TomanTransactionsTable from '../TomanTransactionsTable';

const TransactionsContent = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setShowFilters(!!isDesktop);
  }, [isDesktop]);

  const { mutateAsync, isPending: isLoading } = useTransactions();
  const {
    txid,
    page,
    type,
    operation,
    from_date,
    to_date,
    status,
    currency_id,
    set_type,
    resetFilters,
  } = useTransactionHistoryStore();

  const getTransactions = useCallback(() => {
    if (!isDesktop) return;

    mutateAsync({
      type,
      page,
      per_page: 5,
      operation,
      txid,
      from_date: from_date ? from_date?.replaceAll('/', '-') : undefined,
      to_date: to_date ? to_date?.replaceAll('/', '-') : undefined,
      status: status !== '-1' ? status : undefined,
      currency_id,
    });
  }, [
    page,
    type,
    operation,
    from_date,
    to_date,
    status,
    txid,
    isDesktop,
    currency_id,
  ]);

  useEffect(() => getTransactions(), [getTransactions]);

  return (
    <div>
      <ResponsivePageHeader
        title={wallet.transactionsList}
        onBack={() => router.back()}
      />
      <div className="px-4 sm:px-8 lg:px-0">
        <Card classNames="flex w-full flex-col">
          <div className="flex w-full items-center justify-between border-b-2 border-dark-50 lg:pl-10">
            <MobileTabs
              activeTab={type}
              onClick={(type) => {
                resetFilters();
                set_type(type as 'fiat' | 'crypto');
              }}
            />
            {isDesktop && (
              <IconButton
                className={clsx(
                  showFilters ? '!border-primary-600' : 'border-dark-200',
                )}
                size="lg"
                onClick={() => {
                  setShowFilters((prev) => !prev);
                }}
                icon={
                  <Icon
                    icon="Filter-OutLined"
                    size={20}
                    className={clsx(
                      showFilters ? 'text-primary-600' : 'text-dark-600',
                    )}
                  />
                }
              />
            )}
          </div>
          {type === 'crypto' ? (
            <CryptoTransactionsTable
              showFilters={showFilters}
              isLoading={isLoading}
            />
          ) : (
            <TomanTransactionsTable
              showFilters={showFilters}
              isLoading={isLoading}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default TransactionsContent;

interface MobileTabsProps {
  activeTab: string;
  onClick: (id: string) => void;
}
const MobileTabs: React.FC<MobileTabsProps> = ({ activeTab, onClick }) => {
  const [wallet] = useLang(['wallet']);

  const tabItems = [
    {
      id: 'crypto',
      label: wallet.crypto,
    },
    {
      id: 'fiat',
      label: wallet.toman,
    },
  ];

  return (
    <div className="flex justify-start w-full lg:w-fit">
      {tabItems.map((i) => (
        <div
          key={i.id}
          onClick={() => onClick(i.id)}
          className={clsx(
            'w-full cursor-pointer pb-4 pt-6 text-center font-medium text-dark-500 px-10 py-[18px] whitespace-pre',
            activeTab === i.id && 'border-b-2 border-primary-400',
          )}
        >
          {i.label}
        </div>
      ))}
    </div>
  );
};
