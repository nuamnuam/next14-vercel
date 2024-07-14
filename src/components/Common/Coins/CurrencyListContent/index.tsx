import React, { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'classnames';

import {
  useDebounceValue,
  useIntersectionObserver,
  useCoinIcon,
  useInfiniteCurrencyList,
  useLang,
} from '@/hooks';
import { ICurrencyModel } from '@/types/currency';

import FormGroup from '../../Form/FormGroup';
import FormInput from '../../Form/FormInput';
import Icon from '../../Icon';
import ListLoader from '../../ListLoader';
import EmptyTable from '../../EmptyTable';

interface Props {
  ignoredCoins?: string[];
  onSelect: (coin: ICurrencyModel) => void;
  setItemClassNames?: (coin: ICurrencyModel) => string;
  withNetworks?: boolean;
  otcTradeable?: boolean;
}

const CurrencyListContent: React.FC<Props> = ({
  ignoredCoins = [],
  onSelect,
  setItemClassNames,
  otcTradeable,
}) => {
  const [global] = useLang(['global']);

  const elementRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounceValue(searchValue, 500);
  const getCoinIcon = useCoinIcon();

  const { data, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteCurrencyList({
      q: debouncedSearch,
      ...(otcTradeable !== undefined && {
        otc_tradable: otcTradeable ? 1 : 0,
      }),
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
      </div>
      <div className={clsx('overflow-y-auto px-4 md:px-6 h-[320px]')}>
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
            </div>
          );
        })}
        {(hasNextPage || isFetching) && <ListLoader ref={elementRef} />}
        {(!data?.length && !isFetching) ||
        (!isOTCTradeableTrue && !isFetching) ? (
          <EmptyTable />
        ) : null}
      </div>
    </div>
  );
};

export default CurrencyListContent;
