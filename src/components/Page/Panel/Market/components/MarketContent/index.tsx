import { useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'classnames';

import {
  Icon,
  IconButton,
  ResponsivePageHeader,
  TabsGroup,
} from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import {
  AdvanceMarketSearchInput,
  MarketTable,
  SearchInput,
  SortSelect,
  TradeTable,
} from '@/components/Page/Market/CoinsTable';
import useMarketStore from '@/store/marketStore';
import { useAdvanceMarketStore } from '@/store';

import MarketFiltersModal from '../FilterModal';
import { FavoriteToggleIcon, FiltersIcon, SearchToggleIcon } from '../Icons';
import { getLang } from '@/utils';

const [market] = getLang(['market']);

const InstantMarketContent: React.FC = () => {
  const [market] = useLang(['market']);

  const router = useRouter();

  const { isDesktop } = useBreakpoint();

  const { show_search_input } = useMarketStore();

  useEffect(() => {
    document.title = market.panelMarketTitle;
    return () => {
      document.title = market.panelMarketTitle1;
    };
  }, []);

  return (
    <>
      <ResponsivePageHeader
        title={market.markets}
        hasHelp={false}
        classNames="!mb-0"
        extra={
          <div className="flex gap-4">
            <SearchToggleIcon />
            <FavoriteToggleIcon />
            <FiltersIcon />
          </div>
        }
      />
      <div>
        <TabsGroup
          tabs={instantMarketTabData}
          mode="vertical"
          classes={{
            tabs: isDesktop
              ? 'bg-white rounded-tr-md rounded-tl-md w-full border-b border-dark-50'
              : 'bg-white rounded-tr-md rounded-tl-md w-full border-none',
            container: 'mb-0',
            selectedTab: 'bg-white',
            wrapper: isDesktop ? 'w-full' : 'w-full border-b border-dark-50',
          }}
          onTabChange={() => router.push('/panel/advance-market')}
          selectedIndex={0}
          newSelectedIndex={0}
          extra={
            <div className="flex-col md:flex-row px-4 md:pl-6 flex w-full gap-2 mt-4 lg:mt-0 lg:mb-0 lg:!w-8/12 lg:justify-end">
              {isDesktop ? (
                <>
                  <SearchInput />
                  <SortSelect className="md:w-[50%]" />
                </>
              ) : (
                <>{show_search_input ? <SearchInput /> : <></>}</>
              )}
            </div>
          }
        />
        <MarketFiltersModal />
      </div>
    </>
  );
};

const AdvanceMarketContent: React.FC = () => {
  const router = useRouter();

  const { isDesktop } = useBreakpoint();

  const { show_search_input: showSearchInput, set_show_search_input } =
    useAdvanceMarketStore();

  useEffect(() => {
    document.title = market.panelAdvancedMarketTitle;
    return () => {
      document.title = market.panelAdvancedMarketTitle1;
    };
  }, []);

  return (
    <>
      <ResponsivePageHeader
        title={market.markets}
        hasHelp={false}
        classNames="!mb-0"
        extra={
          <IconButton
            icon={
              <Icon
                icon="Search-OutLined"
                size={20}
                color={showSearchInput ? '#00CB8C' : '#373B4F'}
                className={clsx(
                  showSearchInput
                    ? 'text-primary-600 [&>*]:text-primary-600'
                    : 'text-dark-600 [&>*]:text-dark-600',
                )}
              />
            }
            size="lg"
            className={clsx(
              'border-dark-200 hover:!border-dark-200',
              showSearchInput && 'border-primary-600 hover:!border-primary-600',
            )}
            onClick={() => set_show_search_input(!showSearchInput)}
          />
        }
      />
      <div>
        <TabsGroup
          tabs={advanceMarketTabData}
          mode="vertical"
          classes={{
            tabs: isDesktop
              ? 'bg-white rounded-tr-md rounded-tl-md w-full border-b border-dark-50'
              : 'bg-white rounded-tr-md rounded-tl-md w-full border-none',
            container: 'mb-0',
            selectedTab: 'bg-white',
            wrapper: isDesktop ? 'w-full' : 'w-full border-b border-dark-50',
          }}
          onTabChange={() => router.push('/panel/instant-market')}
          selectedIndex={1}
          newSelectedIndex={1}
          extra={
            <div className="flex-col md:flex-row px-4 flex w-full lg:mt-0 lg:mb-0 lg:auto lg:justify-end">
              {isDesktop ? (
                <AdvanceMarketSearchInput />
              ) : (
                <>{showSearchInput ? <AdvanceMarketSearchInput /> : <></>}</>
              )}
            </div>
          }
        />
        <MarketFiltersModal />
      </div>
    </>
  );
};

export { InstantMarketContent, AdvanceMarketContent };

const instantMarketTabData = [
  {
    name: 'market',
    tabTitle: market.instantTransactionsAndConversions,
    tabContent: <TradeTable withFavorites />,
    extraClassname: 'w-6/12 md:w-fit',
  },
  {
    name: 'advance-market',
    tabTitle: market.tradingMarkets,
    tabContent: <></>,
    extraClassname: 'w-6/12 md:w-fit',
  },
];

const advanceMarketTabData = [
  {
    name: 'market',
    tabTitle: market.instantTransactionsAndConversions,
    tabContent: <></>,
    extraClassname: 'w-6/12 md:w-fit',
  },
  {
    name: 'advance-market',
    tabTitle: market.tradingMarkets,
    tabContent: <MarketTable />,
    extraClassname: 'w-6/12 md:w-fit',
  },
];
