import React from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import Icon from '../Icon';
import { useLang } from '@/hooks';

interface Props {
  adminName?: string;
  userName?: string;
  date: string;
  message: string;
  classNames?: string;
  attachments?: Array<{ title: string; link: string }>;
}

const MessageBox: React.FC<Props> = ({
  adminName,
  userName,
  date,
  message,
  attachments,
  classNames,
}) => {
  const [global] = useLang(['global']);

  return (
    <div className={clsx('flex gap-4', classNames)}>
      <div
        className={clsx(
          'rounded-lg w-10 h-10 flex items-center justify-center mt-9',
          adminName ? 'bg-primary-500' : 'bg-dark-100',
        )}
      >
        {adminName ? (
          <Icon icon="Arzinja-Filled" size={20} className="text-white" />
        ) : (
          <Icon icon="UserAccount-OutLined" size={20} className="text-white" />
        )}
      </div>
      <div className="flex-auto">
        <div className="flex justify-between items-center mb-4">
          {adminName && (
            <span className="text-dark-600 text-sm font-medium">
              {adminName} | {global.arzAdmin}
            </span>
          )}
          {userName && (
            <span className="text-dark-600 text-sm font-medium">
              {userName}
            </span>
          )}
          <span className="text-dark-400 text-xs">{date}</span>
        </div>
        <div
          className={clsx(
            'flex-auto py-6 px-3 relative rounded-lg after:absolute after:top-4 after:-right-1 after:w-3 after:h-3 after:rotate-45',
            adminName
              ? 'bg-primary-50 after:bg-primary-50'
              : 'bg-dark-50 after:bg-dark-50',
          )}
        >
          <p
            className={clsx(
              'text-sm leading-4',
              adminName ? 'text-primary-900' : 'text-dark-600',
            )}
          >
            {message}
          </p>
          {attachments?.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className={clsx(
                'mt-4 flex items-center gap-2',
                adminName ? 'text-primary-600' : 'text-dark-400',
              )}
            >
              <Icon icon="PaperClip-OutLined" size={12} />
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
