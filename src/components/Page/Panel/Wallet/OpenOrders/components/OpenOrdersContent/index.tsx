import React, { FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { useBreakpoint, useLang, useOrderHistoryData } from '@/hooks';
import { useOrderHistoryStore } from '@/store';
import {
  Card,
  Icon,
  IconButton,
  ResponsivePageHeader,
  SwimTab,
} from '@/components/Common';

import OpenOrdersTable from '../OpenOrdersTable';
import OrdersHistoryTable from '../OrdersHistoryTable';
import { useRouter } from 'next/router';

type Props = {
  hasLoadMore?: boolean;
  wrapperClassname?: string;
};

const OpenOrdersContent: FC<Props> = ({
  hasLoadMore = false,
  wrapperClassname,
}) => {
  const [wallet] = useLang(['wallet']);

  useOrderHistoryData();
  const { isDesktop } = useBreakpoint();

  const [activeTab, setActiveTab] = useState('open_orders');
  const [showFilters, setShowFilters] = useState(false);
  const { resetHistories, resetFilters } = useOrderHistoryStore();

  const router = useRouter();

  useEffect(() => {
    const { order_type } = router.query;
    if (!order_type) return;
    setShowFilters(true);
  }, [router.query]);

  const renderContent = () => {
    switch (activeTab) {
      case 'open_orders':
        return (
          <OpenOrdersTable
            showFilters={showFilters}
            hasLoadMore={hasLoadMore}
          />
        );
      case 'orders_history':
        return (
          <OrdersHistoryTable
            showFilters={showFilters}
            hasLoadMore={hasLoadMore}
          />
        );
      default:
        return '';
    }
  };

  const handleChangeTab = (id: string) => {
    setActiveTab(id);
    resetFilters();
    resetHistories();
  };

  return (
    <>
      {!hasLoadMore && (
        <ResponsivePageHeader
          title={wallet.ordersTradesHistory}
          onBack={() => router.back()}
        />
      )}
      <div className={clsx('lg:p-0', wrapperClassname)}>
        <div className={clsx({ 'my-4 lg:!p-0': hasLoadMore })}>
          <Card classNames="flex w-full flex-col">
            <div className="flex w-full items-center justify-between border-b-2 border-dark-50 lg:pl-10">
              <MobileTabs
                activeTab={activeTab}
                onClick={handleChangeTab}
                isDesktop={isDesktop}
              />
              {isDesktop && !hasLoadMore ? (
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
              ) : hasLoadMore && isDesktop ? (
                <Link
                  href={'/panel/open-orders'}
                  className="text-sm font-medium text-dark-600"
                >
                  {wallet.showAll}
                </Link>
              ) : null}
            </div>
            {renderContent()}
          </Card>
        </div>
      </div>
    </>
  );
};

export default OpenOrdersContent;

interface MobileTabsProps {
  activeTab: string;
  onClick: (id: string) => void;
  isDesktop: boolean;
}
const MobileTabs: React.FC<MobileTabsProps> = ({
  activeTab,
  onClick,
  isDesktop,
}) => {
  const [wallet] = useLang(['wallet']);

  const tabRef = useRef<HTMLDivElement | null>(null);
  const tabBorderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const offsetFromLeft = tabRef.current?.offsetLeft;
    if (tabBorderRef.current?.style != null) {
      tabBorderRef.current.style.transform = `translateX(${offsetFromLeft}px)`;
      tabBorderRef.current.style.transitionDuration = '0.3s';
      tabBorderRef.current.style.transitionTimingFunction =
        'cubic-bezier(0.25, 0.1, 0.25, 1)';
      tabBorderRef.current.style.width = '45% !important';
    }
  }, [activeTab]);

  const tabItems = [
    {
      id: 'open_orders',
      label: wallet.openOrders,
    },
    {
      id: 'orders_history',
      label: wallet.ordersHistory,
    },
  ];

  if (isDesktop)
    return (
      <div className="flex justify-start overflow-y-auto w-[520px] [&>div]:w-full [&>div]:min-w-[520px]">
        <SwimTab
          items={tabItems}
          className="whitespace-pre border-b border-dark-50 w-full"
          itemClassName="py-[18px]"
          callback={onClick}
          initial={activeTab}
        />
      </div>
    );
  return (
    <SwimTab
      items={tabItems}
      className="whitespace-pre border-b border-dark-50 w-full"
      itemClassName="py-[18px]"
      callback={onClick}
      initial={activeTab}
    />
  );
};
