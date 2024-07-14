import React from 'react';
import clsx from 'classnames';
import MuiRating from '@mui/material/Rating';
import { Icon } from '@/components/Common';

interface Props {
  readonly?: boolean;
  disabled?: boolean;
  dark?: boolean;
  defaultValue?: number;
  value: number | null;
  onChange: (val: number | null) => void;
  halfPrecision?: boolean;
}

const Rating: React.FC<Props> = ({
  readonly = false,
  disabled = false,
  dark = false,
  defaultValue = 3,
  halfPrecision = true,
  onChange,
}) => {
  return (
    <div>
      <MuiRating
        readOnly={readonly}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={(_, value) => onChange(value)}
        precision={halfPrecision ? 0.5 : 1}
        className={clsx(
          '[&>span]:!px-1 [&>span>label:nth-child(1)]:!w-[38%]',
          disabled && '!opacity-50',
        )}
        icon={
          <Icon icon="Star-Filled" size={24} className="text-warning-500" />
        }
        emptyIcon={
          <Icon
            icon="Star-OutLined"
            size={24}
            className={clsx('text-dark-500', dark && '!text-dark-600')}
          />
        }
      />
    </div>
  );
};

export default Rating;
