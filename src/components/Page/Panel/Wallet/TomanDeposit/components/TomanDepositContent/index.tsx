import React, { useEffect, useMemo } from 'react';
import CardsInputModal from '../CardsInputModal';
import {
  Alert,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
  IconButton,
  InputAlert,
  ResponsivePageHeader,
  Spinner,
} from '@/components/Common';
import clsx from 'classnames';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useUserLimitations } from '@/requests/panel/wallet/getUserLimitations';
import RestrictAlertCTA, {
  NO_KYC_REASON,
} from '@/components/Common/RestrictAlertCTA';
import useSettingValue from '@/hooks/useSettingValue';
import { toPrice } from '@/utils';
import { useFiatDepositStore, useTransactionHistoryStore } from '@/store';
import { useDepositFiat } from '@/requests/panel/wallet/deposit/depositFiat';
import TomanDepositHistoryTable from '../TomanDepositHistoryTable';
import { useBankCardsQuery } from '@/requests/panel/wallet/getBankCards';

const TomanDepositContent = () => {
  const [wallet] = useLang(['wallet']);

  const { isDesktop } = useBreakpoint();
  const minDeposit = useSettingValue('wallet-fiat-min-deposit') || 0;
  const maxDeposit = useSettingValue('wallet-fiat-max-deposit') || 0;
  const { isLoading: limiationLoading, fiatLimitations } = useUserLimitations();
  const { isPending: submitLoading, mutateAsync: submitDeposit } =
    useDepositFiat();
  const { isLoading: cardsLoading, data: cards } = useBankCardsQuery();

  const {
    selectedCard,
    amount = 0,
    setAmount,
    setAmountIsModified,
    resetState,
    setSelectedCart,
  } = useFiatDepositStore();

  const handleChangeAmount = (val: string) => {
    setAmountIsModified(true);
    setAmount(val);
  };

  const isInvalidAmount = useMemo(() => {
    return amount && (+amount < +minDeposit || +amount > +maxDeposit);
  }, [minDeposit, maxDeposit, amount]);

  const amountErrorMessage = useMemo(() => {
    if (!amount) return;
    if (+amount > +maxDeposit) {
      return `${wallet.maxDeposit} ${toPrice(maxDeposit.toString())} ${
        wallet.iisToman
      }`;
    }
    if (+amount < +minDeposit) {
      return `${wallet.minDepositt} ${toPrice(minDeposit.toString())} ${
        wallet.iisToman
      }`;
    }
  }, [minDeposit, maxDeposit, amount]);

  useEffect(() => {
    resetState();
    if (cardsLoading || !cards?.result.length) return;
    const defaultCard = cards.result.find((card) => card.is_default);
    setSelectedCart(defaultCard);
  }, [cardsLoading, cards]);

  if (limiationLoading)
    return (
      <>
        <PageHeader />
        <div className="flex items-center justify-center py-12 lg:bg-white rounded-b-lg lg:shadow-sm">
          <Spinner className="mt-6" />
        </div>
      </>
    );

  if (!fiatLimitations?.deposit.status) {
    return (
      <>
        <PageHeader />
        <div className="mx-auto lg:mx-0 sm:w-[462px] lg:w-full my-6 lg:my-0 px-4 sm:px-8 lg:px-10 lg:py-8 lg:bg-white rounded-b-lg">
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
      <div className="flex w-full flex-col-reverse lg:flex-row bg-transparent lg:bg-white rounded-b-lg shadow-sm px-4 sm:px-8 lg:px-0">
        <div className="mx-auto mt-4 w-full rounded-lg bg-white sm:w-[462px] lg:mx-0 lg:mt-0 lg:w-1/2 lg:bg-transparent lg:py-8 lg:px-10">
          {!isDesktop && <MobileTabs />}
          <div className="p-4 sm:px-12 sm:py-8 lg:p-0">
            <div className="mb-4">
              <CardsInputModal />
            </div>
            <div className="mb-4">
              <FormGroup>
                <FormLabel htmlFor="password">
                  <div className="flex w-full justify-between">
                    {wallet.depositAmount}
                  </div>
                </FormLabel>

                <FormInput
                  name="password"
                  placeholder={`${wallet.enterDepositAmount} ${
                    wallet.min
                  } ${toPrice(minDeposit.toString())} ${wallet.thousand} `}
                  onlyNumber
                  seprator
                  value={amount || ''}
                  onChange={handleChangeAmount}
                  error={!!isInvalidAmount}
                  leftIcon={
                    <span className="text-sm font-medium text-dark-200">
                      {wallet.toman}
                    </span>
                  }
                  caption={
                    amountErrorMessage ? (
                      <InputAlert
                        message={amountErrorMessage}
                        variant="danger"
                      />
                    ) : null
                  }
                />
              </FormGroup>
            </div>
            <div className="mb-4">
              <SuggestPrices />
            </div>
            <ModalFooter fullScreen>
              <Button
                fullWidth
                size={isDesktop ? 'lg' : 'md'}
                disabled={!amount || isInvalidAmount || !selectedCard}
                onClick={async () => await submitDeposit()}
                isLoading={submitLoading}
                className="lg:mt-8"
              >
                {wallet.gotToBank}
              </Button>
            </ModalFooter>
          </div>
        </div>
        <div className="mx-auto w-full sm:w-[462px] lg:mx-0 lg:w-1/2 lg:py-8 lg:px-10">
          <Alert
            slug={{
              feature: 'wallet',
              section: 'fiat-deposit',
            }}
          />
        </div>
      </div>
      {isDesktop && <TomanDepositHistoryTable />}
    </>
  );
};

export default TomanDepositContent;

const SuggestPrices = () => {
  const [wallet] = useLang(['wallet']);

  const { amount, amountIsModified, setAmount, setAmountIsModified } =
    useFiatDepositStore((state) => ({
      amount: state.amount,
      amountIsModified: state.amountIsModified,
      setAmount: state.setAmount,
      setAmountIsModified: state.setAmountIsModified,
    }));

  const suggestiPrices = [
    {
      value: '200000',
      label: wallet.sugestPrice1,
    },
    {
      value: '1000000',
      label: wallet.sugestPrice2,
    },
    {
      value: '5000000',
      label: wallet.sugestPrice3,
    },
    {
      value: '25000000',
      label: wallet.sugestPrice4,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {suggestiPrices.map((item, index) => (
        <Button
          key={index}
          size="md"
          variant={
            amount === item.value && !amountIsModified ? 'link' : 'secondary'
          }
          className={
            amount === item.value && !amountIsModified
              ? 'border-primary-500 rounded-lg !shadow-button'
              : ''
          }
          onClick={() => {
            setAmountIsModified(false);
            setAmount(item.value);
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

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
              item.id === 'tomanDeposit' ? 'text-primary-500' : 'text-dark-500',
            )}
            onClick={async () =>
              await (item.id !== 'tomanDeposit' && router.push(item.href))
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
