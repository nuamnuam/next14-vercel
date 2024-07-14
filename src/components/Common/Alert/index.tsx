import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { Button, Icon } from '@/components/Common';
import { useAlerts, useBreakpoint } from '@/hooks';
import type { AlertItem } from '@/hooks/useAlerts';
import { isHTML, toPersianDigits } from '@/utils';

type Variant = 'success' | 'info' | 'warning' | 'danger';

type Slug = {
  feature: string;
  section: string;
  step?: string;
};
interface AlertProps {
  variant?: Variant;
  title?: string;
  message?: string | string[] | React.ReactNode;
  className?: string;
  hasIcon?: boolean;
  hasClose?: boolean;
  closeCallback?: () => void;
  customMessage?: React.ReactNode;
  titleClassName?: string;
  messageClassName?: string;
  contentClassName?: string;
  ActionComponent?: ReactNode;
  slug?: Slug;
  fullWidthCta?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title = null,
  message,
  className = '',
  hasIcon = true,
  hasClose = false,
  closeCallback = () => {},
  titleClassName,
  messageClassName,
  contentClassName,
  ActionComponent,
  slug,
  fullWidthCta = false,
}) => {
  const [open, setOpen] = useState(true);

  const renderIcon = useCallback(() => {
    let icon = '';
    let className = '';

    switch (variant) {
      case 'success':
        icon = 'CheckCircle-OutLined';
        className = 'text-success-600';
        break;
      case 'info':
        icon = 'InfoCircle-OutLined';
        className = 'text-blue-500';
        break;
      case 'warning':
        icon = 'ExclamationCircle-OutLined';
        className = 'text-warning-600';
        break;
      case 'danger':
        icon = 'CloseCircle-OutLined';
        className = 'text-danger-500';
        break;
      default:
        break;
    }

    return (
      <Icon
        icon={icon}
        className={clsx('mt-1 w-fit', className)}
        size={title ? 22 : 16}
      />
    );
  }, [variant]);

  const wrapperClassName = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'bg-success-50 [&_span]:text-success-800 [&_p]:text-success-800 [&_.close-icon]:text-success-700';
      case 'info':
        return 'bg-blue-50 [&_span]:text-secondary-400 [&_p]:text-secondary-400 [&_.close-icon]:text-secondary-200';
      case 'warning':
        return 'bg-warning-50 [&_p]:text-warning-800 [&_.close-icon]:text-warning-700';
      case 'danger':
        return 'bg-danger-50 [&_span]:text-danger-600 [&_p]:text-danger-600 [&_.close-icon]:text-danger-300';
      default:
    }
  }, [variant]);

  const closeAlert = useCallback(() => {
    setOpen(false);
    closeCallback();
  }, []);

  if (slug) {
    return generateAlerts(slug, className);
  }

  if (!open) return <></>;

  return (
    <div
      className={clsx(
        'flex gap-[10px] rounded-lg px-4 py-2.5',
        wrapperClassName,
        className,
        fullWidthCta && '!flex-col !items-start',
      )}
    >
      <div className={clsx('flex items-start gap-2', contentClassName)}>
        {hasIcon && renderIcon()}
        <div>
          {title && (
            <span
              className={clsx(
                ' inline-block font-bold leading-6 text-sm',
                titleClassName,
              )}
            >
              {title}
            </span>
          )}
          {typeof message === 'string' && isHTML(message) ? (
            <p
              className={clsx('text-sm leading-6', messageClassName)}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          ) : (
            <p className={clsx('text-sm leading-6', messageClassName)}>
              {Array.isArray(message)
                ? message.map((line, index) => (
                    <p key={index}>{toPersianDigits(line)}</p>
                  ))
                : typeof message === 'string'
                ? toPersianDigits(message)
                : message}
            </p>
          )}
        </div>
      </div>
      {hasClose && (
        <span className="mr-auto cursor-pointer" onClick={closeAlert}>
          <Icon
            icon="Close-OutLined"
            size={14}
            className="close-icon mr-auto"
          />
        </span>
      )}
      {ActionComponent && (
        <div
          className={clsx('mr-auto cursor-pointer', fullWidthCta && 'w-full')}
        >
          {ActionComponent}
        </div>
      )}
    </div>
  );
};

export default Alert;

const generateAlerts = (
  { feature, section, step }: Slug,
  className?: string,
): JSX.Element => {
  const { isDesktop } = useBreakpoint();
  const { data } = useAlerts();

  const transformedAlerts = useMemo(() => {
    if (!data?.result?.length) return null;

    const result = data.result.filter((item: AlertItem) => {
      if (item.step) {
        return (
          item.feature === feature &&
          item.section === section &&
          item.step === step &&
          item.status
        );
      }
      return (
        item.feature === feature && item.section === section && item.status
      );
    });

    if (result.length > 1) {
      result.sort((a, b) => a.priority - b.priority);
    }

    return result;
  }, [data, feature, section]);

  if (!transformedAlerts?.length) return <></>;

  return (
    <>
      {transformedAlerts.map(
        ({ alert_type, message, display_status: { web, responsive }, cta }) => (
          <Alert
            key={message}
            variant={alert_type as Variant}
            message={message}
            hasIcon={!cta}
            hasClose={false}
            fullWidthCta={cta?.full_width && !isDesktop}
            className={clsx(
              'my-3 items-center',
              ((isDesktop && !web) || (!isDesktop && !responsive)) && 'hidden',
              className && className,
            )}
            ActionComponent={
              cta ? (
                <Link href={cta.web_action || ''}>
                  <Button
                    fullWidth={cta?.full_width && !isDesktop}
                    size="sm"
                    variant="secondary"
                    className="rounded"
                  >
                    {cta.text}
                  </Button>
                </Link>
              ) : null
            }
          />
        ),
      )}
    </>
  );
};
