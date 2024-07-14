import React, { useMemo } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { Icon } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';

interface Props {
  showHistory?: boolean;
}

const TradeMenuContent: React.FC<Props> = ({ showHistory = true }) => {
  const [menu] = useLang(['menu']);

  const { isDesktop } = useBreakpoint();

  const items = useMemo(() => {
    return [
      {
        icon: (
          <Icon
            icon="Transaction-TwoTone"
            size={24}
            className="[&>*]:fill-dark-200"
          />
        ),
        title: menu.instantTrade,
        subtitle: menu.instantTradeSubtitle,
        href: '/panel/instant-trade/buy',
      },
      {
        icon: (
          <Icon
            icon="Convert-TwoTone"
            size={24}
            className="[&>*]:fill-dark-200"
          />
        ),
        title: menu.convert,
        subtitle: menu.convertSubtitle,
        href: '/panel/instant-trade/convert',
      },
      {
        icon: (
          <Icon
            icon="Trade-TwoTone"
            size={24}
            className="[&>*]:fill-dark-200"
          />
        ),
        title: menu.advancedTrade,
        subtitle: menu.advancedTradeSubtitle,
        href: '/panel/advance-trade',
      },
    ];
  }, [isDesktop]);

  return (
    <React.Fragment>
      <div
        className={clsx('py-3 px-4', showHistory && 'border-b border-dark-50')}
      >
        {items.map((item) => (
          <Link
            href={item.href}
            className="flex cursor-pointer items-center rounded-lg py-2.5 px-3 hover:bg-dark-50"
          >
            {item.icon}
            <div className="mr-3 flex flex-col">
              <span className="mb-1 text-sm font-medium text-dark-700">
                {item.title}
              </span>
              <span className="text-xs text-dark-400">{item.subtitle}</span>
            </div>
          </Link>
        ))}
      </div>
      {showHistory && (
        <div className="px-4 py-2">
          <Link
            href={'/panel/open-orders'}
            className="flex items-center rounded-lg p-3 transition-all duration-300 hover:bg-dark-50 hover:transition-all"
          >
            <Icon
              icon="TradeHistory-TwoTone"
              size={24}
              className="[&>*]:fill-dark-200"
            />
            <span className="mr-3 block text-sm font-medium text-dark-700">
              {menu.tradeHistory}
            </span>
          </Link>
        </div>
      )}
    </React.Fragment>
  );
};

export default TradeMenuContent;
