import React from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { Icon } from '@/components/Common';
import { assetsUrl } from '@/utils';

export type CardVariant = 'primary' | 'info' | 'danger' | 'normal';

export interface CardLinkProps {
  variant: CardVariant;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  href: string;
}

const CardLink: React.FC<CardLinkProps> = ({
  variant,
  title,
  description,
  icon,
  image,
  href,
}) => {
  return (
    <Link
      href={href}
      className="flex h-[100px] items-center justify-between gap-4 border-l border-b border-dark-50 px-6 transition-all duration-300 hover:bg-dark-50 lg:h-[130px]"
    >
      {image ? (
        <img src={assetsUrl(image)} alt={title} width={32} height={32} />
      ) : null}
      {icon ? (
        <Icon
          icon={icon}
          size={32}
          className={clsx(
            variant === 'primary' && '[&>*]:fill-primary-500',
            variant === 'info' && '[&>*]:fill-blue-500',
            variant === 'danger' && '[&>*]:fill-danger-600',
            variant === 'normal' && '[&>*]:fill-dark-200',
          )}
        />
      ) : null}
      <div className="flex flex-col">
        <span
          className={clsx(
            'font-bold leading-7 ',
            variant === 'primary' && 'text-primary-500',
            variant === 'info' && 'text-blue-600',
            variant === 'danger' && 'text-danger-600',
            variant === 'normal' && 'text-dark-700',
          )}
        >
          {title}
        </span>
        <span className="text-sm font-medium leading-6 text-dark-300">
          {description}
        </span>
      </div>
      <Icon icon="Left-OutLined" size={12} className="mr-auto text-dark-100" />
    </Link>
  );
};

export default CardLink;
