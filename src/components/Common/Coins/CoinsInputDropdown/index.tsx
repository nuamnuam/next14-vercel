import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import { useCoinIcon, useLang } from '@/hooks';
import { BalanceCoinModel } from '@/types/wallet';

import Icon from '../../Icon';
import CoinsDropdown from '../CoinsDropdown';

interface Props {
  onSelect?: (coin: BalanceCoinModel) => void;
  selectedCoin?: BalanceCoinModel;
  ignoredCoins?: string[];
  setItemClassNames?: (coin: BalanceCoinModel) => string;
  withNetworks?: boolean;
  onAllClick?: () => void;
  otcTradeable?: boolean;
}

export const CoinsInputDropdown: React.FC<Props> = ({
  onSelect = () => {},
  selectedCoin,
  ignoredCoins = [],
  setItemClassNames,
  withNetworks,
  onAllClick,
  otcTradeable,
}) => {
  const [global] = useLang(['global']);

  const [isOpen, setIsOpen] = useState(false);
  const getCoinIcon = useCoinIcon();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="w-fit min-w-[132px]" onClick={handleClick}>
        <div className="flex cursor-pointer items-center rounded-lg border border-dark-200 px-4 py-2 justify-between">
          <span className="text-sm text-dark-500">
            {selectedCoin ? (
              <div className="flex items-center gap-2 pl-4">
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
                <span className="font-medium text-dark-700">
                  {selectedCoin.title}
                </span>
                <span className="text-xs text-dark-500">
                  {selectedCoin.symbol}
                </span>
              </div>
            ) : (
              global.all
            )}
          </span>
          <div className="mr-4">
            <Icon
              icon="Down-OutLined"
              size={15}
              className={clsx(
                'text-dark-400 transition duration-300',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        </div>
      </div>
      <CoinsDropdown
        isOpen={isOpen}
        ignoredCoins={ignoredCoins}
        onToggle={setIsOpen}
        onSelect={onSelect}
        setItemClassNames={setItemClassNames}
        withNetworks={withNetworks}
        onAllClick={onAllClick}
        otcTradeable={otcTradeable}
      />
    </>
  );
};

export default CoinsInputDropdown;
