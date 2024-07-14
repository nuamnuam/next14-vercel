import { useCallback } from 'react';
import clsx from 'classnames';
import { toPersianDigits } from '@/utils';

interface Props {
  value: string;
  label: string;
  onClick?: () => void;
  variant: 'inactive' | 'complete' | 'done';
}

const VerticalStep: React.FC<Props> = ({ value, variant, label, onClick }) => {
  const renderBullet = useCallback(() => {
    let bulletValue = null;
    let bulletClassname = '';

    switch (variant) {
      case 'inactive':
        bulletValue = toPersianDigits(value);
        bulletClassname =
          '[&>span]:text-white [&>span]:bg-dark-100 [&>p]:text-dark-200 ';
        break;
      case 'complete':
        bulletValue = toPersianDigits(value);
        bulletClassname =
          '[&>span]:text-white [&>span]:bg-primary-500 [&>p]:text-primary-500 ';
        break;
      case 'done':
        bulletValue = toPersianDigits(value);
        bulletClassname =
          '[&>span]:text-white [&>span]:bg-primary-200 [&>p]:text-primary-500 ';
        break;
      default:
        return null;
    }

    return (
      <div
        className={clsx(
          'flex flex-col items-center gap-1 py-2 bg-white',
          bulletClassname,
        )}
      >
        <span
          onClick={() => onClick?.()}
          className={clsx(
            'flex h-[22px] w-[22px] items-center justify-center rounded-3xl text-sm pt-0.5',
          )}
        >
          {bulletValue}
        </span>
        <p className="w-fit text-sm font-medium whitespace-pre">{label}</p>
      </div>
    );
  }, [value, variant]);

  return renderBullet();
};

export default VerticalStep;
