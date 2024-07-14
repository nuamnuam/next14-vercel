import { type MouseEventHandler } from 'react';

import { Button } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import Link from 'next/link';
import clsx from 'classnames';

interface URL {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  username: string;
  toString: () => string;
}
interface IProps {
  name?: string;
  value?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  href: URL;
  additionalClassNames?: string;
}

const ContactInfoItem = (props: IProps) => {
  const [global] = useLang(['global']);

  const { name, value, onClick, href, additionalClassNames } = props;
  const { isDesktop } = useBreakpoint();

  return (
    <div className="flex w-full items-center justify-between border-b-[1px] border-[#EFF2F5] py-5 px-4 sm:px-10">
      <p className="text-sm font-normal text-dark-500">{name}</p>
      <div
        className={clsx(
          'flex items-center justify-center gap-x-4 px-4 font-medium text-sm',
          additionalClassNames,
        )}
        dir="ltr"
      >
        {value || ''}
      </div>
      {isDesktop ? (
        <Button
          variant="primary"
          onClick={onClick}
          size="sm"
          className="!rounded-md"
        >
          {value && value !== '' ? global.edit : global.add}
        </Button>
      ) : (
        <Link href={href}>
          <Button variant="primary" size="sm" className="!rounded-md">
            {value ? global.edit : global.add}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ContactInfoItem;
