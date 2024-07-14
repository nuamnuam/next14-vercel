import { useLang } from '@/hooks';
import { IReferralInfo } from '@/types/referral';
import { toPrice } from '@/utils';
import React from 'react';

interface Props {
  data?: IReferralInfo;
}

const PopoverContent: React.FC<Props> = ({ data }) => {
  const [referral] = useLang(['referral']);
  return (
    <div className="w-[265px] px-6 py-[36px] text-sm font-medium text-dark-700">
      <div className="flex items-center justify-between border-b border-dark-50 py-3">
        <span>{referral.verifiedUsers}</span>
        <span>{toPrice(data?.total_invited_with_kyc ?? 0)}</span>
      </div>
      <div className="flex items-center justify-between border-b border-dark-50 py-3">
        <span>{referral.registeredUsers}</span>
        <span>{toPrice(data?.total_invited ?? 0)}</span>
      </div>
      <div className="flex items-center justify-between border-b border-dark-50 py-3">
        <span>{referral.tradedPeople}</span>
        <span>{toPrice(data?.total_invited_with_deal ?? 0)}</span>
      </div>
      <div className="flex items-center justify-between py-3">
        <span>{referral.doneTrades}</span>
        <span>{toPrice(data?.total_invited_deals ?? 0)}</span>
      </div>
    </div>
  );
};

export default PopoverContent;
