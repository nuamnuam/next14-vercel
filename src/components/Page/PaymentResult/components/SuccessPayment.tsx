import React from 'react';
import { Button, Card, Icon } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toPersianDigits, toPrice } from '@/utils';

const SuccessPayment: React.FC = () => {
  const [global] = useLang(['global']);

  const { isDesktop } = useBreakpoint();
  const { query } = useRouter();

  const cardNumber = sessionStorage.getItem('payment-card');

  return (
    <Card classNames=" mx-auto w-full rounded-lg bg-white sm:w-[382px] lg:mx-0 lg:w-1/2 p-10">
      <div className="flex justify-center items-center flex-col">
        <Icon
          icon="CheckCircle-Filled"
          size={64}
          className="[&>*]:fill-primary-500 mx-auto"
        />
        <h2 className="text-dark-700 text-[18px] my-8 font-bold">
          {global.paymentDone}
        </h2>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-dark-700">{global.value}</p>
        <p className="text-sm text-dark-700">
          {toPrice(query.amount?.toString() || 0)} {global.toman}
        </p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-dark-700">{global.cardNumber}</p>
        <p className="text-sm text-dark-700">{toPersianDigits(cardNumber)}</p>
      </div>
      <Link href="/panel/wallet/my-wallet">
        <Button
          fullWidth
          size={isDesktop ? 'lg' : 'md'}
          variant="primary"
          className="mt-8"
        >
          {global.getWallet}
        </Button>
      </Link>
    </Card>
  );
};

export default SuccessPayment;
