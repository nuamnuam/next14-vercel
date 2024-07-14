import clsx from 'classnames';
import { useBreakpoint } from '@/hooks';

interface Props {
  fullScreen?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ModalFooter: React.FC<Props> = ({
  children,
  className,
  fullScreen = false,
}) => {
  const is_pwa =
    typeof window !== 'undefined'
      ? Boolean(localStorage.getItem('pwa'))
      : false;

  const { isDesktop } = useBreakpoint();

  if (!isDesktop && fullScreen) {
    return (
      <div
        className={clsx(
          'fixed bottom-0 right-0 z-20 w-full rounded-t-2xl bg-white px-4 pt-[10px] shadow-card',
          is_pwa ? 'pb-9' : 'pb-6',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return <div className={clsx('mt-auto', className)}>{children}</div>;
};

export default ModalFooter;
