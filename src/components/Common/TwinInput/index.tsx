import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import { useBreakpoint, useCoinIcon, useLang, useOutsideClick } from '@/hooks';
import { BalanceCoinModel } from '@/types/wallet';
import { useModal } from '@/hooks/useModal';
import CoinsDropdown from '../Coins/CoinsDropdown';
import { convertScientific, maxDecimal } from '@/utils';
import { ICurrencyModel } from '@/types/currency';

import CoinsModal, { coinsModalName } from '../Coins/CoinsModal';
import FormInput from '../Form/FormInput';
import Icon from '../Icon';
import Spinner from '../Spinner';

type Props<T> = {
  hasList?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  value: number | undefined;
  setValue: (val: number) => void;
  selectedCoin?: T;
  setSelectedCoin?: (coin: T) => void;
  caption?: React.ReactNode;
  type?: 'modal' | 'dropdown';
  ignoredCoins?: string[];
  decimal?: number;
  setItemClassNames?: (coin: T) => string;
  showBalance?: boolean;
  showFavorites?: boolean;
  content?: 'currency' | 'balance';
  otcTradeable?: boolean;
  loading?: boolean;
};

const TwinInput: React.FC<Props<any>> = ({
  hasList = false,
  disabled,
  label,
  value,
  error = false,
  setValue,
  selectedCoin,
  caption,
  setSelectedCoin = () => {},
  type = 'modal',
  ignoredCoins = [],
  decimal = 0,
  setItemClassNames,
  showBalance = false,
  showFavorites = false,
  content = 'balance',
  otcTradeable,
  loading = false,
}) => {
  const [wallet] = useLang(['wallet']);

  const [isOpen, setIsOpen] = useState(false);

  const searchContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCoinIcon = useCoinIcon();
  const { isDesktop } = useBreakpoint();
  const { showSyncModal, closeSyncModal } = useModal(coinsModalName);

  useOutsideClick(searchContentRef, () => {
    setIsOpen(false);
  });

  const handleClick = () => {
    if (hasList) {
      if (type === 'dropdown') setIsOpen((prev) => !prev);
      if (type === 'modal') showSyncModal();
    }
    inputRef.current?.focus();
  };

  const renderedPlaceholder = useMemo(() => {
    if (!selectedCoin) return '';
    if (selectedCoin.symbol === 'IRT') return wallet.amountInToman;
    return `${selectedCoin?.symbol || ''} ${wallet.amountIn}`;
  }, [selectedCoin]);

  const handleSelect = (coin: BalanceCoinModel | ICurrencyModel) => {
    setSelectedCoin(coin);
    setIsOpen(false);
    if (type === 'modal') closeSyncModal();
  };

  const shownValue = () => {
    return typeof value !== 'undefined'
      ? decimal === 0
        ? Number(value ?? 0)?.toFixed(0)
        : maxDecimal(convertScientific(value), decimal)
      : undefined;
  };

  return (
    <div>
      {label && (
        <span className="mb-2 block text-sm font-medium text-dark-600">
          {label}
        </span>
      )}
      <div className="flex">
        <div
          className="w-full relative transition-all duration-300"
          ref={searchContentRef}
        >
          <FormInput
            ref={inputRef}
            placeholder={renderedPlaceholder}
            fullWidth
            ltr
            ltrPlaceholder
            onlyNumber
            seprator
            disabled={disabled}
            decimal={decimal}
            value={shownValue()}
            onChange={setValue}
            className={clsx(
              'rounded-lg pr-[50%]',
              error && '!border-danger-400',
              disabled &&
                '!border-dark-50 !bg-dark-50 opacity-50 [&>input]:!bg-dark-50',
            )}
          />
          <div
            className={clsx(
              'absolute select-none right-0 top-0 h-full w-1/2 border-l border-dark-100 pl-2 pr-3 flex items-center flex-1',
              hasList && 'cursor-pointer',
            )}
            onClick={handleClick}
          >
            <div className="flex h-full w-full items-center gap-2">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <Image
                    src={getCoinIcon(selectedCoin)}
                    width={24}
                    height={24}
                    alt={selectedCoin?.symbol || 'symbol'}
                    onError={(e) => {
                      //@ts-ignore
                      e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                    }}
                  />
                  <span className="hidden lg:block font-medium text-dark-700">
                    {(selectedCoin?.title as string)?.length > 6
                      ? `${selectedCoin?.title.slice(0, 6)} ...`
                      : selectedCoin?.title}
                  </span>
                  <span
                    className={clsx(
                      'text-xs text-dark-500',
                      !isDesktop && 'font-medium text-dark-700',
                    )}
                  >
                    {selectedCoin?.symbol}
                  </span>
                </>
              )}
            </div>
            {hasList && (
              <div className="flex-1 flex justify-between items-center">
                <Icon
                  icon="Down-OutLined"
                  size={16}
                  className={clsx(
                    'text-dark-400 transition-all duration-300 mr-auto',
                    isOpen && 'rotate-180',
                  )}
                />
              </div>
            )}
          </div>
          {hasList && type === 'modal' && (
            <CoinsModal
              showBalance={showBalance}
              showFavorites={showFavorites}
              onSelect={handleSelect}
              ignoredCoins={ignoredCoins}
              setItemClassNames={setItemClassNames}
              withNetworks={false}
              content={content}
              otcTradeable={otcTradeable}
            />
          )}
          {hasList && type === 'dropdown' && (
            <CoinsDropdown
              isOpen={isOpen}
              onToggle={setIsOpen}
              onSelect={handleSelect}
              ignoredCoins={ignoredCoins}
              setItemClassNames={setItemClassNames}
              withNetworks={false}
              content={content}
              otcTradeable={otcTradeable}
            />
          )}
        </div>
      </div>
      {caption && <div className="mt-2">{caption}</div>}
    </div>
  );
};

export default TwinInput;
