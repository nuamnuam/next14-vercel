import { useCallback } from 'react';
import clsx from 'classnames';
import { toPersianDigits } from '@/utils';
import Icon from '../Icon';

interface Props {
  value: string;
  label: string;
  onClick?: () => void;
  variant:
    | 'inactive'
    | 'inProgress'
    | 'complete'
    | 'notComplete'
    | 'error'
    | 'warning'
    | 'info'
    | 'done';
}

const HorizontalStep: React.FC<Props> = ({
  value,
  variant,
  label,
  onClick,
}) => {
  const renderBullet = useCallback(() => {
    let bulletValue = null;
    let bulletClassname = '';

    switch (variant) {
      case 'inactive':
        bulletValue = toPersianDigits(value);
        bulletClassname =
          '[&>span]:text-white [&>span]:bg-dark-300 [&>p]:text-dark-300 ';
        break;
      case 'inProgress':
        bulletValue = toPersianDigits(value);
        bulletClassname =
          '[&>span]:text-white [&>span]:bg-blue-500 [&>p]:text-dark-600 ';
        break;
      case 'complete':
        bulletValue = toPersianDigits(value);
        bulletClassname =
          '[&>span]:text-white [&>span]:bg-primary-500 [&>p]:text-dark-600 ';
        break;
      case 'notComplete':
        bulletValue = (
          <Icon
            icon="CheckCircle-OutLined"
            size={24}
            className="text-dark-400"
          />
        );
        bulletClassname = '[&>p]:text-dark-600 ';
        break;
      case 'error':
        bulletValue = (
          <Icon
            icon="CloseCircle-Filled"
            size={24}
            className="text-danger-600"
          />
        );
        bulletClassname = '[&>p]:text-danger-600 ';
        break;
      case 'warning':
        bulletValue = (
          <Icon
            icon="ClockCircle-Filled"
            size={24}
            className="text-warning-600"
          />
        );
        bulletClassname = '[&>p]:text-warning-600 ';
        break;
      case 'info':
        bulletValue = (
          <Icon icon="InfoCircle-Filled" size={24} className="text-blue-600" />
        );
        bulletClassname = '[&>p]:text-blue-600 ';
        break;
      case 'done':
        bulletValue = (
          <Icon
            icon="CheckCircle-Filled"
            size={24}
            className="text-primary-500"
          />
        );
        bulletClassname = '[&>p]:text-dark-600 ';
        break;
      default:
        return null;
    }

    return (
      <div
        className={clsx(
          'flex items-center gap-2 px-2 bg-white',
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

export default HorizontalStep;
