import React from 'react';

import { Button, GuideButton } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import { useSubmitBuyP2POrderStore, useSubmitSellP2POrderStore } from '@/store';

import FixedForm from './FixedForm';

const Form = () => {
  const [advancedTrade] = useLang(['advancedTrade']);

  const buyStore = useSubmitBuyP2POrderStore();
  const sellStore = useSubmitSellP2POrderStore();

  const { isDesktop } = useBreakpoint();

  const toggleType = (type: 'LIMIT' | 'MARKET') => {
    buyStore.set_type(type);
    sellStore.set_type(type);
  };

  return (
    <div className="bg-white rounded-lg lg:pb-6">
      {isDesktop && (
        <div className="flex items-center justify-between py-4 px-6 border-b border-dark-50">
          <div className="flex gap-2">
            <Button
              variant={buyStore.type === 'LIMIT' ? 'secondary' : 'text'}
              onClick={() => toggleType('LIMIT')}
            >
              {advancedTrade.fixedPrice}
            </Button>
            <Button
              variant={buyStore.type === 'MARKET' ? 'secondary' : 'text'}
              onClick={() => toggleType('MARKET')}
            >
              {advancedTrade.marketPrice}
            </Button>
          </div>
          <GuideButton />
        </div>
      )}
      <div className="lg:pt-6 lg:px-4">
        <FixedForm />
      </div>
    </div>
  );
};

export default Form;
