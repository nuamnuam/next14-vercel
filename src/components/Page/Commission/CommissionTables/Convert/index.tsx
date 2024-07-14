import React from 'react';

import { Table } from '@/components';
import { getLang, toPersianDigits } from '@/utils';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useLang } from '@/hooks';

export type HeaderItem = {
  title: any;
  name: any;
  classNames?: any;
  width: string;
  columnClassNames?: string;
};

export type RowItem = {
  level: string | React.ReactNode;
  levelVolume: string | React.ReactNode;
  volume: string;
  maker: string;
  taker: string;
};

const [commisson] = getLang(['global', 'commisson']);

const Convert = () => {
  const [global, commisson] = useLang(['global', 'commisson']);

  return (
    <div>
      <div className="py-8 px-4 md:px-8">
        <h1 className="mt-0 mb-4 font-medium text-dark-800">
          {commisson.convertCommission}
        </h1>
        <p className="m-0 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
      </div>
      <Table data={Array(5).fill(sampleItem)} headerItems={headerItems} />
    </div>
  );
};

export default Convert;

const headerItems: TableHeaderItem[] = [
  {
    title: commisson.level,
    name: 'level',
    width: 'hidden lg:block w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-right text-xs text-dark-600 px-8',
  },
  {
    title: commisson.level,
    name: 'levelVolume',
    width: 'flex lg:hidden w-8/12',
    classNames: ' text-center',
    columnClassNames: 'text-right text-xs text-dark-600',
  },
  {
    title: commisson.tradeVolume,
    name: 'volume',
    width: 'hidden lg:block w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-center text-xs text-dark-600',
  },
  {
    title: commisson.maker,
    name: 'maker',
    width: 'w-2/12 lg:w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-center text-xs text-dark-600',
  },
  {
    title: commisson.taker,
    name: 'taker',
    width: 'w-2/12 lg:w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-center text-xs text-dark-600',
  },
];

const sampleItem: Record<string, any> = {
  level: (
    <div className="flex items-center justify-center">
      <span>{commisson.level1}</span>
    </div>
  ),
  levelVolume: (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center">
        <span>{commisson.level1}</span>
      </div>
      <span>{commisson.zeroToTen}</span>
    </div>
  ),
  volume: commisson.zeroToTen,
  maker: `٪${toPersianDigits(0.35)}`,
  taker: `٪${toPersianDigits(0.35)}`,
};
