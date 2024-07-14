import React, { CSSProperties } from 'react';
import clsx from 'classnames';
import { ToastContainer, toast, IconProps } from 'react-toastify';

import { Icon } from '@/components/Common';
import { useBreakpoint } from '@/hooks';

const TOAST_TIME = 3000;

const getWrapperStyle = (isMobile: boolean): CSSProperties => {
  if (isMobile) {
    return {
      marginTop: '1rem',
      marginRight: '.5rem',
      width: '95%',
    };
  }
  return {};
};

const ToastProvider = () => {
  const { isMobile } = useBreakpoint();

  return (
    <ToastContainer
      position="top-right"
      closeOnClick
      rtl
      pauseOnHover
      newestOnTop
      limit={1}
      autoClose={TOAST_TIME}
      style={getWrapperStyle(isMobile)}
    />
  );
};

const sharedClassNames =
  '!text-white !font-medium !text-sm items-center !p-4 rounded-[4px]';

const sharedBodyClassNames = '!p-0 !m-0 !pl-4';

type VariantType = 'success' | 'info' | 'danger' | 'warning' | 'dark' | 'light';

type ToastVariantType = {
  variant?: VariantType;
  className: string | any;
  bodyClassName?: string;
  progressClassName: string;
  icon?:
    | ((props: IconProps) => React.ReactNode)
    | React.ReactElement<IconProps>;
  closeButton?: any;
  toastId: string;
  autoClose?: number;
};

const toastVariants: ToastVariantType[] = [
  {
    variant: 'success',
    className: '!bg-primary-600',
    progressClassName: '!bg-primary-400',
    closeButton: (
      <Icon icon="Close-OutLined" className="text-white" size={14} />
    ),
    icon: <Icon icon="CheckCircle-OutLined" size={18} className="text-white" />,
    toastId: 'success-toast',
  },
  {
    variant: 'info',
    className: '!bg-blue-500',
    progressClassName: '!bg-blue-200',
    closeButton: (
      <Icon icon="Close-OutLined" className="text-white" size={14} />
    ),
    icon: <Icon icon="InfoCircle-OutLined" size={18} className="text-white" />,
    toastId: 'info-toast',
  },
  {
    variant: 'danger',
    className: '!bg-danger-400',
    progressClassName: '!bg-danger-200',
    closeButton: (
      <Icon icon="Close-OutLined" className="text-white" size={14} />
    ),
    icon: <Icon icon="CloseCircle-OutLined" size={18} className="text-white" />,
    toastId: 'danger-toast',
  },
  {
    variant: 'warning',
    className: '!bg-warning-500',
    progressClassName: '!bg-warning-200',
    closeButton: (
      <Icon icon="Close-OutLined" className="text-white" size={14} />
    ),
    icon: (
      <Icon
        icon="ExclamationCircle-OutLined"
        size={18}
        className="text-white"
      />
    ),
    toastId: 'warning-toast',
  },
  {
    variant: 'dark',
    className: '!bg-dark-700',
    progressClassName: '!bg-dark-400',
    closeButton: (
      <Icon icon="Close-OutLined" className="text-white" size={14} />
    ),
    icon: <Icon icon="Bell-OutLined" size={18} className="text-white" />,
    toastId: 'dark-toast',
  },
  {
    variant: 'light',
    className: '!bg-white',
    bodyClassName: '!text-dark-700',
    progressClassName: '!bg-dark-100',
    closeButton: (
      <Icon icon="Close-OutLined" size={14} className="text-dark-700" />
    ),
    icon: <Icon icon="Bell-OutLined" size={18} className="text-dark-700" />,
    toastId: 'light-toast',
  },
];

export const showToast: any = {};

toastVariants.forEach((item) => {
  showToast[item.variant as keyof VariantType] = (
    msg: string | React.ReactNode,
    hasCloseIcon: boolean = true,
  ) => {
    const toastProperies: ToastVariantType = {
      className: clsx(sharedClassNames, item.className),
      bodyClassName: clsx(sharedBodyClassNames, item.bodyClassName),
      progressClassName: item.progressClassName,
      icon: item.icon,
      closeButton: hasCloseIcon && item.closeButton ? item.closeButton : false,
      toastId: item.toastId,
    };

    if (Array.isArray(msg)) {
      let timeOut: NodeJS.Timeout;
      let i = 0;

      const sequence = () => {
        if (!toast.isActive(i)) {
          toast.success(msg[i], {
            ...toastProperies,
            toastId: i,
            autoClose: TOAST_TIME,
            onClose: () => {
              clearTimeout(timeOut);
              sequence();
            },
          });
        }
        i++;
        if (i < msg.length) {
          timeOut = setTimeout(sequence, TOAST_TIME);
        }
      };

      sequence();
    }
    return toast.success(msg, toastProperies);
  };
});

export default ToastProvider;
