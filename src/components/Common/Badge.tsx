import classNames from 'classnames';
import type { HTMLAttributes, PropsWithChildren } from 'react';

type BadgeCountVariant =
  | 'green'
  | 'red'
  | 'gray'
  | 'dark'
  | 'greenInvert'
  | 'yellow';
type BadgeSizes = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeCountProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @default green
   */
  variant?: BadgeCountVariant;
  /**
   * @default sm
   */
  size?: BadgeSizes;
}

const BadgeCount = ({
  children,
  className,
  variant = 'green',
  size = 'sm',
  ...props
}: PropsWithChildren<BadgeCountProps>) => {
  return (
    <div className={getBadgeCountClasses(variant, size)} {...props}>
      {children}
    </div>
  );
};

export default BadgeCount;

function getBadgeCountClasses(variant: BadgeCountVariant, size: BadgeSizes) {
  return classNames({
    'inline-flex justify-center items-center rounded-full text-xs font-normal':
      true,
    'bg-primary-500 text-white': variant === 'green',
    'bg-danger-500 text-white': variant === 'red',
    'bg-dark-50 text-dark-400': variant === 'gray',
    'bg-dark-600 text-white': variant === 'dark',
    'bg-primary-50 text-primary-600': variant === 'greenInvert',
    'bg-warning-500 text-white': variant === 'yellow',
    'w-4 h-4': size === 'xs',
    'w-5 h-5': size === 'sm',
    'w-6 h-4': size === 'md',
    'w-[28px] h-5': size === 'lg',
  });
}

type StatusVariant = 'success' | 'error' | 'default' | 'info' | 'warning';

export interface StatusProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @default success
   */
  variant?: StatusVariant;
}

export const Status = ({
  children,
  className,
  variant = 'success',
  ...props
}: PropsWithChildren<StatusProps>) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className={getStatusClasses(variant)} {...props} />
      <span className="text-xs text-dark-800">{children}</span>
    </div>
  );
};

function getStatusClasses(variant: StatusVariant) {
  return classNames({
    'inline-flex justify-center items-center rounded-full w-1.5 h-1.5 font-normal':
      true,
    'bg-success-500': variant === 'success',
    'bg-dark-200': variant === 'default',
    'bg-danger-500': variant === 'error',
    'bg-info-500': variant === 'info',
    'bg-warning-500': variant === 'warning',
  });
}

type BadgeVariant =
  | 'processing'
  | 'processingAnimate'
  | 'green'
  | 'red'
  | 'yellow'
  | 'geekBlue'
  | 'gray';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @default success
   */
  variant?: BadgeVariant;
}

export const Badge = ({
  children,
  className,
  variant = 'processing',
  ...props
}: PropsWithChildren<BadgeProps>) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className={getBadgeClasses(variant)} {...props} />
      <span className="text-xs text-dark-800">{children}</span>
    </div>
  );
};

function getBadgeClasses(variant: BadgeVariant) {
  return classNames({
    'inline-flex justify-center items-center rounded-full w-1.5 h-1.5 font-normal':
      true,
    'bg-primary-500': variant === 'processing',
    'bg-primary-500 shadow-[0_0_0_2px_rgba(24,144,255,0.20)]':
      variant === 'processingAnimate',
    'bg-success-500': variant === 'green',
    'bg-danger-500': variant === 'red',
    'bg-warning-500': variant === 'yellow',
    'bg-secondary-500': variant === 'geekBlue',
    'bg-dark-500': variant === 'gray',
  });
}
