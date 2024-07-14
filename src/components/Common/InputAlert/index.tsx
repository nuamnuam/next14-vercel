import React, { useCallback, useMemo } from 'react';
import Icon from '@/components/Common/Icon';
import clsx from 'classnames';

interface Props {
  variant?: 'danger' | 'warning' | 'success' | 'info';
  message: string | undefined;
  className?: string;
  hasIcon?: boolean;
  icon?: string;
  loading?: boolean;
}

const InputAlert: React.FC<Props> = ({
  message,
  className,
  variant = 'info',
  hasIcon = true,
  icon,
  loading = false,
}) => {
  const renderClassName = useMemo(() => {
    switch (variant) {
      case 'info':
        return 'text-dark-600 text-sm';
      case 'warning':
        return 'text-warning-600 text-sm';
      case 'success':
        return 'text-primary-600 text-sm';
      case 'danger':
        return 'text-danger-600 text-sm';
      default:
    }
  }, [variant, message]);

  const renderIcon = useCallback(() => {
    let classname = '';
    let alertIcon = '';

    switch (variant) {
      case 'info':
        alertIcon = 'InfoCircle-OutLined';
        classname = 'text-blue-500 ';
        break;
      case 'warning':
        alertIcon = 'ExclamationCircle-OutLined';
        classname = 'text-warning-500 ';
        break;
      case 'success':
        alertIcon = 'CheckCircle-OutLined';
        classname = 'text-primary-500 ';
        break;
      case 'danger':
        alertIcon = 'CloseCircle-OutLined';
        classname = 'text-danger-500 ';
        break;
      default:
        break;
    }
    if (icon) {
      alertIcon = icon;
    }
    return (
      <Icon
        icon={alertIcon}
        size={16}
        className={clsx('ml-2', loading && 'infinite-rotation', classname)}
      />
    );
  }, [variant, message]);

  if (!message) return null;
  return (
    <div className={clsx('flex items-start', className)}>
      {hasIcon && <div className="mt-[1px]">{renderIcon()}</div>}
      <p className={clsx('leading-6', renderClassName)}>{message}</p>
    </div>
  );
};

export default InputAlert;
