import { type ButtonProps } from '@/types/component';
import classNames from 'classnames';
import { forwardRef } from 'react';
import ButtonBase, { ButtonBaseContext } from './ButtonBase';
import Spinner from './Spinner';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonProps;

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    children,
    size = 'md',
    variant = 'primary',
    shape = 'standard',
    fullWidth,
    endIcon,
    startIcon,
    isBusy,
    disabled = false,
    isLoading = false,
    onClick,
    disableWithoutAffect = false,
    childrenClassname,
    ...props
  },
  ref,
) {
  return (
    <ButtonBase size={size} variant={variant} shape={shape} disabled={disabled}>
      <ButtonBaseContext.Consumer>
        {({
          iconSizeClass,
          sizeClass,
          variantClass,
          disabledClass,
          iconButtonSize,
        }) => (
          <button
            ref={ref}
            {...props}
            className={classNames(
              'btn',
              props.className && props.className,
              sizeClass,
              variantClass,
              fullWidth && 'btn-fullWidth w-full',
              children && (startIcon != null || endIcon != null) && 'gap-x-2',
              isBusy && 'cursor-wait',
              disabled && !disableWithoutAffect && 'border-none',
              disabled && !disableWithoutAffect && `${disabledClass}`,
              (startIcon != null || endIcon != null) &&
                !children &&
                iconButtonSize(),
            )}
            onClick={(e) => {
              if (isLoading || disabled) {
                e.preventDefault();
                return;
              }

              onClick != null && onClick(e);
            }}
          >
            {startIcon != null && (
              <span
                className={classNames(
                  iconSizeClass(),
                  // disabled && "opacity-50",
                  isBusy && 'invisible',
                )}
              >
                {startIcon}
              </span>
            )}

            {!isLoading && (
              <span
                className={classNames(
                  'w-full block',
                  disabled &&
                    !disableWithoutAffect &&
                    'text-dark-200 !font-medium',
                  isBusy && 'invisible',
                  childrenClassname && childrenClassname,
                )}
              >
                {children}
              </span>
            )}

            {endIcon != null && (
              <span
                className={classNames(
                  iconSizeClass(),
                  // disabled && "opacity-50",
                  isBusy && 'invisible',
                )}
              >
                {endIcon}
              </span>
            )}

            {isLoading && (
              <Spinner
                type="secondary"
                className={classNames(
                  variant === 'primary' || variant === 'dark'
                    ? 'text-white'
                    : 'text-black',
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                )}
              />
            )}
          </button>
        )}
      </ButtonBaseContext.Consumer>
    </ButtonBase>
  );
});

export default Button;
