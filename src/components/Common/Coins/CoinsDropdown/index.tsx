import { useRef } from 'react';
import clsx from 'classnames';

import { useOutsideClick } from '@/hooks';
import type { ICurrencyModel } from '@/types/currency';
import { BalanceCoinModel } from '@/types/wallet';

import CoinsContent from '../CoinsContent';
import CurrencyListContent from '../CurrencyListContent';

type Props<T> = {
  onSelect: (coin: T) => void;
  onToggle: (status: boolean) => void;
  isOpen: boolean;
  ignoredCoins?: string[];
  setItemClassNames?: (coin: T) => string;
  withNetworks?: boolean;
  content?: 'currency' | 'balance';
  onAllClick?: () => void;
  otcTradeable?: boolean;
};

const CoinsDropdown: React.FC<Props<any>> = ({
  onSelect,
  onToggle,
  isOpen = false,
  ignoredCoins = [],
  setItemClassNames,
  withNetworks,
  content = 'balance',
  onAllClick,
  otcTradeable,
}) => {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropDownRef, () => {
    onToggle(false);
  });

  const handleSelect = (coin: BalanceCoinModel | ICurrencyModel) => {
    onSelect(coin);
    onToggle(false);
  };

  return (
    <>
      <div
        className="w-full relative transition-all duration-300"
        ref={dropDownRef}
      >
        <div
          className={clsx(
            'absolute z-[20] w-[367px] top-2 grid rounded-lg bg-white transition-all duration-200 ease-in shadow-card',
            isOpen
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-10',
          )}
        >
          <div className="overflow-hidden">
            <div className="pt-8 pb-10 bg-white rounded-lg">
              {content === 'balance' ? (
                <CoinsContent
                  onSelect={handleSelect}
                  ignoredCoins={ignoredCoins}
                  setItemClassNames={setItemClassNames}
                  withNetworks={withNetworks}
                  hasNetworkParam={!!ignoredCoins.length}
                  onAllClick={() => {
                    if (onAllClick) {
                      onAllClick();
                      onToggle(false);
                    }
                  }}
                />
              ) : (
                <CurrencyListContent
                  onSelect={handleSelect}
                  ignoredCoins={ignoredCoins}
                  setItemClassNames={setItemClassNames}
                  withNetworks={withNetworks}
                  otcTradeable={otcTradeable}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && <div className="fixed left-0 top-0 w-screen h-screen z-[1]" />}
    </>
  );
};

export default CoinsDropdown;
