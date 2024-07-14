import React, { useEffect, useState } from 'react';
import clsx from 'classnames';

import { Button, Modal, SelectInput } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import useMarketStore from '@/store/marketStore';
import { useLang } from '@/hooks';
import { useCoinCategoriesMutation } from '@/requests/market/coinCategoriesMutation';

export const instantMarketFiltersModalName = 'instant-market-filter-modal';

const MarketFiltersModal: React.FC = () => {
  const [market] = useLang(['market']);

  const [categoryId, setCategoryId] = useState<number | string | undefined>(
    undefined,
  );
  const [sortType, setSortType] = useState<
    'is_new' | 'mostchanges' | 'lowestchanges' | undefined
  >(undefined);

  const { data: coin_categories } = useCoinCategoriesMutation();

  const {
    category_id,
    sort_by,
    sort_type,
    favorite,
    set_category_id,
    set_sort_by,
    set_sort_type,
    set_favorite,
    reset,
  } = useMarketStore();

  const { closeModal } = useModal(instantMarketFiltersModalName);

  const submitFilter = () => {
    set_favorite(false);
    switch (sortType) {
      case 'is_new':
        set_sort_by(sortType);
        set_sort_type('ASC');
        break;
      case 'mostchanges':
        set_sort_by('changes');
        set_sort_type('DESC');
        break;
      case 'lowestchanges':
        set_sort_by('changes');
        set_sort_type('ASC');
        break;
      default:
        break;
    }
    set_category_id(categoryId);
    closeModal();
  };

  const resetFilters = () => {
    setCategoryId(undefined);
    setSortType(undefined);
    reset();
    closeModal();
  };

  useEffect(() => {
    if (favorite) {
      setCategoryId(undefined);
      setSortType(undefined);
      reset();
    }
  }, [favorite]);

  useEffect(() => {
    setCategoryId(category_id);
    if (sort_by === 'changes') {
      if (sort_type === 'ASC') {
        setSortType('lowestchanges');
      } else if (sort_type === 'DESC') {
        setSortType('mostchanges');
      }
    }
  }, [category_id, sort_type, sort_by]);

  const transformedCategories =
    coin_categories && coin_categories.result
      ? coin_categories.result.map(({ name_fa, id }) => {
          return { label: name_fa, value: id };
        })
      : [];

  return (
    <Modal
      name={instantMarketFiltersModalName}
      onClose={closeModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-0 !px-0 !rounded-[0px]"
      headerClassNames="!p-4"
      fullScreen={false}
      hasHelp={false}
      title={market.filter}
      headerIcon="Filters-TwoTone"
      footer={
        <div className="flex items-center gap-4">
          <Button
            className="w-full"
            variant="dark"
            size="lg"
            onClick={resetFilters}
          >
            {market.clearFilter}
          </Button>
          <Button className="w-full" size="lg" onClick={submitFilter}>
            {market.doFilter}
          </Button>
        </div>
      }
    >
      <div className="px-6 pt-4 pb-6 flex items-center gap-2 justify-between">
        <Button
          className={clsx(
            'w-full',
            sortType === 'is_new' && 'text-primary-600 border-primary-600',
          )}
          variant="secondary"
          size="md"
          onClick={() => setSortType('is_new')}
        >
          {market.newest}
        </Button>
        <Button
          className={clsx(
            'w-full',
            sortType === 'mostchanges' && 'text-primary-600 border-primary-600',
          )}
          variant="secondary"
          size="md"
          onClick={() => setSortType('mostchanges')}
        >
          {market.maxProfit}
        </Button>
        <Button
          className={clsx(
            'w-full',
            sortType === 'lowestchanges' &&
              'text-primary-600 border-primary-600',
          )}
          variant="secondary"
          size="md"
          onClick={() => setSortType('lowestchanges')}
        >
          {market.maxLoss}
        </Button>
      </div>
      <p className="px-6 text-xs font-normal mb-2">
        {market.categoryBaseFilter}
      </p>
      <div className="mb-4 justify-center items-center">
        <SelectInput
          name="category-id"
          fullWidth
          options={[
            { label: market.all, value: 'all' },
            ...transformedCategories,
          ]}
          value={categoryId || 'all'}
          onChange={(value) =>
            setCategoryId(value !== 'all' ? Number(value) : 'all')
          }
          classNames="px-6"
        />
      </div>
    </Modal>
  );
};

export default MarketFiltersModal;
