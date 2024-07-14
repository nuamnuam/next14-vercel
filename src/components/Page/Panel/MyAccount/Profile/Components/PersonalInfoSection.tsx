import React from 'react';
import ProfileSection from '../ProfileSection';
import { maskPhoneNum, toPersianDigits } from '@/utils';
import { useLang, useProfile } from '@/hooks';
import PersonalInfoItem from './PersonalInfoItem';

const PersonalInfoSection = () => {
  const [global] = useLang(['global']);

  const { data: profileData } = useProfile();

  return (
    <ProfileSection
      title={`${profileData?.first_name} ${profileData?.last_name}`}
      itemComponent={PersonalInfoItem}
      header={
        <div className="flex w-full items-center justify-start px-6 py-7">
          <p className="text-base font-medium leading-6 text-dark-800	">
            {global.personalInfo}
          </p>
        </div>
      }
      items={[
        {
          name: global.name,
          value: profileData?.first_name,
          icon: 'Account-TwoTone',
        },
        {
          name: global.lastName,
          value: profileData?.last_name,
          icon: 'Security-TwoTone',
        },
        {
          name: global.birthDay,
          value: toPersianDigits(profileData?.birthday),
          icon: 'Setting-TwoTone',
        },
        {
          name: global.nationalityCode,
          value: toPersianDigits(
            maskPhoneNum(profileData?.national_code ?? ''),
          ),
          icon: 'Bell-TwoTone',
        },
      ]}
    />
  );
};

export default PersonalInfoSection;
