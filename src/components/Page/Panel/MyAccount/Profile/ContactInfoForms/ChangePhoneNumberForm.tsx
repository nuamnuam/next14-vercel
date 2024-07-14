import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { useEditProfileMutation } from '@/requests/panel/my-account/profile/editProfile';
import {
  Icon,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type IPhoneNumber, type EditProfileModel } from '@/types/myAccount';
import { getLang, toEnglishDigits, toPersianDigits } from '@/utils';
import { useRouter } from 'next/router';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import ModalFooter from '@/components/Common/Modal/ModalFooter';

const [myAccount] = getLang(['myAccount']);

const formSchema = yup.object().shape({
  phone_number: yup
    .string()
    .required(myAccount.wrongPhoneNumber)
    .test(
      'len',
      myAccount.wrongPhoneNumber,
      (val: string | undefined) => !!val && val.length === 11,
    )
    .test('match', myAccount.wrongPhone, (val: any) =>
      /0[0-9]{2,}[0-9]{7,}$/.test(toEnglishDigits(val)),
    ),
});

interface IProps {
  closeModal?: () => void;
  reFetchProfile: () => void;
  isEdit?: boolean;
}
const ChangePhoneNumberForm: React.FC<IProps> = (props: IProps) => {
  const [myAccount] = useLang(['myAccount']);

  const { closeModal = () => {}, isEdit } = props;
  const { data: userProfile, refetch: reFetchProfile } = useProfile();

  const methods = useForm<IPhoneNumber>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;
  const { isPending: editLoading, mutateAsync: mutateRegisterAsync } =
    useEditProfileMutation();

  const { isDesktop } = useBreakpoint();
  const router = useRouter();

  useEffect(() => {
    if (!userProfile?.phone_number) return;
    setValue(
      'phone_number',
      toPersianDigits(userProfile.phone_number?.area_code || '') +
        toPersianDigits(userProfile.phone_number?.main_number || ''),
    );
  }, [userProfile?.phone_number]);

  const onSubmitHandler = async (data: IPhoneNumber) => {
    try {
      const { phone_number } = data;
      const phone = toEnglishDigits(phone_number);

      const body: EditProfileModel = {
        area_code: phone?.slice(0, 3),
        main_number: phone?.slice(3),
      };
      const { success } = await mutateRegisterAsync(body);
      if (success) {
        reFetchProfile();
        if (isDesktop) {
          closeModal();
        } else {
          router.push('/panel/my-account/profile');
        }
      }
    } catch (error) {
      console.log('e:', error);
    }
  };

  return (
    <>
      <div className="mt-4 flex flex-col items-center justify-start rounded-lg bg-white p-4 md:mt-6 md:p-0 lg:mt-0">
        <div className="hidden w-full items-center justify-between md:flex">
          <div className="flex items-center justify-start gap-x-3">
            <span className="w-10 h-10 flex justify-center items-center rounded-xl bg-primary-50 p-2">
              <Icon icon={'Phone-TwoTone'} size={18} />
            </span>
            <p className="text-lg font-bold leading-7	text-dark-600">
              {isEdit ? myAccount.changePhoneNumber : myAccount.phoneNumber1}
            </p>
          </div>
          <Icon
            onClick={() => {
              closeModal();
            }}
            icon={'Close-OutLined'}
            size={18}
          />
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="mt-7 block w-full items-center justify-start sm:flex-col"
          >
            <div className="flex w-full flex-wrap gap-x-4">
              <div className="w-full">
                <Controller
                  name={'phone_number'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="mb-4">
                      <FormLabel htmlFor="phone_number">
                        {isEdit
                          ? myAccount.newPhoneNumber
                          : myAccount.phoneNumber}
                      </FormLabel>

                      <FormInput
                        {...register('phone_number')}
                        name="phone_number"
                        placeholder={myAccount.samplePhoneNumber}
                        value={value ?? ''}
                        onChange={onChange}
                        ltr
                        onlyNumber
                        maxLength={11}
                        error={value?.length === 11 && invalid}
                        caption={value?.length === 11 && error?.message}
                      />
                    </FormGroup>
                  )}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      <ModalFooter fullScreen>
        <Button
          size="lg"
          fullWidth
          disabled={!isValid}
          onClick={handleSubmit(onSubmitHandler)}
          isLoading={editLoading}
        >
          {myAccount.confirm}
        </Button>
      </ModalFooter>
    </>
  );
};
export default ChangePhoneNumberForm;
