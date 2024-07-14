import React, { useMemo } from 'react';
import Icon from '@/components/Common/Icon';
import Clipboard from '../Clipboard';
import clsx from 'classnames';
import CustomTooltip from '../Tooltip';

interface Props {
  value: string | React.ReactNode;
  copyValue?: string;
  label?: string;
  tooltip?: string;
  className?: string;
  valueClassName?: string;
  rightIcon?: string | React.ReactElement;
  leftIcon?: string | React.ReactElement;
  caption?: string | React.ReactElement;
  hasCopy?: boolean;
  variant?: 'success' | 'secondary' | 'outlined';
  align?: 'left' | 'right';
  multiLine?: boolean;
}

const StaticInput: React.FC<Props> = ({
  value,
  label,
  tooltip,
  className,
  rightIcon,
  leftIcon,
  hasCopy = true,
  copyValue,
  variant = 'success',
  align = 'right',
  caption,
  valueClassName = undefined,
  multiLine = false,
}) => {
  const renderClassName = useMemo(() => {
    switch (variant) {
      case 'success':
        return clsx(
          'bg-primary-50 [&_.static-input-value]:text-primary-700 px-3 py-3',
        );
      case 'secondary':
        return clsx(
          'bg-dark-50 [&_.static-input-value]:text-dark-500 px-4 py-3',
          !multiLine && 'h-[43px]',
        );
      case 'outlined':
        return clsx(
          'bg-white border border-dark-200 [&_.static-input-value]:text-dark-700 px-3 py-3',
          !multiLine && 'h-12',
        );
      default:
    }
  }, [variant]);

  return (
    <div className={clsx('w-full ', className)}>
      {label && (
        <div className="mb-2 mr-1 flex items-center">
          <span className=" ml-2 block text-sm font-medium text-dark-600">
            {label}
          </span>
          {tooltip && (
            <CustomTooltip
              title={tooltip}
              anchor={
                <Icon
                  icon="InfoCircle-OutLined"
                  size={16}
                  className="text-dark-600"
                />
              }
            />
          )}
        </div>
      )}
      <div
        className={clsx(
          'content flex items-center justify-between overflow-hidden rounded-lg',
          align === 'left' ? 'text-left' : 'text-right',
          renderClassName,
        )}
      >
        {rightIcon && <div className="ml-2">{rightIcon}</div>}
        <div
          className={clsx(
            'static-input-value flex-auto text-sm font-medium',
            align === 'left' && 'dir-ltr',
            valueClassName && valueClassName,
            !multiLine
              ? 'whitespace-pre overflow-hidden overflow-x-auto'
              : 'overflow-hidden w-[calc(100%-60px)] break-all',
          )}
        >
          {value}
        </div>
        {leftIcon && <div className="mr-2">{leftIcon}</div>}
        {hasCopy && (
          <Clipboard
            className="mr-2"
            text={copyValue || value?.toString() || ''}
          />
        )}
      </div>
      {caption && caption}
    </div>
  );
};

export default StaticInput;
