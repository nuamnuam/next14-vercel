import React, { useCallback, useState } from 'react';
import { Card, SwimTab } from '@/components/Common';
import Trade from './Trade';
import Buy from './Buy';
import Sell from './Sell';
import Convert from './Convert';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import { getLang } from '@/utils';

const [commisson] = getLang(['commisson']);

const CommissionTables = () => {
  const [activeType, setActiveType] = useState<string | number>();

  const renderContent = useCallback(() => {
    switch (activeType) {
      case 'trade':
        return <Trade />;
      case 'buy':
        return <Buy />;
      case 'sell':
        return <Sell />;
      case 'convert':
        return <Convert />;
      case 'deposit':
        return <Deposit />;
      case 'withdraw':
        return <Withdraw />;
      default:
        return null;
    }
  }, [activeType]);

  return (
    <Card>
      <div className="border-b border-dark-50">
        <SwimTab
          items={tableTypes}
          className="w-full !justify-start overflow-x-auto lg:w-fit [&>span]:w-[120px] [&>span]:whitespace-pre [&>span]:px-4 [&_.absolute]:hidden [&_.absolute]:lg:block [&_.text-primary-500]:border-b [&_.text-primary-500]:border-primary-500 [&_.text-primary-500]:lg:border-none"
          itemClassName="pt-4 pb-3 lg:pb-4"
          initial="trade"
          scrollCenter
          callback={setActiveType}
        />
      </div>
      {renderContent()}
    </Card>
  );
};

export default CommissionTables;

const tableTypes = [
  {
    id: 'trade',
    label: commisson.advancedTrade,
  },
  {
    id: 'buy',
    label: commisson.fastBuy,
  },
  {
    id: 'sell',
    label: commisson.fastSell,
  },
  {
    id: 'convert',
    label: commisson.convert,
  },
  {
    id: 'deposit',
    label: commisson.deposit,
  },
  {
    id: 'withdraw',
    label: commisson.withdraw,
  },
];
