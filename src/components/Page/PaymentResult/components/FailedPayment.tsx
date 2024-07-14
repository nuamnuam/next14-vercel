import React from 'react';
import { Button, Card, Icon } from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toPersianDigits } from '@/utils';

const FailedPayment: React.FC = () => {
  const [global] = useLang(['global']);

  const { isDesktop } = useBreakpoint();
  const { query } = useRouter();

  return (
    <Card classNames="p-10 mx-auto w-full rounded-lg bg-white sm:w-[382px] lg:mx-0 lg:w-1/2">
      <div className="flex justify-center items-center flex-col">
        <Icon
          icon="CloseCircle-Filled"
          size={64}
          className="[&>*]:fill-danger-500 mx-auto"
        />
        <h2 className="text-danger-600 text-lg my-8 font-bold">
          {global.failedPayment}
        </h2>
      </div>
      <h3 className="text-dark-800 text">{global.payBackIn72}</h3>
      <h3 className="text-dark-800 mt-8 leading-8">{global.failureReason}:</h3>
      <div className="text-dark-800 mb-4 leading-7">
        <p>
          {toPersianDigits(1)}- {global.bankError}
        </p>
        <p>
          {toPersianDigits(2)}- {global.useVpn}
        </p>
        <p>
          {toPersianDigits(3)}- {global.useNonRegisteredBankCard}
        </p>
      </div>
      <div className="flex justify-start items-start gap-x-2">
        <Icon
          icon="CloseCircle-OutLined"
          size={16}
          className="[&>*]:fill-danger-600 mt-1"
        />
        <p className="text-sm text-danger-600 leading-6">
          {global.contactArzinjaSupport}
        </p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-dark-700">{global.trakingCode}</p>
        <p className="text-sm text-dark-700">
          {toPersianDigits(query.transaction_id)}
        </p>
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

export default FailedPayment;
