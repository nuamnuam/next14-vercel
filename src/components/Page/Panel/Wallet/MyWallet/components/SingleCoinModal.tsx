import React, { useEffect, useState } from 'react';
import clsx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button, Card, Icon, Modal, Tabs } from '@/components';
import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useCoinIcon, useLang } from '@/hooks';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { externalData, maxDecimal, toPrice, toStraightNumber } from '@/utils';
import { BalanceCoinModel } from '@/types/wallet';

import CoinTransactionsTable from './CoinTranactionsTable';
import FastTansactionModal, {
  fastTransactionModalName,
} from './FastTansactionModal';
import ProTansactionModal, {
  proTransactionModalName,
} from './ProTansactionModal';

export const singleCoinModalName = 'single-coin-modal';

type Props = {
  coin: BalanceCoinModel;
};

const SingleCoinModal: React.FC<Props> = ({ coin }) => {
  const [wallet] = useLang(['wallet']);

  const [operation, setOperation] = useState<'all' | 'trade' | 'wallet'>('all');
  const [data, setData] = useState<BalanceCoinModel>();
  const [fastTransactionModalData, setFastTransactionModalData] =
    useState<BalanceCoinModel>();

  const { isMobile, isDesktop } = useBreakpoint();
  const getCoinIcon = useCoinIcon();
  const router = useRouter();

  const { closeSyncModal: closeSingleCoinModal } =
    useModal(singleCoinModalName);

  const {
    showSyncModal: showFastTransactionModal,
    closeSyncModal: closeFastTransactionModal,
  } = useModal(fastTransactionModalName);

  const {
    showSyncModal: showProTransactionModal,
    closeSyncModal: closeProTransactionModal,
  } = useModal(proTransactionModalName);

  useEffect(() => {
    const exData = externalData.get();
    if (!exData) return;
    setData(exData);
  }, [externalData]);

  useEffect(() => {
    closeFastTransactionModal();
    closeProTransactionModal();

    const handleRouteChange = () => {
      closeFastTransactionModal();
      closeProTransactionModal();
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const handleChangeTableTab = (val: string) => {
    if (val !== 'all' && val !== 'trade' && val !== 'wallet') return;
    setOperation(val);
  };

  const handleClickDeposit = () => {
    if (!data?.symbol) return;
    if (data.symbol.toLocaleUpperCase() === 'IRT') {
      router.push('/panel/wallet/toman-deposit');
      return;
    }
    externalData.set(data);
    router.push('/panel/wallet/crypto-deposit');
  };

  const handleClickWithdraw = () => {
    if (!data?.symbol) return;
    if (data.symbol.toLocaleUpperCase() === 'IRT') {
      router.push('/panel/wallet/toman-withdraw');
      return;
    }
    externalData.set(data);
    router.push('/panel/wallet/crypto-withdraw');
  };

  const tabItems = [
    {
      label: wallet.all,
      name: 'all',
    },
    {
      label: wallet.trade,
      name: 'trade',
    },
    {
      label: wallet.withdrawDeposit,
      name: 'wallet',
    },
  ];

  return (
    <Modal
      sync
      name={singleCoinModalName}
      noTransition
      onClose={closeSingleCoinModal}
      hasCloseAction={false}
      contentAddtionalClassNames="!pt-8"
      fullScreen
      title={data?.title}
    >
      <div className="px-10"></div>
      <Card classNames="mb-10 py-6 px-4 sm:py-8 sm:px-10">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={getCoinIcon(data!)}
            width={48}
            height={48}
            alt={data?.symbol || 'coin'}
            onError={(e) => {
              //@ts-ignore
              e.currentTarget.src = globalThis.DEFAULT_COIN_IMG_URL;
            }}
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium leading-6 text-dark-300">
              {wallet.allAssets}
            </span>
            <span className="text-xl font-bold mt-1 text-dark-700 flex gap-1 flex-wrap">
              <span>{data?.symbol}</span>{' '}
              {toPrice(
                toStraightNumber(
                  maxDecimal(data?.balance, data?.balance_decimal),
                ) || 0,
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-between bg-dark-50 rounded-lg px-4 py-2 mb-4">
          <span className="text-sm font-medium text-dark-300">
            {wallet.dollarEquivalent}:
          </span>
          <span className="text-sm font-medium text-dark-700">
            {toPrice(
              toStraightNumber(Number(data?.estimated_usdt ?? 0).toFixed(2)) ||
                0,
            )}{' '}
            {wallet.dollar}
          </span>
        </div>
        <div className="mb-6 flex items-center gap-4 rounded-lg border border-dark-100 p-4">
          <div className="flex flex-1 items-center">
            <Icon
              icon="CheckCircle-OutLined"
              size={18}
              className="ml-2 text-dark-200"
            />
            <div className="flex flex-col">
              <span className="text-xs leading-[18px] text-dark-300">
                {wallet.available}
              </span>
              <span className="text-xs leading-[18px] text-dark-700 flex gap-1">
                <span>{data?.symbol}</span>
                {toPrice(
                  toStraightNumber(
                    maxDecimal(data?.balance_available, data?.balance_decimal),
                  ) || 0,
                )}{' '}
              </span>
            </div>
          </div>
          <div className="flex flex-1 items-center">
            <Icon
              icon="CloseCircle-OutLined"
              size={18}
              className="ml-2 text-dark-200"
            />
            <div className="flex flex-col">
              <span className="text-xs leading-[18px] text-dark-300">
                {wallet.freezed}
              </span>
              <span className="text-xs leading-[18px] text-dark-700 flex gap-1">
                <span>{data?.symbol}</span>
                {toPrice(
                  toStraightNumber(
                    maxDecimal(data?.balance_freeze, data?.balance_decimal),
                  ) || 0,
                )}{' '}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div
            className={clsx(
              'cursor-pointer flex h-[107px] flex-1 flex-col items-center justify-center rounded-lg bg-dark-700 shadow-card sm:h-[57px] sm:flex-row',
              !data?.otc_tradeable &&
                data?.symbol !== 'IRT' &&
                'opacity-20 !cursor-not-allowed',
            )}
            onClick={() => {
              if (!data?.otc_tradeable && data?.symbol !== 'IRT') return;
              setFastTransactionModalData(data);
              showFastTransactionModal();
            }}
          >
            <Icon
              icon="InstantTrade-OutLined"
              size={24}
              className="text-dark-50"
            />
            <span className="mt-4 text-sm font-medium text-dark-50 sm:mt-0 sm:mr-4">
              {wallet.instantTradee}
            </span>
          </div>
          <div
            className={clsx(
              'cursor-pointer flex h-[107px] flex-1 flex-col items-center justify-center rounded-lg bg-dark-700 shadow-card sm:h-[57px] sm:flex-row',
              !data?.p2p_tradeable && 'opacity-20 !cursor-not-allowed',
            )}
            onClick={() => {
              if (!data?.p2p_tradeable) return;
              showProTransactionModal();
            }}
          >
            <Icon icon="ProTrade-OutLined" size={24} className="text-dark-50" />
            <span className="mt-4 text-sm font-medium text-dark-50 sm:mt-0 sm:mr-4">
              {wallet.advancedTrade}
            </span>
          </div>
          {data?.symbol !== 'IRT' && data?.otc_tradeable ? (
            <Link
              href={`/panel/instant-trade/convert${
                data?.symbol === 'USDT' ? '' : `?asset=${data?.symbol}`
              }`}
              className={clsx(
                'flex h-[107px] w-full flex-1 flex-col items-center justify-center rounded-lg',
              )}
            >
              <div className="flex h-[107px] w-full flex-col items-center justify-center rounded-lg bg-dark-700 shadow-card sm:h-[57px] sm:flex-row">
                <Icon
                  icon="Convert-OutLined"
                  size={24}
                  className="text-dark-50"
                />
                <span className="mt-4 text-sm font-medium text-dark-50 sm:mt-0 sm:mr-4">
                  {wallet.convert}
                </span>
              </div>
            </Link>
          ) : (
            <div
              className={clsx(
                'flex h-[107px] w-full flex-1 flex-col items-center justify-center rounded-lg opacity-20 cursor-not-allowed',
              )}
            >
              <div className="flex h-[107px] w-full flex-col items-center justify-center rounded-lg bg-dark-700 shadow-card sm:h-[57px] sm:flex-row">
                <Icon
                  icon="Convert-OutLined"
                  size={24}
                  className="text-dark-50"
                />
                <span className="mt-4 text-sm font-medium text-dark-50 sm:mt-0 sm:mr-4">
                  {wallet.convert}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
      <div className="pb-20">
        <Card classNames="overflow-hidden mb-6">
          <div className="p-4 sm:p-6 pb-0">
            <Tabs items={tabItems} onChange={handleChangeTableTab} />
          </div>
          <ModalFooter fullScreen>
            <div className="flex gap-4">
              <Button
                size={isMobile ? 'md' : 'lg'}
                fullWidth
                onClick={handleClickDeposit}
              >
                <Link
                  href={
                    isDesktop
                      ? data?.symbol === 'IRT'
                        ? '/panel/wallet/toman-deposit'
                        : '/panel/wallet/crypto-deposit'
                      : data?.symbol === 'IRT'
                      ? '/panel/wallet/toman-deposit'
                      : '/panel/wallet/crypto-deposit'
                  }
                  className="flex items-center justify-center rounded-lg "
                >
                  {wallet.deposit}
                </Link>
              </Button>
              <Button
                size={isMobile ? 'md' : 'lg'}
                fullWidth
                variant="dark"
                onClick={handleClickWithdraw}
              >
                <Link
                  href={
                    isDesktop
                      ? data?.symbol === 'IRT'
                        ? '/panel/wallet/toman-withdraw'
                        : '/panel/wallet/crypto-withdraw'
                      : data?.symbol === 'IRT'
                      ? '/panel/wallet/toman-withdraw'
                      : '/panel/wallet/crypto-withdraw'
                  }
                  className="flex items-center justify-center rounded-lg "
                >
                  {wallet.withdraw}
                </Link>
              </Button>
            </div>
          </ModalFooter>
          <CoinTransactionsTable coinData={coin} operation={operation} />
          <FastTansactionModal data={fastTransactionModalData} />
          <ProTansactionModal data={data} />
        </Card>
      </div>
    </Modal>
  );
};

export default SingleCoinModal;
