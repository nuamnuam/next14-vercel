import React, { useEffect, useState } from 'react';
import { useTransactionHistoryStore } from '@/store';
import { BalanceCoinModel } from '@/types/wallet';
import CoinsInputDropdown from '@/components/Common/Coins/CoinsInputDropdown';
import { useLang } from '@/hooks';

const Coin = () => {
  const [wallet] = useLang(['wallet']);

  const [selectedCoin, setSelectedCoin] = useState<BalanceCoinModel>();
  const { set_currency_id, currency_id } = useTransactionHistoryStore();

  useEffect(() => {
    if (!currency_id) {
      setSelectedCoin(undefined);
    }
  }, [currency_id]);

  useEffect(() => {
    if (!selectedCoin) return set_currency_id(undefined);
    set_currency_id(Number(selectedCoin?.currency_id));
  }, [selectedCoin]);

  return (
    <div className="">
      <span className="mb-2 block text-sm font-medium text-dark-400">
        {wallet.selectAsset}
      </span>
      <CoinsInputDropdown
        selectedCoin={selectedCoin}
        onSelect={setSelectedCoin}
        ignoredCoins={['IRT']}
        onAllClick={() => setSelectedCoin(undefined)}
      />
    </div>
  );
};

export default Coin;
