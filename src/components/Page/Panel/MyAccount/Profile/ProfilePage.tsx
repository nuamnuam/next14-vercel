import React, { useEffect } from 'react';

import { useProfileMutation } from '@/requests/panel/my-account/profile/getProfile';

import PersonalInfo from './PersonalInfo';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { ListLoader } from '@/components/Common';
import Header from './Components/Header';
import { useRouter } from 'next/router';

const ProfilePage: React.FC = () => {
  const [myAcount] = useLang(['myAccount']);

  const { data: profileData, isLoading } = useProfile();
  const { isDesktop } = useBreakpoint();
  const router = useRouter();

  return (
    <>
      {!isDesktop && (
        <Header
          title={myAcount.userProfile}
          onBack={async () => await router.push('/panel/my-account')}
        />
      )}
      <div className="w-full lg:max-w-[524px]">
        {isLoading && (
          <div className="py-10">
            <ListLoader />
          </div>
        )}
        {!!profileData && <PersonalInfo />}
      </div>
    </>
  );
};

export default ProfilePage;
