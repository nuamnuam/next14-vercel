import React, { useMemo, useState } from 'react';

import { SelectInput, Tabs } from '@/components';
import { useInviteCodeList } from '@/requests/panel/referrals/getInviteCodeList';
import { externalData } from '@/utils';

import UsersTable from './UsersTable';
import RewardsTable from './RewardsTable';
import { useLang } from '@/hooks';

const InvitedContent = () => {
  const [referral] = useLang(['referral']);

  const [selectedTab, setSelectedTab] = useState(
    externalData.get() === 'rewards' ? 'rewards' : 'invited',
  );
  const [filter, setFilter] = useState('all');

  const { data: inviteCodes } = useInviteCodeList();

  const options = useMemo(() => {
    const items =
      inviteCodes?.result.map((item) => ({
        label: item.invited_code,
        value: item.invited_code,
      })) ?? [];
    return [{ label: referral.allCodes, value: 'all' }, ...items];
  }, [inviteCodes]);

  const tabItems = [
    {
      label: referral.inviteds,
      name: 'invited',
    },
    {
      label: referral.rewards,
      name: 'rewards',
    },
  ];

  return (
    <div className="rounded-lg bg-white">
      <div className="flex flex-col items-center justify-between gap-6 py-5 px-4 lg:flex-row lg:px-6">
        <Tabs
          items={tabItems}
          onChange={setSelectedTab}
          className="!pb-0"
          selected={selectedTab}
        />
        {selectedTab === 'invited' && (
          <SelectInput
            name="sort"
            options={options}
            value={filter}
            onChange={setFilter}
            classNames="!w-full lg:!w-auto"
          />
        )}
      </div>
      {selectedTab === 'invited' ? (
        <UsersTable inviteCode={filter} />
      ) : (
        <RewardsTable />
      )}
    </div>
  );
};

export default InvitedContent;
