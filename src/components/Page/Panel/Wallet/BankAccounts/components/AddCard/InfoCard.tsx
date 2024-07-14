import { type FC } from 'react';

import { Alert, Icon } from '@/components/Common';
import { useBanks, useLang } from '@/hooks';

interface Props {
  setPage?: (page: string) => void;
  formType?: 'iban' | 'card';
}

const InfoCard: FC<Props> = (props) => {
  const [myAccount] = useLang(['myAccount']);

  const { getBanksWithQuickWithdraw } = useBanks();

  const { formType } = props;
  return (
    <div>
      <Alert
        slug={{
          feature: 'user-account',
          section:
            formType === 'card'
              ? 'user-bank-account-card'
              : 'user-bank-account-iban',
        }}
        className="hidden lg:flex"
      />
      <div className="lg:mt-3 flex flex-col items-start justify-start gap-x-2 rounded-lg border border-dark-200 bg-dark-50 p-6 ">
        <p className="text-sm font-normal leading-6 text-dark-700	">
          {myAccount.fastTransactionableCards}
        </p>
        <div className="mt-8 grid grid-cols-5 w-full items-center justify-between gap-y-3">
          {getBanksWithQuickWithdraw().map(({ fa_name, logo }) => (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <Icon
                  icon={logo.colored.replace('azico-', '').trim()}
                  size={20}
                  className="!h-auto"
                />
              </div>
              <p className="text-dark-900 mt-2 text-xs font-medium">
                {fa_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
