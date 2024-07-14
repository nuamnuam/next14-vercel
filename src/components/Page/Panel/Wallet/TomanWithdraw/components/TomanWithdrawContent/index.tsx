import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Icon,
  IconButton,
  OtpModal,
  ResponsivePageHeader,
  Spinner,
} from '@/components/Common';
import clsx from 'classnames';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import IbansInputModal from '../IbansInputModal';
import TomanWithdrawValueInput from '../TomanWithdrawValueInput';
import TomanWithdrawHistoryTable from '../TomanWithdrawHistoryTable';
import RestrictAlertCTA, {
  NO_KYC_REASON,
} from '@/components/Common/RestrictAlertCTA';
import { useUserLimitations } from '@/requests/panel/wallet/getUserLimitations';
import useFiatWithdrawStore from '@/store/useFiatWithdrawStore';
import { useEffectOnce } from 'react-use';
import useSettingValue from '@/hooks/useSettingValue';
import { toPrice } from '@/utils';
import { useResendLoginCodeMutation } from '@/requests/auth/resendLoginCodeMutation';
import { useModal } from '@/hooks/useModal';
import { otpModalName } from '@/components/Common/OtpModal';
import { useFiatWithdrawOtp } from '@/requests/panel/wallet/withdraw/fiatWithdrawOtp';
import TomanWithdrawResultModal, {
  tomanWithdrawResultModalName,
} from '../TomanWithdrawResultModal';
import { useBankIbansQuery } from '@/requests/panel/wallet/getBankIbans';
import { useGlobalStore, useTransactionHistoryStore } from '@/store';

