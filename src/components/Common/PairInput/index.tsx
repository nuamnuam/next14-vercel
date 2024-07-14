import React, { useRef } from 'react';
import clsx from 'classnames';

import { convertScientific, maxDecimal } from '@/utils';

import FormInput from '../Form/FormInput';

type Props<T> = {
  disabled?: boolean;
  error?: boolean;
  label?: string;
  value: number | undefined;
  setValue: (val: number) => void;
  selectedCoin?: T;
  setSelectedCoin?: (coin: T) => void;
  caption?: React.ReactNode;
  decimal?: number;
  placeholder: string;
  leftIcon?: string;
  size: 'lg' | 'sm';
};

const PairInput: React.FC<Props<any>> = ({
  disabled,
  label,
  value,
  error = false,
  setValue,
  caption,
  decimal = 0,
  placeholder = '',
  leftIcon,
  size = 'lg',
}) => {
  const searchContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shownValue = () => {
    return typeof value !== 'undefined'
      ? decimal === 0
        ? Number(value ?? 0)?.toFixed(0)
        : maxDecimal(convertScientific(value), decimal)
      : undefined;
  };

  return (
    <div>
      {label && (
        <span className="mb-2 block text-sm font-medium !text-dark-600">
          {label}
        </span>
      )}
      <div className="flex">
        <div
          className="w-full relative transition-all duration-300"
          ref={searchContentRef}
        >
          <FormInput
            ref={inputRef}
            placeholder={placeholder}
            fullWidth
            ltr
            ltrPlaceholder={false}
            onlyNumber
            seprator
            disabled={disabled}
            decimal={decimal}
            value={shownValue()}
            onChange={setValue}
            size={size}
            className={clsx(
              'rounded-lg pr-[1%]',
              error && '!border-danger-400',
              leftIcon && 'pl-8',
              disabled &&
                '!border-dark-50 !bg-dark-50 opacity-50 [&>input]:!bg-dark-50',
              (leftIcon?.toString() || '')?.length > 3 ? '!pl-9' : '!pl-8',
            )}
          />
          {leftIcon && (
            <span
              className={clsx(
                'absolute inset-y-0 left-0 text-sm flex items-center pl-[0.4rem] text-medium-grey peer-focus:text-dark-grey  peer-disabled:text-medium-grey md:pl-[0.6rem]',
              )}
            >
              {leftIcon}
            </span>
          )}
        </div>
      </div>
      {caption && <div className="mt-2">{caption}</div>}
    </div>
  );
};

export default PairInput;
