import React, { useEffect } from 'react';
import { useBreakpoint, useLang } from '@/hooks';
import { Button, Icon } from '@/components/Common';
import DesktopTable from './DesktopTable';
import ResponsiveTable from './ResponsiveTable';
import { useRouter } from 'next/router';
import { useInviteCodeList } from '@/requests/panel/referrals/getInviteCodeList';
import { externalData, toPersianDigits } from '@/utils';
import { useReferralInfo } from '@/requests/panel/referrals/getReferralInfo';

const RefferalCodesLog = () => {
  const [referral] = useLang(['referral']);

  const router = useRouter();
  const { isDesktop } = useBreakpoint();

  const { data: inviteCodes } = useInviteCodeList();
  const { data: referralInfo } = useReferralInfo();

  useEffect(() => {
    externalData.set(undefined);
  }, []);

  const onClick = () => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        refferal_modify: 'new',
      },
    });
  };
  return (
    <div className="rounded-lg bg-white">
      <div className="flex justify-between gap-6 border-b border-dark-50 py-5 px-4 lg:border-none lg:px-6">
        <div className="flex flex-1 flex-col justify-between lg:flex-row lg:items-center">
          <span className="leading-6 text-dark-800">
            {referral.yourInviteCodes}
          </span>
          <span className="text-xs leading-5 text-dark-400">
            {toPersianDigits(
              (referralInfo?.result.max_invite_code_limit ?? 0) -
                (inviteCodes?.result.length ?? 0),
            )}{' '}
            {referral.from}{' '}
            {toPersianDigits(referralInfo?.result.max_invite_code_limit)}{' '}
            {referral.remainedCap}
          </span>
        </div>
        <Button
          variant="dark"
          className="lg:!px-8"
          startIcon={<Icon icon="Plus-OutLined" size={16} />}
          onClick={onClick}
          disabled={
            inviteCodes?.result &&
            referralInfo?.result &&
            inviteCodes?.result.length >=
              referralInfo?.result.max_invite_code_limit
          }
        >
          {referral.createNewCode}
        </Button>
      </div>
      {isDesktop ? (
        <DesktopTable data={inviteCodes?.result} />
      ) : (
        <ResponsiveTable data={inviteCodes?.result} />
      )}
    </div>
  );
};

export default RefferalCodesLog;
