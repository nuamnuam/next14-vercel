import { FC } from 'react';
import clsx from 'classnames';

import { Icon, IconButton } from '@/components/Common';
import useMarketStore from '@/store/marketStore';

const SearchToggleIcon: FC = () => {
  const { show_search_input, set_show_search_input } = useMarketStore();

  return (
    <IconButton
      icon={
        <Icon
          icon="Search-OutLined"
          size={20}
          color={show_search_input ? '#00CB8C' : '#373B4F'}
          className={clsx(
            show_search_input
              ? 'text-primary-600 [&>*]:text-primary-600'
              : 'text-dark-600 [&>*]:text-dark-600',
          )}
        />
      }
      size="lg"
      className={clsx(
        'border-dark-200 hover:!border-dark-200',
        show_search_input && 'border-primary-600 hover:!border-primary-600',
      )}
      onClick={() => set_show_search_input(!show_search_input)}
    />
  );
};

export default SearchToggleIcon;
