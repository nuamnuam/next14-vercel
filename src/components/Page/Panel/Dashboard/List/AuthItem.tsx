import Link from 'next/link';

import { Chip, Icon, Spinner } from '@/components/Common';

type Variant = 'success' | 'warning' | 'danger' | 'secondary' | 'info';

interface IProps {
  name?: string;
  status?: string;
  level?: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  statusVariant?: Variant;
  isLoading?: boolean;
}
const AuthItem = (props: IProps) => {
  const {
    name,
    status,
    level,
    icon,
    href = '',
    onClick = () => {},
    statusVariant = 'warning',
    isLoading = false,
  } = props;

  const el = (
    <div
      onClick={() => {
        onClick();
      }}
      className="flex w-full cursor-pointer items-center justify-between border-b-[1px] border-[#EFF2F5] px-4 py-6 sm:pt-6 sm:pb-6 sm:pr-10 sm:pl-10"
    >
      <div className="flex items-center justify-end gap-x-4">
        <Icon icon={icon} size={22} className="lg:hidden [&>*]:fill-dark-200" />
        <p className="text-sm font-normal text-dark-800 ">{name}</p>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        {isLoading && <Spinner />}
        {status && !isLoading && (
          <Chip
            variant={statusVariant}
            label={status}
            classNames="[&>span]:font-medium"
          />
        )}
        {level && <Chip variant="info" label={level} />}
        <Icon icon="Left-OutLined" size={14} className="[&>*]:fill-dark-400" />
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="w-full">
      {el}
    </Link>
  ) : (
    el
  );
};

export default AuthItem;
