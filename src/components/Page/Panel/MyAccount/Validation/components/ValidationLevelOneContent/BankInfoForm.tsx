import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  Controller,
  type FieldError,
  FormProvider,
  useForm,
} from 'react-hook-form';

import {
  Button,
  Chip,
  CircleLoading,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
  InputAlert,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidCardNumber } from '@/utils/card-number';
import { type ICardNumber } from '@/types/myAccount';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { getLang, toEnglishDigits } from '@/utils';
import { useAddCardInfoMutation } from '@/requests/panel/my-account/kyc/addCard';
import { useBanks, useLang, useProfile } from '@/hooks';

const [myAccount] = getLang(['myAccount']);

const cardSchema = yup.object().shape({
  card_number: yup
    .string()
    .required(myAccount.cardNumberIsRequired)
    .test('len', myAccount.wrongCardNumber, (value: string | undefined) =>
      isValidCardNumber(toEnglishDigits(value) ?? ''),
    ),
});

const BankInfoForm = () => {
  const [myAccount, kyc, global] = useLang(['myAccount', 'kyc', 'global']);

  const { getCardLogo } = useBanks();

  const [isValidIban, setIsValidIban] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [status, setStatus] = useState<'retry' | 'confirm' | 'continue'>(
    'confirm',
  );
  const [cardNumberMsg, setCardNumberMsg] = useState<null | string>(null);

  const methods = useForm<ICardNumber>({
    mode: 'onChange',
    resolver: yupResolver(cardSchema),
  });

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { isValid, errors },
  } = methods;

  const enteredCardNumber = getValues('card_number');

  const {
    isPending: isLoading,
    mutateAsync: mutateAddCardAsync,
    data,
  } = useAddCardInfoMutation();
  const { refetch, isLoading: userProfileLoading } = useProfile();

  const onSubmitHandler = async (data: ICardNumber) => {
    return null;
  };

  useEffect(() => {
    (async () => {
      try {
        if (
          !enteredCardNumber ||
          !isValidCardNumber(enteredCardNumber) ||
          enteredCardNumber.length !== 16
        ) {
          setIsValidIban(false);
          setErrorMessage(null);
          return;
        }

        const body: ICardNumber = {
          card_number: toEnglishDigits(enteredCardNumber?.split(' ').join('')),
        };

        await mutateAddCardAsync(body, {
          onSuccess() {
            setStatus('continue');
            setErrorMessage(null);
            setCardNumberMsg(null);
            setIsValidIban(true);
          },
          onError(err) {
            if (err.code === 422) {
              if (err.result?.card_number) {
                setIsValidIban(false);
                setCardNumberMsg(String(err.result?.card_number));
                setError('card_number', {
                  message: String(err.result?.card_number),
                  type: 'custom',
                });
              } else {
                setIsValidIban(false);
                setError('card_number', { message: String(err.message) });
                setCardNumberMsg(String(err.message));
              }
              setIsValidIban(false);
              setStatus('continue');
            }

            if (err.code === 500) {
              setErrorMessage(String(err.message));
              setCardNumberMsg(String(err.message));
              setStatus('retry');
            }
          },
        });

        setIsValidIban(true);
      } catch (error) {
        console.log('e:', error);
      }
    })();
  }, [enteredCardNumber]);

  const renderInputCaption = (error?: FieldError) => {
    try {
      if (isLoading) return;
      if (error?.message) {
        return <InputAlert message={error.message} variant="danger" />;
      }
    } catch (error) {
      console.log('e:', error);
    }
  };

  return (
    <div className="mb-8">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div>
            <Controller
              name={'card_number'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => {
                return (
                  <FormGroup>
                    <FormLabel htmlFor="card_number">
                      {myAccount.cardNumber}
                    </FormLabel>
                    <FormInput
                      {...register('card_number')}
                      name="card_number"
                      placeholder={myAccount.cardNumberPlaceholder}
                      value={value}
                      mask
                      onChange={onChange}
                      error={
                        value?.length === 16 &&
                        (invalid || !!cardNumberMsg) &&
                        !isLoading
                      }
                      ltr
                      maxLength={19}
                      containerClassName=""
                      caption={
                        value?.length === 16 &&
                        renderInputCaption(
                          error || ({ message: cardNumberMsg } as any),
                        )
                      }
                      className="[&>div>input]:text-dark-700 [&>div>input]:font-medium"
                      leftIcon={
                        getCardLogo(value) &&
                        value?.length >= 6 &&
                        getCardLogo(value) !== 'undefined-Colored' ? (
                          <Icon icon={getCardLogo(value)} size={18} />
                        ) : undefined
                      }
                    />
                  </FormGroup>
                );
              }}
            />
          </div>

          {isLoading && (
            <div className="mt-2 flex items-center justify-start gap-x-2">
              <CircleLoading stroke="#E8B100" />
              <p className="text-sm font-normal text-warning-600">
                {kyc.evaluatingTheBankCard}
              </p>
            </div>
          )}

          {data && isValidIban ? (
            <div>
              <div className="mt-0 mb-4 flex items-center justify-start gap-x-2 rounded-lg pl-4 pt-2 pb-2 md:mb-3">
                <Icon
                  icon={'CheckCircle-OutLined'}
                  className="[&>*]:fill-primary-500"
                  size={16}
                />
                <p className="text-sm text-primary-600">
                  {kyc.confirmedIdentityOfAccount}
                </p>
              </div>
              <FormLabel htmlFor="cardNumber">{myAccount.ibanNumber}</FormLabel>
              <Chip
                classNames="my-2 py-[22px] bg-success-50 !justify-end [&>span]:font-medium [&>span]:text-primary-700"
                variant="success"
                label={data?.result?.iban?.iban}
              />

              <div className="mt-0 flex items-center justify-start gap-x-2 rounded-lg pt-2 pb-2">
                <Icon
                  icon={'ExclamationCircle-OutLined'}
                  className="[&>*]:fill-blue-500"
                  size={16}
                />
                <p className="text-sm text-dark-800">
                  {kyc.cardNumberForWithdraw}
                </p>
              </div>
            </div>
          ) : null}

          <ModalFooter fullScreen>
            {status === 'continue' ? (
              <Button
                size="lg"
                fullWidth
                isLoading={userProfileLoading}
                className="lg:mt-6"
                disabled={
                  !isValid ||
                  isLoading ||
                  !!errors.card_number ||
                  !!errorMessage ||
                  !isValidIban
                }
                onClick={() => {
                  refetch();
                }}
              >
                {global.retry}
              </Button>
            ) : status === 'confirm' ? (
              <Button
                size="lg"
                fullWidth
                className="lg:mt-6"
                disabled={!isValid || isLoading}
                onClick={handleSubmit(onSubmitHandler)}
              >
                {myAccount.confirmCardNumber}
              </Button>
            ) : (
              <Button
                size="lg"
                fullWidth
                className="lg:mt-6"
                disabled={!isValid || isLoading}
                onClick={handleSubmit(onSubmitHandler)}
              >
                {global.retry}
              </Button>
            )}
          </ModalFooter>
        </form>
      </FormProvider>
    </div>
  );
};

export default BankInfoForm;
