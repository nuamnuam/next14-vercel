import clsx from 'classnames';
import { Icon } from '@/components/Common';

interface IProps {
  label: string;
  labelClassName?: string;
  value?: string;
  onClick?: () => void;
  icon: string;
  iconClassName?: string;
  iconSize: number;
}

const Step = ({
  label,
  labelClassName,
  iconClassName,
  icon,
  iconSize,
  onClick,
}: IProps) => {
  return (
    <div className="flex items-center justify-start gap-x-2">
      <Icon icon={icon} className={iconClassName} size={iconSize} />
      <p
        onClick={onClick}
        className={clsx(
          labelClassName,
          'flex h-[21px] w-[21px] cursor-pointer items-center justify-center rounded-3xl pt-1 text-center',
        )}
      >
        {label}
      </p>
    </div>
  );
};

export default Step;
