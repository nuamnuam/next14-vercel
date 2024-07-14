import React from 'react';
import SuccessPayment from './components/SuccessPayment';
import FailedPayment from './components/FailedPayment';
import { useRouter } from 'next/router';
import { useLang } from '@/hooks';
import { Icon, IconButton, ResponsivePageHeader } from '@/components/Common';
import { useTransactionHistoryStore } from '@/store';

const PaymentResultContent: React.FC = () => {
  const [global] = useLang(['global']);

  const { query, push } = useRouter();
  const { set_type } = useTransactionHistoryStore();

  return (
    <>
      <ResponsivePageHeader
        title={global.tomanDeposit}
        onBack={() => push('/panel/wallet/toman-deposit')}
        extra={
          <IconButton
            className="border-dark-200 text-dark-600"
            size="lg"
            icon={<Icon icon="History-OutLined" size={16} />}
            onClick={() => {
              set_type('fiat');
              push('/panel/wallet/transactions-list');
            }}
          />
        }
      />
      <div className="px-4 sm:px-8 lg:px-0">
        {query.status === 'success' && <SuccessPayment />}
        {query.status === 'failed' && <FailedPayment />}
      </div>
    </>
  );
};

export default PaymentResultContent;
