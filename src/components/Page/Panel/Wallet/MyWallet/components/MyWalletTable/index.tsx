import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffectOnce } from 'react-use';
import clsx from 'classnames';
import { Tooltip } from '@mui/material';
import Skeleton from 'react-loading-skeleton';

import { Card, Pagination } from '@/components';
import {
  externalData,
  getLang,
  maxDecimal,
  toPrice,
  toStraightNumber,
} from '@/utils';
import {
  Button,
  EmptyTable,
  Icon,
  ListLoader,
  Mask,
} from '@/components/Common';
import ClickablePopover from '@/components/Common/ClickablePopover';
import {
  useBreakpoint,
  useCoinIcon,
  useInfiniteBalances,
  useIntersectionObserver,
  useLang,
} from '@/hooks';
import { useModal } from '@/hooks/useModal';
import useWalletBalanceStore from '@/store/useWalletBalanceStore';
import { type BalanceCoinModel } from '@/types/wallet';
import { useBalancesDetail } from '@/requests/panel/wallet/getBalancesDetail';
import { type TableHeaderItem } from '@/components/TableLayout/types';

import SingleCoinModal, { singleCoinModalName } from '../SingleCoinModal';

const [wallet] = getLang(['wallet']);

const MyWalletTable: React.FC<{ loading: boolean }> = ({ loading = false }) => {
  const [wallet] = useLang(['wallet']);

  const elementRef = useRef(null);
  const [selectedCoinSymbol, setSelectedCoinSymbol] =
    useState<BalanceCoinModel>();
  const { isDesktop } = useBreakpoint();
  const { showSyncModal, isSyncModalOpen } = useModal(singleCoinModalName);
  const getCoinIcon = useCoinIcon();
  const router = useRouter();

  const { mutateAsync: mutateGetBalancesDetailAsync } = useBalancesDetail();

  useEffectOnce(() => {
    mutateGetBalancesDetailAsync();
  });

  useEffect(() => {
    if (!isSyncModalOpen) {
      externalData.set(undefined);
      setSelectedCoinSymbol(undefined);
    }
  }, [isSyncModalOpen]);

  const {
    balancesPage,
    setBalancesPage,
    balances,
    balancesSearchVal,
    nonZeroBalances,
  } = useWalletBalanceStore();

  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteBalances({
    q: balancesSearchVal,
    with_network: 0,
    nonZeroBalances,
    enabled: !isDesktop,
  });

  useIntersectionObserver(elementRef, fetchNextPage);

  useEffect(() => {
    setBalancesPage(1);
  }, [balancesSearchVal]);

  const onClickRow = (row: BalanceCoinModel) => {
    setSelectedCoinSymbol(row);
    externalData.set(row);
    showSyncModal();
  };

  const handleSort = (sortKey: string) => {
    // call fetch api with sort options here
  };

  const rowsGenerator = useCallback(
    (items: BalanceCoinModel[]) => {
      return items.map((item) => ({
        coin: (
          <div
            className={clsx(
              'flex items-center rounded-lg gap-2',
              item.symbol !== 'IRT' && 'cursor-pointer',
            )}
            onClick={() => {
              if (!isDesktop || item.symbol === 'IRT') return;
              router.push(`/${item.slug}`);
            }}
          >
            <Image
              src={getCoinIcon(item)}
              height={24}
              width={24}
              alt={item.symbol || 'coin'}
              onError={(e) => {
                //@ts-ignore
                e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
              }}
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-dark-700">
                {item.symbol}
              </span>
              <span className="text-xs text-dark-500">{item.title}</span>
            </div>
          </div>
        ),
        totalBalance: (
          <span className="flex justify-center text-dark-600 text-sm">
            <Mask>
              {toPrice(
                toStraightNumber(
                  maxDecimal(item.balance, item.balance_decimal),
                ) || 0,
              )}
            </Mask>
          </span>
        ),
        isFreezed: (
          <span className="flex justify-center text-sm text-dark-600">
            <Mask>
              {toPrice(
                toStraightNumber(
                  maxDecimal(item.balance_freeze, item.balance_decimal),
                ) || 0,
              )}
            </Mask>
          </span>
        ),
        availlable: (
          <span className="flex justify-center text-sm text-dark-600">
            <Mask>
              {toPrice(
                toStraightNumber(
                  maxDecimal(item.balance_available, item.balance_decimal),
                ) || 0,
              )}
            </Mask>
          </span>
        ),
        estimated: (
          <span className="flex justify-center text-sm text-dark-600">
            <Mask className="ml-1">
              {toPrice(
                toStraightNumber(maxDecimal(item.estimated_usdt, 2)) || 0,
              )}
            </Mask>
          </span>
        ),
        actions: (
          <div className="flex w-full justify-end gap-4 sm:w-auto">
            {!item.is_depositable && isDesktop ? (
              <Tooltip
                title={wallet.disabledDeposit}
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      width: '7.5rem',
                      bgcolor: '#373B4F',
                      padding: '0.8rem',
                      fontWeight: 400,
                      fontSize: '14px',
                      textAlign: 'center',
                    },
                  },
                  arrow: {
                    sx: {
                      '&::before': {
                        color: '#373B4F',
                      },
                    },
                  },
                }}
              >
                <Button
                  className="flex-1"
                  disabled={!item.is_depositable}
                  onClick={() => externalData.set(item)}
                >
                  {wallet.deposit}
                </Button>
              </Tooltip>
            ) : item.is_depositable ? (
              <Link
                href={
                  item.symbol === 'IRT'
                    ? '/panel/wallet/toman-deposit'
                    : '/panel/wallet/crypto-deposit'
                }
                className="flex items-center rounded-lg "
              >
                <Button
                  className="flex-1"
                  disabled={!item.is_depositable}
                  onClick={() => externalData.set(item)}
                >
                  {wallet.deposit}
                </Button>
              </Link>
            ) : (
              <Button
                className="flex-1"
                disabled={!item.is_depositable}
                onClick={() => externalData.set(item)}
              >
                {wallet.deposit}
              </Button>
            )}

            {!item.is_withdrawable && isDesktop ? (
              <Tooltip
                title={wallet.disabledWithdraw}
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      width: '7.5rem',
                      bgcolor: '#373B4F',
                      padding: '0.5rem',
                      fontWeight: 400,
                      fontSize: '14px',
                      textAlign: 'center',
                    },
                  },
                  arrow: {
                    sx: {
                      '&::before': {
                        color: '#373B4F',
                      },
                    },
                  },
                }}
              >
                <Button
                  className="flex-1"
                  variant="dark"
                  disabled={!item.is_withdrawable}
                  onClick={() => externalData.set(item)}
                >
                  {wallet.withdraw}
                </Button>
              </Tooltip>
            ) : item.is_withdrawable ? (
              <Link
                href={
                  item.symbol === 'IRT'
                    ? '/panel/wallet/toman-withdraw'
                    : '/panel/wallet/crypto-withdraw'
                }
                className="flex items-center rounded-lg "
              >
                <Button
                  className="flex-1"
                  variant="dark"
                  disabled={!item.is_withdrawable}
                  onClick={() => externalData.set(item)}
                >
                  {wallet.withdraw}
                </Button>
              </Link>
            ) : (
              <Button
                className="flex-1"
                variant="dark"
                disabled={!item.is_withdrawable}
                onClick={() => externalData.set(item)}
              >
                {wallet.withdraw}
              </Button>
            )}

            {!item.otc_tradeable &&
            item.symbol !== 'IRT' &&
            !item.p2p_tradeable ? (
              <Tooltip
                title={wallet.disabledTrade}
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      width: '7.5rem',
                      bgcolor: '#373B4F',
                      padding: '0.5rem',
                      fontWeight: 400,
                      fontSize: '14px',
                      textAlign: 'center',
                    },
                  },
                  arrow: {
                    sx: {
                      '&::before': {
                        color: '#373B4F',
                      },
                    },
                  },
                }}
              >
                <Button className="flex-1" variant="secondary" disabled>
                  {wallet.trade}
                </Button>
              </Tooltip>
            ) : (
              <PopoverContent item={item} />
            )}
          </div>
        ),
      }));
    },
    [balancesPage, balancesSearchVal, getCoinIcon],
  );

  return (
    <>
      <Card>
        <div aria-label="coins-table">
          <div className="flex bg-dark-50/50 py-3 px-4">
            {headerItems.map((item) => (
              <div
                className={clsx(
                  'text-xs text-dark-600 text-center',
                  item?.classNames,
                  item?.width,
                )}
              >
                {item.title}
                {item?.sort && (
                  <Icon
                    icon="ArrowChangeSort-Filled"
                    size={18}
                    className="[&>*]:fill-dark-200 cursor-pointer"
                    onClick={() => handleSort(item.name)}
                  />
                )}
              </div>
            ))}
          </div>
          {isDesktop && loading && !balances.result?.length && (
            <ListLoader className="!py-10" />
          )}
          {isDesktop && !loading && !balances.result?.length && <EmptyTable />}
          {!isDesktop && !isFetching && !data?.length && <EmptyTable />}
          {rowsGenerator(isDesktop ? balances.result : data ?? [])?.map(
            (row: RowItem, rowIndex: number) => (
              <div
                key={rowIndex}
                onClick={() => {
                  !isDesktop && onClickRow(data![rowIndex]);
                }}
                className="flex w-full flex-wrap items-center border-b border-dark-50 p-4 hover:bg-dark-50"
              >
                {(Object.keys(row) as Array<keyof typeof row>).map(
                  (cellName, cellIndex) => (
                    <div
                      className={clsx(
                        headerItems[cellIndex].width,
                        headerItems[cellIndex].columnClassNames,
                      )}
                      key={`${rowIndex}-${cellIndex}`}
                    >
                      {isDesktop && loading ? (
                        <Skeleton
                          inline
                          width={80}
                          height={36}
                          style={{ borderRadius: '0.5rem' }}
                        />
                      ) : (
                        row[cellName]
                      )}
                    </div>
                  ),
                )}
              </div>
            ),
          )}
          {!isDesktop && (hasNextPage || isFetching) && (
            <ListLoader ref={elementRef} className="!py-10" />
          )}
        </div>
        {isDesktop && balances.result?.length ? (
          <div className="flex flex-col items-center justify-center p-4 sm:flex-row">
            <Pagination
              count={balances.pagination.total_pages}
              page={balancesPage}
              onChange={setBalancesPage}
              classNames="mb-4 sm:mb-0"
            />
          </div>
        ) : null}
      </Card>
      {selectedCoinSymbol && <SingleCoinModal coin={selectedCoinSymbol} />}
    </>
  );
};

