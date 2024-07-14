import React from 'react';
import { SelectInput } from '@/components/Common';
import { useTransactionHistoryStore } from '@/store';
import { useLang } from '@/hooks';

interface Props {
  noLabel?: boolean;
}

const TransactionType: React.FC<Props> = ({ noLabel = false }) => {
  const [wallet] = useLang(['wallet']);

  const { operation, setOperation } = useTransactionHistoryStore();

  const handleChange = (val: string) => {
    if (val === 'withdraw' || val === 'deposit') setOperation(val);
  };

  const options = [
    {
      label: wallet.deposit,
      value: 'deposit',
    },
    {
      label: wallet.withdraw,
      value: 'withdraw',
    },
  ];

  return (
    <SelectInput
      name="transaction-type"
      fullWidth
      label={!noLabel ? wallet.transType : ''}
      options={options}
      value={operation}
      onChange={handleChange}
    />
  );
};

export default TransactionType;
