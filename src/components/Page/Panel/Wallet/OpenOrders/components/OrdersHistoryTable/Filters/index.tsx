import React, { useRef } from 'react';

import { Button } from '@/components/Common';
import { useOrderHistoryStore } from '@/store';

import TransactionType from './TransactionType';
import Period from './Period';
import Coin from './Coin';
import Historytype from './HistoryType';
import { useLang } from '@/hooks';

const Filters = () => {
  const [global] = useLang(['global']);

  const customPeriodRef = useRef<{ resetCustomDates: () => void }>(null);

  const { resetFilters } = useOrderHistoryStore();

  const handleReset = () => {
    resetFilters();
    customPeriodRef.current?.resetCustomDates();
  };

  return (
    <div className="flex gap-4 items-start flex-wrap">
      <div className="flex-1 max-w-fit">
        <Historytype />
      </div>
      <div className="flex-1 max-w-fit">
        <TransactionType />
      </div>
      <div className="flex-1 max-w-fit">
        <Period ref={customPeriodRef} />
      </div>
      <div className="flex-1 max-w-fit">
        <Coin />
      </div>
      <div className="flex-1 max-w-fit">
        <Button
          fullWidth
          variant="dark"
          onClick={handleReset}
          className="mt-[1.8rem]"
        >
          {global.clear}
        </Button>
      </div>
    </div>
  );
};

export default Filters;
