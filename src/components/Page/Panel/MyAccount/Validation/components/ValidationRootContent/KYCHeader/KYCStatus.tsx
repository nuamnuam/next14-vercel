import { Chip } from '@/components/Common';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { getLang } from '@/utils';
import React from 'react';

export type ILevel = Record<string, string>;

const [kyc] = getLang(['kyc']);

export const levels: ILevel = {
  'Level 0': kyc.levelZero,
  'Level 1': kyc.levelOne,
  'Level 2': kyc.levelTwo,
};

const KYCStatus = () => {
  const [myAccount] = useLang(['myAccount']);

  const { isDesktop } = useBreakpoint();
  const { data } = useProfile();
  const { kyc_info } = data || {};

  return (
    <Chip
      variant="secondary"
      size="sm"
      classNames="bg-dark-500 !text-white"
      label={
        isDesktop
          ? `${myAccount.currentLevel}:  ${
              kyc_info?.level === 'Level 0'
                ? myAccount.levelZero
                : kyc_info?.level === 'Level 1'
                ? myAccount.levelOne
                : myAccount.levelTwo
            }`
          : `${levels[kyc_info?.level as string]}`
      }
    />
  );
};

export default KYCStatus;
