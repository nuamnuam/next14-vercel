import React from 'react';
import clsx from 'classnames';
import { toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

interface Props {
  buyPercent: number;
  width?: string;
}

const PercentBar: React.FC<Props> = ({ buyPercent, width }) => {
  const [market] = useLang(['market']);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-danger-600 text-xs">
          {market.sell} {toPersianDigits(100 - buyPercent)}٪
        </span>
        <span className="text-primary-600 text-xs">
          {market.buy} {toPersianDigits(buyPercent)}٪
        </span>
      </div>
      <div
        className={clsx(
          'h-[5px] rounded-lg bg-danger-500 overflow-hidden relative',
          (width && width) || 'w-[134px]',
        )}
      >
        <div
          className="absolute left-0 top-0 h-full bg-primary-600"
          style={{ width: `${buyPercent}%` }}
        />
      </div>
    </div>
  );
};

export default PercentBar;
