import React, { useRef } from 'react';
import TransactionType from './TransactionType';
import Period from './Period';
import Coin from './Coin';
import Status from './Status';
import Txid from './Txid';
import { Button } from '@/components/Common';
import { useTransactionHistoryStore } from '@/store';
import { useLang } from '@/hooks';

const Filters = () => {
  const [global] = useLang(['global']);

  const customPeriodRef = useRef<{ resetCustomDates: () => void }>(null);

  const { resetFilters } = useTransactionHistoryStore();

  return (
    <div className="flex gap-4 items-start flex-wrap">
      <div className="w-[132px]">
        <TransactionType />
      </div>
      <div className="min-w-[132px]">
        <Period ref={customPeriodRef} />
      </div>
      <div className="min-w-[132px]">
        <Coin />
      </div>
      <div className="w-[132px]">
        <Status />
      </div>
      <div className="w-[132px]">
        <Txid />
      </div>
      <div>
        <Button
          variant="dark"
          className="mt-[1.8rem]"
          onClick={() => {
            resetFilters();
            customPeriodRef.current?.resetCustomDates();
          }}
        >
          {global.clear}
        </Button>
      </div>
    </div>
  );
};

export default Filters;
