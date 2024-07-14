import { useLang, useProfile } from '@/hooks';
import React from 'react';
import ProfileSection from '../ProfileSection';
import ContactInfoItem from './ContactInfoItem';
import { toPersianDigits } from '@/utils';

const ContactSection: React.FC<{
  contactInfoList: Array<{
    name: string;
    value: string | null;
    onClick: () => void;
    href: string;
  }>;
}> = ({ contactInfoList }) => {
  const [global] = useLang(['global']);

  const { data: profileData } = useProfile();

  const persianContantInfo = () => {
    const x = contactInfoList?.map((item, index) =>
      index === 2
        ? item
        : {
            ...item,
            value: toPersianDigits(item.value),
          },
    );
    return x;
  };

  return (
    <ProfileSection
      title={`${profileData?.first_name} ${profileData?.last_name}`}
      itemComponent={ContactInfoItem}
      header={
        <div className="flex w-full items-center justify-start px-6 py-7">
          <p className="text-base font-medium leading-6 text-dark-800	">
            {global.contactInfo}
          </p>
        </div>
      }
      items={
        profileData?.kyc_info?.level === 'Level 0'
          ? persianContantInfo()
              .slice(0, 1)
              .concat(persianContantInfo().slice(2, 3))
          : persianContantInfo()
      }
    />
  );
};

export default ContactSection;
