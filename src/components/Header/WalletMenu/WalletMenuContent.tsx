import React, { useMemo } from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { Icon } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';

const WalletMenuContent = () => {
  const [menu] = useLang(['menu']);

  const { isDesktop } = useBreakpoint();

  const items = useMemo(() => {
    return [
      [
        {
          icon: (
            <Icon
              icon="Wallet-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200"
            />
          ),
          title: menu.balances,
          href: '/panel/wallet/my-wallet',
        },
      ],
      [
        {
          icon: (
            <Icon
              icon="FiatWithdraw-TwoTone"
              size={20}
              // className="fill-dark-200"
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.withdrawToman,
          href: '/panel/wallet/toman-withdraw',
        },
        {
          icon: (
            <Icon
              icon="CryptoWithdraw-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.withdrawCoin,
          href: '/panel/wallet/crypto-withdraw',
        },
      ],
      [
        {
          icon: (
            <Icon
              icon="FiatDeposit-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.depositToman,
          href: '/panel/wallet/toman-deposit',
        },
        {
          icon: (
            <Icon
              icon="CryptoDeposit-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.depositCoin,
          href: '/panel/wallet/crypto-deposit',
        },
      ],
      [
        {
          icon: (
            <Icon
              icon="TransactionHistory-TwoTone"
              size={20}
              className="[&>*]:fill-dark-200 [&>*]:stroke-dark-200"
            />
          ),
          title: menu.transactionsHistory,
          href: '/panel/wallet/transactions-list',
        },
      ],
    ];
  }, [isDesktop]);

  return (
    <React.Fragment>
      {items.map((cat, index) => (
        <div
          className={clsx(
            'py-2',
            index !== items.length - 1 && 'border-b border-dark-50',
          )}
        >
          {cat.map((item) => (
            <Link
              href={item.href}
              className="group flex h-full items-center rounded-lg py-3 px-3 hover:bg-dark-50"
            >
              {item.icon}
              <span className="mr-2 ml-auto block h-5 text-sm font-medium text-dark-700">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </React.Fragment>
  );
};

export default WalletMenuContent;
