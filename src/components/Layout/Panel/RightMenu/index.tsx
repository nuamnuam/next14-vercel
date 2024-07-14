import { Icon } from '@/components/Common';
import { ROUTES } from '@/constants/routes';
import { useProfileStore } from '@/store';

import MenuItem from './MenuItem';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getLang } from '@/utils';

export type MenuItemType = {
  title: string;
  name: string;
  generateIcon?: (isActive?: boolean) => React.ReactNode;
  href?: string | string[];
  children?: Array<{
    title: string;
    name: string;
    href: string | string[];
  }>;
};

const [global, myAccount, menu] = getLang(['global', 'myAccount', 'menu']);

export const menuItems = (status: boolean): MenuItemType[] => [
  {
    title: menu.dashboard,
    name: 'dashboard',
    generateIcon: (isActive = false) => (
      <Icon
        icon="Dashboard-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.panelDashboard,
  },
  {
    title: menu.markets,
    name: 'instant-market',
    generateIcon: (isActive = false) => (
      <Icon
        icon="VolumeChart-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: [ROUTES.panelInstantMarket, ROUTES.panelAdvanceMarket],
  },
  {
    title: menu.trade,
    name: 'trade',
    generateIcon: (isActive = false) => (
      <Icon
        icon="Trade-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: menu.instantTrade,
        name: 'instant-trade-buy',
        href: [ROUTES.panelInstantTradeBuy, ROUTES.panelInstantTradeSell],
      },
      {
        title: menu.convert,
        name: 'instant-trade-convert',
        href: ROUTES.panelInstantTradeConvert,
      },
      {
        title: menu.advancedTrade,
        name: 'advanced-trade',
        href: ROUTES.panelAdvancedTrade,
      },
      {
        title: menu.tradeHistory,
        name: 'orders-history',
        href: ROUTES.panelOpenOrders,
      },
    ],
  },
  {
    title: menu.wallet,
    name: 'wallet',
    generateIcon: (isActive = false) => (
      <Icon
        icon="Wallet-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: menu.balances,
        name: 'my-wallet',
        href: ROUTES.panelWalletMyWallet,
      },
      {
        title: menu.withdraw,
        name: 'toman-withdraw',
        href: [
          ROUTES.panelWalletTomanWithdraw,
          ROUTES.panelWalletCryptoWithdraw,
        ],
      },
      {
        title: menu.deposit,
        name: 'toman-deposit',
        href: [
          ROUTES.panelWalletTomanDeposit,
          ROUTES.panelWalletCryptoDeposit,
          ROUTES.panelWalletIdDeposit,
        ],
      },
      {
        title: menu.transactionsHistory,
        name: 'transactions-list',
        href: ROUTES.panelWalletTransactionsList,
      },
    ],
  },
  {
    title: menu.account,
    name: 'my_account',
    generateIcon: (isActive = false) => (
      <Icon
        icon="Account-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: myAccount.authentication,
        name: 'validation',
        href: ROUTES.panelMyAccountValidation,
      },
      {
        title: global.commission,
        name: 'commission',
        href: ROUTES.panelCommission,
      },
      {
        title: global.userInfo,
        name: 'profile',
        href: ROUTES.panelMyAccountProfile,
      },
      ...(status
        ? [
            {
              title: menu.bankAccount,
              name: 'bank-accounts',
              href: ROUTES.panelUserBankAccounts,
            },
          ]
        : []),
      {
        title: menu.inviteFriends,
        name: 'referrals',
        href: ROUTES.panelMyAccountRefferals,
      },
      {
        title: global.security,
        name: 'security',
        href: ROUTES.panelMyAccountSecurity,
      },
      {
        title: global.settings,
        name: 'settings',
        href: ROUTES.panelMyAccountSettings,
      },
    ],
  },
  {
    title: global.support,
    name: 'support',
    generateIcon: (isActive = false) => (
      <Icon
        icon="Support-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: menu.tickets,
        name: 'tickets',
        href: ROUTES.panelSupportTickets,
      },
      {
        title: menu.sendTicket,
        name: 'new-ticket',
        href: ROUTES.panelSupportNewTicket,
      },
    ],
    href: ROUTES.panelSupport,
  },
];

const RightMenu = () => {
  const { pathname } = useRouter();
  const { profile } = useProfileStore();
  const [activeItem, setActiveItem] = useState<MenuItemType>();

  const onClickItem = (item: MenuItemType) => {
    setActiveItem(item);
  };

  const hasBankAccess = !!profile.kyc_info?.details?.['financial-info'];

  const checkPathname = (href?: string | string[]) => {
    if (!href) return false;
    if (Array.isArray(href)) {
      return href.some((i) => pathname.startsWith(i));
    }
    return pathname.startsWith(href);
  };

  const isActive = (item: MenuItemType) => {
    const isAccordion = !!item.children;

    if (activeItem) {
      // has value when a menuItem was selected
      return (
        (isAccordion
          ? item.name === activeItem?.name ||
            item.children?.some((item) => item.name === activeItem?.name)
          : item.name === activeItem?.name) ?? false
      );
    } else {
      return (
        (isAccordion
          ? item.children?.some((item) => checkPathname(item.href))
          : checkPathname(item.href)) ?? false
      );
    }
  };

  return (
    <div className="sticky top-[16px]">
      <div
        className="overflow-hidden rounded-lg bg-white"
        style={{ width: '264px' }}
      >
        {menuItems(hasBankAccess).map((item) => {
          return (
            <div key={item.name}>
              <MenuItem
                key={item.name}
                data={item}
                isActive={isActive(item)}
                onClick={onClickItem}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightMenu;
