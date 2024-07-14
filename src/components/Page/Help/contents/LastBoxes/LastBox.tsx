import React from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import { HelpContentResponse } from '@/requests/help';

import { Icon } from '@/components/Common';
import { useLang } from '@/hooks';

export type BoxLinkType = {
  label: string;
  href: string;
  description?: string;
  media?: HelpContentResponse['data'][number]['attributes']['media'];
};

interface Props {
  title: string;
  variant: 'danger' | 'info' | 'warning';
  showMoreHref: string;
  icon: string;
  items: BoxLinkType[];
}

const LastBox: React.FC<Props> = ({
  title,
  items,
  variant,
  showMoreHref,
  icon,
}) => {
  const [singleCoin] = useLang(['singleCoin']);

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg bg-dark-700 p-8">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
      <div className="flex flex-col gap-4 min-h-[200px]">
        {items.map(({ label, href }, index) => (
          <Link className="w-full text-right" href={href} key={index}>
            <span
              className="relative flex pr-4 text-sm font-medium text-dark-200 after:absolute after:right-0 after:top-2 after:h-1 after:w-1 after:rounded-full after:bg-dark-200 "
              dangerouslySetInnerHTML={{ __html: label }}
            />
          </Link>
        ))}
      </div>
      <Link href={showMoreHref} className="mt-4 flex items-center justify-end">
        <span className="ml-1.5 font-medium text-primary-500">
          {singleCoin.viewMore}
        </span>
        <Icon
          icon="ArrowLeft-TwoTone"
          size={24}
          className="[&>*]:fill-primary-500"
        />
      </Link>
      <div
        className={clsx(
          'absolute -top-10 -left-10 flex h-40 w-40 items-center justify-center rounded-full border-[26px] bg-clip-content',
          variant === 'danger' && 'border-danger-300/10 bg-danger-300/20',
          variant === 'info' && 'border-blue-300/10 bg-blue-300/20',
          variant === 'warning' && 'border-warning-300/10 bg-warning-300/20',
        )}
      >
        <Icon
          icon={icon}
          className={clsx(
            variant === 'danger' && '[&>*]:fill-danger-300',
            variant === 'info' && '[&>*]:fill-blue-300',
            variant === 'warning' && '[&>*]:fill-warning-300',
          )}
          size={32}
        />
      </div>
    </div>
  );
};

export default LastBox;
