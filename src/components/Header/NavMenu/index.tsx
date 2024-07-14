import * as React from 'react';
import Link from 'next/link';
import clsx from 'classnames';

import { Icon } from '@/components/Common';
import TradeMenu from '@/components/Header/TradeMenu/TradeMenu';
import MarketsMenu from '@/components/Common/MarketsMenu';
import { authStore } from '@/store';
import { useLang } from '@/hooks';

interface IProps {
  className?: string;
}

const NavMenu: React.FC<IProps> = ({ className }: IProps) => {
  const [global] = useLang(['global']);

  const { token } = authStore();
  const isLogin = !!token;

  return (
    <div className={clsx('flex items-center', className)}>
      {isLogin ? (
        <Link
          href="/panel/instant-market"
          className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300"
        >
          <Icon
            icon="VolumeChart-TwoTone"
            size={18}
            className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
          />
          <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
            {global.markets}
          </span>
        </Link>
      ) : (
        <MarketsMenu
          triggerElement={
            <div className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300">
              <Icon
                icon="Coins-TwoTone"
                size={18}
                className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
              />
              <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
                {global.coins}
              </span>
              <Icon
                icon="Down-OutLined"
                size={11}
                className="text-dark-200 group-hover:text-dark-100"
              />
            </div>
          }
        />
      )}
      {isLogin ? (
        <TradeMenu
          triggerElement={
            <div className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300">
              <Icon
                icon="Trade-TwoTone"
                size={18}
                className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
              />
              <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
                {global.trade}
              </span>
              <Icon
                icon="Down-OutLined"
                size={11}
                className="text-dark-200 group-hover:text-dark-100"
              />
            </div>
          }
        />
      ) : (
        <Link
          href="/advance-trade/USDTIRT"
          className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300"
        >
          <Icon
            icon="Trade-TwoTone"
            size={18}
            className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
          />
          <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
            {global.trade}
          </span>
        </Link>
      )}
      <Link
        href="/help"
        className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300"
      >
        <Icon
          icon="Help-TwoTone"
          size={18}
          className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
        />
        <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
          {global.guide}
        </span>
      </Link>
      {!isLogin && (
        <Link
          href="/referral"
          className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300"
        >
          <Icon
            icon="Money-TwoTone"
            size={18}
            className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
          />
          <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
            {global.earnMoney}
          </span>
        </Link>
      )}
      <Link
        href="https://arzinja.info/blog"
        className="group ml-2 flex cursor-pointer items-center rounded-lg px-3 py-2 transition duration-300 hover:bg-dark-300"
      >
        <Icon
          icon="Blog-TwoTone"
          size={18}
          className="[&>*]:fill-dark-200 [&>*]:group-hover:fill-dark-50"
        />
        <span className="mr-2 ml-3 block text-sm font-medium text-dark-600 group-hover:text-white ">
          {global.blog}
        </span>
      </Link>
    </div>
  );
};

export default NavMenu;
