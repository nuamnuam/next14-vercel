import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import clsx from 'classnames';

import {
  useBalancesData,
  useBreakpoint,
  useLang,
  useNotifications,
  useProfile,
  useSettings,
  useSingleBalanceCoin,
} from '@/hooks';
import { useProfileMutation } from '@/requests/profileMutation';
import { useUserLimitations } from '@/requests/panel/wallet/getUserLimitations';
import { messagesTabItems } from '@/components/Page/Panel/MyAccount/Messages/components/MessagesContent';
import { useBalances } from '@/requests/panel/wallet/getBalances';
import { GuideModal } from '@/components/Page/PWA/components';
import FcmTokenComp from '@/components/Firebase';

import { menuItems } from './RightMenu';

const Header = dynamic(async () => await import('./Header'), { ssr: false });
const BottomNav = dynamic(async () => await import('./BottomNav'), {
  ssr: false,
});
const Credit = dynamic(async () => await import('./Credit'), { ssr: false });
const RightMenu = dynamic(async () => await import('./RightMenu'), {
  ssr: false,
});
const BreadCrumb = dynamic(
  async () => await import('@/components/Common/BreadCrumb'),
  {
    ssr: false,
  },
);

interface Props {
  children: React.ReactNode;
  layout?: 'right' | 'left';
  noHeader?: boolean;
  className?: {
    childrenContainer?: string;
    childrenContent?: string;
  };
  pageName?: string;
}

const headlessPanelResponsiveRoutes = [
  '/panel/wallet/bank-accounts',
  '/panel/my-account',
  '/panel/payment-result',
  '/panel/wallet/transactions-list',
  '/panel/wallet/toman-deposit',
  '/panel/wallet/id-deposit',
  '/panel/wallet/crypto-deposit',
  '/panel/instant-trade/buy',
  '/panel/instant-trade/sell',
  '/panel/instant-trade/convert',
  '/panel/instant-market',
  '/panel/advance-market',
  '/panel/advance-trade',
  '/panel/open-orders',
  '/panel/support',
  '/panel/wallet/toman-withdraw',
  '/panel/wallet/crypto-withdraw',
  '/panel/referrals',
  '/panel/migrate-user',
];

const PanelLayout: React.FC<Props> = ({
  children,
  noHeader = false,
  className,
  pageName,
}) => {
  const [menu] = useLang(['menu']);

  useNotifications();
  const { data: profileData } = useProfile();
  useSettings();
  useUserLimitations();
  useSingleBalanceCoin('IRT');
  useBalancesData();
  useBalances({ q: 'IRT' });

  const { isDesktop } = useBreakpoint();
  const { mutateAsync: profileMutateAsync } = useProfileMutation();

  const {
    query: { mainItem, subItem },
    asPath,
    route,
    pathname,
  } = useRouter();

  useEffect(() => {
    profileMutateAsync();
  }, []);

  const showRightMenu = useMemo(() => {
    if (asPath.startsWith('/panel/advance-trade')) return false;
    return true;
  }, [asPath, route]);

  const showBottomMenu = useMemo(() => {
    if (
      asPath.startsWith('/panel/wallet/bank-accounts') ||
      asPath.startsWith('/panel/my-account/settings') ||
      asPath.startsWith('/panel/my-account/security') ||
      asPath.startsWith('/panel/my-account') ||
      asPath.startsWith('/panel/my-account/profile') ||
      asPath.startsWith('/panel/advance-trade') ||
      asPath.startsWith('/panel/open-orders') ||
      asPath.startsWith('/panel/support') ||
      asPath.startsWith('/panel/wallet/transactions-list') ||
      asPath.startsWith('/panel/instant-trade') ||
      asPath.startsWith('/panel/wallet/toman-withdraw') ||
      asPath.startsWith('/panel/wallet/crypto-withdraw') ||
      asPath.startsWith('/panel/referrals') ||
      asPath.startsWith('/panel/wallet/id-deposit') ||
      asPath.startsWith('/panel/wallet/toman-deposit') ||
      asPath.startsWith('/panel/wallet/crypto-deposit') ||
      asPath.startsWith('/panel/migrate-user')
    )
      return false;
    return true;
  }, [asPath, route]);

  const shouldShowHeader = useMemo(() => {
    if (isDesktop) return true;

    const isExcepted = !!headlessPanelResponsiveRoutes.filter((i) =>
      asPath.startsWith(i),
    )?.length;

    return !isExcepted;
  }, [asPath, isDesktop]);

  const flatMenuItems = menuItems(
    !!profileData?.kyc_info.details?.['financial-info'],
  )
    .concat(messagesTabItems(isDesktop))
    .flatMap((item) => [item, ...(item.children || [])]);

  const activeMenu = flatMenuItems.find((item) => {
    if (Array.isArray(item.href)) {
      const hasUrlRoute = item.href.some((href) => pathname.startsWith(href));
      if (hasUrlRoute) return item;
    } else {
      if (pathname.startsWith(item?.href as string)) return item;
    }
  });

  const breadCurmbGenerator = useMemo(() => {
    const items = [
      {
        label: menu.panel,
        href: '/panel/dashboard',
      },
    ];

    if (activeMenu) {
      items.push({
        label: activeMenu.title,
        href: Array.isArray(activeMenu?.href)
          ? activeMenu.href[0]
          : activeMenu.href ?? '',
      });
    }
    return items;
  }, [pathname]);

  if (
    (!isDesktop &&
      [
        'my_account/profile',
        'wallet/bank-accounts',
        'my_account/security',
        'my_account/validation',
      ].includes(mainItem + '/' + subItem)) ||
    (!isDesktop && ['/panel/my-account/validation'].includes(route))
  ) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <main className="min-h-screen">
      {!noHeader && !(pageName === 'validation' && !isDesktop) && (
        <Header shouldShowHeader={shouldShowHeader} />
      )}
      {isDesktop && (
        <div className="border-b border-dark-100 bg-dark-50">
          <div className="container">
            <div className="flex items-center justify-between py-2">
              <div>
                <BreadCrumb items={breadCurmbGenerator} />
              </div>
              <div className="mr-auto">
                <Credit />
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={clsx(shouldShowHeader && 'my-8', className?.childrenContent)}
      >
        <div
          className={clsx(
            'relative flex items-start justify-between md:gap-8',
            shouldShowHeader && 'container',
            className?.childrenContainer,
          )}
        >
          {isDesktop && showRightMenu && <RightMenu />}
          <div
            className={clsx(
              'pb-[84px] lg:pb-0 w-full',
              showRightMenu && 'lg:w-[calc(100%-296px)]',
            )}
          >
            {children}
          </div>
        </div>
      </div>
      {!isDesktop && showBottomMenu && <BottomNav />}
      <GuideModal />
      <FcmTokenComp />
    </main>
  );
};

const PanelWrapper = <T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const Wrapper: React.FC<T> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const userIsLogin = !!Cookies.get('token');

      const callbackURL = decodeURI(router.pathname);
      router.query.callbackURL = callbackURL;

      if (!userIsLogin) {
        const url = {
          pathname: '/auth/login',
          query: { ...router.query },
        };

        router.push(url, undefined, { shallow: true });
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default PanelWrapper(PanelLayout);
