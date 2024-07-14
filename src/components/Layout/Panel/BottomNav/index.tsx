import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import { useRouter } from 'next/router';

import { Icon } from '@/components/Common';
import { useModal } from '@/hooks/useModal';

import { walletMenuModalName } from '@/components/Header/WalletMenu/WalletMenuModal';
import MarketsModal, { marketsModalName } from '../MarketsModal';
import TradeMenuModal, {
  tradeMenuModalName,
} from '@/components/Header/TradeMenu/TradeMenuModal';
import PanelNavMoreModal, {
  panelNavMoreMenuModalName,
} from '@/components/Header/PanelNavMoreMenu/PanelNavMoreMenuModal';
import { useLang } from '@/hooks';

const BottomNav = () => {
  const [y, setY] = useState(document?.scrollingElement?.scrollHeight || 0);
  const [scrollDirection, setScrollDirection] = useState<
    'UP' | 'DOWN' | 'SAME'
  >('SAME');
  const [scrollTimeout, setScrollTimeout] = useState<any>(null);

  const is_pwa = Boolean(localStorage.getItem('pwa'));

  const [global] = useLang(['global']);

  const { asPath, events } = useRouter();

  const { closeSyncModal: closeWalletModal } = useModal(walletMenuModalName);

  const { closeSyncModal: closeCoinsModal } = useModal(marketsModalName);

  const {
    showSyncModal: showTranasctionsModal,
    closeSyncModal: closeTransactionsModal,
  } = useModal(tradeMenuModalName);

  const {
    showSyncModal: showPanelNavMoreModal,
    closeSyncModal: closePanelNavMoreModal,
  } = useModal(panelNavMoreMenuModalName);

  useEffect(() => {
    const handleRouteChange = () => {
      closeWalletModal();
      closeCoinsModal();
      closeTransactionsModal();
      closePanelNavMoreModal();
    };

    events.on('routeChangeStart', handleRouteChange);

    return () => {
      events.off('routeChangeStart', handleRouteChange);
    };
  }, [events]);

  const handleNavigation = useCallback(() => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    setScrollTimeout(
      setTimeout(() => {
        setScrollDirection('SAME');
      }, 150),
    );
    if (y < 250) {
      setScrollDirection('SAME');
    } else {
      if (y > window.scrollY) {
        setScrollDirection('UP');
      } else if (y < window.scrollY) {
        setScrollDirection('DOWN');
      }
    }

    setY(window.scrollY);
  }, [y]);

  useEffect(() => {
    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleNavigation]);

  return (
    <>
      <div
        className={clsx(
          'bottom-nav fixed bottom-0 right-0 flex w-full justify-between rounded-t-2xl bg-white px-8 pt-2 pb-5 shadow-card',
          is_pwa && '!pb-8',
          scrollDirection === 'DOWN' ? '' : 'is-open',
        )}
      >
        <Link
          href="/panel/dashboard"
          className={clsx(
            'flex flex-col items-center text-dark-300',
            asPath.startsWith('/panel/dashboard') && 'text-primary-600',
          )}
        >
          <Icon
            icon={
              asPath.startsWith('/panel/dashboard')
                ? 'Dashboard-Filled'
                : 'Dashboard-OutLined'
            }
            size={20}
            className={
              asPath.startsWith('/panel/dashboard')
                ? '[&>*]:fill-primary-600'
                : '[&>*]:fill-dark-300'
            }
          />
          <span
            className={clsx(
              'mt-[6px] text-xs font-medium',
              asPath.startsWith('/panel/dashboard')
                ? 'text-primary-600'
                : 'text-dark-300',
            )}
          >
            {global.counter}
          </span>
        </Link>
        <Link
          href={'/panel/instant-market?modal=instant-market-content-modal'}
          className={clsx(
            'flex cursor-pointer flex-col items-center text-dark-300',
          )}
        >
          <Icon
            icon={
              asPath.startsWith('/panel/instant-market') ||
              asPath.startsWith('/panel/advance-market')
                ? 'VolumeChart-Filled'
                : 'VolumeChart-OutLined'
            }
            size={20}
            className={clsx(
              '[&>*]:fill-dark-300',
              (asPath.startsWith('/panel/instant-market') ||
                asPath.startsWith('/panel/advance-market')) &&
                '[&>*]:fill-primary-600',
            )}
          />
          <span
            className={clsx(
              'mt-[6px] text-xs font-medium text-dark-300',
              (asPath.startsWith('/panel/instant-market') ||
                asPath.startsWith('/panel/advance-market')) &&
                '!text-primary-600',
            )}
          >
            {global.markets}
          </span>
        </Link>
        <span
          className="flex cursor-pointer flex-col items-center text-dark-300"
          onClick={() => {
            showTranasctionsModal();
          }}
        >
          <Icon
            icon={'CheckList-OutLined'}
            size={20}
            className="[&>*]:fill-dark-300"
          />
          <span className="mt-[6px] text-xs font-medium text-dark-300">
            {global.financeTransaction}
          </span>
        </span>
        <Link
          href="/panel/wallet/my-wallet"
          className={clsx(
            'flex cursor-pointer flex-col items-center text-dark-300',
            asPath.startsWith('/panel/wallet') && 'text-primary-600',
          )}
        >
          <Icon
            icon={
              asPath.startsWith('/panel/wallet')
                ? 'Wallet-Filled'
                : 'Wallet-OutLined'
            }
            size={20}
            className={
              asPath.startsWith('/panel/wallet')
                ? '[&>*]:fill-primary-600'
                : '[&>*]:fill-dark-300'
            }
          />
          <span
            className={clsx(
              'mt-[6px] text-xs font-medium',
              asPath.startsWith('/panel/wallet')
                ? 'text-primary-600'
                : 'text-dark-300',
            )}
          >
            {global.bag}
          </span>
        </Link>

        <span
          className="flex cursor-pointer flex-col items-center text-dark-300"
          onClick={() => showPanelNavMoreModal()}
        >
          <Icon icon="More-OutLined" size={20} onClick={() => ''} />
          <span className={clsx('mt-[6px] text-xs font-medium')}>
            {global.more}
          </span>
        </span>
      </div>
      <MarketsModal />
      <TradeMenuModal />
      <PanelNavMoreModal />
    </>
  );
};

export default BottomNav;
