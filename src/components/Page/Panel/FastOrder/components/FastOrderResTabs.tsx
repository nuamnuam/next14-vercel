import React, { useMemo } from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';

const FastOrderResTabs: React.FC = () => {
  const [instantTrade] = useLang(['instantTrade']);
  const { isDesktop } = useBreakpoint();
  const { asPath, query } = useRouter();
  const queryAsset = query.asset as string;

  const tabItems = useMemo(
    () => [
      {
        id: 'fastOrderBuy',
        label: instantTrade.buy,
        pathname: '/panel/instant-trade/buy',
        href: queryAsset
          ? `/panel/instant-trade/buy?asset=${queryAsset}`
          : '/panel/instant-trade/buy',
      },
      {
        id: 'fastOrderSell',
        label: instantTrade.sell,
        pathname: '/panel/instant-trade/sell',
        href: queryAsset
          ? `/panel/instant-trade/sell?asset=${queryAsset}`
          : '/panel/instant-trade/sell',
      },
      {
        id: 'fastOrderConvert',
        label: instantTrade.convert,
        pathname: '/panel/instant-trade/convert',
        href: queryAsset
          ? `/panel/instant-trade/convert?asset=${queryAsset}`
          : '/panel/instant-trade/convert',
      },
    ],
    [instantTrade, queryAsset],
  );

  if (isDesktop) return <></>;

  return (
    <div className="border-b border-dark-50 flex justify-between items-center">
      {tabItems.map((tab) => (
        <Link href={tab.href} key={tab.id} className="flex flex-col w-full">
          <span
            className={clsx(
              'cursor-pointer w-full text-center font-medium pb-4 pt-[18px] border-b-2',
              asPath.includes(tab.pathname)
                ? 'border-primary-400 text-primary-500'
                : 'border-transparent text-dark-500',
            )}
          >
            {tab.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default FastOrderResTabs;
