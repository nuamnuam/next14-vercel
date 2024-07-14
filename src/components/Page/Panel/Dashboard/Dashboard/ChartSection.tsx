import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'classnames';
import {
  Icon,
  Card,
  Button,
  Chip,
  Mask,
  IconButton,
  AnnouncementSwipper,
} from '@/components/Common';
import MaskButton from '@/components/Common/Mask/MaskButton';
import { maxDecimal, toPersianDigits, toPrice } from '@/utils';
import { useWalletBalanceStore } from '@/store';
import { useLang, useProfile } from '@/hooks';
import BalanceHistory from '@/components/BalanceHistory';
import { useModal } from '@/hooks/useModal';
import BalanceHistoryModal, {
  balanceHistoryModalName,
} from '@/components/BalanceHistory/BalanceHistoryModal';
import { useUserStats } from '@/requests/panel/getUserStats';

const ChartSection: React.FC = () => {
  const [panelDashboard] = useLang(['panelDashboard']);

  const router = useRouter();
  const { data: userStats } = useUserStats();

  const { showModal: showChart } = useModal(balanceHistoryModalName);

  const { data: profileInfo } = useProfile();
  const { commission } = profileInfo || {};
  const { balanceHistory } = useWalletBalanceStore();

  const assets = useMemo(() => {
    return [
      {
        title: panelDashboard.estimatedValueOfAssets,
        amount: `${toPrice(balanceHistory?.total?.USDT ?? 0)}`,
        icon: 'Information-OutLined',
        symbol: 'USDT',
      },
      {
        title: panelDashboard.availableAssets,
        amount: `${toPrice(balanceHistory?.available?.USDT ?? 0)}`,
        icon: 'Currency-OutLined',
        symbol: 'USDT',
      },
    ];
  }, [balanceHistory]);

  const assetsNotifs = useMemo(
    () => [
      {
        title: panelDashboard.openOrders,
        counts:
          (userStats?.result.orders_value.OTC?.open_orders?.count ?? 0) +
          (userStats?.result.orders_value.P2P?.open_orders?.count ?? 0),
        icon: 'Article-TwoTone',
        href: '/panel/open-orders',
      },
      {
        title: panelDashboard.openExchanges,
        counts: userStats?.result.orders_value.CONVERT?.open_orders?.count ?? 0,
        icon: 'Convert-TwoTone',
        href: '/panel/open-orders?order_type=CONVERT',
      },
    ],
    [userStats],
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <AnnouncementSwipper />
        <div className="hidden w-1/12 items-center justify-end md:flex">
          <MaskButton />
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-between gap-x-6 lg:mt-8 lg:flex-row">
        <Card classNames="hidden lg:block py-7 lg:flex-auto">
          <div className="flex px-6">
            {assets?.map(({ title, icon, amount, symbol }) => (
              <div
                key={title}
                className="flex flex-1 items-center justify-start gap-x-4"
              >
                <Icon icon={icon} className="text-dark-200" size={32} />
                <div>
                  <p className="text-xl font-bold text-dark-700 flex gap-1 items-center">
                    <span className="text-sm text-dark-500 font-medium">
                      {symbol}
                    </span>
                    <Mask className="dir-ltr block text-right">{amount}</Mask>
                  </p>
                  <p className="mt-1 text-sm font-medium text-dark-300">
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="my-6 h-[25px] w-full border-t-2 border-t-dark-100 bg-dark-50 opacity-30" />
          <div className="mb-7 flex justify-between border-b-2 border-b-dark-50 px-4 pb-6 md:px-8 ">
            <div className="flex gap-x-4 items-center">
              <p className="text-sm text-dark-300">
                {panelDashboard.allOrders} (
                {toPrice(
                  (userStats?.result.orders_value.OTC?.total_orders?.count ??
                    0) +
                    (userStats?.result.orders_value.P2P?.total_orders?.count ??
                      0),
                )}
                )
              </p>
              <p className="text-sm font-bold text-dark-600 flex gap-1">
                USDT
                <Mask>
                  {toPrice(
                    maxDecimal(
                      Number(
                        userStats?.result.orders_value.OTC?.total_orders
                          ?.estimate_value.usdt ?? 0,
                      ) +
                        Number(
                          userStats?.result.orders_value.P2P?.total_orders
                            ?.estimate_value.usdt ?? 0,
                        ),
                      2,
                    ),
                  )}
                </Mask>
              </p>
            </div>
            <div className="flex gap-x-4 items-center">
              <p className="text-sm text-dark-300">
                {panelDashboard.allChanges} (
                {toPrice(
                  userStats?.result.orders_value.CONVERT?.total_orders.count ??
                    0,
                )}
                )
              </p>
              <p className="text-sm font-bold text-dark-600 flex gap-1">
                USDT
                <Mask>
                  {toPrice(
                    userStats?.result.orders_value.CONVERT?.total_orders
                      .estimate_value.usdt ?? 0,
                  )}
                </Mask>
              </p>
            </div>
          </div>
          <div className="px-4 md:px-8 ">
            <BalanceHistory title={panelDashboard.assetsDetails} />
          </div>
          <div className="flex items-center justify-between gap-x-[10px] px-4 md:px-8 mt-6">
            <Button
              fullWidth
              onClick={async () =>
                await router.push('/panel/wallet/toman-deposit')
              }
            >
              {panelDashboard.deposit}
            </Button>
            <Button
              fullWidth
              variant="dark"
              onClick={async () =>
                await router.push('/panel/wallet/toman-withdraw')
              }
            >
              {panelDashboard.withdrawal}
            </Button>
          </div>
        </Card>
        <div className="w-full lg:w-[326px]">
          <Card classNames="flex w-full">
            {assetsNotifs?.map(({ icon, title, counts, href }, index) => (
              <Link href={href} key={index} className="w-full">
                <div
                  className={clsx(
                    'flex-1 cursor-pointer',
                    index === 0 && 'border-l border-dashed border-dark-100',
                  )}
                >
                  <div className="flex flex-col items-center justify-center border-dashed px-4 pb-7 pt-6 lg:pt-9 ">
                    <div className=" relative w-10 h-10 flex items-center justify-center bg-dark-50 rounded-xl">
                      <Icon
                        icon={icon}
                        className="[&>*]:fill-dark-200"
                        size={24}
                      />
                      <span className="absolute -top-[10px] -right-[10px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-warning-500 text-xs text-white">
                        {toPersianDigits(counts)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-dark-800">
                      {title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Card>

          <Card classNames="block lg:hidden md:py-8 py-4  w-full mt-8">
            <div className="flex">
              <div className="flex-1 mb-6 flex-col px-4 lg:px-10">
                {assets?.map(({ title, icon, amount, symbol }) => (
                  <div className="mb-4 flex flex-col items-start justify-start gap-x-4">
                    <p className="text-xl font-bold text-dark-700 flex gap-1">
                      <span>{symbol}</span>
                      <Mask>{amount}</Mask>
                    </p>
                    <p className="mt-1 text-sm font-medium text-dark-300">
                      {title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-1 items-start justify-end gap-x-4 px-4 md:px-10">
                <MaskButton />

                <IconButton
                  icon={
                    <Icon
                      icon="ChartUp-OutLined"
                      size={20}
                      className="text-dark-600"
                    />
                  }
                  className="border-dark-200"
                  onClick={showChart}
                />
              </div>
            </div>

            <div className="flex-col justify-between border-t border-b-dark-50 px-4 pt-6 md:px-10">
              <div className="flex items-center justify-between gap-x-4">
                <p className="text-sm text-dark-300">
                  {panelDashboard.allOrders} (
                  {toPrice(
                    (userStats?.result.orders_value.OTC?.total_orders?.count ??
                      0) +
                      (userStats?.result.orders_value.P2P?.total_orders
                        ?.count ?? 0),
                  )}
                  )
                </p>
                <p className="text-sm lg:text-base font-bold text-dark-600 flex gap-1">
                  USDT
                  <Mask>
                    {toPrice(
                      maxDecimal(
                        Number(
                          userStats?.result.orders_value.OTC?.total_orders
                            ?.estimate_value.usdt ?? 0,
                        ) +
                          Number(
                            userStats?.result.orders_value.P2P?.total_orders
                              ?.estimate_value.usdt ?? 0,
                          ),
                        2,
                      ),
                    )}
                  </Mask>
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-x-4">
                <p className="text-sm text-dark-300">
                  {panelDashboard.allChanges} (
                  {toPrice(
                    userStats?.result.orders_value.CONVERT?.total_orders
                      .count ?? 0,
                  )}
                  )
                </p>
                <p className="text-sm lg:text-base font-bold text-dark-600 flex gap-1">
                  USDT
                  <Mask>
                    {toPrice(
                      userStats?.result.orders_value.CONVERT?.total_orders
                        .estimate_value.usdt ?? 0,
                    )}
                  </Mask>
                </p>
              </div>
            </div>
            <div className="mt-6 lg:mt-4 flex items-center justify-between gap-x-3 px-4 md:px-10">
              <Button
                onClick={async () =>
                  await router.push('/panel/wallet/toman-deposit')
                }
                className="flex-1 border-none bg-primary-500 text-base font-normal text-white"
              >
                {panelDashboard.deposit}
              </Button>
              <Button
                onClick={async () =>
                  await router.push('/panel/wallet/toman-withdraw')
                }
                className="flex-1 border-none bg-dark-500 font-normal text-white"
              >
                {panelDashboard.withdrawal}
              </Button>
            </div>
          </Card>

          <Card classNames="flex flex-col w-full justify-center mt-8 md:py-6 py-6 lg:py-4">
            <div className="flex items-center justify-between px-4 md:px-8">
              <p className="text-base text-dark-800">
                {panelDashboard.transactionFees}
              </p>
              <Button variant="text" className="!px-0">
                <Link href={'/panel/my-account/commission'}>
                  {panelDashboard.moreInfo}
                </Link>
              </Button>
            </div>
            <div className="my-6 h-[2px] w-full border-t-2 border-t-dark-100 bg-dark-50 opacity-30" />

            <div className="flex items-center justify-between gap-x-4 px-4 md:px-8">
              <p className="text-sm text-dark-300">{panelDashboard.feeLevel}</p>
              <Chip
                label={toPersianDigits(
                  commission?.['commission-level-name'] ?? '',
                )}
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-x-1 px-4 md:px-8">
              <p className="text-sm text-dark-300">
                {panelDashboard.tradingVolume}
              </p>
              <p className="text-sm font-bold text-dark-600 flex gap-1">
                <Mask>
                  {toPrice(
                    maxDecimal(commission?.['dollar-equivalent-30-days'], 2),
                  )}
                </Mask>
                <span>{panelDashboard.dollar}</span>
              </p>
            </div>
          </Card>
          <Card classNames="flex flex-col w-full justify-center mt-8 md:px-8 px-4 md:py-8 py-5">
            <Link
              href={'/panel/referrals'}
              className="flex flex-col rounded-lg "
            >
              <div className="flex items-center justify-center gap-x-4">
                <Icon icon="Money-TwoTone" size={32} />
                <div>
                  <h2 className="text-xl font-bold text-dark-700">
                    {panelDashboard.earnMoney}
                  </h2>
                  <p className="mt-4 text-xs leading-5 font-medium text-dark-500">
                    {panelDashboard.shareInviteLink}
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
      <BalanceHistoryModal />
    </>
  );
};

export default ChartSection;
