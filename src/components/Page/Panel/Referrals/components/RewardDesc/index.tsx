import React from 'react';
import DescItem from './DescItem';
import { useLang } from '@/hooks';

const RewardDesc = () => {
  const [referral] = useLang(['referral']);

  const items = [
    {
      title: referral.shareInviteLink,
      description: referral.shareInviteLinkDesc,
    },
    {
      title: referral.registerArzinja,
      description: referral.registerArzinjaDesc,
    },
    {
      title: referral.getReward,
      description: referral.getRewardDesc,
    },
  ];

  return (
    <div className="rounded-lg bg-white py-6 px-4 sm:px-6 lg:p-8">
      <span className="mb-6 block text-[18px] font-medium text-dark-600">
        {referral.howGetReward}
      </span>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
        {items.map((item, index) => (
          <div className="flex-1">
            <DescItem
              index={index + 1}
              title={item.title}
              description={item.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardDesc;
