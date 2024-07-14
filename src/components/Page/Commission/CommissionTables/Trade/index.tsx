import React from 'react';

import { getLang, toPersianDigits } from '@/utils';
import { Table } from '@/components/TableLayout';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useLang } from '@/hooks';

const [commission] = getLang(['global', 'commisson']);

const Trade = () => {
  const [global, commission] = useLang(['global', 'commisson']);

  return (
    <div>
      <div className="py-8 px-4 md:px-8">
        <h1 className="mt-0 mb-4 font-medium text-dark-800">
          {commission.advancedTradeCommission}
        </h1>
        <p className="m-0 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
      </div>
      <Table data={Array(5).fill(sampleItem)} headerItems={headerItems} />
    </div>
  );
};

export default Trade;

const headerItems: TableHeaderItem[] = [
  {
    title: commission.level,
    name: 'level',
    width: 'hidden lg:block w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-right text-xs text-dark-600 px-8',
  },
  {
    title: commission.level,
    name: 'levelVolume',
    width: 'flex lg:hidden w-8/12',
    classNames: ' text-center',
    columnClassNames: 'text-right text-xs text-dark-600',
  },
  {
    title: commission.tradeVolume,
    name: 'volume',
    width: 'hidden lg:block w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-center text-xs text-dark-600',
  },
  {
    title: commission.maker,
    name: 'maker',
    width: 'w-2/12 lg:w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-center text-xs text-dark-600',
  },
  {
    title: commission.taker,
    name: 'taker',
    width: 'w-2/12 lg:w-3/12',
    classNames: 'text-center',
    columnClassNames: 'text-center text-xs text-dark-600',
  },
];

const sampleItem: Record<string, any> = {
  level: (
    <div className="flex items-center justify-center">
      <span>{commission.level1}</span>
    </div>
  ),
  levelVolume: (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center">
        <span>{commission.level1}</span>
      </div>
      <span>{commission.zeroToTen}</span>
    </div>
  ),
  volume: commission.zeroToTen,
  maker: `٪${toPersianDigits(0.35)}`,
  taker: `٪${toPersianDigits(0.35)}`,
};
