import React, { useCallback } from 'react';
import IconButton from '@/components/Common/IconButton';
import { Button, Icon, Logo } from '@/components/Common';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLang } from '@/hooks';

const Header = () => {
  const [auth] = useLang(['auth']);
  const { back, pathname, query } = useRouter();

  const renderButtons = useCallback(() => {
    if (query.otp) return;
    if (pathname.startsWith('/auth/login'))
      return (
        <Link href={'/auth/signup'}>
          <Button variant="secondary">{auth.signup}</Button>
        </Link>
      );
    if (pathname.startsWith('/auth/signup'))
      return (
        <>
          <Link href={'/auth/login'}>
            <Button variant="secondary">{auth.enter}</Button>
          </Link>
          <IconButton
            size="lg"
            className="mr-4 border-dark-200"
            icon={
              <Icon
                icon="QuestionCircle-OutLined"
                size={20}
                className="text-dark-600"
              />
            }
          />
        </>
      );
    if (pathname.startsWith('/auth/reset-password'))
      return (
        <Link href={'/auth/login'}>
          <Button variant="secondary">{auth.cancel}</Button>
        </Link>
      );
  }, [pathname, query]);

  return (
    <div className="w-full border-b border-dark-100 bg-white">
      <div className="container flex items-center justify-between">
        <div className="flex h-[76px] items-center justify-between">
          {pathname.startsWith('/auth/forgot-password') && (
            <Icon
              icon="Right-OutLined"
              size={18}
              className="ml-8 text-dark-200"
              onClick={back}
            />
          )}
          <Logo type="text" size="sm" />
        </div>
        <div className="mr-auto flex items-center">{renderButtons()}</div>
      </div>
    </div>
  );
};

export default Header;
