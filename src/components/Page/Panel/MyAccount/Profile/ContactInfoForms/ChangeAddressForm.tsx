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
import { type IAddress, type EditProfileModel } from '@/types/myAccount';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { getLang, toEnglishDigits, toPersianDigits } from '@/utils';
import { useBreakpoint, useLang, useProfile } from '@/hooks';

interface IProps {}

const [myAccount] = getLang(['myAccount']);

const formSchema = yup.object().shape({
  province: yup.string().required(myAccount.requiredProvince).nullable(),
  city: yup.string().required(myAccount.requiredCity).nullable(),
  location: yup.string().required(myAccount.requiredAddress).nullable(),
  house_number: yup.string().required(myAccount.requiredPlaque).nullable(),
  postal_code: yup
    .string()
    .required(myAccount.requiredPostalCode)
    .test('postal', myAccount.invalidPostalCode, (value) =>
      /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/.test(
        toEnglishDigits(value),
      ),
    ),
});

interface IProps {
  closeModal?: () => void;
  defaultAddress?: IAddress;
}
const ChangeAddressForm: React.FC<IProps> = (props) => {
  const [myAccount] = useLang(['myAccount']);
  const { isDesktop } = useBreakpoint();

  const { closeModal = () => {} } = props;

  const { data: userProfile, refetch: reFetchProfile } = useProfile();

  const methods = useForm<IAddress>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (!userProfile?.address) return;
    setValue('province', userProfile.address.province || '');
    setValue('city', userProfile.address.city || '');
    setValue('location', toPersianDigits(userProfile.address.location || ''));
    setValue(
      'house_number',
      toPersianDigits(userProfile.address.house_number || ''),
    );
    setValue(
      'postal_code',
      toPersianDigits(userProfile.address.postal_code || ''),
    );
  }, [userProfile]);

  const { isPending: editProfileLoading, mutateAsync: mutateEditProfileAsync } =
    useEditProfileMutation();

  const onSubmitHandler = async (data: IAddress) => {
    try {
      const { city, province, location, postal_code, house_number } = data;

      const body: EditProfileModel = {
        country: myAccount.iran,
        city,
        location,
        province,
        postal_code: toEnglishDigits(postal_code),
        house_number: toEnglishDigits(house_number),
      };

      const { success } = await mutateEditProfileAsync(body);
      if (success) {
        reFetchProfile();
        closeModal();
      }
    } catch (error) {
      console.log('e:', error);
    }
  };

  return (
    <>
      <div className="mx-auto mt-4 max-w-[462px] rounded-lg bg-white pt-6 px-4 pb-7 sm:px-8 sm:py-10 md:w-full lg:mt-0 lg:p-0">
        <div className="hidden items-center justify-between lg:flex">
          <div className="flex items-center justify-start gap-x-3">
            <span className="w-10 h-10 flex justify-center items-center rounded-xl bg-primary-50 p-2">
              <Icon icon={'LocationPen-TwoTone'} size={18} />
            </span>
            <p className="text-lg font-bold leading-7	text-dark-600">
              {myAccount.changeAddress1}
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
            className="block lg:mt-7 items-center justify-start lg:flex-col"
          >
            <div className="flex w-full flex-wrap gap-x-4">
              <div className="flex flex-col sm:flex-row w-full flex-wrap gap-x-4">
                <div className="flex-1">
                  <Controller
                    name={'province'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-4">
                        <FormLabel htmlFor="province">
                          {myAccount.province}
                        </FormLabel>

                        <FormInput
                          {...register('province')}
                          name="province"
                          placeholder={myAccount.provincePlaceholder}
                          value={value}
                          onChange={onChange}
                          error={invalid}
                          caption={error?.message}
                        />
                      </FormGroup>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Controller
                    name={'city'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-4">
                        <FormLabel htmlFor="city">{myAccount.city}</FormLabel>

                        <FormInput
                          {...register('city')}
                          name="city"
                          placeholder={myAccount.cityPlaceholder}
                          value={value}
                          onChange={onChange}
                          error={invalid}
                          caption={error?.message}
                        />
                      </FormGroup>
                    )}
                  />
                </div>
              </div>
              <div className="w-full">
                <Controller
                  name={'location'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="mb-4">
                      <FormLabel htmlFor="location">
                        {myAccount.address}
                      </FormLabel>

                      <FormInput
                        {...register('location')}
                        name="location"
                        placeholder={myAccount.addressPlaceholder}
                        value={value}
                        onChange={onChange}
                        error={invalid}
                        caption={error?.message}
                      />
                    </FormGroup>
                  )}
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full flex-wrap gap-x-4">
                <div className="flex-1">
                  <Controller
                    name={'house_number'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-4">
                        <FormLabel htmlFor="house_number">
                          {myAccount.plaque}
                        </FormLabel>

                        <FormInput
                          {...register('house_number')}
                          name="house_number"
                          placeholder={myAccount.plaquePlaceholder}
                          value={value ?? ''}
                          onChange={onChange}
                          error={invalid}
                          caption={error?.message}
                          onlyNumber
                          ltr
                        />
                      </FormGroup>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Controller
                    name={'postal_code'}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <FormGroup className="mb-4">
                        <FormLabel htmlFor="postal_code">
                          {myAccount.postalCode}
                        </FormLabel>

                        <FormInput
                          {...register('postal_code')}
                          name="postal_code"
                          placeholder={myAccount.postalCodePlaceholder}
                          value={value ?? ''}
                          onChange={onChange}
                          error={invalid}
                          caption={error?.message}
                          maxLength={10}
                          onlyNumber
                          ltr
                        />
                      </FormGroup>
                    )}
                  />
                </div>
              </div>
            </div>
            <ModalFooter fullScreen>
              <Button
                size={isDesktop ? 'lg' : 'md'}
                fullWidth
                className="lg:mt-2"
                disabled={!isValid}
                onClick={handleSubmit(onSubmitHandler)}
                isLoading={editProfileLoading}
              >
                {myAccount.confirm}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </div>
    </>
  );
};
export default ChangeAddressForm;
