//@ts-nocheck

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'classnames';
import { Icon } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';

const PanelNavMoreContent = () => {
  const [menu] = useLang(['menu']);

  const { isDesktop } = useBreakpoint();

  const onVisibilityChanged = (data) => {
    switch (data.visibility) {
      case 'minimized':
        window.LiveChatWidget.call('hide');
        break;
    }
  };

  useEffect(() => {
    window.LiveChatWidget.on('visibility_changed', onVisibilityChanged);

    return () => {
      window.LiveChatWidget.off('visibility_changed', onVisibilityChanged);
    };
  }, []);

  const items = useMemo(() => {
    return [
      [
        {
          icon: (
            <Icon
              icon="TradeHistory-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
          ),
          title: menu.tradeHistory,
          href: '/panel/open-orders',
        },
      ],
      [
        globalThis.LIVE_CHAT_STATE && {
          icon: (
            <Icon
              icon="Chat-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.chatSupport,
          href: '#',
          onClick: () => {
            window.LiveChatWidget.call('maximize');
          },
        },
        {
          icon: (
            <Icon
              icon="List-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.supportTickets,
          href: '/panel/support/tickets',
        },
        {
          icon: (
            <Icon
              icon="WriteMessage-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.sendTicket,
          href: '/panel/support/new-ticket',
        },
        {
          icon: (
            <Icon
              icon="Help-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.help,
          href: '/help',
        },
      ].filter(Boolean),
      [
        {
          icon: (
            <Icon
              icon="Blog-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.blog,
          href: 'https://arzinja.info/blog',
        },
      ],
      [
        {
          icon: (
            <Icon
              icon="Mobile-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.downloadApp,
          href: '/application',
        },
      ],
    ];
  }, [isDesktop]);

  return (
    <React.Fragment>
      {items.map((cat, index) => (
        <div
          className={clsx(
            'py-2 ',
            index !== items.length - 1 && 'border-b border-dark-50 ',
          )}
        >
          {cat.map((item) => {
            if (item.onClick) {
              return (
                <span
                  onClick={item.onClick}
                  className="px-4 group flex h-full items-center rounded-lg py-3 px-3 hover:bg-dark-50"
                >
                  {item.icon}
                  <span className="mr-2 ml-auto block h-5 text-sm font-medium text-dark-700">
                    {item.title}
                  </span>
                </span>
              );
            }
            return (
              <Link
                href={item.href}
                className="px-4 group flex h-full items-center rounded-lg py-3 px-3 hover:bg-dark-50"
              >
                {item.icon}
                <span className="mr-2 ml-auto block h-5 text-sm font-medium text-dark-700">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </React.Fragment>
  );
};

export default PanelNavMoreContent;
