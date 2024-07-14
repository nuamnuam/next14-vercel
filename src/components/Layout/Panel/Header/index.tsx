import React, { useEffect, useMemo } from 'react';
import IconButton, {
  ICONBUTTON_VARIANTS,
} from '@/components/Common/IconButton';
import NavMenu from '@/components/Header/NavMenu';
import ProfileMenu from '@/components/Header/ProfileMenu/ProfileMenu';
import WalletMenu from '@/components/Header/WalletMenu/WalletMenu';
import NotificationsMenu from '@/components/Header/NotificationsMenu/NotificationsMenu';
import DownloadAppMenu from '@/components/Header/DownloadAppMenu/DownloadAppMenu';
import { Icon, Logo } from '@/components/Common';
import NotificationsMenuModal, {
  notificationsModalName,
} from '@/components/Header/NotificationsMenu/NotificationsMenuModal';
import { useRouter } from 'next/router';
import { useBreakpoint, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import WalletMenuModal, {
  walletMenuModalName,
} from '@/components/Header/WalletMenu/WalletMenuModal';
import MaskButton from '@/components/Common/Mask/MaskButton';
import { useMessagesQuery } from '@/requests/panel/messages';

const Header: React.FC<{ shouldShowHeader: boolean }> = ({
  shouldShowHeader,
}) => {
  const [global] = useLang(['global']);
  const { push, asPath, events } = useRouter();
  const { isDesktop } = useBreakpoint();

  const { data: notifications } = useMessagesQuery();

  const {
    showSyncModal: showNotificationsModal,
    closeSyncModal: closeNotificationsModal,
  } = useModal(notificationsModalName);

  const { showSyncModal: showWalletModal, closeSyncModal: closeWalletModal } =
    useModal(walletMenuModalName);

  useEffect(() => {
    const handleRouteChange = () => {
      closeNotificationsModal();
    };
    events.on('routeChangeStart', handleRouteChange);
    return () => {
      events.off('routeChangeStart', handleRouteChange);
    };
  }, [events]);

  const isInDashboard = useMemo(() => {
    return asPath.startsWith('/panel/dashboard');
  }, [asPath]);

  const isInMyWallet = useMemo(() => {
    return asPath.startsWith('/panel/wallet/my-wallet');
  }, [asPath]);

  const generatedExtra = useMemo(() => {
    return '';
  }, []);

  if (!shouldShowHeader) return null;

  return (
    <div
      className="w-full bg-white border-b border-dark-100"
      // style={{ boxShadow: '0px 3px 15px 0px rgba(55, 59, 79, 0.03)' }}
    >
      <div className="container">
        <div className="flex h-[76px] lg:h-[84px] items-center justify-between">
          {!isDesktop && isInMyWallet ? (
            <span className="text-lg font-medium text-dark-600">
              {global.mywallet}
            </span>
          ) : (
            <></>
          )}
          <div className="lg:ml-28">
            {isDesktop ? (
              <Logo type="full" size="md" />
            ) : (
              isInDashboard && <Logo type="text" size="sm" />
            )}
          </div>
          {isDesktop && <NavMenu />}
          {isDesktop ? (
            <div className="flex mr-auto gap-3">
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
                    className="border-dark-200"
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
                    className="border-dark-200"
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
                    className="border-dark-200"
                    badge={
                      notifications?.result.unread_notifications_count || 0
                    }
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
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {generatedExtra && generatedExtra}
              {isInDashboard && (
                <IconButton
                  size="lg"
                  icon={
                    <Icon
                      icon="UserAccount-OutLined"
                      size={20}
                      className="text-dark-600"
                    />
                  }
                  onClick={async () => await push('/panel/my-account')}
                />
              )}
              {isInDashboard && (
                <IconButton
                  onClick={() => {
                    showNotificationsModal();
                  }}
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
              )}
              {isInMyWallet && (
                <>
                  <MaskButton size="lg" classNames="border-gray-200" />
                  <IconButton
                    size="lg"
                    icon={
                      <Icon
                        icon="More-OutLined"
                        size={20}
                        className="text-dark-600"
                      />
                    }
                    onClick={() => showWalletModal()}
                  />
                </>
              )}
              {!isInDashboard && !isInMyWallet ? (
                <IconButton
                  size="lg"
                  icon={
                    <Icon
                      icon="QuestionCircle-OutLined"
                      size={20}
                      className="text-dark-600"
                    />
                  }
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
      {!isDesktop && (
        <React.Fragment>
          <NotificationsMenuModal />
          <WalletMenuModal />
        </React.Fragment>
      )}
    </div>
  );
};

export default Header;
