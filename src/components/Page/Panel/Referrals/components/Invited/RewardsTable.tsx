import React, { useCallback, useRef, useState } from 'react';
import moment from 'jalali-moment';
import clsx from 'classnames';

import { getLang, toPersianDigits, toPrice } from '@/utils';
import { EmptyTable, ListLoader, Pagination } from '@/components';
import { useGiftsList } from '@/requests/panel/referrals/getGiftsList';
import { useBreakpoint, useIntersectionObserver } from '@/hooks';
import { type TableHeaderItem } from '@/components/TableLayout/types';

const [referral] = getLang(['referral']);

const RewardsTable: React.FC = () => {
  const { isDesktop } = useBreakpoint();

  const elementRef = useRef(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGiftsList({
    page,
    hasInfinitScoll: !isDesktop,
  });

  useIntersectionObserver(elementRef, () => {
    if (isFetching) return;
    setPage((prev) => prev + 1);
  });

  const transformedData = useCallback(() => {
    return data?.result.map((item) => ({
      gift: `IRT ${toPrice(item.gift_amount_irt)}`,
      date: toPersianDigits(
        moment(item.gift_date).locale('fa').format('YYYY/M/D'),
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
      <div
        className={clsx(
          'transition duration-300',
          isDesktop && isFetching && 'opacity-50',
        )}
      >
        {isLoading && isDesktop && <ListLoader className="!py-20" />}
        {transformedData()?.map((row: any, rowIndex: number) => (
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
                  {row[cellName]}
                </div>
              ),
            )}
          </div>
        ))}
        {!isDesktop && data?.pagination?.total_pages != page && (
          <ListLoader ref={elementRef} className="pb-6 !pt-4" />
        )}
        {!data?.result.length && !isFetching && <EmptyTable />}
      </div>
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

export default RewardsTable;

const headerItems: TableHeaderItem[] = [
  {
    title: referral.earnedGift,
    name: 'gift',
    width: 'w-1/2',
    classNames: 'text-right lg:pr-4',
    columnClassNames: 'text-xs text-dark-600 text-right lg:pr-4',
  },
  {
    title: referral.earnDate,
    name: 'date',
    width: 'w-1/2',
    classNames: 'text-left lg:pl-4',
    columnClassNames: 'text-xs text-dark-600 text-left lg:pl-4',
  },
];