const PopoverContent: React.FC<{ item: BalanceCoinModel }> = ({ item }) => {
  const [wallet] = useLang(['wallet']);

  const [open, setOpen] = useState(false);
  return (
    <ClickablePopover
      id="coins_dropdown"
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      hideBackdrop={false}
      open={open}
      setOpen={setOpen}
      backdropFilter
      anchor={
        <Button className="flex-1" variant="secondary">
          {wallet.trade}
        </Button>
      }
    >
      <div className="w-[220px] p-4">
        {item.otc_tradeable || item.symbol === 'IRT' ? (
          <Link
            href={`/panel/instant-trade/buy?asset=${
              item.symbol === 'IRT' ? 'USDT' : item.symbol
            }`}
            className="flex items-center rounded-lg p-2 hover:bg-dark-50"
          >
            <Icon
              icon="InstantTrade-OutLined"
              size={20}
              className="ml-2 text-dark-200"
            />
            <span className="text-sm font-medium text-dark-700">
              {wallet.instantTradee}
            </span>
          </Link>
        ) : (
          <div className="flex items-center rounded-lg p-2 cursor-not-allowed">
            <Icon
              icon="InstantTrade-OutLined"
              size={20}
              className="ml-2 text-dark-200"
            />
            <span className="text-sm font-medium text-dark-200">
              {wallet.instantTradee}
            </span>
          </div>
        )}
        {item.p2p_tradeable ? (
          <Link
            href={`/panel/advance-trade/${item.p2p_pair}`}
            className="flex items-center rounded-lg my-1 p-2 hover:bg-dark-50"
          >
            <Icon
              icon="ProTrade-OutLined"
              size={20}
              className="ml-2 text-dark-200"
            />
            <span className="text-sm font-medium text-dark-700">
              {wallet.advancedTrade}
            </span>
          </Link>
        ) : (
          <div className="flex items-center rounded-lg my-1 p-2 cursor-not-allowed">
            <Icon
              icon="ProTrade-OutLined"
              size={20}
              className="ml-2 text-dark-200"
            />
            <span className="text-sm font-medium text-dark-200">
              {wallet.advancedTrade}
            </span>
          </div>
        )}
        {item.symbol !== 'IRT' && item.otc_tradeable ? (
          <Link
            href={`/panel/instant-trade/convert?asset=${
              item.symbol === 'USDT' ? 'BTC' : item.symbol
            }`}
            className="flex items-center rounded-lg p-2 hover:bg-dark-50"
          >
            <Icon
              icon="Convert-OutLined"
              size={20}
              className="ml-2 text-dark-200"
            />
            <span className="text-sm font-medium text-dark-700">
              {wallet.convert}
            </span>
          </Link>
        ) : (
          <div className="flex items-center rounded-lg p-2 cursor-not-allowed">
            <Icon
              icon="Convert-OutLined"
              size={20}
              className="ml-2 text-dark-200"
            />
            <span className="text-sm font-medium text-dark-200">
              {wallet.convert}
            </span>
          </div>
        )}
      </div>
    </ClickablePopover>
  );
};

