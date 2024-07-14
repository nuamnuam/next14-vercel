import React, { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Icon from '@/components/Common/Icon';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { colors } from '@/designTokens';
import Link from 'next/link';
import { useModal } from '@/hooks/useModal';
import { useCoinIcon, useLang } from '@/hooks';
import clsx from 'classnames';
import useAuthStore from '@/store/authStore';
import { Logo } from '@/components/Common';

export const mainMenuDrawerModalName = 'drawer-modal';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const MainMenuDrawer = styled(Dialog)(({ theme, maxWidth, fullScreen }) => ({
  '& .MuiPaper-root': {
    width: '100%',
    overflow: 'hidden',
    background: '#fff',
    margin: 0,
    boxShadow: '0px 0px 30px rgba(7, 16, 58, 0.09);',
    borderRadius: 0,
  },

  '& .MuiBackdrop-root': {
    backgroundColor: '#00000033',
    backdropFilter: 'blur(2px)',
  },
}));

type CustomizedDialogsProps = {
  onClose: () => void;
};

type MenuItem = {
  id: number;
  title: string;
  icon: string;
  href?: string;
  extraClassnames?: string;
  children?: Array<{
    id: number;
    title: string;
    href: string;
    icon?: string;
    extraClassnames?: string;
  }>;
};

const CustomizedDialogs = ({ onClose }: CustomizedDialogsProps) => {
  const [menu] = useLang(['menu']);

  const { closeSyncModal, isSyncModalOpen } = useModal(mainMenuDrawerModalName);
  const getCoinIcon = useCoinIcon();
  const { token } = useAuthStore();
  const isLogin = !!token;

  const handleClose = () => {
    onClose();
  };

  const loginItems: MenuItem[] = useMemo(() => {
    return [
      {
        id: 0,
        title: menu.home,
        icon: 'Home-TwoTone',
        href: '/',
      },
      {
        id: 3,
        title: menu.markets,
        icon: 'VolumeChart-TwoTone',
        href: '/panel/instant-market',
      },
      {
        id: 1,
        title: menu.trade,
        icon: 'Trade-TwoTone',
        children: [
          {
            id: 1,
            title: menu.instantTrade,
            href: '/panel/instant-trade/buy',
          },
          {
            id: 2,
            title: menu.convert,
            href: `/panel/instant-trade/convert`,
          },
          {
            id: 3,
            title: menu.advancedTrade,
            href: `/panel/advance-trade`,
          },
          {
            id: 4,
            title: menu.tradeHistory,
            href: '/panel/open-orders',
          },
        ],
      },
      {
        id: 3,
        title: menu.guide,
        icon: 'Help-TwoTone',
        href: '/help',
      },
      {
        id: 5,
        title: menu.blog,
        icon: 'Blog-TwoTone',
        href: 'https://arzinja.info/blog',
      },
      {
        id: 6,
        title: menu.downloadApp,
        icon: 'Mobile-TwoTone',
        href: '/application',
      },
    ];
  }, []);

  const guestItems: MenuItem[] = useMemo(() => {
    return [
      {
        id: 0,
        title: menu.home,
        icon: 'Home-TwoTone',
        href: '/',
      },
      {
        id: 1,
        title: menu.coins,
        icon: 'Coins-TwoTone',
        children: [
          {
            id: 1,
            title: menu.btc,
            href: `/BTC`,
            icon: getCoinIcon('BTC'),
          },
          {
            id: 2,
            title: menu.eth,
            href: `/ETH`,
            icon: getCoinIcon('ETH'),
          },
          {
            id: 3,
            title: menu.usdt,
            href: `/USDT`,
            icon: getCoinIcon('USDT'),
          },
          {
            id: 4,
            title: menu.ada,
            href: `/ADA`,
            icon: getCoinIcon('ADA'),
          },
          {
            id: 5,
            title: menu.dash,
            href: `/DASH`,
            icon: getCoinIcon('DASH'),
          },
          {
            id: 5,
            title: menu.coinsPrice,
            href: `/instant-market`,
            extraClassnames: '!text-dark-500 !mr-[3.7rem] !pr-4',
          },
        ],
      },
      {
        id: 2,
        title: menu.trade,
        icon: 'Trade-TwoTone',
        href: '/panel/advance-trade',
      },
      {
        id: 3,
        title: menu.guide,
        icon: 'Help-TwoTone',
        href: '/help',
      },
      {
        id: 5,
        title: menu.blog,
        icon: 'Blog-TwoTone',
        href: 'https://arzinja.info/blog',
      },
      {
        id: 4,
        title: menu.earnMoney,
        icon: 'Money-TwoTone',
        href: '/referral',
      },
      {
        id: 4,
        title: menu.commision,
        icon: 'Commission-TwoTone',
        href: '/commission',
      },
      {
        id: 6,
        title: menu.downloadApp,
        icon: 'Mobile-TwoTone',
        href: '/application',
      },
    ];
  }, []);

  return (
    <div>
      <MainMenuDrawer
        open={isSyncModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen
      >
        <div className="flex h-full flex-col items-center overflow-hidden">
          <div className="flex w-full items-center justify-between border border-b-dark-100 px-[28px] py-[18px]">
            <div className="flex items-center" onClick={handleClose}>
              <Icon
                icon="Close-OutLined"
                size={18}
                className="ml-8 text-dark-200"
              />
              <Logo type="full" size="sm" linkable={false} />
            </div>
          </div>
          <div className="w-full flex-1 overflow-y-auto">
            <div className="w-full">
              <div className="flex flex-col">
                {(isLogin ? loginItems : guestItems).map((item) =>
                  item.children != null ? (
                    <Accordion>
                      <AccordionSummary>
                        <Icon
                          icon={item.icon}
                          size={20}
                          className="[&>*]:fill-dark-200"
                        />
                        <span className="mr-4 text-sm text-dark-500">
                          {item.title}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails>
                        {item.children.map((subItem) => (
                          <Link href={subItem.href}>
                            <span
                              className={clsx(
                                'panel-menuItem-title text-dark-700 cursor-pointer',
                                subItem?.icon && 'after:content-none',
                                subItem.extraClassnames &&
                                  subItem.extraClassnames,
                              )}
                              onClick={() => closeSyncModal()}
                            >
                              <div className="flex gap-2 items-center">
                                {subItem?.icon && (
                                  <img
                                    src={subItem.icon}
                                    width={24}
                                    alt="menu"
                                  />
                                )}
                                {subItem.title}
                              </div>
                            </span>
                          </Link>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Link href={item?.href ?? '#'}>
                      <span
                        className="flex items-center border-b border-dark-50 py-3 px-6 text-sm text-dark-500"
                        onClick={() => closeSyncModal()}
                      >
                        <Icon
                          icon={item.icon}
                          size={20}
                          className="[&>*]:fill-dark-200"
                        />
                        <span className="mr-4">{item.title}</span>
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </MainMenuDrawer>
    </div>
  );
};

export default CustomizedDialogs;

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  '&': {
    boxShadow: 'none !important',
  },
  '&:not(:last-child)': {
    borderBottom: `1px solid ${colors.dark[50]}`,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <Icon
        icon="Down-OutLined"
        size={12}
        className={
          props.className?.includes('active')
            ? 'text-dark-300'
            : 'text-dark-100 '
        }
      />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row',
  padding: '0 24px',
  minHeight: '48px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {},
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));
