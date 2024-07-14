import { useRouter } from 'next/router';
import { useState } from 'react';

import { Icon, Button, IconButton } from '@/components/Common';
import ChangeEmailForm from '@/components/Page/Panel/MyAccount/Profile/ContactInfoForms/ChangeEmailForm';
import { useProfileStore } from '@/store';
import { useLang } from '@/hooks';

const ResponsiveChangeEmail: React.FC = () => {
  const [myAccount] = useLang(['myAccount']);

  const [step, setStep] = useState(1);
  const router = useRouter();
  const { profile: profileData } = useProfileStore();

  return (
    <div>
      <div className="flex items-center justify-between bg-white px-4 sm:px-8 h-[76px] border-b border-dark-100">
        <div
          className="flex items-center justify-end gap-x-4"
          onClick={() => {
            router.push('/panel/my-account/profile');
          }}
        >
          <Button className="p-0" variant="text">
            <Icon
              icon={'Right-OutLined'}
              size={18}
              className="[&>*]:fill-dark-200"
            />
          </Button>

          <h2 className="text-lg font-medium text-dark-600">
            {profileData?.email
              ? step === 1
                ? myAccount.changeEmail
                : step === 2
                ? myAccount.confirmCurentEmail
                : myAccount.confirmNewEmail
              : step === 1
              ? myAccount.addEmailAddress
              : myAccount.confirmEmailAddress}
          </h2>
        </div>
        <IconButton
          size="lg"
          className="border-dark-200"
          icon={
            <Icon
              icon={'QuestionCircle-OutLined'}
              size={20}
              className="[&>*]:fill-dark-600"
            />
          }
        />
      </div>
      <div className="mx-auto max-w-[462px] p-4">
        <ChangeEmailForm
          step={step}
          setStep={setStep}
          isEdit={!!profileData?.email}
          currentEmail={profileData?.email}
        />
      </div>
    </div>
  );
};

export default ResponsiveChangeEmail;
