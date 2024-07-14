import { useState, useEffect } from 'react';
import clsx from 'classnames';

import {
  Paper,
  Icon,
  Button,
  EmptyTable,
  Pagination,
  Spinner,
} from '@/components';
import { type IActivity } from '@/types/myAccount';
import { useBreakpoint, useLang } from '@/hooks';
import { formatedDate } from '@/utils/date-format';
import { useActivityLoginsQuery } from '@/requests/panel/my-account/security/getActivitiesLogins';
import { useGetActivitiesActionsMutation } from '@/requests/panel/my-account/security/getActivitiesActions';
import { useSecurityStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { getLang } from '@/utils';

import ActivityHistoryModal from './ActiveHistoryModal';

const modalName = 'activityHistoryPage';

const [security] = getLang(['security']);

const ActivitiesTable: React.FC = () => {
  const [security] = useLang(['security']);

  const [tab, setTab] = useState<'login-history' | 'security-changes'>(
    'login-history',
  );

  const { setselectedDevice } = useSecurityStore();
  const { showSyncModal } = useModal(modalName);

  const showItem = (activity: IActivity) => {
    showSyncModal();
    setselectedDevice(activity);
  };

  return (
    <Paper classNames="p-0 flex-col flex items-center lg:mt-8 ">
      <div className="flex w-full items-center justify-between lg:px-6 lg:py-4">
        <h2 className="text-md hidden w-full p-6 lg:p-0 text-right font-medium text-dark-800 lg:block">
          {security.activityHistory}
        </h2>
        <div className="flex gap-x-2 pl-7 pt-4 pr-4 pb-4 lg:p-0">
          <Button
            variant={tab === 'login-history' ? 'secondary' : 'text'}
            fullWidth
            onClick={() => {
              setTab('login-history');
            }}
            size="md"
          >
            {security.loginHistory}
          </Button>
          <Button
            variant={tab === 'security-changes' ? 'secondary' : 'text'}
            fullWidth
            onClick={() => {
              setTab('security-changes');
            }}
            size="md"
          >
            {security.securityChanges}
          </Button>
        </div>
      </div>
      {tab === 'login-history' ? (
        <LoginTable showItem={showItem} />
      ) : (
        <SecurityTable showItem={showItem} />
      )}
      <ActivityHistoryModal
        title={
          tab === 'login-history'
            ? security.loginDetails
            : security.securityChangesDetails
        }
      />
    </Paper>
  );
};

export default ActivitiesTable;

const securityHeaders: string[] = [
  security.date,
  security.device,
  security.actionType,
  security.ip,
];

const resSecurityHeaders: string[] = [security.actionType, security.date, ''];

const loginHeaders: string[] = [security.device, security.date, security.ip];
const resLoginHeaders: string[] = [security.device, security.date, ''];

const LoginTable: React.FC<{
  showItem: (activity: IActivity, tab: string) => void;
}> = ({ showItem }) => {
  const [page, setPage] = useState<number>(1);

  const { isDesktop } = useBreakpoint();

  const { data: logins, isLoading } = useActivityLoginsQuery(page);

  return (
    <>
      <table className="w-full table-auto">
        <thead className="bg-[#F2F4FA]/[.5] lg:table-header-group">
          <tr>
            {(isDesktop ? loginHeaders : resLoginHeaders)?.map((th, index) => (
              <th
                className="py-4 text-xs font-normal text-dark-600 px-6 lg:px-0 text-right lg:text-center"
                key={index}
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>

        {!isLoading && (
          <tbody>
            {logins?.result?.map((tr) => (
              <tr
                key={tr.id}
                className="border-b-2 border-dark-50"
                onClick={() => {
                  if (isDesktop) return;
                  showItem(tr, 'login-history');
                }}
              >
                <td className="w-2/5 lg:w-1/3 h-[72px] px-4 lg:pl-2 lg:pr-10 two-line-truncate table-cell text-right text-xs font-normal text-dark-600 lg:text-center">
                  {isDesktop
                    ? tr?.agent
                      ? tr.agent?.length > 35
                        ? '...' + tr.agent.substring(0, 35)
                        : tr.agent
                      : ''
                    : tr?.agent
                    ? tr.agent?.length > 15
                      ? '...' + tr.agent.substring(0, 15)
                      : tr.agent
                    : ''}
                </td>
                <td className="w-2/5 lg:w-1/3 h-[72px] px-2 two-line-truncate table-cell text-xs font-normal text-dark-600 text-center">
                  {formatedDate({ date: tr?.created_at, locale: 'fa' })}
                </td>

                <td className="w-1/3 h-[72px] px-2 two-line-truncate hidden text-right text-xs font-normal text-dark-600 lg:table-cell lg:text-center">
                  {tr?.ip}
                </td>
                <td className="w-1/5 lg:w-1/3 h-[72px] pl-4 lg:pr-2 lg:pl-10 text-left lg:hidden">
                  <Icon
                    icon={'Left-OutLined'}
                    className="text-dark-400"
                    size={16}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}
      {!isLoading && (!logins?.result?.length ? <EmptyTable /> : null)}
      <div className="mt-9 mb-8  items-center justify-center hidden lg:flex">
        <Pagination
          count={logins?.pagination?.total_pages || 1}
          page={logins?.pagination.current_page}
          onChange={(page) => setPage(page)}
          classNames="mb-4 sm:mb-0"
        />
      </div>
    </>
  );
};

const SecurityTable: React.FC<{
  showItem: (activity: IActivity, tab: string) => void;
}> = ({ showItem }) => {
  const { isDesktop } = useBreakpoint();
  const {
    mutateAsync: asyncGetActivitiesActionsAsync,
    data: activities,
    isPending: isLoading,
  } = useGetActivitiesActionsMutation();

  useEffect(() => {
    asyncGetActivitiesActionsAsync();
  }, []);

  return (
    <>
      <table className="w-full table-auto">
        <thead className="bg-[#F2F4FA]/[.5] lg:table-header-group">
          <tr>
            {(isDesktop ? securityHeaders : resSecurityHeaders)?.map(
              (th, index) => (
                <th
                  className="py-4 text-xs font-normal text-dark-600 px-6 lg:px-0 text-right lg:text-center"
                  key={index}
                >
                  {th}
                </th>
              ),
            )}
          </tr>
        </thead>
        {!isLoading && (
          <tbody>
            {activities?.result.map((tr) => (
              <tr
                key={tr.id}
                className="border-b-2 border-dark-50"
                onClick={() => {
                  if (isDesktop) return;
                  showItem(tr, 'security-changes');
                }}
              >
                {isDesktop && (
                  <td
                    className={clsx(
                      'two-line-truncate w-[20%] lg:w-[20%] px-2 h-[72px] table-cell text-right text-xs font-normal text-dark-600 lg:text-center',
                    )}
                  >
                    {formatedDate({ date: tr?.created_at, locale: 'fa' })}
                  </td>
                )}
                {!isDesktop && (
                  <td className="two-line-truncate w-1/2 px-2 h-[72px] pr-4 table-cell text-right text-xs font-normal text-dark-600 lg:text-center">
                    {tr?.action_type_text}
                  </td>
                )}
                {!isDesktop && (
                  <td
                    className={clsx(
                      'two-line-truncate w-[40%] lg:w-[20%] px-2 h-[72px] table-cell text-right text-xs font-normal text-dark-600 lg:text-center',
                    )}
                  >
                    {formatedDate({ date: tr?.created_at, locale: 'fa' })}
                  </td>
                )}
                {isDesktop && (
                  <td className="two-line-truncate w-[40%] px-2 h-[72px] table-cell text-right text-xs font-normal text-dark-600 lg:text-center">
                    {tr?.agent
                      ? tr.agent?.length > 35
                        ? '...' + tr.agent.substring(0, 35)
                        : tr.agent
                      : ''}
                  </td>
                )}
                {isDesktop && (
                  <td className="two-line-truncate w-[20%] px-2 h-[72px] table-cell text-right text-xs font-normal text-dark-600 lg:text-center">
                    {tr?.action_type_text}
                  </td>
                )}
                {isDesktop && (
                  <td className="two-line-truncate w-[20%] px-2 h-[72px] hidden text-right text-xs font-normal text-dark-600 lg:table-cell lg:text-center">
                    {tr?.ip}
                  </td>
                )}
                <td className="text-left lg:hidden w-[10%] pr-2 pl-4 h-[72px]">
                  <Icon
                    icon={'Left-OutLined'}
                    className="text-dark-400"
                    size={17}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}
      {!isLoading && (!activities?.result?.length ? <EmptyTable /> : null)}
    </>
  );
};
