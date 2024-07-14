import React, { useState } from 'react';
import clsx from 'classnames';
import moment from 'jalali-moment';

import {
  SuccessReferralLevelsResponse,
  useReferralLevels,
} from '@/requests/panel/referrals/getReferralLevels';
import { useReferralContent } from '@/requests/referral';
import { Chip, Card, Spinner, Tabs } from '@/components';
import { getLang, toPersianDigits } from '@/utils';

import TableContent from '../../Panel/Referrals/components/MostProfitable/TableContent';
import { months } from '../../Panel/Referrals/components/MostProfitable';
import { useLang } from '@/hooks';

const [referral] = getLang(['referral']);

const Rewards = () => {
  const [referral] = useLang(['referral']);

  const [mostProfitable, setMostProfitable] = useState('current_month');
  const { data: referralContent, isLoading } = useReferralContent();
  const { data: levelsList } = useReferralLevels();

  const tabItems = [
    {
      label: months[Number(moment().locale('fa').format('M')) - 1],
      name: 'current_month',
    },
    {
      label: referral.all,
      name: 'all',
    },
  ];

  if (!referralContent || isLoading || !levelsList)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Spinner />
      </div>
    );

  const { MemberCB_SH, RewardCB_SH } = referralContent.data.attributes;

  return (
    <div className="block gap-x-10 xl:gap-x-28 lg:flex">
      <div className="w-full flex-1 lg:max-w-[416px]">
        <h2 className="text-center md:text-right text-2xl md:text-[28px] font-black text-dark-700 whitespace-nowrap">
          {RewardCB_SH.title}
        </h2>
        <h3
          className="mt-4 text-sm text-center md:text-right font-medium text-dark-500 leading-6"
          dangerouslySetInnerHTML={{ __html: RewardCB_SH.description }}
        />

        <div className="mt-8 flex flex-col [&>*:last-child]:border-none">
          {mapRewards(levelsList.result).map(({ num, percent, level }) => (
            <div
              className={clsx(
                'flex w-full items-center gap-x-6 justify-between border-b-[1px] border-b-dark-100 py-5',
              )}
            >
              <span className="w-1/3 text-right font-medium whitespace-nowrap text-dark-500">
                {num}
              </span>
              <div className="flex w-1/3 items-center justify-center">
                <Chip
                  classNames="bg-primary-500 [&>span]:text-white w-fit whitespace-nowrap"
                  label={level}
                  variant="success"
                />
              </div>
              <span className="w-1/3 text-left text-dark-500 font-bold text-[24px]">
                {percent}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-2 mt-12 w-full lg:mt-0 lg:max-w-[796px]">
        <h2 className="text-center md:text-right text-2xl md:text-[28px] font-black text-dark-700">
          {MemberCB_SH.title}
        </h2>
        <h3
          className="mt-4 text-center md:text-right text-sm font-medium text-dark-500"
          dangerouslySetInnerHTML={{ __html: MemberCB_SH.description }}
        />

        <Card classNames="mt-8 shadow-card">
          <div className="flex items-center justify-between px-2 py-3 md:px-6">
            <p className="text-base font-semibold text-dark-600">
              {referral.theHighestPaidAmbassadors}
            </p>
            <Tabs
              items={tabItems}
              onChange={setMostProfitable}
              className="!w-fit !pb-0"
              selected={mostProfitable}
            />
          </div>

          <TableContent currentMonth={mostProfitable === 'current_month'} />

          <div className="flex items-center justify-center py-6">
            <span className="text-dark-700 text-sm font-medium">
              {referral.joinUs}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;

function mapRewards(rewards: SuccessReferralLevelsResponse['result']) {
  return rewards.map(
    ({
      level_min_limited,
      level_max_limited,
      level_name,
      level_earn_percent,
    }) => {
      return {
        num: levelListText(level_min_limited, level_max_limited),
        level: `${toPersianDigits(level_name)}`,
        percent: `٪${toPersianDigits(level_earn_percent)}`,
      };
    },
  );
}

function levelListText(minNum: number, maxNum: number) {
  if (minNum <= 0) {
    return `${referral.lessThan} ${toPersianDigits(maxNum)} ${referral.person}`;
  }

  if (maxNum >= 250) {
    return `${referral.moreThan} ${toPersianDigits(maxNum)} ${referral.person}`;
  }

  return `${toPersianDigits(minNum)} ${referral.till} ${toPersianDigits(
    maxNum,
  )} ${referral.person}`;
}
