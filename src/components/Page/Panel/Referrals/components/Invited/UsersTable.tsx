import React, { useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import clsx from 'classnames';
import moment from 'jalali-moment';

import { externalData, getLang, toPersianDigits, toPrice } from '@/utils';
import { EmptyTable, Icon, ListLoader, Pagination } from '@/components';
import { useModal } from '@/hooks/useModal';
import { useInvitedUsersList } from '@/requests/panel/referrals/getInvitedUsersList';
import { useBreakpoint, useIntersectionObserver } from '@/hooks';
import { type TableHeaderItem } from '@/components/TableLayout/types';

import InvitedDetailsModal, {
  invitedDetailsModalName,
} from './InvitedDetailsModal';

interface Props {
  inviteCode: string;
}

const [referral] = getLang(['referral']);

const UsersTable: React.FC<Props> = ({ inviteCode }) => {
  const [page, setPage] = useState(1);
  const elementRef = useRef(null);

  const { isDesktop } = useBreakpoint();
  const { showSyncModal } = useModal(invitedDetailsModalName);

  const { data, isLoading, isFetching } = useInvitedUsersList({
    invite_code: inviteCode,
    hasInfinitScoll: !isDesktop,
    page,
  });

  useEffect(() => {
    setPage(1);
  }, [inviteCode]);

  useIntersectionObserver(elementRef, () => {
    if (isFetching) return;
    setPage((prev) => prev + 1);
  });

  const transformedData = useCallback(() => {
    return data?.result.map((item) => ({
      userMobile: toPersianDigits(item.user_mobile_no),
      registerDate: toPersianDigits(
        moment(item.user_register_date)
          .locale('fa')
          .format('HH:mm:ss YYYY/M/D'),
      ),
      inviteCode: item.invite_code,
      inviterPercent: `٪${toPersianDigits(item.inviter_commission_percent)}`,
      invitedPercent: `٪${toPersianDigits(item.invited_commission_percent)}`,
      reward: `IRT ${toPrice(item.code_rewarded_earned_irt)}`,
      isKyc: (
        <Icon
          icon={
            item.user_kyc_is_done
              ? 'CheckCircle-OutLined'
              : 'CloseCircle-OutLined'
          }
          size={16}
          className={
            item.user_kyc_is_done ? 'text-primary-500' : 'text-danger-500'
          }
        />
      ),
      actions: (
        <Icon icon="Left-OutLined" size={12} className="text-dark-400" />
      ),
    }));
  }, [data]);

  return (
    <div>
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
              onClick={() => {
                if (isDesktop) return;
                externalData.set(data?.result?.[rowIndex]);
                showSyncModal();
              }}
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
          ))}
          {!isDesktop && data?.pagination?.total_pages != page && (
            <ListLoader ref={elementRef} className="pb-6 !pt-4" />
          )}
          {!data?.result.length && !isFetching && <EmptyTable />}
        </div>
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
      <InvitedDetailsModal />
    </div>
  );
};

export default UsersTable;

const headerItems: TableHeaderItem[] = [
  {
    title: referral.account,
    name: 'userMobile',
    width: 'w-[40%] lg:w-[15%]',
    classNames: 'text-right lg:text-center',
    columnClassNames: 'dir-ltr text-xs text-dark-400 text-right lg:text-center',
  },
  {
    title: referral.regiterDate,
    name: 'registerDate',
    width: 'w-[15%]',
    classNames: 'hidden lg:block text-center',
    columnClassNames: 'hidden lg:block text-xs text-dark-400 text-center',
  },
  {
    title: referral.inviteCode,
    name: 'inviteCode',
    width: 'w-[15%]',
    classNames: 'hidden lg:block text-center',
    columnClassNames: 'hidden lg:block text-xs text-dark-400 text-center',
  },
  {
    title: referral.yourShare,
    name: 'inviterPercent',
    width: 'w-[15%]',
    classNames: 'hidden lg:block text-center',
    columnClassNames: 'hidden lg:block text-xs text-dark-400 text-center',
  },
  {
    title: referral.friendShare,
    name: 'invitedPercent',
    width: 'w-[15%]',
    classNames: 'hidden lg:block text-center',
    columnClassNames: 'hidden lg:block text-xs text-dark-400 text-center',
  },
  {
    title: referral.reward,
    name: 'reward',
    width: 'w-[40%] lg:w-[15%]',
    classNames: 'text-center',
    columnClassNames: 'text-xs text-dark-400 text-center',
  },
  {
    title: referral.authentication,
    name: 'isKyc',
    width: 'w-[10%]',
    classNames: 'hidden lg:block',
    columnClassNames: 'hidden lg:flex justify-center',
  },
  {
    title: '',
    name: 'actions',
    width: 'w-[20%]',
    classNames: 'flex lg:hidden',
    columnClassNames: 'flex justify-end lg:hidden lg:justify-center',
  },
];
