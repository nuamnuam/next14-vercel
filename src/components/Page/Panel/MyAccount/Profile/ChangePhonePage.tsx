import { useRouter } from 'next/router';

import { Icon, Button, IconButton } from '@/components/Common';
import ChangePhoneNumberForm from '@/components/Page/Panel/MyAccount/Profile/ContactInfoForms/ChangePhoneNumberForm';
import { useProfileStore } from '@/store';
import { useLang } from '@/hooks';

const ResponsiveChangePhoneNumber: React.FC = () => {
  const [global] = useLang(['global']);

  const router = useRouter();
  const { profile: profileData } = useProfileStore();

  return (
    <div>
      <div className="flex items-center justify-between bg-white px-4 sm:px-8 h-[76px] border-b border-dark-100">
        <div
          className="flex items-center justify-end gap-x-4"
          onClick={() => {
            router.back();
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
            {global.changePhoneNumber}
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
        <ChangePhoneNumberForm
          reFetchProfile={() => {}}
          isEdit={!!profileData?.phone_number}
        />
      </div>
    </div>
  );
};

export default ResponsiveChangePhoneNumber;
