import { Icon } from '@/components/Common';
import ClickablePopover from '@/components/Common/ClickablePopover';
import React, { useMemo, useState } from 'react';
import PopoverContent from './PopoverContent';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';
import { externalData, toPersianDigits, toPrice } from '@/utils';
import { useReferralLevels } from '@/requests/panel/referrals/getReferralLevels';
import Stepper from './Stepper';
import { useModal } from '@/hooks/useModal';
import InvitedModal, { invitedModalName } from '../Invited/InvitedModal';
import { useBreakpoint, useLang } from '@/hooks';

const Gamification = () => {
  const [referral] = useLang(['referral']);

  const { isDesktop } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const { data: referralInfo } = useReferralInfo();
  const { data: levelsList } = useReferralLevels();

  const { showSyncModal: showInvitedModal } = useModal(invitedModalName);

  const sortedLevels = useMemo(() => {
    return (
      levelsList?.result.sort((a, b) => a.level_order - b.level_order) ?? []
    );
  }, [levelsList]);

  const stepItems = useMemo(() => {
    return (
      sortedLevels.map((level) => ({
        title: toPersianDigits(level.level_earn_percent),
        tooltip: `${toPersianDigits(level.level_min_limited)} ${
          referral.to
        } ${toPersianDigits(level.level_max_limited)} ${referral.person}`,
      })) ?? []
    );
  }, [sortedLevels]);

  const activeStep = useMemo(() => {
    return (
      sortedLevels.findIndex(
        (level) => referralInfo?.result.current_level_id === level.level_id,
      ) + 1
    );
  }, [sortedLevels, referralInfo]);

  const subtitle = useMemo(() => {
    const from = sortedLevels?.[0]?.level_earn_percent;
    const to = sortedLevels?.[sortedLevels.length - 1]?.level_earn_percent;

    return `${referral.byFriendInvites} ${referral.from} ${toPersianDigits(
      from,
    )}٪ ${referral.to} ${toPersianDigits(to)}٪ ${referral.transactionsReward}`;
  }, [sortedLevels]);

  return (
    <div className="rounded-lg bg-white">
      <div className="p-4 sm:px-6 lg:px-4">
        <div
          className="mb-[14px] flex w-full justify-between border-b border-dark-100 pb-[14px]"
          onClick={() => {
            if (isDesktop) return;
            externalData.set('rewards');
            showInvitedModal();
          }}
        >
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-medium leading-5 text-dark-600">
              {referral.rewardsSum}
            </span>
            <span className="text-xs font-medium leading-5 text-dark-400">
              IRT {toPrice(referralInfo?.result.total_rewarded_earned_irt ?? 0)}
            </span>
          </div>
          <div className="block lg:hidden">
            <Icon icon="Left-OutLined" size={16} className="text-dark-400" />
          </div>
        </div>
        <div
          className="mb-[14px] flex w-full items-start justify-between border-b border-dark-100 pb-[14px]"
          onClick={() => {
            if (isDesktop) return;
            externalData.set('invited');
            showInvitedModal();
          }}
        >
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-medium leading-5 text-dark-600">
              {referral.inviteds}
            </span>
            <span className="text-xs font-medium leading-5 text-dark-400">
              {toPrice(referralInfo?.result.total_invited ?? 0)}{' '}
              {referral.person}
            </span>
          </div>
          <div className="block lg:hidden">
            <Icon icon="Left-OutLined" size={16} className="text-dark-400" />
          </div>
          <div className="hidden lg:block">
            <ClickablePopover
              id="gamification"
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              anchorOrigin={{ vertical: 18, horizontal: 'right' }}
              hideBackdrop={false}
              open={open}
              setOpen={setOpen}
              anchor={
                <Icon
                  icon="InfoCircle-OutLined"
                  size={16}
                  className="cursor-pointer text-dark-400"
                />
              }
            >
              <PopoverContent data={referralInfo?.result} />
            </ClickablePopover>
          </div>
        </div>
        <div className="mb-7">
          <div className="flex w-full items-start justify-between">
            <span className="mb-4 text-xs font-medium leading-5 text-dark-600 lg:mb-2">
              {referral.earnRewardLevel}
            </span>
          </div>
          <Stepper items={stepItems} activeStep={activeStep} />
        </div>
        <div>
          <span className="text-xs leading-[18px] text-dark-400">
            {subtitle}
          </span>
        </div>
      </div>
      <InvitedModal />
    </div>
  );
};

export default Gamification;
