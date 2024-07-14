import React, { useMemo } from 'react';
import { useLang, useProfile } from '@/hooks';
import { HorizontalStepper } from '@/components/Common';

const Stepper = () => {
  const [global, kyc] = useLang(['global', 'kyc']);

  const { data: userInfo } = useProfile();

  const steps: Array<{
    label: string;
    value: string;
    variant:
      | 'inactive'
      | 'inProgress'
      | 'complete'
      | 'notComplete'
      | 'error'
      | 'warning'
      | 'info'
      | 'done';
  }> = useMemo(() => {
    return [
      {
        label: global.userProfile,
        value: '1',
        variant: userInfo?.kyc_info?.details?.['personal-info']
          ? 'complete'
          : 'inProgress',
      },
      {
        label: kyc.bankInfo,
        value: '2',
        variant: userInfo?.kyc_info?.details?.['personal-info']
          ? 'inProgress'
          : 'inactive',
      },
    ];
  }, [userInfo]);

  return (
    <div className="pt-6 px-4 pb-4 sm:pt-8 sm:px-10 sm:pb-6 lg:pt-8 lg:px-12">
      <HorizontalStepper steps={steps} />
    </div>
  );
};

export default Stepper;
