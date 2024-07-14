import React from 'react';

import { SelectInput } from '@/components/Common';
import useOrderHistoryStore from '@/store/useOrderHistoryStore';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

interface Props {
  noLabel?: boolean;
}

const [wallet] = getLang(['wallet']);

const TransactionType: React.FC<Props> = ({ noLabel = false }) => {
  const [wallet] = useLang(['wallet']);
  const { side, set_side, resetHistories } = useOrderHistoryStore();

  return (
    <SelectInput
      name="order-history-side"
      fullWidth
      label={!noLabel ? wallet.side : ''}
      options={options}
      value={side || 'ALL'}
      onChange={(value) => {
        resetHistories();
        if (value === 'ALL') {
          return set_side(undefined);
        }
        return set_side(value as 'BUY' | 'SELL');
      }}
    />
  );
};

export default TransactionType;

const options = [
  {
    label: wallet.all,
    value: 'ALL',
  },
  {
    label: wallet.buy,
    value: 'BUY',
  },
  {
    label: wallet.sell,
    value: 'SELL',
  },
];
