import { useRouter } from 'next/router';

import { Icon, Button, IconButton } from '@/components/Common';
import ChangeAddressForm from '@/components/Page/Panel/MyAccount/Profile/ContactInfoForms/ChangeAddressForm';
import { useLang } from '@/hooks';

const ResponsiveChangeAddress: React.FC = () => {
  const [global] = useLang(['global']);

  const router = useRouter();
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
            {global.changeAddress}
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
      <div className="mx-auto max-w-[462px] p-4 ">
        <ChangeAddressForm />
      </div>
    </div>
  );
};

export default ResponsiveChangeAddress;