const TomanWithdrawContent = () => {
  const [wallet] = useLang(['wallet']);

  const [otpChannel, setOtpChannel] = useState<{
    status: boolean;
    type: 'sms' | 'email' | 'google2fa';
    channel: string;
  }>();

  const { isDesktop } = useBreakpoint();
  const { isLoading, fiatLimitations } = useUserLimitations();
  const [otpCode, setOtpCode] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');

  const { data: ibans, isLoading: ibansLoading } = useBankIbansQuery();
  const { showSyncModal: showOtpModal, closeSyncModal: closeOtpModal } =
    useModal(otpModalName);

  const {
    isSyncModalOpen: isResultModalOpen,
    closeSyncModal: closeResultModal,
  } = useModal(tomanWithdrawResultModalName);

  const { userCredit } = useGlobalStore();

  const { isPending: otpCodeLoading, mutateAsync: otpCodeMutateAsync } =
    useResendLoginCodeMutation();

  const {
    isError: submitOtpError,
    isPending: submitOtpLoading,
    mutateAsync: submitOtpMutateAsync,
  } = useFiatWithdrawOtp();

  const { selectedIban, withdrawValue, setSelectedIban, resetState } =
    useFiatWithdrawStore((state) => ({
      selectedIban: state.selectedIban,
      withdrawValue: state.withdrawValue,
      setSelectedIban: state.setSelectedIban,
      resetState: state.resetState,
    }));

  const walletFiatMaxWithdraw = useSettingValue('wallet-fiat-max-withdraw');
  const walletFiatMinWithdraw = useSettingValue('wallet-fiat-min-withdraw');
  const walletFiatWithdrawPartAmount = useSettingValue(
    'wallet-fiat-withdraw-part-amount',
  );
  const walletFiatWithdrawPartFee = useSettingValue(
    'wallet-fiat-withdraw-part-fee',
  );

  useEffectOnce(() => {
    resetState();
    closeOtpModal();
    closeResultModal();
  });

  useEffect(() => {
    const defaultIban = ibans?.result.find((i) => i.is_default);
    if (!defaultIban) return;
    setSelectedIban(defaultIban);
  }, [ibans, ibansLoading]);

  useEffect(() => {
    if (isResultModalOpen) return;
    if (withdrawValue) resetState();
  }, [isResultModalOpen]);

  const calculatedFee = useMemo(() => {
    if (
      !withdrawValue ||
      !walletFiatWithdrawPartAmount ||
      !walletFiatWithdrawPartFee
    )
      return 0;
    return (
      Math.ceil(+withdrawValue / Number(walletFiatWithdrawPartAmount)) *
      Number(walletFiatWithdrawPartFee)
    );
  }, [withdrawValue, walletFiatWithdrawPartAmount, walletFiatWithdrawPartFee]);

  const resultValue = useMemo(() => {
    if (!withdrawValue) return 0;
    return +withdrawValue - +calculatedFee;
  }, [withdrawValue, calculatedFee]);

  const submitIsDisabled = useMemo(() => {
    return (
      !selectedIban ||
      !userCredit ||
      !withdrawValue ||
      !walletFiatMinWithdraw ||
      !walletFiatMaxWithdraw ||
      +withdrawValue > +userCredit ||
      +withdrawValue < +walletFiatMinWithdraw ||
      +withdrawValue > +walletFiatMaxWithdraw
    );
  }, [
    selectedIban,
    userCredit,
    withdrawValue,
    walletFiatMinWithdraw,
    walletFiatMaxWithdraw,
  ]);

  const handleSubmitForm = async (bypass: boolean = false) => {
    setOtpErrorText('');
    const { success, result } = await otpCodeMutateAsync();
    if (success && !bypass) {
      setOtpChannel(result.two_step);
      showOtpModal();
    }
  };

  const handleSubmitOtp = async () => {
    if (!otpCode) return;
    setOtpErrorText('');
    await submitOtpMutateAsync({ code: otpCode }).catch((exp) => {
      const error = exp?.result ? Object.values(exp.result)[0] : exp?.message;
      setOtpErrorText(error);
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-b-lg">
        <Spinner className="mt-6" />
      </div>
    );

  if (!fiatLimitations?.withdraw.status) {
    return (
      <>
        <PageHeader />
        <div className="px-4 sm:px-8 lg:p-0">
          <div className="mx-auto lg:mx-0 sm:w-[462px] lg:w-full my-6 lg:my-0 lg:px-10 lg:py-8 lg:bg-white rounded-b-lg">
            {fiatLimitations?.withdraw.reason === NO_KYC_REASON ? (
              <RestrictAlertCTA />
            ) : (
              <Alert
                variant="danger"
                message={fiatLimitations?.withdraw.text}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <div className="px-4 sm:px-8 lg:p-0">
        <div className="flex w-full flex-col-reverse pb-[7rem] lg:flex-row lg:rounded-b-lg lg:bg-white lg:pb-0">
          <div className="mx-auto mt-8 w-full rounded-lg bg-white sm:w-[462px] lg:mx-0 lg:mt-0 lg:w-1/2 lg:bg-transparent lg:py-8 lg:px-10">
            {!isDesktop && <MobileTabs />}
            <div className="p-4 sm:px-12 sm:py-8 lg:p-0">
              <div className="mb-4">
                <IbansInputModal
                  onSelect={setSelectedIban}
                  selectedIban={selectedIban}
                />
              </div>
              <div className="mb-6">
                <TomanWithdrawValueInput
                  min={(walletFiatMinWithdraw ?? '0') as string}
                  max={(walletFiatMaxWithdraw ?? '0') as string}
                  userCredit={userCredit?.balance_available ?? '0'}
                />
              </div>
              <div className="mb-4">
                <div className="flex w-full justify-between">
                  <span className="text-xs text-dark-300">
                    {wallet.feeAmount}
                  </span>
                  <span className="text-xs font-medium text-dark-600">
                    {toPrice(calculatedFee)} {wallet.toman}
                  </span>
                </div>
              </div>
              {resultValue || withdrawValue ? (
                <div className="mb-4">
                  <div className="flex w-full justify-between">
                    <span className="text-xs text-dark-300">
                      {wallet.receivedAmount}
                    </span>
                    <span className="text-sm font-bold text-dark-600">
                      {toPrice(resultValue > 0 ? resultValue : 0)}{' '}
                      {wallet.toman}
                    </span>
                  </div>
                </div>
              ) : null}
              <ModalFooter fullScreen>
                <Button
                  fullWidth
                  className="lg:mt-8"
                  size={isDesktop ? 'lg' : 'md'}
                  disabled={submitIsDisabled}
                  onClick={() => handleSubmitForm(false)}
                  isLoading={otpCodeLoading}
                >
                  {wallet.withdrawRequest}
                </Button>
              </ModalFooter>
            </div>
          </div>
          <div className="mx-auto w-full sm:w-[462px] lg:mt-0 lg:w-1/2 lg:py-8 lg:px-10">
            <Alert
              slug={{
                feature: 'wallet',
                section: 'fiat-withdraw',
              }}
            />
          </div>
        </div>
        <OtpModal
          title={wallet.withdraw}
          channel={otpChannel}
          isLoading={submitOtpLoading}
          onResend={() => handleSubmitForm(true)}
          onSubmit={handleSubmitOtp}
          otp={otpCode}
          onChange={setOtpCode}
          errorText={otpErrorText}
          hasError={otpCode.length === 6 && submitOtpError && !submitOtpLoading}
        />
        {isDesktop && <TomanWithdrawHistoryTable />}
        <TomanWithdrawResultModal
          calculatedFee={calculatedFee}
          resultValue={resultValue}
        />
      </div>
    </>
  );
};

export default TomanWithdrawContent;

const MobileTabs = () => {
  const [wallet] = useLang(['wallet']);

  const router = useRouter();
  return (
    <div className="flex justify-start">
      <div className="relative flex items-center justify-between whitespace-pre border-b border-dark-50 w-full sm:w-auto">
        {[
          {
            id: 'tomanWithdraw',
            label: wallet.tomanWithdraw,
            href: '/panel/wallet/toman-withdraw',
          },
          {
            id: 'cryptoWithdraw',
            label: wallet.cryptoWithdraw,
            href: '/panel/wallet/crypto-withdraw',
          },
        ].map((item) => (
          <span
            key={item.id}
            className={clsx(
              'w-full cursor-pointer px-6 pb-4 pt-6 text-center',
              item.id === 'tomanWithdraw'
                ? 'text-primary-500'
                : 'text-dark-500',
            )}
            onClick={async () =>
              await (item.id !== 'tomanWithdraw' && router.push(item.href))
            }
          >
            {item.label}
          </span>
        ))}
        <div className="absolute bottom-0 right-0 h-px w-1/2 bg-primary-400" />
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
      title={wallet.withdraw}
      onBack={() => router.back()}
      extra={
        <IconButton
          className="border-dark-200 text-dark-600"
          size="lg"
          icon={<Icon icon="History-OutLined" size={16} />}
          onClick={() => {
            set_type('fiat');
            setOperation('withdraw');
            router.push('/panel/wallet/transactions-list');
          }}
        />
      }
    />
  );
};
