import React, { FC, useEffect } from 'react';

import { Icon, SelectInput } from '@/components/Common';
import useMarketStore from '@/store/marketStore';
import classNames from 'classnames';
import { useLang } from '@/hooks';

type Props = {
  className?: string;
};

const SortSelect: FC<Props> = ({ className = undefined }) => {
  const [market] = useLang(['market']);

  const options = [
    {
      label: market.newest,
      value: 'is_new',
    },
    {
      label: market.mostProfit,
      value: 'mostchanges',
    },
    {
      label: market.mostLoss,
      value: 'lowestchanges',
    },
  ];
  const {
    sort_by,
    sort_type,
    favorite,
    set_sort_by,
    set_sort_type,
    set_favorite,
  } = useMarketStore();

  const handleChange = (value: string) => {
    set_favorite(false);
    switch (value) {
      case 'is_new':
        set_sort_by(value);
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
  };

  const currentValue =
    sort_by === 'is_new'
      ? options[0].value
      : sort_type === 'ASC'
      ? options[2].value
      : options[1].value;

  useEffect(() => {
    if (favorite) {
      set_sort_by(undefined);
      set_sort_type(undefined);
    }
  }, [favorite]);

  return (
    <SelectInput
      name="sort"
      fullWidth
      options={options}
      value={currentValue}
      onChange={handleChange}
      classNames={classNames('w-full', className)}
      icon={
        <Icon icon="Sort-OutLined" size={16} className="[&>*]:fill-dark-600" />
      }
    />
  );
};

export default SortSelect;
