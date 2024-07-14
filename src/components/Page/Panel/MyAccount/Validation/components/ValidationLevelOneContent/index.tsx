import { useState, useEffect } from 'react';
import clsx from 'classnames';
import { useLang, useProfile } from '@/hooks';
import { useRouter } from 'next/router';
import {
  Card,
  Icon,
  BoxDivider,
  ResponsivePageHeader,
  Button,
} from '@/components/Common';
import PersonalInfoForm from './PersonalInfoForm';
import BankInfoForm from './BankInfoForm';
import LevelOneCongrats from './LevelOneCongrats';
import Stepper from './Stepper';
import Link from 'next/link';

const ValidationLevelOneContent = () => {
  const [kyc, global] = useLang(['kyc', 'global']);

  const router = useRouter();
  const { data: userInfo } = useProfile();
  const [step, setStep] = useState('personal-info');

  useEffect(() => {
    if (!userInfo?.kyc_info?.details?.['personal-info']) {
      setStep('personal-info');
    } else if (!userInfo?.kyc_info?.details?.['financial-info']) {
      setStep('financial-info');
    } else {
      setStep('congrats');
    }
  }, [userInfo]);

  const getContent = () => {
    switch (step) {
      case 'personal-info':
        return <PersonalInfoForm />;
      case 'financial-info':
        return <BankInfoForm />;
      case 'congrats':
        return <LevelOneCongrats />;
      default:
        return null;
    }
  };

  const isInCongratsStep =
    userInfo?.kyc_info?.details['personal-info'] &&
    userInfo?.kyc_info?.details['financial-info'];

  return (
    <>
      <ResponsivePageHeader
        title={kyc.levelOneAuthentication}
        extra={
          !isInCongratsStep && (
            <Link href="/panel/my-account/validation">
              <Button variant="secondary">{global.cancel}</Button>
            </Link>
          )
        }
      />
      <div className="px-4 sm:px-8 lg:p-0">
        {step !== 'congrats' && (
          <div className="mb-8 lg:flex items-center justify-between gap-6 hidden">
            <span
              className="flex cursor-pointer items-center"
              onClick={() => {
                router.back();
              }}
            >
              <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
              <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
                {kyc.levelOneAuthentication}
              </h1>
            </span>
          </div>
        )}
        <Card
          classNames={clsx(
            'w-full lg:w-1/2 flex flex-col mx-auto lg:mx-0 !mt-0 max-w-[462px] lg:max-w-full',
            step !== 'congrats' && 'mt-8',
          )}
        >
          <div className="flex w-full flex-col items-center justify-between ">
            {step !== 'congrats' && (
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

export default ValidationLevelOneContent;
