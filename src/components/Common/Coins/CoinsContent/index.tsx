import React, { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import { maxDecimal, toPrice, toStraightNumber } from '@/utils';
import {
  useDebounceValue,
  useIntersectionObserver,
  useInfiniteBalances,
  useCoinIcon,
  useLang,
} from '@/hooks';
import { usePopularCurrencies } from '@/requests/panel/instantTrade/getPopularCurrencies';
import { BalanceCoinModel } from '@/types/wallet';

import ListLoader from '../../ListLoader';
import EmptyTable from '../../EmptyTable';
import FormGroup from '../../Form/FormGroup';
import Icon from '../../Icon';
import FormInput from '../../Form/FormInput';

interface Props {
  showBalance?: boolean;
  showFavorites?: boolean;
  ignoredCoins?: string[];
  onSelect: (coin: BalanceCoinModel) => void;
  setItemClassNames?: (coin: BalanceCoinModel) => string;
  withNetworks?: boolean;
  type?: 'deposit' | 'withdraw';
  onAllClick?: () => void;
  otcTradeable?: boolean;
  hasNetworkParam?: boolean;
}

const CoinsContent: React.FC<Props> = ({
  showBalance = false,
  showFavorites = false,
  ignoredCoins = [],
  onSelect,
  setItemClassNames,
  withNetworks = true,
  type,
  hasNetworkParam,
  onAllClick,
  otcTradeable = undefined,
}) => {
  const [global] = useLang(['global']);

  const elementRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounceValue(searchValue, 500);
  const getCoinIcon = useCoinIcon();

  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteBalances({
    q: debouncedSearch,
    with_network: withNetworks ? 1 : 0,
    type,
    ...(typeof otcTradeable !== 'undefined' && { otc_tradable: otcTradeable }),
    hasNetworkParam,
  });

  useIntersectionObserver(elementRef, fetchNextPage);
  const isOTCTradeableTrue = data?.some((item) => item.otc_tradeable);

  return (
    <div>
      <div className="flex flex-col px-4 md:px-6">
        <FormGroup className="mb-2">
          <FormInput
            className="!h-10 border-dark-50 bg-dark-50 [&_input]:bg-dark-50"
            placeholder={global.search1}
            value={searchValue}
            onChange={setSearchValue}
            hasClear
            rightIcon={
              <Icon
                icon="Search-OutLined"
                size={16}
                className="text-dark-600"
              />
            }
          />
        </FormGroup>
        {showFavorites && !searchValue && (
          <div className="my-2">
            <Favorites onSelect={onSelect} />
          </div>
        )}
      </div>
      <div
        className={clsx(
          'overflow-y-auto px-4 md:px-6 h-[320px]',
          showFavorites
            ? onAllClick
              ? 'h-[160px]'
              : 'h-[240px]'
            : onAllClick
            ? 'h-[400px]'
            : 'lg:h-[480px]',
        )}
      >
        {showBalance && (
          <div className=" flex items-center justify-between border-b border-dark-50 bg-white py-2 pr-1">
            <span className="text-sm text-dark-200">{global.crypto}</span>
            <span className="text-sm text-dark-200">{global.balance}</span>
          </div>
        )}
        {onAllClick && (
          <span
            className="text-dark-700 font-medium block px-4 py-2 cursor-pointer hover:bg-dark-50"
            onClick={onAllClick}
          >
            {global.all}
          </span>
        )}
        {data?.map((coin, index) => {
          if (ignoredCoins.includes(coin.symbol)) return null;
          return (
            <div
              key={index}
              className={clsx(
                'select-none flex h-14 cursor-pointer items-center justify-between rounded-sm px-4 transition duration-100 hover:bg-dark-50',
                setItemClassNames?.(coin),
              )}
              onClick={() => onSelect(coin)}
            >
              <div className="flex items-center">
                <Image
                  src={getCoinIcon(coin)}
                  height={24}
                  width={24}
                  alt={coin?.symbol || ''}
                  onError={(e) => {
                    //@ts-ignore
                    e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                  }}
                />
                <span className="mx-2 font-medium leading-6 text-dark-700">
                  {coin.title}
                </span>
                <span className="text-xs leading-5 text-dark-500">
                  {coin.symbol}
                </span>
              </div>
              {showBalance && (
                <span className="text-sm text-dark-700">
                  {toPrice(
                    toStraightNumber(
                      maxDecimal(coin.balance_available, coin.balance_decimal),
                    ) || 0,
                  )}
                </span>
              )}
            </div>
          );
        })}
        {(hasNextPage || isFetching) && <ListLoader ref={elementRef} />}
        {(!data?.length && !isFetching) ||
          (!isOTCTradeableTrue && !isFetching && <EmptyTable />)}
      </div>
    </div>
  );
};

interface FavoritesProps {
  onSelect: (coin: BalanceCoinModel) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onSelect }) => {
  const [global] = useLang(['global']);

  const { isLoading, data } = usePopularCurrencies();
  const getCoinIcon = useCoinIcon();

  if (isLoading) return <ListLoader className="py-10" />;
  if (data?.result?.length === 0) return <EmptyTable className="py-10" />;

  return (
    <div className="cursor-pointer rounded-lg bg-dark-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon
          icon="BadgeCheck-TwoTone"
          className="[&>*]:fill-dark-200"
          size={24}
        />
        <span className="text-sm font-medium text-dark-700">
          {global.trends}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data?.result.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className="flex items-center justify-between rounded-lg border bg-white p-4 transition duration-100 hover:border-dark-100"
          >
            <div className="flex items-center">
              <span className="ml-2 font-medium text-dark-700">
                {item.title}
              </span>
              <span className="text-xs text-dark-500">{item.symbol}</span>
            </div>
            <Image
              src={getCoinIcon(item)}
              height={24}
              width={24}
              alt={item?.symbol || ''}
              onError={(e) => {
                //@ts-ignore
                e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinsContent;