export default MyWalletTable;

export type RowItem = {
  coin: any;
  totalBalance: any;
  isFreezed: any;
  availlable: any;
  estimated: any;
  classNames?: any;
  align?: 'right' | 'left' | 'inherit' | 'center' | 'justify';
  actions?: any;
};

const headerItems: TableHeaderItem[] = [
  {
    title: wallet.cryptoName,
    name: 'coin',
    width: 'w-6/12 lg:w-[15%]',
    classNames: 'flex justify-start sm:pr-6 lg:pr-7',
    columnClassNames: 'sm:pr-6 lg:pr-2',
  },
  {
    title: wallet.allBalancee,
    name: 'totalBalance',
    width: 'w-6/12 lg:w-[15%]',
    classNames: 'flex justify-end lg:justify-center sm:pl-6 lg:pl-0',
    columnClassNames: 'flex justify-end lg:justify-center sm:pl-6 lg:pl-0',
    align: 'center',
  },
  {
    title: wallet.freezed,
    name: 'isFreezed',
    width: 'hidden lg:flex justify-center lg:w-[15%]',
    columnClassNames: 'flex justify-end sm:justify-center',
    align: 'center',
  },
  {
    title: wallet.available,
    name: 'availlable',
    width: 'hidden lg:flex justify-center w-[15%]',
    columnClassNames: 'hidden lg:flex justify-center',
    align: 'center',
  },
  {
    title: wallet.estimatedUsdt,
    name: 'estimated',
    classNames: 'flex justify-center',
    width: 'hidden lg:flex lg:w-[15%]',
    columnClassNames: 'hidden lg:flex justify-center',
    align: 'center',
  },
  {
    title: '',
    name: 'actions',
    width: 'hidden lg:flex w-[25%]',
    columnClassNames: 'justify-start sm:justify-end mt-4 sm:mt-0 flex lg:pl-2',
    align: 'left',
  },
];
