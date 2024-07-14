import React from 'react';
import clsx from 'classnames';

import { toPersianDigits } from '@/utils';
import { useLang, usePairDetail } from '@/hooks';
import { useAdvanceTradeStore } from '@/store';

interface Props {
  buyPercent: number;
  width?: string;
}

const PercentBar: React.FC<Props> = ({ buyPercent, width }) => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const { baseAsset, quoteAsset } = useAdvanceTradeStore();

  const { update } = usePairDetail(`${baseAsset}${quoteAsset}`);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-danger-600 text-xs">
          {advancedTrade.sell}{' '}
          {toPersianDigits(Number(update?.msp) || 100 - buyPercent)}٪
        </span>
        <span className="text-primary-600 text-xs">
          {advancedTrade.buy}{' '}
          {toPersianDigits(Number(update?.mbp) || buyPercent)}٪
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
          style={{ width: `${Number(update?.mbp) || buyPercent}%` }}
        />
      </div>
    </div>
  );
};

export default PercentBar;
