import { useRouter } from 'next/router';
import { useState } from 'react';
import { Icon, Button, IconButton } from '@/components/Common';
import ChangeMobileNumberForm from '@/components/Page/Panel/MyAccount/Profile/ContactInfoForms/ChangeMobileNumberForm';
import { useLang } from '@/hooks';

const ResponsiveChangeMobileNumber: React.FC = () => {
  const [global, myAccount] = useLang(['global', 'myAccount']);

  const [step, setStep] = useState(1);
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between bg-white px-4 sm:px-8 h-[76px] border-b border-dark-100">
        <div
          onClick={() => {
            router.push('/panel/my-account/profile');
            // if (step === 1) {
            //   router.back();
            // } else {
            //   setStep(1);
            // }
          }}
          className="flex items-center justify-end gap-x-4"
        >
          <Button className="p-0" variant="text">
            <Icon
              icon={'Right-OutLined'}
              size={18}
              className="[&>*]:fill-dark-200"
            />
          </Button>

          <h2 className="text-lg font-medium text-dark-600">
            {step === 1 && global.changeMobileNumber}
            {step === 2 && global.confirmCurrentMobile}
            {step === 3 && myAccount.confirmNewMobile}
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
        <ChangeMobileNumberForm step={step} setStep={setStep} />
      </div>
    </div>
  );
};

export default ResponsiveChangeMobileNumber;
