import React from 'react';
import clsx from 'classnames';

import Icon from '../Icon';
import { useLang } from '@/hooks';

interface Props {
  text?: string;
  className?: string;
  iconSize?: number;
}

const EmptyTable: React.FC<Props> = ({ className, text, iconSize = 64 }) => {
  const [global] = useLang(['global']);

  return (
    <div
      className={clsx(
        'flex h-[17rem] flex-col items-center justify-center',
        className,
      )}
    >
      <Icon
        icon="SearchHistory-TwoTone"
        size={iconSize}
        className="[&>*]:fill-dark-100"
      />
      <span className="mt-4 text-xs font-medium text-dark-400">
        {text || global.noData}
      </span>
    </div>
  );
};

export default EmptyTable;
