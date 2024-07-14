import { Icon, IconButton } from '@/components/Common';
import { useBreakpoint } from '@/hooks';
import clsx from 'classnames';
import Link from 'next/link';

interface Props {
  title: string;
  onBack?: () => void;
  hasHelp?: boolean;
  extra?: React.ReactNode;
  classNames?: string;
}

const ResponsivePageHeader: React.FC<Props> = ({
  title,
  onBack,
  hasHelp = true,
  extra,
  classNames,
}) => {
  const { isDesktop } = useBreakpoint();

  if (isDesktop) return null;

  return (
    <div
      className={clsx(
        'bg-white border-b border-dark-100 p-4 sm:px-8 mb-8 h-[76px]',
        classNames,
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={clsx(
            'flex gap-8 items-center justify-start',
            onBack && 'cursor-pointer',
          )}
          onClick={() => onBack?.()}
        >
          {onBack && (
            <Icon size={18} icon="Right-OutLined" className="text-dark-200" />
          )}
          <span className="text-dark-600 text-lg font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-4 mr-auto">
          {extra}
          {hasHelp && (
            <Link href={'/help'}>
              <IconButton
                size="lg"
                className="border-dark-200"
                icon={
                  <Icon
                    className="text-dark-600"
                    icon="QuestionCircle-OutLined"
                    size={20}
                  />
                }
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsivePageHeader;
