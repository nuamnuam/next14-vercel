import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Icon } from '@/components/Common';
import { useCoinIcon, useLang } from '@/hooks';

const MarketsMenuContent = () => {
  const [menu, global] = useLang(['menu', 'global']);

  const getCoinIcon = useCoinIcon();

  const items = useMemo(() => {
    return [
      {
        symbol: 'BTC',
        title: global.btc,
        slug: 'bitcoin',
      },
      {
        symbol: 'ETH',
        title: global.eth,
        slug: 'ethereum',
      },
      {
        symbol: 'USDT',
        title: global.tether,
        slug: 'tetherus',
      },
      {
        symbol: 'ADA',
        title: global.ada,
        slug: 'cardano',
      },
      {
        symbol: 'DASH',
        title: global.dash,
        slug: 'dash',
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div className="py-3 px-4">
        {items.map((item) => {
          return (
            <Link
              href={`/${item.slug}`}
              className="flex cursor-pointer items-center rounded-lg py-2.5 px-3 hover:bg-dark-50 gap-2"
            >
              <Image
                src={getCoinIcon(item.symbol)}
                width={24}
                height={24}
                alt={item?.symbol || ''}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
              <span className="text-sm font-medium text-dark-700">
                {item.title}
              </span>
              <span className="text-2xs text-dark-500">{item.symbol}</span>
            </Link>
          );
        })}
      </div>
      <div className="border-t border-dark-50 py-3 px-4">
        <Link
          href="/instant-market"
          className="flex cursor-pointer items-center rounded-lg py-2.5 px-3 hover:bg-dark-50"
        >
          <Icon
            icon="Price-TwoTone"
            className="[&>*]:fill-dark-200"
            size={20}
          />
          <span className="mr-2 text-sm font-medium text-dark-700">
            {menu.coinsPrice}
          </span>
        </Link>
      </div>
    </React.Fragment>
  );
};

export default MarketsMenuContent;
