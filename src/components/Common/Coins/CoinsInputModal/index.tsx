import React, { useCallback } from 'react';
import Image from 'next/image';

import { CoinsModal, ModalInput } from '@/components/Common';
import { coinsModalName } from '@/components/Common/Coins/CoinsModal';
import { type BalanceCoinModel } from '@/types/wallet';
import { useCoinIcon, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';

interface Props {
  className?: string;
  showBalance?: boolean;
  showFavorites?: boolean;
  caption?: React.ReactElement;
  selectedCoin?: BalanceCoinModel;
  ignoredCoins?: string[];
  onChange?: (coin: BalanceCoinModel) => void;
  setItemClassNames?: (coin: BalanceCoinModel) => string;
  withNetworks?: boolean;
  type?: 'deposit' | 'withdraw';
  onAllClick?: () => void;
  showAllItem?: boolean;
}

const CoinsInputModal: React.FC<Props> = ({
  className,
  showBalance = false,
  showFavorites = false,
  caption,
  selectedCoin,
  ignoredCoins = [],
  showAllItem = true,
  onChange = () => {},
  setItemClassNames,
  withNetworks,
  type,
  onAllClick,
}) => {
  const [wallet] = useLang(['wallet']);

  const getCoinIcon = useCoinIcon();
  const { showSyncModal, closeSyncModal } = useModal(coinsModalName);

  const onSelect = useCallback(
    (coin: BalanceCoinModel) => {
      onChange(coin);
      closeSyncModal();
    },
    [closeSyncModal, onChange],
  );

  return (
    <div className={className}>
      <ModalInput
        onClick={() => {
          showSyncModal();
        }}
        label={wallet.currencyType}
        placeholder={wallet.selectCurrencyType}
        value={
          selectedCoin && (
            <>
              <Image
                src={getCoinIcon(selectedCoin)}
                width={24}
                height={24}
                alt={selectedCoin?.symbol || ''}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
              <span className="mx-2 font-medium leading-6 text-dark-700">
                {selectedCoin?.title}
              </span>
              <span className="text-xs leading-4 text-dark-500">
                {selectedCoin?.symbol}
              </span>
            </>
          )
        }
      />
      {caption != null && caption}
      <CoinsModal
        showBalance={showBalance}
        showFavorites={showFavorites}
        ignoredCoins={ignoredCoins}
        onSelect={onSelect}
        setItemClassNames={setItemClassNames}
        withNetworks={withNetworks}
        type={type}
        onAllClick={
          showAllItem
            ? () => {
                if (onAllClick) {
                  onAllClick();
                  closeSyncModal();
                }
              }
            : undefined
        }
      />
    </div>
  );
};

export default CoinsInputModal;
