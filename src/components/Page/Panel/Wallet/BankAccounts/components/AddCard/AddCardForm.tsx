import React, { type Dispatch, type SetStateAction } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type ICardFormModel, type IIbanFormModel } from '@/types/wallet';
import { useAddCardMutation } from '@/requests/panel/my-account/kyc/addCardInfo';
import { useAddNewIbanMutation } from '@/requests/panel/wallet/addNewIban';
import { isValidIban, isValidCardNumber } from '@/utils/card-number';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBanks, useBreakpoint, useLang } from '@/hooks';
import { getLang, toEnglishDigits, toPersianDigits } from '@/utils';
import { useRouter } from 'next/router';

interface IProps {
  formType?: 'card' | 'iban';
  setPage: Dispatch<SetStateAction<string>>;
  reFetchCards: (type: 'card' | 'iban') => void;
}

const [wallet] = getLang(['wallet']);

const cardSchema = yup.object().shape({
  card_number: yup
    .string()
    .test('len', wallet.wrongCardNumber, (value: string | undefined) =>
      isValidCardNumber(toEnglishDigits(value) ?? ''),
    ),
});

const ibanSchema = yup.object().shape({
  iban: yup
    .string()
    .test('len', wallet.wrongIbanNumber, (val: string | undefined) => {
      return isValidIban('IR' + toEnglishDigits(val ?? '')?.trim());
    }),
});

const AddCardForm: React.FC<IProps> = (props) => {
  const [wallet] = useLang(['wallet']);

  const { getCardLogo } = useBanks();

  const { isMobile } = useBreakpoint();
  const { isPending: addCardLoading, mutateAsync: mutateAddCardAsync } =
    useAddCardMutation();
  const { isPending: addIbanLoading, mutateAsync: mutateAddNewIbanAsync } =
    useAddNewIbanMutation();

  const { formType, setPage, reFetchCards } = props;
  const router = useRouter();
  const { form } = router.query;

  const methods = useForm<ICardFormModel>({
    mode: 'onChange',
    resolver:
      formType === 'card' ? yupResolver(cardSchema) : yupResolver(ibanSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmitHandler = async (data: ICardFormModel) => {
    try {
      const { card_number, iban } = data;
      if (formType === 'card') {
        const body: ICardFormModel = {
          card_number: toEnglishDigits(card_number)?.split(' ').join(''),
        };

        const { success } = await mutateAddCardAsync(body);
        if (success) {
          if (form) {
            router.back();
            return;
          }
          setPage('list');
          reFetchCards('card');
        }
      } else {
        const body: IIbanFormModel = {
          iban: 'IR' + toEnglishDigits(iban),
        };

        const { success } = await mutateAddNewIbanAsync(body);
        if (success) {
          if (form) {
            router.back();
            return;
          }
          setPage('list');
          reFetchCards('iban');
        }
      }
    } catch (error) {
      console.log('e: ', error);
    }
  };

  return (
    <>
      <div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="mt-0 block items-center justify-start md:mt-8"
            autoComplete="off"
          >
            <div className="ml-4 w-full">
              {formType === 'card' ? (
                <Controller
                  name={'card_number'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => {
                    return (
                      <FormGroup className="mb-8">
                        <FormLabel htmlFor="card_number">
                          {wallet.cardNumber}
                        </FormLabel>
                        <FormInput
                          {...register('card_number')}
                          name="card_number"
                          placeholder={wallet.cardNumberPlaceholder}
                          value={value}
                          onChange={onChange}
                          error={value?.length === 16 && invalid}
                          ltr
                          mask
                          maxLength={19}
                          containerClassName="[&>div>input]:!pl-12 "
                          caption={value?.length === 16 && error?.message}
                          leftIcon={
                            value && (value as string).length >= 6 ? (
                              <Icon icon={getCardLogo(value)} size={24} />
                            ) : (
                              <></>
                            )
                          }
                        />
                      </FormGroup>
                    );
                  }}
                />
              ) : (
                <Controller
                  name={'iban'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => {
                    return (
                      <FormGroup className="mb-8">
                        <FormLabel htmlFor="iban">{wallet.iban}</FormLabel>
                        <FormInput
                          {...register('iban')}
                          name="iban"
                          placeholder={wallet.addIbanNumber}
                          value={
                            value?.startsWith('IR')
                              ? toPersianDigits(value.slice(2))
                              : toPersianDigits(value)
                          }
                          onChange={(text: string) => {
                            const val = toEnglishDigits(text);
                            const regex = /^[0-9]*$/;
                            if (val.startsWith('IR')) {
                              const slicedVal = val.slice(2);
                              if (val.length <= 26 && slicedVal.match(regex)) {
                                onChange(slicedVal);
                              }
                            } else if (val.length <= 24 && val.match(regex))
                              onChange(val);
                          }}
                          ltr
                          containerClassName="[&>div>input]:!pl-12 "
                          error={value?.length === 24 && invalid}
                          caption={value?.length === 24 && error?.message}
                          leftIcon={<p>IR</p>}
                        />
                      </FormGroup>
                    );
                  }}
                />
              )}
            </div>
            <ModalFooter fullScreen>
              <Button
                size={isMobile ? 'md' : 'lg'}
                fullWidth
                className="lg:mb-4"
                disabled={!isValid}
                isLoading={addCardLoading || addIbanLoading}
                onClick={handleSubmit(onSubmitHandler)}
              >
                {formType === 'card'
                  ? wallet.submitCardNumber
                  : wallet.submitIbanNumber}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default AddCardForm;
