import { ROUTES } from '@/constants/routes';
import { Icon } from '@/components/Common';
import { getLang } from '@/utils';

import { helpTypes } from '../../helpTypes';

export type MenuItemType = {
  title: string;
  name: string;
  generateIcon?: (isActive?: boolean) => React.ReactNode;
  href?: string;
  children?: Array<{
    title: string;
    name: string;
    href: string;
  }>;
};

const [menu] = getLang(['menu']);

export const menuItems: MenuItemType[] = [
  {
    title: menu.startWhere,
    name: helpTypes.START,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Start-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.START),
  },
  {
    title: menu.signupAndAuth,
    name: helpTypes.SIGNUP,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Verification-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.SIGNUP),
  },
  {
    title: menu.withdrawDeposit,
    name: helpTypes.WITHDRAW_DEPOSIT,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Transaction-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    children: [
      {
        title: menu.deposit,
        name: helpTypes.DEPOSIT,
        href: ROUTES.help(helpTypes.DEPOSIT),
      },
      {
        title: menu.withdraw,
        name: helpTypes.WITHDRAW,
        href: ROUTES.help(helpTypes.WITHDRAW),
      },
    ],
  },
  {
    title: menu.tomanWithdrawDeposit,
    name: helpTypes.TOMAN_WITHDRAW_DEPOSIT,
    generateIcon: (isActive = false) => (
      <Icon
        icon="IRTTransaction-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.TOMAN_WITHDRAW_DEPOSIT),
  },
  {
    title: menu.sellAndBuy,
    name: helpTypes.BUY_SELL,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Trade-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.BUY_SELL),
  },
  {
    title: menu.convert,
    name: helpTypes.CONVERT,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Convert-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.CONVERT),
  },
  {
    title: menu.accountAndSecurity,
    name: helpTypes.ACCOUNT_SECURITY,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Account-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.ACCOUNT_SECURITY),
  },
  {
    title: menu.wallet,
    name: helpTypes.WALLET,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Wallet-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.WALLET),
  },
  {
    title: menu.arzApp,
    name: helpTypes.APPLICATION,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Mobile-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.APPLICATION),
  },
  {
    title: menu.updates,
    name: helpTypes.UPDATES,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Update-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.UPDATES),
  },
  {
    title: menu.faq,
    name: helpTypes.FAQ,
    generateIcon: (isActive = false) => (
      <Icon
        icon="QuestionList-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.FAQ),
  },
  {
    title: menu.arzAnnouncements,
    name: helpTypes.ANNOUNCEMENTS,
    generateIcon: (isActive = false) => (
      <Icon
        icon="Announcement-TwoTone"
        size={20}
        className={
          isActive ? 'active-menuItem-icon' : 'de-active-menuItem-icon'
        }
      />
    ),
    href: ROUTES.help(helpTypes.ANNOUNCEMENTS),
  },
];
