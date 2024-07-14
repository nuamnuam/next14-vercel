import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import IconButton, {
  ICONBUTTON_VARIANTS,
} from '@/components/Common/IconButton';
import NavMenu from '@/components/Header/NavMenu';
import WalletMenu from '@/components/Header/WalletMenu/WalletMenu';
import NotificationsMenu from '@/components/Header/NotificationsMenu/NotificationsMenu';
import DownloadAppMenu from '@/components/Header/DownloadAppMenu/DownloadAppMenu';
import { Button, Icon, Logo } from '@/components/Common';
import { profileModalName } from '@/components/Layout/Panel/ProfileModal';
import { notificationsModalName } from '@/components/Header/NotificationsMenu/NotificationsMenuModal';
import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useLang } from '@/hooks';
import Link from 'next/link';
import { downloadAppMenuModalName } from '@/components/Header/DownloadAppMenu/DownloadAppMenuModal';
import { mainMenuDrawerModalName } from './MainMenuDrawerModal';
import { authStore } from '@/store';
import ProfileMenu from '@/components/Header/ProfileMenu/ProfileMenu';
import { useRouter } from 'next/router';
import WalletMenuModal, {
  walletMenuModalName,
} from '@/components/Header/WalletMenu/WalletMenuModal';
import { useMessagesQuery } from '@/requests/panel/messages';

const ProfileModal = dynamic(
  async () => await import('@/components/Header/ProfileMenu/ProfileModal'),
  { ssr: false },
);

const NotificationsMenuModal = dynamic(
  async () =>
    await import(
      '@/components/Header/NotificationsMenu/NotificationsMenuModal'
    ),
  {
    ssr: false,
  },
);

const DownloadAppModal = dynamic(
  async () =>
    await import('@/components/Header/DownloadAppMenu/DownloadAppMenuModal'),
  {
    ssr: false,
  },
);

const MainMenuDrawerModal = dynamic(
  async () => await import('./MainMenuDrawerModal'),
  {
    ssr: false,
  },
);

const Header = () => {
  const [menu] = useLang(['menu']);
  const router = useRouter();
  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  const { token } = authStore();
  const { data: notifications } = useMessagesQuery();

  const isLogin = !!token;

  const { showSyncModal: showProfileModal, closeSyncModal: closeProfileModal } =
    useModal(profileModalName);
  const {
    showSyncModal: showDownloadAppModal,
    closeSyncModal: closeDownloadAppModal,
  } = useModal(downloadAppMenuModalName);

  const {
    showSyncModal: showNotificationsModal,
    closeSyncModal: closeNotificationsModal,
  } = useModal(notificationsModalName);

  const {
    showSyncModal: showMainMenuDrawerModal,
    closeSyncModal: closeMainMenuDrawerModal,
  } = useModal(mainMenuDrawerModalName);

  const {
    showSyncModal: showWalletMenuModal,
    closeSyncModal: closeWalletMenuModal,
  } = useModal(walletMenuModalName);

  useEffect(() => {
    const handleRouteChange = () => {
      closeMainMenuDrawerModal();
      closeNotificationsModal();
      closeDownloadAppModal();
      closeProfileModal();
      closeWalletMenuModal();
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const renderButtons = () => {
    if (isLogin) {
      return isDesktop ? (
        <>
          <WalletMenu
            triggerElement={
              <IconButton
                size="lg"
                icon={
                  <Icon
                    icon="Wallet-OutLined"
                    size={20}
                    className="text-dark-600"
                  />
                }
              />
            }
          />
          <ProfileMenu
            triggerElement={
              <IconButton
                size="lg"
                icon={
                  <Icon
                    icon="UserAccount-OutLined"
                    size={20}
                    className="text-dark-600"
                  />
                }
              />
            }
          />
          <NotificationsMenu
            triggerElement={
              <IconButton
                size="lg"
                icon={
                  <Icon
                    icon="Bell-OutLined"
                    size={20}
                    className="text-dark-600"
                  />
                }
                badge={notifications?.result?.unread_notifications_count || 0}
              />
            }
          />
          <DownloadAppMenu
            triggerElement={
              <IconButton
                size="lg"
                icon={
                  <Icon
                    icon="DownloadApp-OutLined"
                    size={20}
                    className="[&>*]:fill-dark-50 [&>*]:stroke-dark-50"
                  />
                }
                variant={ICONBUTTON_VARIANTS.DARK}
              />
            }
          />
        </>
      ) : (
        <>
          <IconButton
            size="lg"
            onClick={() => {
              showWalletMenuModal();
            }}
            icon={
              <Icon
                icon="Wallet-OutLined"
                size={20}
                className="text-dark-600"
              />
            }
          />
          <IconButton
            size="lg"
            onClick={() => {
              showProfileModal();
            }}
            icon={
              <Icon
                icon="UserAccount-OutLined"
                size={20}
                className="text-dark-600"
              />
            }
          />
          <IconButton
            size="lg"
            onClick={() => {
              showNotificationsModal();
            }}
            icon={
              <Icon icon="Bell-OutLined" size={20} className="text-dark-600" />
            }
            badge={notifications?.result?.unread_notifications_count || 0}
          />
        </>
      );
    }
    return (
      <>
        <Link aria-label="sign-up" href={'/auth/signup'}>
          <Button>{menu.signup}</Button>
        </Link>

        <Link aria-label="sign-in" href={'/auth/login'}>
          <Button variant="secondary">{menu.login}</Button>
        </Link>

        {isTablet && (
          <IconButton
            size="lg"
            onClick={() => {
              showDownloadAppModal();
            }}
            icon={
              <Icon
                icon="DownloadApp-OutLined"
                size={20}
                className="[&>*]:fill-dark-50 [&>*]:stroke-dark-50"
              />
            }
            variant={ICONBUTTON_VARIANTS.DARK}
          />
        )}

        {isDesktop && (
          <DownloadAppMenu
            triggerElement={
              <IconButton
                size="lg"
                icon={
                  <Icon
                    icon="DownloadApp-OutLined"
                    size={20}
                    className="[&>*]:fill-dark-50 [&>*]:stroke-dark-50"
                  />
                }
                variant={ICONBUTTON_VARIANTS.DARK}
              />
            }
          />
        )}
      </>
    );
  };

  return (
    <div className="w-full bg-white">
      <div className="container">
        <div
          className="flex items-center h-[76px] lg:h-[84px]"
          style={{ boxShadow: '0px 3px 15px 0px rgba(55, 59, 79, 0.03)' }}
        >
          <div className="flex items-center lg:ml-28">
            {!isDesktop && (
              <span
                aria-label="Arzinja"
                className="ml-4 text-dark-400"
                onClick={() => {
                  showMainMenuDrawerModal();
                }}
              >
                <Icon icon="BurgerMenu-OutLined" size={32} />
              </span>
            )}
            {isMobile ? (
              <Logo type="text" size="sm" />
            ) : (
              <Logo type="full" size="md" />
            )}
          </div>
          {isDesktop && <NavMenu />}
          <div className="flex mr-auto gap-4">{renderButtons()}</div>
        </div>
      </div>
      {!isDesktop && (
        <React.Fragment>
          <WalletMenuModal />
          <ProfileModal />
          <NotificationsMenuModal />
          <DownloadAppModal />
          <MainMenuDrawerModal onClose={closeMainMenuDrawerModal} />
        </React.Fragment>
      )}
    </div>
  );
};

export default Header;
