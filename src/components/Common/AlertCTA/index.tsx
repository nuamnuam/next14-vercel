import React, { useCallback, useMemo } from 'react';

import Icon from '@/components/Common/Icon';
import clsx from 'classnames';
import { useBreakpoint, useLang } from '@/hooks';

import Button from '../Button';

export type Variant = 'success' | 'warning' | 'danger' | 'info';

interface AlertCTAProps {
  variant?: Variant;
  title?: string;
  message: string;
  ctaTitle?: string;
  className?: string;
  size?: 'md' | 'lg';
  onClick?: () => void;
  hasIcon?: boolean;
}

const AlertCTA: React.FC<AlertCTAProps> = ({
  variant,
  title,
  message,
  ctaTitle,
  className = '',
  size = 'md',
  onClick = () => {},
  hasIcon = true,
}) => {
  const [kyc] = useLang(['kyc']);
  const { isDesktop } = useBreakpoint();

  const renderIcon = useCallback(() => {
    if (!hasIcon) return null;

    let icon = '';
    let classname = '';

    switch (variant) {
      case 'success':
        icon =
          size === 'md' ? 'CheckCircle-OutLined' : 'ExclamationCircle-Filled';
        classname = size === 'md' ? 'text-success-600' : 'text-success-500';
        break;
      case 'warning':
        icon =
          size === 'md'
            ? 'ExclamationCircle-OutLined'
            : 'ExclamationCircle-Filled';
        classname = size === 'md' ? 'text-warning-600' : 'text-warning-500';
        break;
      case 'danger':
        icon =
          size === 'md' ? 'CloseCircle-OutLined' : 'ExclamationCircle-Filled';
        classname = 'text-danger-500';
        break;
      case 'info':
        icon =
          size === 'md'
            ? 'ExclamationCircle-OutLined'
            : 'ExclamationCircle-Filled';
        classname = 'text-blue-500';
        break;
      default:
        break;
    }

    return (
      <Icon
        icon={icon}
        className={clsx(
          'w-6',
          classname,
          size === 'md' && title && 'self-start mt-0.5',
        )}
        size={size === 'md' ? (title ? 22 : 16) : 32}
      />
    );
  }, [variant, size, hasIcon, title]);

  const wrapperClassName = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'bg-success-50 [&_span]:text-success-800 [&_p]:text-success-800';
      case 'warning':
        return 'bg-warning-50 [&_span]:text-warning-800 [&_p]:text-warning-800';
      case 'danger':
        return size === 'md'
          ? 'bg-danger-50 [&_span]:text-danger-600 [&_p]:text-danger-600'
          : 'bg-danger-50 [&_span]:text-danger-700 [&_p]:text-danger-700';
      case 'info':
        return 'bg-blue-50 [&_span]:text-secondary-400 [&_p]:text-secondary-400';
      default:
    }
  }, [variant]);

  const onCTAClick = useCallback(() => {
    onClick();
  }, []);

  return (
    <div
      className={clsx(
        'flex rounded-lg',
        size === 'md' ? 'py-[9px] px-4' : 'p-4',
        wrapperClassName,
        className,
      )}
    >
      <div
        className={clsx(
          'flex w-full items-center lg:flex-nowrap',
          size === 'lg' && 'flex-wrap',
        )}
      >
        {(isDesktop || size === 'md') && hasIcon && renderIcon()}
        <div
          className={clsx(
            'text-contain',
            hasIcon && (size === 'md' ? 'mr-[10px]' : 'lg:mr-4'),
          )}
        >
          {title && (
            <div
              className={clsx(size === 'md' ? 'mb-2 lg:mb-0' : 'mb-5 lg:mb-2')}
            >
              {!isDesktop && size === 'lg' && renderIcon()}
              <span
                className={clsx(
                  'font-bold leading-6 lg:mr-0',
                  size === 'md' ? 'text-sm' : 'text-base',
                  hasIcon && size === 'lg' && 'mr-2',
                )}
              >
                {title}
              </span>
            </div>
          )}
          <p className="text-sm leading-6 ml-4">{message}</p>
        </div>
        <Button
          variant="secondary"
          fullWidth={!isDesktop && size === 'lg'}
          size={size === 'md' ? 'sm' : 'md'}
          className={clsx(
            'lg:mr-auto [&>span]:!text-dark-700',
            size === 'md' ? '!rounded !mr-auto' : 'mt-4 lg:mt-0 !rounded-lg',
          )}
          onClick={onCTAClick}
        >
          {ctaTitle || kyc.fillKyc}
        </Button>
      </div>
    </div>
  );
};

export default AlertCTA;
