import React, { useMemo } from 'react';
import clsx from 'classnames';
import Step from '../Step';
import { useLang, useProfile } from '@/hooks';

const Stepper = () => {
  const [kyc] = useLang(['kyc']);

  const { data: userInfo } = useProfile();

  const renderStepTwoClassName = useMemo(() => {
    if (
      userInfo?.status.national_card_image === 'Accepted' ||
      userInfo?.status.national_card_image === 'Edited'
    )
      return 'bg-primary-500';
    else {
      return 'bg-blue-500';
    }
  }, [userInfo]);

  const renderStepThreeClassName = useMemo(() => {
    if (
      userInfo?.status?.national_card_image === 'Unfilled' ||
      userInfo?.status?.national_card_image === 'Unaccepted'
    ) {
      return 'bg-dark-300';
    }
    if (
      userInfo?.status?.face_image === 'Accepted' ||
      userInfo?.status?.face_video === 'Accepted'
    ) {
      return 'bg-primary-500';
    }
    return 'bg-blue-500';
  }, [userInfo]);

  return (
    <div className="pt-6 px-4 pb-4 sm:pt-8 sm:px-10 sm:pb-6 lg:pt-8 lg:px-12">
      <div className="relative">
        <div className="absolute h-[1px] top-2.5 right-0 w-full bg-dark-100" />
        <div className="relative flex w-full items-center justify-between">
          <div className="flex item-center gap-2 px-2 bg-white">
            <Step value="1" className={renderStepTwoClassName} />
            <p
              className={clsx(
                'text-sm font-medium whitespace-pre text-dark-600',
              )}
            >
              {kyc.identificationDocument}
            </p>
          </div>
          <div className="flex item-center gap-2 pr-2 bg-white">
            <Step value="2" className={renderStepThreeClassName} />
            <p
              className={clsx(
                'text-sm font-medium whitespace-pre',
                userInfo?.status?.national_card_image === 'Accepted' ||
                  userInfo?.status?.national_card_image === 'Edited'
                  ? 'text-dark-600'
                  : 'text-dark-300',
              )}
            >
              {kyc.confirmAuthority}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
