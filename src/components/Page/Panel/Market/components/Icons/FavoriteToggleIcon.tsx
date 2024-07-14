import { FC } from 'react';
import clsx from 'classnames';

import { Icon, IconButton } from '@/components/Common';
import useMarketStore from '@/store/marketStore';

const FavoriteToggleIcon: FC = () => {
  const { favorite, set_favorite } = useMarketStore();

  return (
    <IconButton
      icon={
        <Icon
          icon={favorite ? 'Star-Filled' : 'Star-OutLined'}
          size={20}
          color={favorite ? '#00CB8C' : '#373B4F'}
          className={clsx(
            favorite
              ? 'text-primary-600 [&>*]:text-primary-600'
              : 'text-dark-600 [&>*]:text-dark-600',
          )}
        />
      }
      size="lg"
      className={clsx(
        'border-dark-200 hover:!border-dark-200',
        favorite && 'border-primary-600 hover:!border-primary-600',
      )}
      onClick={() => set_favorite(!favorite)}
    />
  );
};

export default FavoriteToggleIcon;
