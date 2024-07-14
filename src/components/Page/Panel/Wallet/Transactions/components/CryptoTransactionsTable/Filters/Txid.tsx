import React, { useEffect, useState } from 'react';
import { FormGroup, FormInput, FormLabel } from '@/components/Common';
import { useTransactionHistoryStore } from '@/store';
import { useDebounceValue } from '@/hooks';

const Txid = () => {
  const { txid, set_txid } = useTransactionHistoryStore();
  const [searchVal, setSearchVal] = useState<string | undefined>(txid);
  const debouncedSearch = useDebounceValue(searchVal, 500);

  useEffect(() => {
    set_txid(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchVal(txid);
  }, [txid]);

  return (
    <FormGroup>
      <FormLabel
        htmlFor="txid"
        className="mb-2 block text-sm font-medium text-dark-400"
      >
        TxID
      </FormLabel>
      <FormInput
        name="txid"
        placeholder="TxID"
        value={searchVal}
        onChange={setSearchVal}
        size="sm"
      />
    </FormGroup>
  );
};

export default Txid;
