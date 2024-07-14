import React, { useMemo } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { authStore } from '@/store';
import FullLogo from '@/components/Icons/FullLogo';
import TextLogo from '@/components/Icons/TextLogo';

import Icon from '../Icon';

interface Props {
  size: 'sm' | 'md' | 'lg';
  type: 'full' | 'text' | 'sign';
  linkable?: boolean;
  classNames?: string;
}

const Logo: React.FC<Props> = ({ size, type, linkable = true, classNames }) => {
  const is_pwa =
    typeof window !== 'undefined'
      ? Boolean(localStorage.getItem('pwa'))
      : false;

  const { token } = authStore();
  const isLogin = !!token;

  const fullLogoSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return { width: 100, height: 30 };
      case 'md':
        return { width: 147, height: 44 };
      case 'lg':
        return { width: 180, height: 54 };
      default:
        return { width: 100, height: 30 };
    }
  }, [size]);

  const textLogoSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return { width: 84, height: 30 };
      case 'md':
        return { width: 105, height: 38 };
      case 'lg':
        return { width: 129, height: 45 };
      default:
        return { width: 100, height: 30 };
    }
  }, [size]);

  const signLogoSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return { width: 17, height: 30 };
      case 'md':
        return { width: 24, height: 44 };
      case 'lg':
        return { width: 31, height: 54 };
      default:
        return { width: 17, height: 30 };
    }
  }, [size]);

  const renderLogo = useMemo(() => {
    switch (type) {
      case 'full':
        return (
          <FullLogo width={fullLogoSize.width} height={fullLogoSize.height} />
        );
      case 'text':
        return (
          <TextLogo width={textLogoSize.width} height={textLogoSize.height} />
        );
      case 'sign':
        return (
          <Icon
            icon="Arzinja-Filled"
            className="text-primary-500"
            size={signLogoSize.width}
          />
        );
      default:
        return <FullLogo />;
    }
  }, [size, type, fullLogoSize, textLogoSize, signLogoSize]);

  if (linkable)
    return (
      <Link href={isLogin ? '/panel/dashboard' : is_pwa ? '#' : '/'}>
        <div className={clsx('cursor-pointer', classNames)}>{renderLogo}</div>
      </Link>
    );
  return <div className={clsx(classNames)}>{renderLogo}</div>;
};

export default Logo;
