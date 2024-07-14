import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useBreakpoint, useLang, useSingleBalanceCoin } from '@/hooks';
import { useRouter } from 'next/router';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import RadioGroup from '@/components/RadioGroup';
import CryptoWithdrawHistoryTable from '../CryptoWithdrawHistoryTable';
import { useCryptoWithdrawStore, useTransactionHistoryStore } from '@/store';
import ExternalWithdraw from './ExternalWithdraw';
import InternalWithdraw from './InternalWithdraw';
import { useCryptoWithdrawSubmit } from '@/requests/panel/wallet/withdraw/cryptoWithdrawSubmit';
import { useCryptoWithdrawInternalSubmit } from '@/requests/panel/wallet/withdraw/cryptoWithdrawInternalSubmit';
import { useModal } from '@/hooks/useModal';
import { otpModalName } from '@/components/Common/OtpModal';
import { useCryptoWithdrawOtp } from '@/requests/panel/wallet/withdraw/cryptoWithdrawOtp';
import { externalData, toEnglishDigits } from '@/utils';
import { useCryptoWithdrawInternalOtp } from '@/requests/panel/wallet/withdraw/cryptoWithdrawInternalOtp';
import CryptoWithdrawResultModal, {
  cryptoWithdrawResultModalName,
} from '../CryptoWithdrawResultModal';
import { useUserLimitations } from '@/requests/panel/wallet/getUserLimitations';
import RestrictAlertCTA, {
  NO_KYC_REASON,
} from '@/components/Common/RestrictAlertCTA';
import CoinsInputModal from '@/components/Common/Coins/CoinsInputModal';

export const CRYPTO_WITHDRAW_TYPES = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
};

