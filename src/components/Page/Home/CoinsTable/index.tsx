import React, { FC, useState } from 'react';
import Link from 'next/link';

import { Card, Icon, SwimTab } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import type { IPairResult } from '@/hooks/useMarketData';

import {
  AdvanceMarketTable,
  ResponiveTableContent,
} from '../../Market/CoinsTable/Market';
import { InstantMarketTable } from './components';
import { getLang } from '@/utils';

import type { HomeProps } from '../types';

type Props = {
  updatePairs: (inputs: string[]) => void;
  update: IPairResult[];
} & Pick<HomeProps, 'currencies'>;

const [home] = getLang(['home']);

const CoinsTable: FC<Props> = ({ updatePairs, update, currencies }) => {
  const [home] = useLang(['home']);

  const [activeTab, setActiveTab] = useState('');

  const { isDesktop } = useBreakpoint();

  return (
    <Card classNames="shadow-none rounded-none">
      <div className="border-b border-dark-50 lg:border-none">
        <SwimTab
          items={tableTypes}
          className="w-full sm:w-[356px]"
          itemClassName="pt-7"
          initial="trade"
          callback={setActiveTab}
        />
      </div>

      {activeTab === 'trade' ? (
        <InstantMarketTable
          updatePairs={updatePairs}
          update={update}
          currencies={undefined}
        />
      ) : isDesktop ? (
        <AdvanceMarketTable />
      ) : (
        <ResponiveTableContent />
      )}

      <div className="flex items-center justify-center">
        <Link
          href={activeTab === 'trade' ? '/instant-market' : '/advance-market'}
          className="p-4 block text-sm text-dark-400"
        >
          {home.enterToMarket}
          <Icon
            icon="ArrowLeft-TwoTone"
            size={16}
            className="[&>*]:fill-dark-200"
          />
        </Link>
      </div>
    </Card>
  );
};

export default CoinsTable;

const tableTypes = [
  {
    id: 'trade',
    label: home.tradeAndConvert,
  },
  {
    id: 'markets',
    label: home.tradeMarkets,
  },
];
