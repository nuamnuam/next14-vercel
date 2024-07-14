import { useCallback, useMemo } from 'react';
import clsx from 'classnames';
import { toPersianDigits } from '@/utils';

export const ICONBUTTON_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
};

export const ICONBUTTON_VARIANTS = {
  PRIMARY: 'primary',
  OUTLINED: 'outlined',
  DARK: 'dark',
  DASHED: 'dashed',
};

interface IconButtonProps {
  icon: React.ReactNode;
  className?: string;
  badge?: string | number;
  disabled?: boolean;
  size?: string;
  variant?: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  badge = null,
  disabled = false,
  size = ICONBUTTON_SIZES.MEDIUM,
  variant = ICONBUTTON_VARIANTS.OUTLINED,
  onClick,
}) => {
  const generateVariatClassess = useMemo(() => {
    switch (variant) {
      case ICONBUTTON_VARIANTS.DARK:
        return 'bg-dark-600 text-white border-dark-600 hover:bg-dark-700';
      case ICONBUTTON_VARIANTS.PRIMARY:
        return 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600 ';
      case ICONBUTTON_VARIANTS.OUTLINED:
        return 'bg-White border-neutoral-5 text-dark-700 hover:border-primary-600 [&>*]:hover:text-primary-600';
      case ICONBUTTON_VARIANTS.DASHED:
        return 'bg-white border-neutoral-5 text-dark-700 hover:border-primary-600 hover:text-primary-600 border-dashed';
      default:
        return '';
    }
  }, [variant]);

  const generateSizeClassess = useMemo(() => {
    switch (size) {
      case ICONBUTTON_SIZES.SMALL:
        return 'w-6 h-6';
      case ICONBUTTON_SIZES.MEDIUM:
        return 'w-8 h-8';
      case ICONBUTTON_SIZES.LARGE:
        return 'w-10 h-10';
      default:
        return '';
    }
  }, [size]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={clsx(
        'flex justify-center items-center rounded-lg cursor-pointer relative border shadow-button transition duration-300 ease-in-out',
        generateVariatClassess,
        generateSizeClassess,
        className,
        disabled &&
          'border-neutral-5 bg-neutral-3 text-opacity-50 hover:border-neutral-5 hover:bg-neutral-3 hover:text-opacity-50',
      )}
      onClick={handleClick}
    >
      {badge ? (
        <span className="absolute w-4 h-4 rounded-lg bg-danger-500 -inset-1.5 text-xs !text-white flex justify-center items-center pt-0.5">
          {toPersianDigits(badge)}
        </span>
      ) : null}
      {icon}
    </div>
  );
};

export default IconButton;
