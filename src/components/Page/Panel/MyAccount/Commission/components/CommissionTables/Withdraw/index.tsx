import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';

import {
  Chip,
  FormInput,
  Icon,
  LabelValue,
  ListLoader,
  Pagination,
  Table,
} from '@/components';
import { useCurrencyList } from '@/requests/getCurrencyList';
import {
  useBreakpoint,
  useCoinIcon,
  useDebounceValue,
  useIntersectionObserver,
  useLang,
} from '@/hooks';
import { toPrice } from '@/utils';
import { ICurrencyModel } from '@/types/currency';

const Withdraw = () => {
  const [global, commisson] = useLang(['global', 'commisson']);

  const { isDesktop } = useBreakpoint();
  const elementRef = useRef(null);
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState('');

  const debouncedSearch = useDebounceValue(searchVal, 500);
  const getCoinIcon = useCoinIcon();

  const { data, isLoading, isFetching } = useCurrencyList(
    {
      type: 'withdraw',
      q: debouncedSearch,
      with_network: 1,
      page,
    },
    !isDesktop,
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useIntersectionObserver(elementRef, () => {
    if (isFetching) return;
    setPage((prev) => prev + 1);
  });
  const headerItems = useMemo(() => {
    return [
      {
        title: commisson.crypto,
        name: 'coin',
        width: 'hidden lg:block w-1/5 px-6',
        classNames: 'text-center',
        columnClassNames: 'px-6',
      },
      {
        title: commisson.networkType,
        name: 'network',
        width: 'hidden lg:block w-1/5',
        classNames: ' text-center',
      },
      {
        title: '',
        name: 'x',
        width: 'block lg:hidden w-auto',
        classNames: '',
        columnClassNames: 'w-full mb-2',
      },
      {
        title: commisson.cryptoNetwork,
        name: 'coinNetwork',
        width: 'block lg:hidden w-1/4',
        classNames: 'lg:text-center',
      },
      {
        title: commisson.withdrawCommission,
        name: 'withdrawFee',
        width: 'w-1/4 lg:w-1/5',
        classNames: 'text-center',
      },
      {
        title: commisson.minWithdraw,
        name: 'minWithdraw',
        width: 'w-1/4 lg:w-1/5',
        classNames: 'text-center',
      },
      {
        title: isDesktop ? commisson.networkStatus : commisson.status,
        name: 'status',
        width: 'w-1/4 lg:w-1/5',
        classNames: 'text-left lg:text-center',
      },
    ];
  }, [isDesktop]);

  const transformedData = useCallback(() => {
    return data.result?.map((item) => ({
      coin: (
        <div className="flex items-center gap-2">
          <Image
            src={getCoinIcon(item)}
            width={24}
            height={24}
            alt={item.symbol}
            onError={(e) => {
              //@ts-ignore
              e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
            }}
          />
          <span className="text-dark-700">{item.title}</span>
          <span className="text-xs text-dark-500">{item.symbol}</span>
        </div>
      ),
      network: (
        <div className="flex flex-col items-center gap-2 text-sm text-dark-600 justify-between h-full">
          {Object.values(item.networks ?? {})?.map((network) => (
            <span>{network.title}</span>
          ))}
        </div>
      ),
      x: (
        <div className="flex items-center w-full">
          <Image
            src={getCoinIcon(item)}
            width={24}
            height={24}
            alt={item.symbol}
            onError={(e) => {
              //@ts-ignore
              e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
            }}
          />
          <div className="mr-2 flex gap-2 items-center">
            <span className="font-medium text-dark-700">{item.title}</span>
            <span className="text-xs text-dark-500">{item.symbol}</span>
          </div>
        </div>
      ),
      coinNetwork: (
        <div className="flex flex-col items-start gap-2 text-sm text-dark-600">
          <div className="flex flex-col gap-2 items-center text-sm">
            {Object.values(item.networks ?? {})?.map((network) => (
              <span className="text-center">{network.slug}</span>
            ))}
          </div>
        </div>
      ),
      withdrawFee: (
        <div className="flex flex-col items-center gap-2 text-sm text-dark-600 justify-between h-full">
          {Object.values(item.networks ?? {})?.map((network) => (
            <div className="flex gap-1">
              <span>{toPrice(network.withdrawal_fee)}</span>
              <span className="lg:block hidden">{item.symbol}</span>
            </div>
          ))}
        </div>
      ),
      minWithdraw: (
        <div className="flex flex-col items-center gap-2 text-sm text-dark-600 justify-between h-full">
          {Object.values(item.networks ?? {})?.map((network) => (
            <div className="flex gap-1">
              <span>{toPrice(network.min_withdrawal)}</span>
              <span className="lg:block hidden">{item.symbol}</span>
            </div>
          ))}
        </div>
      ),
      status: (
        <div className="flex flex-col items-end gap-2 lg:pl-4 text-sm text-dark-600 lg:items-center lg:p-0">
          {Object.values(item.networks ?? {})?.map((network) => (
            <Chip
              label={
                network.is_withdrawable ? commisson.active : commisson.deactive
              }
              size="sm"
              variant={network.is_withdrawable ? 'success' : 'danger'}
            />
          ))}
        </div>
      ),
    }));
  }, [data]);

  return (
    <div>
      <div className="py-6 px-4 md:px-6">
        <h1 className="mt-0 mb-4 font-medium text-dark-800">
          {commisson.withdrawCommission}
        </h1>
        <p className="m-0 mb-8 text-sm leading-6 text-dark-600">
          {' '}
          {global.loremIpsum}
        </p>
        <h2 className="relative mt-0 mb-4 pr-5 font-medium text-primary-600 after:absolute after:top-2.5 after:right-1 after:h-1.5 after:w-1.5 after:rounded-lg after:bg-primary-600">
          {commisson.tomanwithdrawCommission}
        </h2>
        <p className="m-0 mb-8 text-sm leading-6 text-dark-600">
          {' '}
          {global.loremIpsum}
        </p>
        <h2 className="relative mt-0 mb-4 pr-5 font-medium text-primary-600 after:absolute after:top-2.5 after:right-1 after:h-1.5 after:w-1.5 after:rounded-lg after:bg-primary-600">
          {commisson.cryptoWithdrawCommission}
        </h2>
        <p className="m-0 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
      </div>
      <div className="p-4 md:p-6 flex items-center justify-between">
        <h2 className="text-base text-dark-800 font-normal hidden lg:block">
          {commisson.withdrawFeeList}
        </h2>
        <FormInput
          size="sm"
          placeholder={commisson.search}
          value={searchVal}
          onChange={setSearchVal}
          hasClear
          containerClassName="w-full lg:w-60"
          rightIcon={
            <Icon icon="Search-OutLined" size={16} className="text-dark-500" />
          }
        />
      </div>
      {isDesktop ? (
        <Table
          data={transformedData() || []}
          headerItems={headerItems}
          isLoading={isLoading}
          isFetching={isFetching}
          bodyExtraClassname="items-stretch"
          hasNextPage={
            data.pagination && !isDesktop
              ? data.pagination?.current_page < data.pagination?.total_pages
              : false
          }
          ref={elementRef}
        />
      ) : (
        <ResponsiveTable
          data={data.result}
          ref={elementRef}
          isLoading={isLoading}
          hasNextPage={
            data.pagination && !isDesktop
              ? data.pagination?.current_page < data.pagination?.total_pages
              : false
          }
        />
      )}
      {isDesktop && data?.result?.length ? (
        <div className="flex flex-col items-center justify-center p-4 sm:flex-row">
          <Pagination
            page={page}
            count={data?.pagination?.total_pages ?? 1}
            onChange={setPage}
            classNames="mb-4 sm:mb-0"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Withdraw;

interface ResTableProps {
  data: ICurrencyModel[];
  hasNextPage: boolean;
  isLoading: boolean;
}

const ResponsiveTable = forwardRef<HTMLDivElement, ResTableProps>(
  ({ data, hasNextPage, isLoading }, ref) => {
    const [commisson] = useLang(['commisson']);

    const getCoinIcon = useCoinIcon();

    return (
      <div>
        {data?.map((item, index) => (
          <div className="p-4 sm:p-6 border-b border-dark-50" key={index}>
            <div className="flex items-center gap-2">
              <Image
                src={getCoinIcon(item)}
                width={24}
                height={24}
                alt={item.symbol}
                onError={(e) => {
                  //@ts-ignore
                  e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
                }}
              />
              <span className="text-dark-700 font-medium text-sm">
                {item.title}
              </span>
              <span className="text-2xs text-dark-500">{item.symbol}</span>
            </div>
            {Object.values(item.networks ?? {})?.map((net) => (
              <div className="border border-dark-50 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-dark-600 font-medium">
                    {net?.title}
                  </span>
                  <Chip
                    label={
                      net?.is_depositable
                        ? commisson.active
                        : commisson.deactive
                    }
                    size="sm"
                    variant={net?.is_depositable ? 'success' : 'danger'}
                  />
                </div>
                <LabelValue
                  label={`${commisson.withdrawFee}:`}
                  value={`${item.symbol} ${toPrice(net.withdrawal_fee)}`}
                  classNames="mb-2"
                />
                <LabelValue
                  label={`${commisson.minWithdraw}:`}
                  value={`${item.symbol} ${toPrice(net.min_withdrawal)}`}
                />
              </div>
            ))}
          </div>
        ))}
        {(hasNextPage || isLoading) && (
          <div className="py-8" ref={ref}>
            <ListLoader className="!py-0" />
          </div>
        )}
      </div>
    );
  },
);
