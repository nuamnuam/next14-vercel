import React, { FC, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';

import useMarketStore from '@/store/marketStore';
import { useCoinCategoriesMutation } from '@/requests/market/coinCategoriesMutation';
import { Icon } from '@/components';
import { useBreakpoint, useLang } from '@/hooks';

import TableContent from './TableContent';
import { MarketTabs } from './components';
import ResponsiveTableContent from './ResponsiveTableContent';

export type TableProps = {
  withFavorites?: boolean;
};

const TradeTable: FC<TableProps> = ({ withFavorites = false }) => {
  const [market] = useLang(['market']);
  const { isDesktop } = useBreakpoint();

  const userIsLogin = !!Cookies.get('token');

  const { data: coin_categories } = useCoinCategoriesMutation();
  const { category_id, favorite, set_category_id, set_favorite, resetSorting } =
    useMarketStore();

  useEffect(() => {
    return () => {
      resetSorting();
    };
  }, []);

  const categroies = useMemo(() => {
    if (coin_categories?.result.length)
      return [
        {
          label: market.all,
          name: 'all',
        },
        ...coin_categories.result
          .sort((a, b) => Number(a.priority) - Number(b.priority))
          .map(({ name_fa, id }) => {
            return {
              name: id.toString(),
              label: name_fa || '',
            };
          }),
      ].filter(Boolean);
    return [];
  }, [coin_categories]);

  return (
    <div>
      <div className="flex flex-nowrap justify-between gap-2 p-4 pb-0 overflow-x-auto bg-white rounded-b-md hidden lg:flex">
        {userIsLogin && withFavorites && (
          <div
            className="flex flex-col w-fit justify-start items-center py-1 pl-1 cursor-pointer hidden lg:block"
            onClick={() => {
              set_favorite(!favorite);
              set_category_id(undefined);
            }}
          >
            <Icon
              icon={favorite ? 'Star-Filled' : 'Star-OutLined'}
              size={24}
              color={favorite ? '#00CB8C' : '#4E536B'}
            />
          </div>
        )}

        <MarketTabs
          items={categroies as Array<{ name: string; label: string }>}
          onChange={(value) => {
            set_favorite(false);
            if (value !== 'all') {
              set_category_id(Number(value));
            } else {
              set_category_id('all');
            }
          }}
          selected={
            favorite
              ? undefined
              : typeof category_id === 'number'
              ? category_id.toString()
              : 'all'
          }
          size="sm"
          buttonClassName="px-4 text-sm font-medium"
          activeChipVariant="active-chip"
          chipVariant="chip"
        />
      </div>
      {isDesktop ? (
        <TableContent withFavorites={withFavorites} />
      ) : (
        <ResponsiveTableContent />
      )}
    </div>
  );
};

export default TradeTable;
