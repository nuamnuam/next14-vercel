import { type FC, type Dispatch, type SetStateAction } from 'react';

import { Button, Icon, GuideButton, Alert } from '@/components/Common';

import { InfoCard, AddCardForm } from './index';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';
interface Props {
  setPage: Dispatch<SetStateAction<string>>;
  formType?: 'card' | 'iban';
  reFetchCards: (type: 'card' | 'iban') => void;
}

const AddCardPage: FC<Props> = (props) => {
  const [myAccount] = useLang(['myAccount']);

  const { setPage, formType, reFetchCards } = props;
  const router = useRouter();
  const { form } = router.query;

  return (
    <div className="lg:p-0">
      <div className="hidden lg:flex items-center justify-between bg-white pt-6 pb-6 pr-7 pl-7 lg:bg-transparent lg:p-0">
        <div
          className="flex items-center justify-end gap-x-2 cursor-pointer"
          onClick={() => {
            if (form) {
              router.back();
              return;
            }
            setPage('list');
          }}
        >
          <Button className="p-0" variant="text">
            <Icon
              icon={'Right-OutLined'}
              size={20}
              className="[&>*]:fill-dark-200"
            />
          </Button>

          <h2 className="text-xl font-medium text-dark-600">
            {formType === 'card'
              ? myAccount.addCardNumber
              : myAccount.addcardIban}
          </h2>
        </div>
        <GuideButton />
      </div>
      <div className="lg:py-6 px-4 lg:px-0">
        <div className="mr-auto lg:gap-x-[144px] ml-auto mt-0 flex flex-col justify-between rounded-lg bg-white sm:max-w-[524px] lg:flex-row px-4 py-6 sm:py-8 sm:px-12 lg:px-10 lg:py-8 lg:w-full lg:max-w-full">
          <div className="w-full lg:w-6/12">
            <Alert
              slug={{
                feature: 'user-account',
                section:
                  formType === 'card'
                    ? 'user-bank-account-card'
                    : 'user-bank-account-iban',
              }}
              className="lg:hidden"
            />
            <AddCardForm
              formType={formType}
              setPage={setPage}
              reFetchCards={reFetchCards}
            />
          </div>
          <div className="w-full lg:w-6/12">
            <InfoCard formType={formType} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCardPage;
