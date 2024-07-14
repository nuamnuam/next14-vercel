import { useMemo, useState } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { verifyIranianNationalId } from '@persian-tools/persian-tools';
import { useEditProfileMutation } from '@/requests/panel/my-account/profile/editProfile';
import {
  SelectInput,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Alert,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type IUpgradeToLevelOneForm } from '@/types/kyc';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import {
  toEnglishDigits,
  toPersianDigits,
  ageCalculator,
  getLang,
} from '@/utils';
import isValidName from '@/utils/isValidName';
import { useLang } from '@/hooks';

interface ISelectOption {
  label: string;
  value: string;
}

const [kyc] = getLang(['kyc']);

const formSchema = yup.object().shape({
  first_name: yup
    .string()
    .required(kyc.requiredFirstName)
    .min(2, kyc.minLength2Characters),
  last_name: yup
    .string()
    .required(kyc.requiredLastName)
    .min(2, kyc.minLength2Characters),
  day: yup.string().required(),
  month: yup.string().required(),
  year: yup.string().required(),
  national_code: yup
    .string()
    .required(kyc.requiredNationalityCode)
    .test(
      'len',
      kyc.wrongNationalityCode,
      (val: string | undefined) =>
        !!verifyIranianNationalId(toEnglishDigits(val)),
    ),
});

