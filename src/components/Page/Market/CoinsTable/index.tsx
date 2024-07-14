import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

import { SwimTab, Card } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';

import AdvancedMarketSearchInput from './Market/SearchInput';
import SearchInput from './SearchInput';
import SortSelect from './SortSelect';
import MarketTable from './Market';
import TradeTable from './Trade';
import { FiltersIcon } from '../../Panel/Market/components/Icons';
import MarketFiltersModal from '../../Panel/Market/components/FilterModal';

type Props = {
  selectedTab: 'trade' | 'markets';
};

const CoinsTable: FC<Props> = ({ selectedTab }) => {
  const [market] = useLang(['market']);

  const { isDesktop } = useBreakpoint();

  const router = useRouter();

  const handleTabChange = (tab: 'markets' | 'trade') => {
    if (tab === 'markets') {
      return router.push('/advance-market');
    }
    return router.push('/instant-market');
  };

  useEffect(() => {
    document.title =
      selectedTab === 'trade' ? market.marketTitle1 : market.marketTitle2;
    return () => {
      document.title = market.marketTitle3;
    };
  }, [selectedTab]);

  const tableTypes = [
    {
      id: 'trade',
      label: market.tradeAndConvert,
    },
    {
      id: 'markets',
      label: market.tradeMarkets,
    },
  ];

  return (
    <Card classNames="shadow-none !rounded-none">
      <div className="flex flex-col justify-between lg:flex-row lg:items-center lg:border-b lg:border-dark-50">
        <div className="border-b border-dark-50 lg:border-none">
          <SwimTab
            items={tableTypes}
            className="w-full sm:w-[356px]"
            itemClassName="pt-7"
            initial={selectedTab}
            callback={(id) => handleTabChange(id as 'markets' | 'trade')}
          />
        </div>
        {selectedTab === 'trade' ? (
          <div className="mb-4 flex w-full flex-col gap-2 !px-3 sm:flex-row lg:mt-0 lg:mb-0 lg:w-auto lg:px-0">
            <div className="flex items-center gap-3 justify-between mt-4">
              <div className="flex flex-col w-11/12 lg:w-64">
                <SearchInput />
              </div>
              <div className="flex flex-col w-fit items-end justify-end h-full lg:w-[170px]">
                {isDesktop ? <SortSelect /> : <FiltersIcon />}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex w-full flex-col gap-2 !px-3 sm:flex-row lg:mt-0 lg:mb-0 lg:w-auto lg:px-0">
            <div className="w-full sm:w-[60%] lg:w-64">
              <AdvancedMarketSearchInput />
            </div>
          </div>
        )}
      </div>
      {selectedTab === 'trade' ? <TradeTable /> : <MarketTable />}
      <MarketFiltersModal />
    </Card>
  );
};

export default CoinsTable;

export { default as SearchInput } from './SearchInput';
export { default as SortSelect } from './SortSelect';
export { default as TradeTable } from './Trade';
export { default as MarketTable } from './Market';
export { default as AdvanceMarketSearchInput } from './Market/SearchInput';
