import { toPersianDigits } from '@/utils';
import clsx from 'classnames';

interface IProps {
  className?: string;
  value?: string;
  onClick?: () => void;
}

const Step = ({ className, value, onClick }: IProps) => {
  return (
    <span
      onClick={onClick}
      className={clsx(
        className,
        'flex h-[21px] w-[21px] items-center justify-center rounded-3xl text-normal text-sm text-white pt-1',
      )}
    >
      {toPersianDigits(value)}
    </span>
  );
};

export default Step;
