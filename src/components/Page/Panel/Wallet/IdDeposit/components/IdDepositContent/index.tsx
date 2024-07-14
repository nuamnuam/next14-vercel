import React from 'react';
import clsx from 'classnames';
import { useRouter } from 'next/router';

import RestrictAlertCTA, {
  NO_KYC_REASON,
} from '@/components/Common/RestrictAlertCTA';
import {
  Alert,
  Icon,
  IconButton,
  InputAlert,
  ResponsivePageHeader,
  Spinner,
  StaticInput,
} from '@/components/Common';
import { useBreakpoint, useLang } from '@/hooks';
import { toPersianDigits } from '@/utils';
import { useUserLimitations } from '@/requests/panel/wallet/getUserLimitations';
import { useFiatIdDepositInfo } from '@/requests/panel/wallet/deposit/getFiatIdDepositInfo';
import { useTransactionHistoryStore } from '@/store';

import IdDepositHistoryTable from '../IdDepositHistoryTable';

const IdDepositContent = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const { isLoading: limitationLoading, fiatLimitations } =
    useUserLimitations();
  const { isLoading: infoLoading, data: depositInfo } = useFiatIdDepositInfo(
    fiatLimitations?.id_payment.status,
  );

  if (limitationLoading || infoLoading)
    return (
      <>
        <PageHeader />
        <div className="flex items-center justify-center py-12 lg:bg-white rounded-b-lg shadow-sm">
          <Spinner className="mt-6" />
        </div>
      </>
    );

  if (!fiatLimitations?.id_payment.status) {
    return (
      <>
        <PageHeader />
        <div className="mx-auto lg:mx-0 sm:w-[462px] lg:w-full my-6 lg:my-0 lg:py-8 lg:bg-white rounded-b-lg px-4 sm:px-8 lg:px-10">
          {fiatLimitations?.id_payment.reason === NO_KYC_REASON ? (
            <RestrictAlertCTA />
          ) : (
            <Alert
              variant="danger"
              message={fiatLimitations?.id_payment.text}
            />
          )}
        </div>
      </>
    );
  }
  if (!fiatLimitations?.deposit.status) {
    return (
      <>
        <PageHeader />
        <div className="mx-auto lg:mx-0 sm:w-[462px] lg:w-full my-6 lg:my-0 lg:py-8 lg:bg-white rounded-b-lg px-4 sm:px-8 lg:px-10">
          {fiatLimitations?.deposit.reason === NO_KYC_REASON ? (
            <RestrictAlertCTA />
          ) : (
            <Alert variant="danger" message={fiatLimitations?.deposit.text} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <div className="flex w-full flex-col-reverse lg:flex-row bg-transparent lg:bg-white rounded-b-lg lg:shadow-sm px-4 sm:px-8 lg:px-0">
        <div className="mx-auto mt-4 w-full rounded-lg bg-white sm:w-[462px] lg:mx-0 lg:mt-0 lg:w-1/2 lg:bg-transparent lg:py-8 lg:px-10">
          {!isDesktop && <MobileTabs />}
          <div className="p-4 sm:px-12 sm:py-8 lg:p-0">
            <div className="mb-4">
              <StaticInput
                value={toPersianDigits(depositInfo?.result.bank_account.iban)}
                label={wallet.targetIban}
                multiLine
                align="left"
                caption={
                  <InputAlert
                    message={`${wallet.account} ${depositInfo?.result.bank_account.bank_name} ${wallet.name} ${depositInfo?.result.bank_account.owner}`}
                    className="mt-2"
                  />
                }
              />
            </div>
            <div className="mb-4">
              <StaticInput
                value={toPersianDigits(depositInfo?.result.payment_id)}
                label={wallet.depositId}
                multiLine
                align="left"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full sm:w-[462px] lg:mx-0 lg:w-1/2 lg:py-8 lg:px-10">
          <Alert
            slug={{
              feature: 'wallet',
              section: 'fiat-deposit-with-id',
            }}
          />
        </div>
      </div>
      {isDesktop && <IdDepositHistoryTable />}
    </>
  );
};

export default IdDepositContent;

const MobileTabs = () => {
  const [wallet] = useLang(['wallet']);

  const router = useRouter();
  return (
    <div className="flex justify-start">
      <div className="relative w-full flex items-center justify-between whitespace-pre border-b border-dark-50">
        {[
          {
            id: 'tomanDeposit',
            label: wallet.fastـDeposit,
            href: '/panel/wallet/toman-deposit',
          },
          {
            id: 'idDeposit',
            label: wallet.depositWithId,
            href: '/panel/wallet/id-deposit',
          },
        ].map((item) => (
          <span
            key={item.id}
            className={clsx(
              'w-full cursor-pointer px-6 pb-4 pt-6 text-center',
              item.id === 'idDeposit' ? 'text-primary-500' : 'text-dark-500',
            )}
            onClick={async () =>
              await (item.id !== 'idDeposit' && router.push(item.href))
            }
          >
            {item.label}
          </span>
        ))}
        <div className="absolute bottom-0 left-0 h-px w-1/2 bg-primary-400" />
      </div>
    </div>
  );
};

const PageHeader = () => {
  const [wallet] = useLang(['wallet']);

  const router = useRouter();
  const { set_type, setOperation } = useTransactionHistoryStore();

  return (
    <ResponsivePageHeader
      title={wallet.tomanDeposit}
      onBack={() => router.back()}
      extra={
        <IconButton
          className="border-dark-200 text-dark-600"
          size="lg"
          icon={<Icon icon="History-OutLined" size={16} />}
          onClick={() => {
            setOperation('deposit');
            set_type('fiat');
            router.push('/panel/wallet/transactions-list');
          }}
        />
      }
    />
  );
};
