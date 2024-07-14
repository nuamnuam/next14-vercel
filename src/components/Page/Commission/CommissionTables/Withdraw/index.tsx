import React, { useState } from 'react';

import { Chip, FormInput, Icon, Pagination, Table } from '@/components';
import BitcoinIcon from '@/components/Icons/BitcoinIcon';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

const [commisson] = getLang(['global', 'commisson']);

const Withdraw = () => {
  const [global, commisson] = useLang(['global', 'commisson']);

  const [search, setSearch] = useState('');
  return (
    <div>
      <div className="py-8 px-4 md:px-8">
        <h1 className="mt-0 mb-4 font-medium text-dark-800">
          {commisson.withdrawCommission}
        </h1>
        <p className="m-0 mb-8 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
        <h2 className="relative mt-0 mb-4 pr-5 font-medium text-primary-600 after:absolute after:top-2.5 after:right-1 after:h-1.5 after:w-1.5 after:rounded-lg after:bg-primary-600">
          {commisson.tomanwithdrawCommission}
        </h2>
        <p className="m-0 mb-8 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
        <h2 className="relative mt-0 mb-4 pr-5 font-medium text-primary-600 after:absolute after:top-2.5 after:right-1 after:h-1.5 after:w-1.5 after:rounded-lg after:bg-primary-600">
          {commisson.cryptoWithdrawCommission}
        </h2>
        <p className="m-0 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
      </div>
      <div className="border-t border-dark-50 p-3 lg:px-10">
        <FormInput
          size="sm"
          placeholder={commisson.search}
          className="w-60"
          hasClear
          value={search}
          onChange={setSearch}
          rightIcon={
            <Icon icon="Search-OutLined" size={16} className="text-dark-500" />
          }
        />
      </div>
      <Table data={Array(5).fill(sampleItem)} headerItems={headerItems} />
      <div className="flex flex-col items-center justify-center p-4 sm:flex-row">
        <Pagination count={10} onChange={() => {}} classNames="mb-4 sm:mb-0" />
      </div>
    </div>
  );
};

export default Withdraw;

const headerItems: TableHeaderItem[] = [
  {
    title: commisson.crypto,
    name: 'coin',
    width: 'hidden lg:block w-[28%] px-6',
    classNames: 'text-right',
    columnClassNames: 'px-6',
  },
  {
    title: commisson.networkType,
    name: 'network',
    width: 'hidden lg:block w-[18%]',
    classNames: 'text-center',
  },
  {
    title: commisson.networkType,
    name: 'coinNetwork',
    width: 'block lg:hidden w-[31%]',
    classNames: 'lg:text-center',
  },
  {
    title: commisson.withdrawCommission,
    name: 'fee',
    width: 'w-[27%] lg:w-[18%]',
    classNames: 'text-center',
  },
  {
    title: commisson.minWithdraw,
    name: 'minDeposit',
    width: 'w-[27%] lg:w-[18%]',
    classNames: 'text-center',
  },
  {
    title: (
      <div>
        <span className="block lg:hidden">{commisson.status}</span>
        <span className="hidden lg:block">{commisson.networkStatus}</span>
      </div>
    ),
    name: 'status',
    width: 'w-[15%] lg:w-[18%]',
    classNames: 'text-left lg:text-center',
  },
];

const sampleItem: Record<string, any> = {
  coin: (
    <div className="flex items-center">
      <BitcoinIcon />
      <span className="mx-2 text-dark-700">{commisson.bitcoin}</span>
      <span className="text-xs text-dark-500">{commisson.btc}</span>
    </div>
  ),
  network: (
    <div className="flex flex-col items-center gap-2 text-sm text-dark-600">
      <span>BITCOIN</span>
      <span>ERC20</span>
    </div>
  ),
  coinNetwork: (
    <div className="flex flex-col items-start gap-2 text-xs text-dark-600 lg:text-sm">
      <div className="flex items-center">
        <BitcoinIcon />
        <div className="mr-2 flex flex-col items-start">
          <span className="mb-2 text-xs font-medium text-dark-700 lg:text-base">
            {commisson.bitcoin}
          </span>
          <span className="text-xs text-dark-500">{commisson.btc}</span>
        </div>
      </div>
      <span>BITCOIN</span>
      <span>ERC20</span>
    </div>
  ),
  fee: (
    <div className="flex flex-col items-center gap-2 text-xs text-dark-600 lg:text-sm">
      <span>BTC ۰.۰۰۲</span>
      <span>BTC ۰.۰۰۳</span>
    </div>
  ),
  minDeposit: (
    <div className="flex flex-col items-center gap-2 text-xs text-dark-600 lg:text-sm">
      <span>BTC ۰.۰۰۲</span>
      <span>BTC ۰.۰۰۳</span>
    </div>
  ),
  status: (
    <div className="flex flex-col items-end gap-2 text-xs text-dark-600 lg:items-center lg:p-0 lg:pl-4 lg:text-sm">
      <Chip
        label={commisson.active}
        size="sm"
        classNames="hidden lg:block w-fit"
      />
      <Chip
        label={commisson.deactive}
        size="sm"
        classNames="hidden lg:block w-fit"
        variant="danger"
      />
      <div className="block lg:hidden">
        <Icon
          icon="CheckCircle-OutLined"
          size={20}
          className="text-primary-500"
        />
      </div>
      <div className="block lg:hidden">
        <Icon
          icon="CheckCircle-OutLined"
          size={20}
          className="text-primary-500"
        />
      </div>
    </div>
  ),
};
