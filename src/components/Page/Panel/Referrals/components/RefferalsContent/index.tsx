import React from 'react';

import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';

import RefferalCode from '../RefferalCode';
import Gamification from '../Gamification';
import RewardDesc from '../RewardDesc';
import RefferalCodesLog from '../RefferalCodesLog';
import MostProfitable from '../MostProfitable';
import Invited from '../Invited';
import Inviter from '../Inviter';
import ShareRefferalCodeModal from '../RefferalCode/ShareRefferalCodeModal';
import { Icon, IconButton, ResponsivePageHeader } from '@/components/Common';
import { useRouter } from 'next/router';
import { useModal } from '@/hooks/useModal';
import { invitedModalName } from '../Invited/InvitedModal';

const RefferalsContent = () => {
  const [referral] = useLang(['referral']);

  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const { showSyncModal } = useModal(invitedModalName);
  const { data } = useReferralInfo();
  const { data: userInfo } = useProfile();

  return (
    <>
      <ResponsivePageHeader
        title={referral.inviteFriends}
        onBack={() => router.back()}
        extra={
          <IconButton
            className="border-dark-200 text-dark-600"
            size="lg"
            icon={<Icon icon="History-OutLined" size={16} />}
            onClick={showSyncModal}
          />
        }
      />
      <div className="px-4 sm:px-8 lg:p-0">
        <div className="w-full rounded-lg px-0 py-4 lg:py-0 pb-[6rem] sm:px-4 md:pb-28">
          <div className="flex flex-col gap-6 rounded-lg lg:w-full lg:flex-row lg:gap-8">
            <div className="w-full lg:w-3/5 shadow-sm rounded-lg">
              <RefferalCode />
            </div>
            <div className="w-full lg:w-2/5 shadow-sm rounded-lg">
              <Gamification />
            </div>
          </div>
          <div className="mt-6 lg:mt-8 shadow-sm rounded-lg">
            <RewardDesc />
          </div>
          <div className="mt-6 lg:mt-8 shadow-sm rounded-lg">
            <RefferalCodesLog />
          </div>
          {isDesktop && (
            <div className="mt-6 lg:mt-8 shadow-sm rounded-lg">
              <Invited />
            </div>
          )}
          <div className="mt-6 lg:mt-8 shadow-sm rounded-lg">
            <MostProfitable />
          </div>
          {!data?.result.registration_invite_code_expired &&
          !userInfo?.invite_code ? (
            <div className="mt-6 lg:mt-8 shadow-sm rounded-lg">
              <Inviter
                remainingHours={
                  data?.result.registration_invite_code_max_hours || ''
                }
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <ShareRefferalCodeModal />
      </div>
    </>
  );
};

export default RefferalsContent;
