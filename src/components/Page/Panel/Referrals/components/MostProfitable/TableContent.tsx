import React, { useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import clsx from 'classnames';

import { getLang, toPersianDigits, toPrice } from '@/utils';
import { Chip, EmptyTable, ListLoader } from '@/components/Common';
import { useHighestEarningList } from '@/requests/panel/referrals/getHighestEarningList';
import { type TableHeaderItem } from '@/components/TableLayout/types';
import { useLang } from '@/hooks';

interface Props {
  currentMonth: boolean;
}

const [referral] = getLang(['referral']);

const TableContent: React.FC<Props> = ({ currentMonth }) => {
  const [referral] = useLang(['referral']);

  const { data, isLoading } = useHighestEarningList({
    currnet_month: currentMonth ? 1 : 0,
  });

  const transformedData = useCallback(() => {
    return data?.result.map((item, index) => ({
      index: toPersianDigits(index + 1),
      userMobile: toPersianDigits(item.user_mobile_no),
      rewards: `IRT ${toPrice(item.user_rewarded_earned_irt)}`,
      usages: (
        <Chip
          label={`${toPersianDigits(item.user_codes_usage)} ${referral.person}`}
          variant="secondary"
          size="sm"
          colorized
          classNames="w-fit px-6"
        />
      ),
    }));
  }, [data]);

  return (
    <div>
      <div className="flex bg-dark-50/50 py-3 px-4">
        {headerItems.map((item) => (
          <div
            className={clsx(
              'text-xs text-dark-600',
              item?.classNames,
              item?.width,
            )}
          >
            {item.title}
          </div>
        ))}
      </div>
      {isLoading ? (
        <ListLoader className="!py-20" />
      ) : data?.result?.length ? (
        transformedData()?.map((row: any, rowIndex: number) => (
          <div
            key={rowIndex}
            className="flex w-full flex-wrap items-center border-b border-dark-50 p-4 hover:bg-dark-50"
          >
            {(Object.keys(row) as Array<keyof typeof row>).map(
              (cellName, cellIndex) => (
                <div
                  className={clsx(
                    headerItems[cellIndex]?.width,
                    headerItems[cellIndex]?.columnClassNames,
                  )}
                  key={`${rowIndex}-${cellIndex}`}
                >
                  {false ? (
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
        ))
      ) : (
        <EmptyTable />
      )}
    </div>
  );
};

export default TableContent;

const headerItems: TableHeaderItem[] = [
  {
    title: referral.rank,
    name: 'index',
    width: 'w-1/12 lg:w-[6%]',
    classNames: 'text-center ml-auto',
    columnClassNames: 'text-xs text-dark-400 text-center ml-auto',
  },
  {
    title: referral.account,
    name: 'userMobile',
    width: 'w-[30%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center dir-ltr',
  },
  {
    title: referral.rewardsSum,
    name: 'rewards',
    width: 'w-[30%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: referral.introduced,
    name: 'usages',
    width: 'lg:w-[12%]',
    classNames: 'text-center mr-auto',
    columnClassNames: 'flex justify-center mr-auto',
  },
];
