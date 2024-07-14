import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { useLang } from '@/hooks';

import Icon from '../Icon';

type Props = {
  variant?: 'primary' | 'dark';
};

const GuideButton: FC<Props> = ({ variant = 'dark' }) => {
  const [global] = useLang(['global']);

  return (
    <Link
      href={'/help'}
      className={clsx(
        'flex w-fit cursor-pointer select-none items-center rounded-2xl bg-dark-50 px-2 py-2 gap-2',
        variant === 'primary' && '!bg-primary-50',
      )}
    >
      <Icon
        icon={
          variant === 'dark'
            ? 'QuestionCircle-OutLined'
            : 'ExclamationCircle-OutLined'
        }
        size={variant === 'dark' ? 16 : 20}
        className={clsx(
          'text-dark-400',
          variant === 'primary' && 'text-primary-600',
        )}
      />
      <span
        className={clsx(
          'mr-1 block text-sm font-medium text-dark-400',
          variant === 'primary' && 'text-primary-600',
        )}
      >
        {global.guide}
      </span>
    </Link>
  );
};

export default GuideButton;
