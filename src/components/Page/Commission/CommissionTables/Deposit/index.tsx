import React, { useState } from 'react';

import { Chip, FormInput, Icon, Pagination, Table } from '@/components';
import BitcoinIcon from '@/components/Icons/BitcoinIcon';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

const [commisson] = getLang(['global', 'commisson']);

const Deposit = () => {
  const [global, commisson] = useLang(['global', 'commisson']);

  const [searchValue, setSearchValue] = useState('');

  return (
    <div>
      <div className="py-8 px-4 md:px-8">
        <h1 className="mt-0 mb-4 font-medium text-dark-800">
          {commisson.depositFee}
        </h1>
        <p className="m-0 mb-8 text-sm leading-6 text-dark-600 font-bold md:font-normal">
          {global.loremIpsum}
        </p>
        <h2 className="relative mt-0 mb-4 pr-5 font-medium text-primary-600 after:absolute after:top-2.5 after:right-1 after:h-1.5 after:w-1.5 after:rounded-lg after:bg-primary-600">
          {commisson.tomanDepositCommission}
        </h2>
        <p className="m-0 mb-8 text-sm leading-6 text-dark-600 font-bold md:font-normal">
          {global.loremIpsum}
        </p>
        <h2 className="relative mt-0 mb-4 pr-5 font-medium text-primary-600 after:absolute after:top-2.5 after:right-1 after:h-1.5 after:w-1.5 after:rounded-lg after:bg-primary-600">
          {commisson.cryptoDepositCommission}
        </h2>
        <p className="m-0 text-sm leading-6 text-dark-600 font-bold md:font-normal">
          {global.loremIpsum}
        </p>
      </div>
      <div className="border-t border-dark-50 p-3 lg:px-10">
        <FormInput
          size="sm"
          placeholder={commisson.search}
          className="w-60"
          value={searchValue}
          onChange={setSearchValue}
          hasClear
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

export default Deposit;

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
    width: 'hidden lg:block w-[24%]',
    classNames: ' text-center',
  },
  {
    title: commisson.networkType,
    name: 'coinNetwork',
    width: 'block lg:hidden w-1/2',
    classNames: 'lg:text-center',
  },
  {
    title: commisson.minDeposit,
    name: 'minDeposit',
    width: 'w-1/4 lg:w-[24%]',
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
    width: 'w-1/4 lg:w-[24%]',
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
      <span>ERC20</span>
    </div>
  ),
  coinNetwork: (
    <div className="flex flex-col items-start gap-2 text-sm text-dark-600">
      <div className="flex items-center">
        <BitcoinIcon />
        <div className="mr-2 flex flex-col items-start">
          <span className="mb-2 font-medium text-dark-700">
            {commisson.bitcoin}
          </span>
          <span className="text-xs text-dark-500">BTC</span>
        </div>
      </div>
      <span>BITCOIN</span>
      <span>ERC20</span>
      <span>ERC20</span>
    </div>
  ),
  minDeposit: (
    <div className="flex flex-col items-center gap-2 text-sm text-dark-600">
      <span>BTC ۰.۰۰۲</span>
      <span>BTC ۰.۰۰۳</span>
      <span>BTC ۰.۰۰۵</span>
    </div>
  ),
  status: (
    <div className="flex flex-col items-end gap-2 pl-4 text-sm text-dark-600 lg:items-center lg:p-0">
      <Chip
        label={commisson.active}
        size="sm"
        classNames="hidden lg:block w-fit"
      />
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
          icon="CloseCircle-OutLined"
          size={20}
          className="text-danger-500"
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
