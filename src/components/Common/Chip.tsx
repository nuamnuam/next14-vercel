import clsx from 'classnames';
import { useMemo } from 'react';
import Skeleton from './Skeleton/Skeleton';

export type Variant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'secondary'
  | 'info'
  | 'light';

interface Props {
  label: any;
  variant?: Variant;
  size?: 'sm' | 'md';
  colorized?: boolean;
  rounded?: boolean;
  icon?: any;
  classNames?: string;
  transparentBg?: boolean;
  onClick?: () => void;
  isReady?: boolean;
}

const Chip: React.FC<Props> = ({
  label,
  variant = 'success',
  size = 'md',
  icon,
  classNames,
  colorized = false,
  rounded = false,
  transparentBg = false,
  onClick = undefined,
  isReady = true,
}) => {
  const generateVariantClass = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'bg-primary-50 text-primary-600';
      case 'warning':
        return 'bg-warning-50 text-warning-600';
      case 'danger':
        return 'bg-danger-50 text-danger-600';
      case 'secondary':
        return 'bg-dark-50 text-dark-400';
      case 'info':
        return 'bg-blue-50 text-blue-500';
      case 'light':
        return 'bg-transparent text-dark-400';
      default:
        return '';
    }
  }, [variant]);

  const generateColorizedVariantClass = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'bg-primary-500 text-white';
      case 'warning':
        return 'bg-warning-500 text-white';
      case 'danger':
        return 'bg-danger-500 text-white';
      case 'secondary':
        return 'bg-dark-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'light':
        return 'bg-dark-200 text-white';
      default:
        return '';
    }
  }, [variant]);

  const generateWithIconClass = useMemo(() => {
    if (colorized) {
      if (rounded) return size === 'sm' ? 'pl-[10px] pr-1' : 'pl-4 pr-1';
      else return 'px-4';
    } else {
      if (rounded) return size === 'sm' ? 'px-[10px]' : 'pl-2 pr-1';
      else return 'px-[10px]';
    }
  }, [colorized, rounded, size]);

  const generateFontClass = useMemo(() => {
    if (colorized) {
      if (icon) {
        if (rounded) {
          return size === 'sm' ? 'font-normal' : 'font-bold';
        } else {
          return 'font-bold';
        }
      } else {
        if (rounded) {
          return size === 'sm' ? 'font-normal' : 'font-bold';
        } else {
          return size === 'sm' ? 'font-normal' : 'font-bold';
        }
      }
    } else {
      return size === 'sm' ? 'font-normal' : 'font-medium';
    }
  }, [colorized, icon, rounded, size]);

  if (!isReady) {
    return <Skeleton type="chip" />;
  }

  return (
    <div
      className={clsx(
        'flex select-none items-center justify-center text-sm truncate',
        generateFontClass,
        rounded ? 'rounded-full' : 'rounded-lg',
        colorized ? generateColorizedVariantClass : generateVariantClass,
        icon ? generateWithIconClass : 'px-4',
        size === 'sm' ? 'h-6' : 'h-[29px]',
        classNames,
        transparentBg ? '!bg-transparent' : '',
        onClick ? 'cursor-pointer' : '',
      )}
      onClick={() => onClick?.()}
    >
      {icon && icon}
      <span className={icon && 'mr-2'}>{label}</span>
    </div>
  );
};

export default Chip;
