import React, { useEffect, useState } from 'react';
import clsx from 'classnames';
import { useLang, useProfile } from '@/hooks';
import {
  Card,
  Icon,
  BoxDivider,
  ResponsivePageHeader,
  Button,
} from '@/components/Common';
import { useRouter } from 'next/router';
import IdentityDocument from './IdentityDocument';
import ConfirmAuthority from './ConfirmAuthority';
import Stepper from './Stepper';
import UploadValidationProviderWrapper, {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from './UploadValidationProvider';
import Link from 'next/link';

const ValidationLevelTwoContent: React.FC = () => {
  const [kyc, global] = useLang(['kyc', 'global']);

  const router = useRouter();
  const { data: userInfo } = useProfile();
  const [step, setStep] = useState('national-card-image');
  const { selfieStep } = useUploadValidationProvider();

  useEffect(() => {
    if (
      userInfo?.status?.national_card_image === 'Unaccepted' ||
      userInfo?.status?.national_card_image === 'Unfilled'
    ) {
      setStep('national-card-image');
    } else {
      setStep('authority');
    }
  }, [userInfo]);

  const getContent = () => {
    switch (step) {
      case 'national-card-image':
        return <IdentityDocument />;
      case 'authority':
        return <ConfirmAuthority />;
      default:
        return null;
    }
  };

  const renderTitle = () => {
    if (
      userInfo?.status?.national_card_image !== 'Unaccepted' &&
      userInfo?.status?.national_card_image !== 'Unfilled'
    ) {
      return kyc.confirmAuthority;
    }
    return kyc.upgradeToLevel2;
  };

  return (
    <>
      <ResponsivePageHeader
        title={renderTitle()}
        extra={
          <Link href="/panel/my-account/validation">
            <Button variant="secondary">{global.cancel}</Button>
          </Link>
        }
      />
      <div className="px-4 sm:px-8 lg:p-0">
        {selfieStep !== SELFIE_STEPS.CONGRATS && (
          <div className="mb-8 lg:flex items-center justify-between gap-6 hidden">
            <span
              className="flex cursor-pointer items-center"
              onClick={() => {
                router.push('/panel/my-account/validation');
              }}
            >
              <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
              <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
                {kyc.upgradeToLevel2}
              </h1>
            </span>
          </div>
        )}
        <Card
          classNames={clsx(
            'w-full lg:w-1/2 flex flex-col mx-auto lg:mx-0 !mt-0 max-w-[462px] lg:max-w-full',
            selfieStep !== SELFIE_STEPS.CONGRATS && 'mt-8',
          )}
        >
          <div className="flex w-full flex-col items-center justify-between ">
            {selfieStep !== SELFIE_STEPS.CONGRATS && (
              <div className="w-full">
                <Stepper />
                <BoxDivider />
              </div>
            )}
            <div
              className={
                'w-full px-4 pt-6 pb-7 sm:pt-8 sm:px-10 lg:px-12 sm:pb-10'
              }
            >
              {getContent()}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UploadValidationProviderWrapper(ValidationLevelTwoContent);
