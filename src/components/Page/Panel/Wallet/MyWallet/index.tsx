import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useBreakpoint, useDebounceFunc, useLang } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { maxDecimal, toPrice } from '@/utils';
import {
  Button,
  Card,
  CheckBox,
  FormInput,
  Icon,
  Mask,
} from '@/components/Common';
import MaskButton from '@/components/Common/Mask/MaskButton';
import IconButton from '@/components/Common/IconButton';
import GuidButton from '@/components/Common/GuideButton';
import MyWalletTable from './components/MyWalletTable';
import SmallConvertContent from './components/SmallConvertContent';
import SmallConvertModal, {
  smallConvertModalName,
} from './components/SmallConvertModal';
import { useWalletBalanceStore } from '@/store';
import BalanceHistory from '@/components/BalanceHistory';
import BalanceHistoryModal, {
  balanceHistoryModalName,
} from '@/components/BalanceHistory/BalanceHistoryModal';
import { useBalancesList } from '@/requests/panel/wallet/getBalancesList';

const MyWalletPage: React.FC = () => {
  const [wallet] = useLang(['wallet']);

  const { showModal: showWalletChartModal } = useModal(balanceHistoryModalName);
  const { showModal: showSmallConvertModal } = useModal(smallConvertModalName);
  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const [searchInputVal, setSearchInputVal] = useState('');

  const {
    balanceHistory,
    balancesPage,
    nonZeroBalances,
    balancesSearchVal,
    setBalancesSearchVal,
    setNonZeroBalances,
  } = useWalletBalanceStore();

  const { isLoading } = useBalancesList(
    {
      page: balancesPage,
      non_zero_balances: nonZeroBalances ? 1 : 0,
      q: balancesSearchVal,
    },
    isDesktop,
  );

  const { available, total } = balanceHistory;

  const debouncedFunc = useDebounceFunc(500, setBalancesSearchVal);

  useEffect(() => {
    if (!searchInputVal || searchInputVal.length === 1) {
      debouncedFunc(undefined);
      return;
    }
    debouncedFunc(searchInputVal);
  }, [searchInputVal]);

  const smallConvertAction = () => {
    if (isDesktop) router.push('/panel/wallet/my-wallet?small_assets=1');
    else {
      showSmallConvertModal();
    }
  };

  if (router.query.small_assets && isDesktop) return <SmallConvertContent />;

  return (
    <>
      {isDesktop && (
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="my-0 ml-4 text-lg font-medium text-dark-600">
              {wallet.myWallet}
            </h1>
            <MaskButton />
          </div>
          <GuidButton variant="primary" />
        </div>
      )}
      <Card>
        <div className="flex">
          <div className="flex-1 border-l border-dark-50 ">
            {isDesktop && (
              <>
                <h2 className="m-0 border-b border-dark-50 py-7 px-6 text-base text-dark-800">
                  {wallet.assetsOverview}
                </h2>
                <div className="h-5 bg-dark-50 opacity-40" />
              </>
            )}
            <div className="py-10 px-6">
              <div className="flex items-center">
                <div className="flex flex-1 items-center">
                  {isDesktop ? (
                    <Icon
                      size={32}
                      icon="Information-OutLined"
                      className="text-dark-200"
                    />
                  ) : (
                    <></>
                  )}
                  <div className="mr-4 flex flex-col">
                    <p className="text-xl font-bold leading-8 text-dark-700 flex items-center gap-1">
                      <span className="text-sm text-dark-500 font-medium">
                        USDT
                      </span>
                      <Mask className="inline-block dir-ltr">
                        {toPrice(maxDecimal(total?.USDT, 2))}
                      </Mask>
                    </p>
                    <span className="text-sm font-medium leading-6 text-dark-300">
                      {wallet.assetsEstimate}
                    </span>
                  </div>
                </div>
                {isDesktop ? (
                  <div className="flex flex-1 items-center">
                    <Icon
                      size={32}
                      icon="Currency-OutLined"
                      className="text-dark-200"
                    />
                    <div className="mr-4 flex flex-col">
                      <p className="text-xl font-bold leading-8 text-dark-700 flex items-center gap-1">
                        <span className="text-sm text-dark-500 font-medium">
                          USDT
                        </span>
                        <Mask className="inline-block dir-ltr">
                          {toPrice(maxDecimal(available?.USDT, 2))}
                        </Mask>
                      </p>
                      <span className="text-sm font-medium leading-6 text-dark-300">
                        {wallet.availableBalance}{' '}
                      </span>
                    </div>
                  </div>
                ) : (
                  <IconButton
                    onClick={() => {
                      showWalletChartModal();
                    }}
                    icon={<Icon icon="ChartUp-OutLined" size={20} />}
                    size="lg"
                  />
                )}
              </div>
              <div className="mt-11 flex items-center gap-[10px]">
                <Link
                  href={'/panel/wallet/toman-deposit'}
                  className="flex items-center rounded-lg flex-1"
                >
                  <Button fullWidth>{wallet.deposit}</Button>
                </Link>
                <Link
                  className="flex items-center rounded-lg flex-1"
                  href={'/panel/wallet/toman-withdraw'}
                >
                  <Button fullWidth variant="dark">
                    {wallet.withdraw}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {isDesktop && (
            <div className="flex-1 lg:w-1/2 py-7 px-6">
              <BalanceHistory title={wallet.assetsDetails} />
            </div>
          )}
        </div>
      </Card>
      <Card classNames="mt-10 ">
        <div className="lg:px-5 lg:py-5 py-4  flex flex-col items-center justify-between px-5 pt-6 md:flex-row lg:p-0">
          <div className="md:0 w-full  md:w-[200px]  lg:w-[246px]">
            <FormInput
              name="search"
              fullWidth
              placeholder={wallet.searchInAssets}
              value={searchInputVal}
              onChange={setSearchInputVal}
              hasClear
              className="h-[42px] w-full "
              rightIcon={
                <Icon
                  icon="Search-OutLined"
                  size={16}
                  className="text-dark-500"
                />
              }
            />
          </div>
          <div className="mt-4 md:mt-0 flex flex-auto self-stretch items-center justify-between md:mr-auto md:justify-end">
            <span
              className="md:ml-8 cursor-pointer rounded-lg bg-warning-50 py-1 px-2"
              onClick={smallConvertAction}
            >
              <Icon
                icon="Convert-OutLined"
                size={16}
                className="text-warning-600"
              />
              <span className="text-medium mr-2 text-sm text-warning-600">
                {wallet.convertSmallAssets}
              </span>
            </span>
            <CheckBox
              size="small"
              label={wallet.showingFew}
              isChecked={!nonZeroBalances}
              isDisabled={isLoading}
              handleInputChange={(a) => {
                setNonZeroBalances(!a);
              }}
            />
          </div>
        </div>
        <MyWalletTable loading={isLoading || false} />
      </Card>

      <SmallConvertModal />
      <BalanceHistoryModal />
    </>
  );
};

export default MyWalletPage;
