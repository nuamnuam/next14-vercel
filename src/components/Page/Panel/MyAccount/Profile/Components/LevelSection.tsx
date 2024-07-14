import React from 'react';
import ProfileSection from '../ProfileSection';
import { useLang, useProfile } from '@/hooks';
import { Chip } from '@/components/Common';
import AuthItem from './AuthItem';
import { toPersianDigits } from '@/utils';

type ILevel = Record<string, string>;

const LevelSection: React.FC<{
  getStatus: () => {
    title: string;
    variant: string;
  };
}> = ({ getStatus }) => {
  const [myAccount] = useLang(['myAccount']);

  const { data: profileData } = useProfile();

  const levels: ILevel = {
    'Level 0': myAccount.levelZero,
    'Level 1': myAccount.levelOne,
    'Level 2': myAccount.levelTwo,
  };

  return (
    <ProfileSection
      header={
        <div className="flex w-full items-center justify-between pl-10 pr-6 pt-7 pb-7">
          <p
            dir="ltr"
            className="ltr text-base font-medium leading-6 text-dark-800	"
          >
            {profileData?.first_name
              ? profileData?.first_name + ' ' + profileData?.last_name
              : toPersianDigits(profileData?.mobile_number)}
          </p>
          <Chip
            variant="secondary"
            classNames="bg-dark-500 !text-white"
            label={`${myAccount.currentLevel}:  ${
              levels[profileData?.kyc_info?.level ?? 1]
            }`}
          />
        </div>
      }
      itemComponent={AuthItem}
      items={[
        {
          name: myAccount.authentication,
          status: getStatus()?.title,
          href: '/panel/my-account/validation',
          statusVariant: getStatus()?.variant,
        },
        {
          name: myAccount.commission,
          href: '/panel/my-account/commission',
          status: toPersianDigits(
            profileData?.commission['commission-level-name'] || '',
          ),
          statusVariant: 'info',
        },
      ]}
    />
  );
};

export default LevelSection;
