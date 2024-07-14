import React from 'react';
import clsx from 'classnames';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  firstText: React.ReactNode;
  secondText: React.ReactNode;
  classNames?: string;
  firstClick?: () => void;
}

const DoubleText: React.FC<Props> = ({
  size = 'sm',
  firstText,
  secondText,
  classNames,
  firstClick,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center flex-row-reverse text-dark-300 ',
        size === 'sm' && 'text-xs',
        size === 'md' && 'font-medium text-sm',
        size === 'lg' && 'font-medium text-base',
        classNames,
      )}
    >
      <div
        className={clsx(
          'text-dark-700 lg:font-bold',
          firstClick && 'cursor-pointer',
        )}
        onClick={() => firstClick?.()}
      >
        {firstText}
      </div>
      /<div className="">{secondText}</div>
    </div>
  );
};

export default DoubleText;
