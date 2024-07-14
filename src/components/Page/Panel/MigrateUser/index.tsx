import { useRouter } from 'next/router';
import { Card, Icon, ResponsivePageHeader, Spinner } from '@/components/Common';
import { useLang, useProfile } from '@/hooks';
import PersonalInfoForm from './components/PersonalInfoForm';

const MigrateUserPage: React.FC = () => {
  const [kyc] = useLang(['kyc']);
  const router = useRouter();

  const { isLoading } = useProfile();

  if (isLoading)
    return (
      <>
        <ResponsivePageHeader
          title={kyc.completeIdentityInfo}
          onBack={() => router.back()}
        />
        <div className="px-4 sm:px-8 lg:p-0">
          <div className="mb-8 lg:flex items-center justify-between gap-6 hidden">
            <span
              className="flex cursor-pointer items-center"
              onClick={() => {
                router.back();
              }}
            >
              <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
              <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
                {kyc.completeIdentityInfo}
              </h1>
            </span>
          </div>
          <Card classNames="w-full lg:w-1/2 flex justify-center mx-auto lg:mx-0 max-w-[462px] lg:max-w-full p-12">
            <Spinner />
          </Card>
        </div>
      </>
    );

  return (
    <>
      <ResponsivePageHeader title={kyc.completeIdentityInfo} />
      <div className="px-4 sm:px-8 lg:p-0">
        <div className="mb-8 lg:flex items-center justify-between gap-6 hidden">
          <span
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.back();
            }}
          >
            <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
            <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
              {kyc.completeIdentityInfo}
            </h1>
          </span>
        </div>
        <Card classNames="w-full lg:w-1/2 flex flex-col mx-auto lg:mx-0 max-w-[462px] lg:max-w-full">
          <div className="flex w-full flex-col items-center justify-between ">
            <div
              className={
                'w-full px-4 pt-6 pb-7 sm:pt-8 sm:px-10 lg:px-12 sm:pb-10'
              }
            >
              <PersonalInfoForm />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default MigrateUserPage;
