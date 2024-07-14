import React, { forwardRef, useMemo } from 'react';

import { Chip, Icon, LabelValue, Table } from '@/components';
import { toPersianDigits, toPrice, toStraightNumber } from '@/utils';
import { useCommissionLevels } from '@/requests/panel/commission/getCommissionLevels';
import { ICommissionLevel } from '@/types/commission';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { Profile } from '@/types/profile';

export type RowItem = {
  level: string | React.ReactNode;
  levelVolume: string | React.ReactNode;
  volume: string;
  p2p: string;
  otc: string;
  convert: string;
};

const Trade = () => {
  const [global, commisson] = useLang(['global', 'commisson']);

  const { isDesktop } = useBreakpoint();
  const { data: commissionData, isLoading, isFetching } = useCommissionLevels();
  const { data: profileData } = useProfile();

  const headerItems = useMemo(() => {
    return [
      {
        title: commisson.level,
        name: 'level',
        width: 'hidden lg:block w-1/5',
        classNames: 'text-center',
        columnClassNames: 'text-xs text-dark-600 px-8',
      },
      {
        title: commisson.levelVolume,
        name: 'levelVolume',
        width: 'block lg:hidden w-[35%]',
        classNames: 'text-center',
        columnClassNames: 'text-right text-xs text-dark-600',
      },
      {
        title: commisson.tradeVolume,
        name: 'volume',
        width: 'hidden lg:block w-1/5',
        classNames: 'text-center',
        columnClassNames: 'text-center text-xs text-dark-600',
      },
      {
        title: isDesktop ? commisson.advancedTradeFee : commisson.advancedTrade,
        name: 'p2p',
        width: 'w-1/4 lg:w-1/5',
        classNames: 'text-center',
        columnClassNames: 'text-center text-xs text-dark-600',
      },
      {
        title: isDesktop ? commisson.advancedTradeFee : commisson.instantTrade,
        name: 'otc',
        width: 'w-1/4 lg:w-1/5',
        classNames: 'text-center',
        columnClassNames: 'text-center text-xs text-dark-600',
      },
      {
        title: isDesktop ? commisson.convertFeeDiscount : commisson.convert,
        name: 'convert',
        width: 'w-[10%] lg:w-1/5',
        classNames: 'text-center',
        columnClassNames: 'text-center text-xs text-dark-600',
      },
    ];
  }, [isDesktop]);

  const transformedRows = () => {
    return commissionData?.result.map((row: ICommissionLevel) => {
      return {
        level: (
          <div className="flex items-center justify-center">
            <span className="whitespace-pre">{toPersianDigits(row.title)}</span>
            {row.title === profileData?.commission['commission-level-name'] && (
              <Chip
                label={commisson.currentLevel}
                classNames="mr-2 whitespace-pre"
                size="sm"
              />
            )}
          </div>
        ),
        levelVolume: (
          <div className="flex flex-col items-center">
            <div className="mb-2 flex items-center gap-1">
              {row.title ===
                profileData?.commission['commission-level-name'] && (
                <Icon
                  icon="CheckCircle-OutLined"
                  className="text-primary-600"
                  size={16}
                />
              )}
              <span>{toPersianDigits(row.title)}</span>
            </div>
            <span className="flex">
              {`${toPrice(row.min_trade_range)} ${commisson.to} ${toPrice(
                row.max_trade_range,
              )} ${commisson.dollar}`}
            </span>
          </div>
        ),
        volume: (
          <span className="flex justify-center">
            {`${toPrice(row.min_trade_range)} ${commisson.to} ${toPrice(
              row.max_trade_range,
            )} ${commisson.dollar}`}
          </span>
        ),
        p2p: (
          <div className="flex flex-col gap-2">
            <span>
              {commisson.maker}:{' '}
              {toPersianDigits(
                toStraightNumber(row.p2p_transaction_commission.maker),
              )}
              ٪
            </span>
            <span>
              {commisson.taker}:{' '}
              {toPersianDigits(
                toStraightNumber(row.p2p_transaction_commission.taker),
              )}
              ٪
            </span>
          </div>
        ),
        otc: `٪${toPersianDigits(
          toStraightNumber(row.otc_transaction_commission_discount),
        )}`,
        convert: `٪${toPersianDigits(
          toStraightNumber(row.convert_commission_discount),
        )}`,
      };
    });
  };

  return (
    <div>
      <div className="py-6 px-4 md:px-6">
        <h1 className="mt-0 mb-4 font-medium text-dark-800">
          {commisson.tradesFee}
        </h1>
        <p className="m-0 text-sm leading-6 text-dark-600">
          {global.loremIpsum}
        </p>
      </div>
      {isDesktop ? (
        <Table
          data={transformedRows() || []}
          headerItems={headerItems}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      ) : (
        <ResponsiveTable
          data={commissionData?.result ?? []}
          profileData={profileData}
        />
      )}
    </div>
  );
};

export default Trade;

interface ResTableProps {
  data: ICommissionLevel[];
  profileData?: Profile;
}

const ResponsiveTable = forwardRef<HTMLDivElement, ResTableProps>(
  ({ data, profileData }, ref) => {
    const [global, commisson] = useLang(['global', 'commisson']);

    return (
      <div className="px-4 sm:px-6 pb-4 [&>div:not(:last-child)]:mb-4">
        {data?.map((item, index) => (
          <div className="p-4 border border-dark-50 rounded-lg" key={index}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-dark-500 font-medium">
                {toPersianDigits(item.title)} (
                {`${toPrice(item.min_trade_range)} ${commisson.to} ${toPrice(
                  item.max_trade_range,
                )} ${commisson.dollar}`}
                )
              </span>
              {item.title ===
                profileData?.commission['commission-level-name'] && (
                <Chip
                  label={commisson.yourCurrentLevel}
                  classNames="mr-2 whitespace-pre"
                  size="sm"
                />
              )}
            </div>
            <LabelValue
              classNames="mb-2"
              valueClassNames="!font-normal"
              label={`${commisson.advancedTradeFeeMaker}:`}
              value={`٪${toPersianDigits(
                toStraightNumber(item.p2p_transaction_commission.maker),
              )}`}
            />
            <LabelValue
              classNames="mb-2"
              valueClassNames="!font-normal"
              label={`${commisson.advancedTradeFeetaker}:`}
              value={`٪${toPersianDigits(
                toStraightNumber(item.p2p_transaction_commission.taker),
              )}`}
            />
            <LabelValue
              classNames="mb-2"
              valueClassNames="!font-normal"
              label={`${commisson.instantTradeFeeDiscount}:`}
              value={`٪${toPersianDigits(
                toStraightNumber(item.otc_transaction_commission_discount),
              )}`}
            />
            <LabelValue
              valueClassNames="!font-normal"
              label={`${commisson.convertFeeDiscount}:`}
              value={`٪${toPersianDigits(
                toStraightNumber(item.convert_commission_discount),
              )}`}
            />
          </div>
        ))}
      </div>
    );
  },
);
