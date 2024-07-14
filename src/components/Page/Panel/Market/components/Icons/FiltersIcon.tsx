import { FC } from 'react';
import clsx from 'classnames';

import { Icon, IconButton } from '@/components/Common';
import useMarketStore from '@/store/marketStore';
import { useModal } from '@/hooks/useModal';

import { instantMarketFiltersModalName } from '../FilterModal';

const FiltersIcon: FC = () => {
  const { category_id, sort_by, sort_type } = useMarketStore();

  const { showModal } = useModal(instantMarketFiltersModalName);

  const hasFilter = [sort_by, sort_type].some(
    (item) => item !== undefined || category_id !== 'all',
  );

  return (
    <IconButton
      icon={
        <Icon
          icon={'Filter-OutLined'}
          size={20}
          color={hasFilter ? '#00CB8C' : '#373B4F'}
          className={clsx(
            hasFilter
              ? 'text-primary-600 [&>*]:text-primary-600'
              : 'text-dark-600 [&>*]:text-dark-600',
          )}
        />
      }
      size="lg"
      className={clsx(
        'border-dark-200 hover:!border-dark-200',
        hasFilter && 'border-primary-600 hover:!border-primary-600',
      )}
      onClick={() => showModal()}
    />
  );
};

export default FiltersIcon;
