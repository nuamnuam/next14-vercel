import React, { FC } from 'react';

import CoinsInputDropdown from '@/components/Common/Coins/CoinsInputDropdown';
import { BalanceCoinModel } from '@/types/wallet';
import useOrderHistoryStore from '@/store/useOrderHistoryStore';
import { useLang } from '@/hooks';

type Props = {
  onSelect?: (coin: BalanceCoinModel) => void;
  coin?: BalanceCoinModel;
  onAllClick?: () => void;
};

const CoinContent: FC<Props> = ({ onSelect, coin, onAllClick }) => {
  return (
    <CoinsInputDropdown
      onSelect={onSelect}
      selectedCoin={coin}
      onAllClick={onAllClick}
    />
  );
};

const Coin = () => {
  const [wallet] = useLang(['wallet']);

  const { pair, set_pair, resetHistories } = useOrderHistoryStore();
  return (
    <div className="">
      <span className="mb-2 block text-sm font-medium text-dark-400">
        {wallet.coins}
      </span>
      <CoinContent
        onSelect={(coin) => {
          resetHistories();
          set_pair(coin);
        }}
        coin={pair}
        onAllClick={() => set_pair(undefined)}
      />
    </div>
  );
};

export default Coin;
