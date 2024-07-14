import React, { useMemo, useState } from 'react';
import moment from 'jalali-moment';

import { Tabs } from '@/components';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

import TableContent from './TableContent';

const [referral] = getLang(['referral']);

const Invited = () => {
  const [referral] = useLang(['referral']);

  const [selectedTab, setSelectedTab] = useState('current_month');

  const tabItems = useMemo(() => {
    return [
      {
        label: months[Number(moment().locale('fa').format('M')) - 1],
        name: 'current_month',
      },
      {
        label: referral.all,
        name: 'all',
      },
    ];
  }, []);

  return (
    <div className="rounded-lg bg-white">
      <div className="flex w-full items-center justify-between py-5 px-4 lg:px-6">
        <span className="text-dark-800 ml-auto">{referral.mostPrifit}</span>
        <Tabs
          items={tabItems}
          onChange={setSelectedTab}
          className="!w-fit !pb-0"
          selected={selectedTab}
        />
      </div>
      <TableContent currentMonth={selectedTab === 'current_month'} />
    </div>
  );
};

export default Invited;

export const months = [
  referral.farvardin,
  referral.ordibehesht,
  referral.khordad,
  referral.tir,
  referral.mordad,
  referral.shahrivar,
  referral.mehr,
  referral.aban,
  referral.azar,
  referral.dey,
  referral.bahman,
  referral.esfand,
];
