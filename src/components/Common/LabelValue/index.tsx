import React, { useCallback, useMemo, useState } from 'react';
import { Icon, Button } from '@/components/Common';
import clsx from 'classnames';

interface Props {
  label: string;
  value: string | React.ReactNode;
  labelClassNames?: string;
  valueClassNames?: string;
  classNames?: string;
}

const LabelValue: React.FC<Props> = ({
  label,
  value,
  labelClassNames,
  valueClassNames,
  classNames,
}) => {
  return (
    <div
      className={clsx('flex w-full items-center justify-between', classNames)}
    >
      <span
        className={clsx(
          'text-xs leading-[18px] text-dark-300',
          labelClassNames,
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          'text-xs font-medium leading-[18px] text-dark-600',
          valueClassNames,
        )}
      >
        {value}
      </span>
    </div>
  );
};

export default LabelValue;
