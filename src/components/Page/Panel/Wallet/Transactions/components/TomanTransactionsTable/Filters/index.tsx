import React, { useRef } from 'react';
import TransactionType from './TransactionType';
import Period from './Period';
import Status from './Status';
import { Button } from '@/components/Common';
import { useTransactionHistoryStore } from '@/store';
import { useLang } from '@/hooks';

const Filters = () => {
  const [global] = useLang(['global']);

  const customPeriodRef = useRef<{ resetCustomDates: () => void }>(null);

  const { resetFilters } = useTransactionHistoryStore();

  return (
    <div className="flex gap-4 items-start">
      <div className="w-[132px]">
        <TransactionType />
      </div>
      <div className="min-w-[132px]">
        <Period ref={customPeriodRef} />
      </div>
      <div className="w-[132px]">
        <Status />
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
