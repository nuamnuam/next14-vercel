import React from 'react';
import { SelectInput } from '@/components/Common';
import { useTransactionHistoryStore } from '@/store';
import { useLang } from '@/hooks';

const Status = () => {
  const [wallet] = useLang(['wallet']);

  const { status, set_status } = useTransactionHistoryStore();

  const handleChange = (val: string) => {
    if (val !== '-1' && val !== '0' && val !== '1') return;
    set_status(val);
  };

  const options = [
    {
      label: wallet.all,
      value: '-1',
    },
    {
      label: wallet.pending,
      value: '0',
    },
    {
      label: wallet.done,
      value: '1',
    },
  ];

  return (
    <SelectInput
      name="status"
      fullWidth
      label={wallet.status}
      options={options}
      value={status?.toString() ?? '-1'}
      onChange={handleChange}
    />
  );
};

export default Status;
