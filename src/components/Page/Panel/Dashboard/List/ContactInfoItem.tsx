import { type MouseEventHandler } from 'react';

import { Button } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import Link from 'next/link';

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
}

const ContactInfoItem = (props: IProps) => {
  const [global] = useLang(['global']);

  const { name, value, onClick, href } = props;
  const { isDesktop } = useBreakpoint();

  return (
    <div className="flex w-full items-center justify-between border-b-[1px] border-[#EFF2F5] p-4 pt-5 pb-5 sm:pt-6 sm:pb-6 sm:pr-10 sm:pl-10">
      <p className="text-sm font-normal text-dark-500">{name}</p>
      <div
        className="flex items-center justify-center gap-x-4 px-4 font-medium"
        dir="ltr"
      >
        {value || ''}
      </div>
      {isDesktop ? (
        <Button
          variant="primary"
          className="w-fit border-none"
          onClick={onClick}
          size="sm"
        >
          {value && value !== '' ? global.edit : global.add}
        </Button>
      ) : (
        <Link
          href={href}
          className="w-fit rounded-lg border-none bg-primary-500 px-2 py-2 text-sm font-medium text-white"
        >
          {value ? global.edit : global.add}
        </Link>
      )}
    </div>
  );
};

export default ContactInfoItem;