const PersonalInfoForm = () => {
  const [kyc] = useLang(['kyc']);

  const { mutateAsync: mutateEditProfileAsync, isPending: isLoading } =
    useEditProfileMutation(false);
  const [userAge, setUserAge] = useState<null | number>(null);
  const methods = useForm<IUpgradeToLevelOneForm>({
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    setValue,
    getValues,
  } = methods;

  const minRequireAge = (year: number, month: number, day: number) => {
    const userAge = ageCalculator(+year, +month, +day);

    return userAge <= 18;
  };

  const maxRequireAge = (year: number, month: number, day: number) => {
    const userAge = ageCalculator(+year, +month, +day);

    return userAge > 80;
  };

  const onSubmitHandler = async (data: IUpgradeToLevelOneForm) => {
    try {
      const {
        first_name,
        last_name,
        day = '',
        month = '',
        year = '',
        national_code,
      } = data;

      const userAge = ageCalculator(+year, +month, +day);

      if (userAge <= 18) {
        setError('birthday', {
          type: 'custom',
          message: kyc.adultsOnly,
        });
        return;
      } else if (userAge > 80) {
        setError('birthday', {
          type: 'custom',
          message: kyc.notOlds,
        });
        return;
      }
      setUserAge(userAge);

      const body: IUpgradeToLevelOneForm = {
        first_name: first_name?.trim(),
        last_name: last_name?.trim(),
        birthday:
          +year +
          '/' +
          (+month < 10 ? '0' + month : month) +
          '/' +
          (+day < 10 ? '0' + day : day),
        national_code: national_code?.trim(),
      };

      await mutateEditProfileAsync(body);
    } catch (error) {
      console.log('e:', error);
    }
  };

  const days = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => i + 1).map((item) => ({
      label: toPersianDigits(item.toString()),
      value: item.toString(),
    }));
  }, []);

  const years = useMemo(() => {
    const arr: ISelectOption[] = [];
    for (let i = 1300; i <= 1402; i++) {
      arr.push({ label: toPersianDigits(i.toString()), value: i.toString() });
    }
    return arr;
  }, []);

  return (
    <div className="mb-8">
      <Alert
        slug={{
          feature: 'user-verification',
          section: 'kyc-personal-info',
        }}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div>
            <div className="mb-4">
              <Controller
                name={'first_name'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup>
                    <FormLabel htmlFor="first_name">{kyc.name}</FormLabel>

                    <FormInput
                      {...register('first_name')}
                      name="first_name"
                      placeholder={kyc.firstNamePlaceholder}
                      value={value}
                      onChange={(val) => {
                        isValidName(val, onChange);
                      }}
                      maxLength={50}
                      error={invalid}
                      caption={error?.message}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="mb-4">
              <Controller
                name={'last_name'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup>
                    <FormLabel htmlFor="last_name">{kyc.lastName}</FormLabel>

                    <FormInput
                      {...register('last_name')}
                      name="last_name"
                      placeholder={kyc.lastNamePlaceholder}
                      value={value}
                      onChange={(val) => {
                        isValidName(val, onChange);
                      }}
                      maxLength={50}
                      error={invalid}
                      caption={error?.message}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="mb-4">
              <Controller
                name={'national_code'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup>
                    <FormLabel htmlFor="national_code">
                      {kyc.nationalityCode}
                    </FormLabel>

                    <FormInput
                      {...register('national_code')}
                      name="national_code"
                      placeholder={kyc.nationalityCodePlaceholder}
                      value={value}
                      onChange={onChange}
                      error={invalid}
                      ltr
                      caption={error?.message}
                      onlyNumber
                      checkZero={false}
                      maxLength={10}
                    />
                  </FormGroup>
                )}
              />
            </div>

            <div className="lg:mb-6">
              <FormLabel>{kyc.birthDay}</FormLabel>
              <div className="flex gap-x-4">
                <Controller
                  name={'day'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="flex-1">
                      <SelectInput
                        fullWidth
                        name={'day'}
                        options={days}
                        value={value}
                        onChange={onChange}
                        error={invalid}
                        // caption={error?.message}
                        palceholder={kyc.day}
                        selectClassName="h-12	[&>div]:min-w-0"
                      />
                    </FormGroup>
                  )}
                />
                <Controller
                  name={'month'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="flex-1">
                      <SelectInput
                        name={'month'}
                        fullWidth
                        onChange={onChange}
                        value={value}
                        error={invalid}
                        caption={error?.message}
                        options={months}
                        palceholder={kyc.month}
                        selectClassName="h-12	[&>div]:min-w-0"
                      />
                    </FormGroup>
                  )}
                />
                <Controller
                  name={'year'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="flex-1">
                      <SelectInput
                        fullWidth
                        name={'year'}
                        onChange={onChange}
                        menuListRefHandler={(ref) => {
                          if (!getValues('year')) {
                            ref?.scroll({
                              top: 865,
                            });
                          }
                        }}
                        value={value}
                        options={years}
                        error={invalid}
                        caption={error?.message}
                        palceholder={kyc.year}
                        selectClassName="h-12	[&>div]:min-w-0"
                      />
                    </FormGroup>
                  )}
                />
              </div>

              {errors.birthday?.message &&
              minRequireAge(
                +getValues('year')!,
                +getValues('month')!,
                +getValues('day')!,
              ) ? (
                <Alert
                  title={kyc.adultsOnly}
                  variant="danger"
                  className="mt-4"
                />
              ) : errors.birthday?.message &&
                maxRequireAge(
                  +getValues('year')!,
                  +getValues('month')!,
                  +getValues('day')!,
                ) ? (
                <Alert
                  title={kyc.adultsOnly}
                  variant="danger"
                  className="mt-4"
                />
              ) : errors.birthday?.message &&
                maxRequireAge(
                  +getValues('year')!,
                  +getValues('month')!,
                  +getValues('day')!,
                ) ? (
                <Alert
                  title={kyc.adultsOnly}
                  variant="danger"
                  className="mt-4"
                />
              ) : null}
            </div>
          </div>
          <ModalFooter fullScreen>
            <Button
              fullWidth
              size="lg"
              disabled={!isValid}
              variant="primary"
              isLoading={isLoading}
              onClick={handleSubmit(onSubmitHandler)}
            >
              {kyc.nextStep}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </div>
  );
};

export default PersonalInfoForm;

const months: ISelectOption[] = [
  { label: kyc.farvardin, value: '1' },
  { label: kyc.ordibehesght, value: '2' },
  { label: kyc.khordat, value: '3' },
  { label: kyc.tir, value: '4' },
  { label: kyc.mordad, value: '5' },
  { label: kyc.shahrivar, value: '6' },
  { label: kyc.mehr, value: '7' },
  { label: kyc.aban, value: '8' },
  { label: kyc.azar, value: '9' },
  { label: kyc.dey, value: '10' },
  { label: kyc.bahman, value: '11' },
  { label: kyc.esfand, value: '12' },
];