const CryptoWithdrawContent = () => {
  const [wallet] = useLang(['wallet']);

  const [shouldRenderResultModal, setShouldRenderResultModal] = useState(false);
  const { isDesktop } = useBreakpoint();
  const [otpCode, setOtpCode] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');
  const { showSyncModal } = useModal(otpModalName);
  const { isLoading, cryptoLimitations } = useUserLimitations();
  const { closeSyncModal: closeResultModal } = useModal(
    cryptoWithdrawResultModalName,
  );

  useEffect(() => {
    closeResultModal();
  }, []);

  const [otpChannel, setOtpChannel] = useState<{
    status: boolean;
    type: 'sms' | 'email' | 'google2fa';
    channel: string;
  }>();

  const {
    mutateAsync: mutateSubmitExternal,
    isPending: submitExternalLoading,
  } = useCryptoWithdrawSubmit();

  const {
    mutateAsync: mutateExternalOtpCheck,
    isPending: externalOtpCheckLoading,
    isError: externalOtpCheckError,
  } = useCryptoWithdrawOtp();

  const {
    mutateAsync: mutateSubmitInternal,
    isPending: submitInternalLoading,
  } = useCryptoWithdrawInternalSubmit();

  const {
    mutateAsync: mutateInternalOtpCheck,
    isPending: internalOtpCheckLoading,
    isError: internalOtpCheckError,
  } = useCryptoWithdrawInternalOtp();

  const {
    withdrawType,
    selectedCoin,
    selectedNetwork,
    address,
    tag,
    withdrawValue,
    mobileNumber,
    setWithdrawType,
    setSelectedCoin,
    resetState,
  } = useCryptoWithdrawStore();

  const { data: selectedCoinApiData, isLoading: selectedCoinLoading } =
    useSingleBalanceCoin(selectedCoin?.symbol ?? 'BTC', 1, 'withdraw');

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    const externalCoin = externalData.get();
    if (!externalCoin) return;
    if (externalCoin.symbol === 'IRT') {
      externalData.set(undefined);
      return;
    }

    const resetSelectedCoin = new Promise((resolve) => {
      setSelectedCoin(externalCoin);
      resolve('');
    });

    resetSelectedCoin.then(() => {
      isDesktop && externalData.set(undefined);
    });
  }, []);

  useEffect(() => {
    if (!selectedCoinApiData) return;
    setSelectedCoin(selectedCoinApiData);
  }, [selectedCoinApiData?.symbol]);

  const withdrawIsEnabled = useMemo(() => {
    return (
      selectedCoin && selectedCoin.is_withdrawable && selectedCoin.networks
    );
  }, [selectedCoin]);

  const submitIsDisabled = useMemo(() => {
    const memoRegex =
      selectedNetwork?.memo_regex && new RegExp(selectedNetwork.memo_regex);

    if (
      !selectedCoin ||
      !Number(withdrawValue) ||
      Number(withdrawValue!) > Number(selectedCoin.balance_available) ||
      (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL &&
        Boolean(
          !selectedNetwork ||
            (selectedNetwork.min_withdrawal &&
              Number(withdrawValue) > 0 &&
              Number(withdrawValue) < selectedNetwork.min_withdrawal),
        )) ||
      (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL &&
        Boolean(
          !selectedNetwork ||
            (selectedNetwork.max_withdrawal &&
              Number(withdrawValue) > 0 &&
              Number(withdrawValue) > selectedNetwork.max_withdrawal),
        ))
    )
      return true;

    if (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL) {
      return (
        !selectedNetwork ||
        !address ||
        (!!selectedNetwork.has_tag &&
          !!memoRegex &&
          !!tag &&
          !memoRegex.test(tag))
      );
    }
    if (withdrawType === CRYPTO_WITHDRAW_TYPES.INTERNAL) {
      return !mobileNumber;
    }
  }, [
    selectedCoin,
    withdrawValue,
    withdrawType,
    selectedNetwork,
    address,
    tag,
    mobileNumber,
  ]);

  const handleSubmit = useCallback(async () => {
    if (submitIsDisabled) return;
    setOtpErrorText('');

    if (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL) {
      const { success, result } = await mutateSubmitExternal();
      if (success) {
        setOtpChannel(result);
        showSyncModal();
      }
    }
    if (withdrawType === CRYPTO_WITHDRAW_TYPES.INTERNAL) {
      const { success, result } = await mutateSubmitInternal();
      if (success) {
        setOtpChannel(result);
        showSyncModal();
      }
    }
  }, [
    withdrawType,
    selectedCoin,
    withdrawValue,
    mobileNumber,
    selectedNetwork,
    address,
  ]);

  const handleSubmitOtp = async () => {
    if (!otpCode) return;
    setOtpErrorText('');

    setShouldRenderResultModal(true);

    const payload = {
      code: toEnglishDigits(otpCode),
    };

    if (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL) {
      await mutateExternalOtpCheck(payload).catch((exp) => {
        const error = exp?.result
          ? Object.values(exp.result)?.[0]
          : exp?.message;
        if (typeof error === 'string') setOtpErrorText(error);
      });
      return;
    }
    if (withdrawType === CRYPTO_WITHDRAW_TYPES.INTERNAL) {
      mutateInternalOtpCheck(payload).catch((exp) => {
        const error = exp?.result
          ? Object.values(exp.result)?.[0]
          : exp?.message;
        if (typeof error === 'string') setOtpErrorText(error);
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-b-lg">
        <Spinner className="mt-6" />
      </div>
    );

  if (!cryptoLimitations?.withdraw.status) {
    return (
      <>
        <PageHeader />
        <div className="px-4 sm:px-8 lg:p-0">
          <div className="mx-auto lg:mx-0 sm:w-[462px] lg:w-full my-6 lg:my-0 lg:px-10 lg:py-8 lg:bg-white rounded-b-lg">
            {cryptoLimitations?.withdraw.reason === NO_KYC_REASON ? (
              <RestrictAlertCTA />
            ) : (
              <Alert
                variant="danger"
                message={cryptoLimitations?.withdraw.text}
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
              <div className="mb-8">
                <CoinsInputModal
                  selectedCoin={selectedCoin}
                  onChange={setSelectedCoin}
                  showBalance
                  type="withdraw"
                  showAllItem={false}
                />
              </div>
              {selectedCoinLoading && !selectedCoin && (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              {!withdrawIsEnabled && selectedCoin && !selectedCoinLoading ? (
                <div className="mb-4">
                  <Alert variant="danger" message={wallet.cantWithdrawCrypto} />
                </div>
              ) : (
                <></>
              )}
              {selectedCoin && withdrawIsEnabled ? (
                <>
                  <div className="mb-4">
                    <RadioGroup
                      switchTheme
                      label={wallet.sendTo}
                      options={[
                        {
                          key: CRYPTO_WITHDRAW_TYPES.EXTERNAL,
                          label: wallet.wallet,
                          value: CRYPTO_WITHDRAW_TYPES.EXTERNAL,
                        },
                        {
                          key: CRYPTO_WITHDRAW_TYPES.INTERNAL,
                          label: wallet.arzinjaUser,
                          value: CRYPTO_WITHDRAW_TYPES.INTERNAL,
                        },
                      ]}
                      defaultSelected={withdrawType}
                      onChange={setWithdrawType}
                    />
                  </div>
                  <div>
                    {withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL ? (
                      <ExternalWithdraw />
                    ) : (
                      <InternalWithdraw />
                    )}
                  </div>
                  <ModalFooter fullScreen>
                    <Button
                      fullWidth
                      className="lg:mt-8"
                      size={isDesktop ? 'lg' : 'md'}
                      disabled={submitIsDisabled}
                      onClick={handleSubmit}
                      isLoading={submitExternalLoading || submitInternalLoading}
                    >
                      {wallet.withdrawRequest}
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="mx-auto w-full sm:w-[462px] lg:mx-0 lg:w-1/2 lg:py-8 lg:px-10"></div>
        </div>
        {isDesktop && <CryptoWithdrawHistoryTable />}
        <OtpModal
          title={isDesktop ? wallet.confirCryptomWithdraw : wallet.withdraw}
          channel={otpChannel}
          isLoading={externalOtpCheckLoading || internalOtpCheckLoading}
          onSubmit={handleSubmitOtp}
          otp={otpCode}
          onChange={setOtpCode}
          errorText={otpErrorText}
          hasResend={false}
          hasError={
            otpCode.length === 6 &&
            (withdrawType === CRYPTO_WITHDRAW_TYPES.EXTERNAL
              ? externalOtpCheckError && !externalOtpCheckLoading
              : internalOtpCheckError && !internalOtpCheckLoading)
          }
        />
        {shouldRenderResultModal && (
          <CryptoWithdrawResultModal
            withdrawType={withdrawType as 'internal' | 'external'}
          />
        )}
      </div>
    </>
  );
};

export default CryptoWithdrawContent;

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
              item.id === 'cryptoWithdraw'
                ? 'text-primary-500'
                : 'text-dark-500',
            )}
            onClick={async () =>
              await (item.id !== 'cryptoWithdraw' && router.push(item.href))
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
      title={wallet.withdraw}
      onBack={() => router.back()}
      extra={
        <IconButton
          className="border-dark-200 text-dark-600"
          size="lg"
          icon={<Icon icon="History-OutLined" size={16} />}
          onClick={() => {
            set_type('crypto');
            setOperation('withdraw');
            router.push('/panel/wallet/transactions-list');
          }}
        />
      }
    />
  );
};
