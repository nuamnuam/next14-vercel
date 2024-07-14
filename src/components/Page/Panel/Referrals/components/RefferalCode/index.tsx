import React, { useMemo } from 'react';
import Link from 'next/link';

import { useReferralLevels } from '@/requests/panel/referrals/getReferralLevels';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';
import {
  Button,
  Chip,
  Icon,
  IconBox,
  StaticInput,
  BoxDivider,
} from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useModal } from '@/hooks/useModal';
import { shareRefferalCodeModalName } from './ShareRefferalCodeModal';
import { useInviteCodeList } from '@/requests/panel/referrals/getInviteCodeList';
import { externalData, toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

const RefferalCode = () => {
  const [referral] = useLang(['referral']);

  const { showSyncModal } = useModal(shareRefferalCodeModalName);

  const { data: referralInfo } = useReferralInfo();
  const { data: levelsList } = useReferralLevels();
  const { data: inviteCodes, isLoading: inviteCodeLoading } =
    useInviteCodeList();

  const defaultInviteCode = useMemo(() => {
    return inviteCodes?.result.find((item) => item.is_default);
  }, [inviteCodes, inviteCodeLoading]);

  const activeStep = useMemo(() => {
    return levelsList?.result.find(
      (level) => referralInfo?.result.current_level_id === level.level_id,
    );
  }, [referralInfo, levelsList]);

  return (
    <div className="rounded-lg bg-white">
      <div className="py-6 px-4 sm:px-6 lg:p-8">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <StaticInput
              label={referral.defaultInviteCode}
              value={defaultInviteCode?.invited_code}
              copyValue={defaultInviteCode?.invited_code}
              variant="outlined"
              align="left"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <StaticInput
              label={referral.defaultInviteLink}
              value={`${referralInfo?.result.invite_base_url || ''}${
                defaultInviteCode?.invited_code || ''
              }`}
              copyValue={`${referralInfo?.result.invite_base_url}${defaultInviteCode?.invited_code}`}
              variant="outlined"
              align="left"
              valueClassName="!overflow-x-hidden"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-2 lg:pt-0">
          <Link
            href={'/referral'}
            target="_blank"
            className="flex items-center lg:w-1/2"
          >
            <Icon
              icon="QuestionCircle-OutLined"
              size={18}
              className="text-dark-600"
            />
            <span className="mr-2 font-medium text-dark-600">
              {referral.terms}
            </span>
          </Link>
          <ModalFooter fullScreen className="lg:w-1/2">
            <Button
              fullWidth
              onClick={() => {
                externalData.set(defaultInviteCode);
                showSyncModal();
              }}
              startIcon={
                <Icon icon="Share-OutLined" size={16} className="text-white" />
              }
            >
              {referral.inviteCodeSharing}
            </Button>
          </ModalFooter>
        </div>
      </div>
      <BoxDivider />
      <div className="flex flex-col gap-4 py-6 px-4 sm:px-6 lg:flex-row lg:p-8">
        <div className="flex w-full items-center justify-between lg:w-1/2 lg:justify-start">
          <span className="ml-4 whitespace-pre text-sm font-medium text-dark-400">
            {referral.earnRewardLevel}
          </span>
          <Chip
            label={`٪${toPersianDigits(
              activeStep?.level_earn_percent,
            )} ${toPersianDigits(activeStep?.level_name)}`}
            colorized
          />
        </div>
        <div className="mt-4 flex w-full items-center justify-between lg:mt-0 lg:w-1/2">
          <IconBox
            title={referral.yourShare}
            desc={`٪${toPersianDigits(
              defaultInviteCode?.inviter_commission_percent,
            )}`}
            icon="SignUp-TwoTone"
          />
          <IconBox
            title={referral.friendShare}
            desc={`٪${toPersianDigits(
              defaultInviteCode?.invited_commission_percent,
            )}`}
            icon="Users-TwoTone"
          />
        </div>
      </div>
    </div>
  );
};

export default RefferalCode;
