import React from 'react';

import { Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useLang } from '@/hooks';

import CoinsContent from '../CoinsContent';
import CurrencyListContent from '../CurrencyListContent';

type Props<T> = {
  showBalance?: boolean;
  showFavorites?: boolean;
  ignoredCoins: string[];
  onSelect?: (coin: T) => void;
  setItemClassNames?: (coin: T) => string;
  withNetworks?: boolean;
  content?: 'currency' | 'balance';
  type?: 'deposit' | 'withdraw';
  onAllClick?: () => void;
  otcTradeable?: boolean;
};

export const coinsModalName = 'coins-list-modal';
const CoinsModal: React.FC<Props<any>> = ({
  showBalance = false,
  showFavorites = false,
  onSelect = () => {},
  ignoredCoins = [],
  setItemClassNames,
  withNetworks,
  content = 'balance',
  type,
  onAllClick,
  otcTradeable,
}) => {
  const [global] = useLang(['global']);

  const { closeSyncModal } = useModal(coinsModalName);
  return (
    <Modal
      sync
      name={coinsModalName}
      onClose={closeSyncModal}
      hasCloseAction={false}
      contentAddtionalClassNames=" !pt-8 !px-0"
    >
      <div className="flex flex-col">
        <h2 className="mt-4 mb-4 text-center font-medium text-dark-700 lg:mt-0">
          {global.selectCrypto}
        </h2>

        {content === 'balance' ? (
          <CoinsContent
            showBalance={showBalance}
            showFavorites={showFavorites}
            onSelect={onSelect}
            ignoredCoins={ignoredCoins}
            setItemClassNames={setItemClassNames}
            withNetworks={withNetworks}
            type={type}
            onAllClick={onAllClick}
            otcTradeable={otcTradeable}
          />
        ) : (
          <CurrencyListContent
            onSelect={onSelect}
            ignoredCoins={ignoredCoins}
            setItemClassNames={setItemClassNames}
            withNetworks={withNetworks}
            otcTradeable={otcTradeable}
          />
        )}
      </div>
    </Modal>
  );
};

export default CoinsModal;
