import { useRouter } from 'next/router';
import classNames from 'classnames';

import { Button, Icon } from '@/components/Common';
import { toPersianDigits, toPrice } from '@/utils';

import Wrapper from './components/Wrapper';
import { useLang } from '@/hooks';

const PaymentResultPage: React.FC = () => {
  const [global] = useLang(['global']);

  const router = useRouter();

  return (
    <Wrapper
      header={global.paymentResult}
      icon={<Icon icon="PasswordCheck-TwoTone" size={20} />}
    >
      <div className="my-6 w-full text-center">
        <span
          className={classNames('text-bold text-red-500', {
            '!text-primary-500': router.query.status === 'success',
          })}
        >
          {router.query?.status === 'success'
            ? global.successPayment
            : global.failedPayment}
        </span>
      </div>
      <div className="my-2 w-full flex justify-between">
        <div className="flex flex-col">
          <span className="text-bold">{global.transactionAmount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-bold">
            {router.query.amount
              ? toPrice(router.query.amount as string)
              : '-----'}
          </span>
        </div>
      </div>
      <div className="my-2 mb-4 w-full flex justify-between">
        <div className="flex flex-col">
          <span className="text-bold">{global.trackingCode}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-bold">
            {router.query.trackingcode
              ? toPersianDigits(router.query.trackingcode as string)
              : '-----'}
          </span>
        </div>
      </div>
      <Button
        fullWidth
        size="lg"
        className="mb-2"
        onClick={async () =>
          await router.push(
            `arzinja://WalletNavigator/transaction_id=${router.query.trackingcode}\&amount=${router.query.amount}\&status=${router.query.status}`,
          )
        }
      >
        {global.backToApp}
      </Button>
    </Wrapper>
  );
};

export default PaymentResultPage;
