import React from 'react';
import clsx from 'classnames';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  topIcon: React.ReactNode;
  bottomIcon: React.ReactNode;
  classNames?: string;
}

const DoubleCoin: React.FC<Props> = ({
  size = 'sm',
  topIcon,
  bottomIcon,
  classNames,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center',
        size === 'sm' && '[&>div]:w-[18px] [&>div]:h-[18px]',
        size === 'md' && '[&>div]:w-6 [&>div]:h-6',
        size === 'lg' && '[&>div]:w-8 [&>div]:h-8',
        classNames,
      )}
    >
      <div className="[&>*]:w-full [&>*]:h-full">{bottomIcon}</div>
      <div
        className={clsx(
          '[&>*]:w-full [&>*]:h-full',
          size === 'sm' && '-mr-[10px]',
          size === 'md' && '-mr-[14px]',
          size === 'lg' && '-mr-[18px]',
        )}
      >
        {topIcon}
      </div>
    </div>
  );
};

export default DoubleCoin;
