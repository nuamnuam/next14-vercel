import React from 'react';
import clsx from 'classnames';

type BoxDividerSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

interface BoxDividerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  className?: string;
  size?: BoxDividerSize;
}

export const BoxDivider = ({
  className,
  size = 'md',
  ...props
}: BoxDividerProps) => {
  return (
    <div
      className={clsx(
        'w-full  border-dark-50',
        size === 'xl' && 'bg-dark-lightest h-[56px] border-y',
        size === 'lg' && 'bg-dark-lightest h-[50px] border-y',
        size === 'md' && 'bg-dark-lightest h-[24px] border-t',
        size === 'sm' && 'h-2 border-t',
        size === 'xs' && 'h-2 border-t-2',
        className,
      )}
      aria-label="Box Divider"
      {...props}
    />
  );
};

type HorizontalDividerVariant = 'line' | 'dash' | 'lineDash';
type HorizontalDividerAlign = 'center' | 'right' | 'left';

interface HorizontalDivider
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  className?: string;
  variant: HorizontalDividerVariant;
  title: string;
  subTitle: string;
}

export const HorizontalDivider = ({
  className,
  variant,
  title,
  subTitle,
  ...props
}: HorizontalDivider) => {
  return (
    <div
      className={clsx(
        'bg-dark-lightest h-6 border-t border-dark-50',
        className,
      )}
      aria-label="Horizontal Divider"
      {...props}
    >
      {title || subTitle ? (
        <div className="px-4 text-center bg-white before:absolute">
          {title ? (
            <h3 className="text-dark-900 text-sm font-normal">{title}</h3>
          ) : null}
          {subTitle ? (
            <span className="text-dark-300 text-xxs font-normal">
              {subTitle}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

type VerticalDividerVariant = 'primary' | 'secondary' | 'dashed';

interface VerticalDividerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  className?: string;
  variant: VerticalDividerVariant;
}

export const VerticalDivider = ({
  className,
  variant,
  ...props
}: VerticalDividerProps) => {
  return (
    <div
      className={clsx(
        'h-[150px] w-1 border-l',
        variant === 'dashed' && 'border-dashed border-dark-100',
        variant === 'primary' && 'border-solid border-dark-100',
        variant === 'secondary' && 'border-solid border-dark-50',
        className,
      )}
      aria-label="Vertical Divider"
      {...props}
    />
  );
};
