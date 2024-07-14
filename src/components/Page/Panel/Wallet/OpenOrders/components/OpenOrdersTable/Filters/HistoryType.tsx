import React, { useEffect } from 'react';

import { SelectInput } from '@/components/Common';
import useOrderHistoryStore from '@/store/useOrderHistoryStore';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';

interface Props {
  noLabel?: boolean;
}

const Historytype: React.FC<Props> = ({ noLabel = false }) => {
  const [wallet] = useLang(['wallet']);

  const { order_type, set_order_type, resetHistories } = useOrderHistoryStore();
  const router = useRouter();

  useEffect(() => {
    const { order_type } = router.query;

    if (!order_type) return;
    set_order_type(order_type as 'OTC' | 'CONVERT' | 'P2P');
  }, [router.query]);

  const options = [
    {
      label: wallet.all,
      value: 'ALL',
    },
    {
      label: wallet.convert,
      value: 'CONVERT',
    },
    {
      label: wallet.instantTrade,
      value: 'OTC',
    },
    {
      label: wallet.advancedTrade,
      value: 'P2P',
    },
  ];

  return (
    <SelectInput
      name="order-history-type"
      fullWidth
      label={!noLabel ? wallet.tradeType : ''}
      options={options}
      value={order_type || 'ALL'}
      onChange={(value) => {
        resetHistories();
        if (value === 'ALL') {
          return set_order_type(undefined);
        }
        return set_order_type(value as 'CONVERT' | 'OTC' | 'P2P');
      }}
    />
  );
};

export default Historytype;
