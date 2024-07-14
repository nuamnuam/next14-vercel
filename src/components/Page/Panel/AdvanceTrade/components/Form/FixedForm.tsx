import React, { useState } from 'react';
import clsx from 'classnames';

import { SelectInput } from '@/components';
import RadioGroup from '@/components/RadioGroup';
import { useSubmitBuyP2POrderStore, useSubmitSellP2POrderStore } from '@/store';
import { useBreakpoint, useLang } from '@/hooks';

import { Buy, Sell } from './components';

const FixedForm: React.FC = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const orderTargets = [
    { label: advancedTrade.fixedPrice, value: 'LIMIT' },
    { label: advancedTrade.marketPrice, value: 'MARKET' },
  ];

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');

  const buyStore = useSubmitBuyP2POrderStore();
  const sellStore = useSubmitSellP2POrderStore();

  const { isDesktop } = useBreakpoint();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {!isDesktop && (
        <div>
          <RadioGroup
            switchTheme
            options={[
              {
                key: 'buy',
                label: advancedTrade.buy,
                value: 'BUY',
              },
              { key: 'sell', label: advancedTrade.sell, value: 'SELL' },
            ]}
            defaultSelected={side}
            onChange={setSide}
          />
        </div>
      )}
      {!isDesktop && (
        <SelectInput
          name="transaction-type"
          fullWidth
          options={orderTargets}
          value={side === 'BUY' ? buyStore.type : sellStore.type}
          onChange={(value) => {
            const type = value as 'LIMIT' | 'MARKET';
            if (side === 'BUY') {
              return buyStore.set_type(type);
            }
            return sellStore.set_type(type);
          }}
        />
      )}
      <div className="flex gap-4 md:gap-8">
        <div
          className={clsx(
            'flex-1 flex-col gap-4 md:gap-6 hidden',
            (isDesktop || side === 'BUY') && '!flex',
          )}
        >
          <Buy />
        </div>
        <div
          className={clsx(
            'flex-1 flex-col gap-4 md:gap-6 hidden',
            (isDesktop || side === 'SELL') && '!flex',
          )}
        >
          <Sell />
        </div>
      </div>
    </div>
  );
};

export default FixedForm;
