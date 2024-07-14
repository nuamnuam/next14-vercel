import React from 'react';
import clsx from 'classnames';

import Icon from '../Icon';
import Spinner from '../Spinner';

interface Props {
  className?: string;
}

const SearchingBox: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx(
        'flex h-[17rem] flex-col items-center justify-center',
        className,
      )}
    >
      <Icon
        icon="SearchHistory-TwoTone"
        size={64}
        className="[&>*]:fill-dark-100"
      />
      <span className="mt-4 text-xs font-medium text-dark-400">
        <Spinner />
      </span>
    </div>
  );
};

export default SearchingBox;
