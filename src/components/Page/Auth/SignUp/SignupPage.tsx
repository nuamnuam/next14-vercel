import {
  Alert,
  Button,
  CheckBox,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
} from '@/components/Common';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthBox from '../AuthBoxPage';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import clsx from 'classnames';
import * as yup from 'yup';
import {
  type CheckCodeModel,
  type RegisterModel,
  type ResendCodeModel,
} from '@/types/auth';
import Recaptcha from '@/components/Recaptcha';
import OTP, { AUTH_OTP_SUBTITLE } from '@/components/OTP';
import { useCaptchaQuery } from '@/requests/captcha/captchaQuery';
import { useRegisterMutation } from '@/requests/auth/registerMutation';
import { useCheckCodeMutation } from '@/requests/auth/checkCodeMutation';
import {
  getLang,
  maskPhoneNum,
  toEnglishDigits,
  toPersianDigits,
} from '@/utils';
import { useResendCodeMutation } from '@/requests/auth/resendCodeMutation';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';
import GuidButton from '@/components/Common/GuideButton';
import useAuthStore from '@/store/authStore';

interface Agreement {
  agreement?: boolean;
}

const [auth] = getLang(['auth']);

export const oneUpperCaseRegex = /^(?=.*[A-Z])/;
export const oneLowerCaseRegex = /^(?=.*[a-z])/;
export const oneNumberRegex = /^(?=.*[0-9])/;

const schema = yup.object().shape({
  mobile_number: yup
    .string()
    .required(auth.mobileRequired)
    .test('mathc', auth.wrongMobile, (val: any) =>
      /^(\+98|0)?9\d{9}$/.test(toEnglishDigits(val)),
    ),
  password: yup
    .string()
    .required(auth.passwordRequired)
    .min(8, ' ')
    .max(20, '')
    .matches(oneLowerCaseRegex, { message: ' ' })
    .matches(oneUpperCaseRegex, { message: ' ' })
    .matches(oneNumberRegex, { message: ' ' }),
  captcha: yup.string().required(auth.captchaRequired).length(5),
  agreement: yup.boolean().oneOf([true], ''),
  referral_code: yup
    .string()
    .optional()
    .test(
      'len',
      auth.referralLength,
      (value) => !value || (value.length >= 6 && value.length <= 8),
    ),
});

const DEFAULT_RULES = {
  minChars: { value: false, label: auth.min8chars },
  lowerCase: { value: false, label: auth.min1Lower },
  upperCase: { value: false, label: auth.min1Upper },
  number: { value: false, label: auth.min1Number },
};

const SignupPage: React.FC = () => {
  const [auth] = useLang(['auth']);

  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const [rules, setRules] = useState<any>(DEFAULT_RULES);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const {
    isPending: registerLoading,
    mutateAsync: mutateRegisterAsync,
    error,
  } = useRegisterMutation();

  const {
    isPending: checkCodeLoading,
    isError: checkCodeError,
    mutateAsync: mutateCheckCodeAsync,
  } = useCheckCodeMutation();

  const { mutateAsync: mutateResendCodeAsync } = useResendCodeMutation();
  const { refetch: requestCaptcha } = useCaptchaQuery();

  const captcha = useAuthStore((state) => state.captcha);

  const methods = useForm<RegisterModel>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    resetField,
    reset,
    setValue,
    formState: { isValid },
    control,
    watch,
    setError,
    clearErrors,
  } = methods;

  useEffect(() => {
    if (showOTP) {
      router.query.otp = '1';
      return;
    }
    delete router.query.otp;
  }, [showOTP]);

  const renderIcon = () => {
    return (
      <div className="cursor-pointer" onClick={handleClickShowPassword}>
        <Icon
          icon={showPassword ? 'Eye-OutLined' : 'EyeInvisible-OutLined'}
          size={23}
          className={showPassword ? 'text-primary-500' : 'text-dark-500'}
        />
      </div>
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newStatus = { ...rules };
    rules.minChars.value = value?.length > 7;
    rules.lowerCase.value = oneLowerCaseRegex.test(value);
    rules.upperCase.value = oneUpperCaseRegex.test(value);
    rules.number.value = oneNumberRegex.test(value);

    setRules(newStatus);
  };

  const onSubmitHandler = async (data: RegisterModel & Agreement) => {
    if (!captcha?.key) return;
    const { agreement, mobile_number, ...rest } = data;
    const body: RegisterModel = {
      ...rest,
      mobile_number: toEnglishDigits(mobile_number),
      captcha_key: captcha.key,
    };
    const { success } = await mutateRegisterAsync(body);
    if (success) {
      setShowOTP(true);
      reFetchCaptcha();
      reset({
        captcha: '',
      });
    }
  };

  const submitOtp = async () => {
    const tempData: CheckCodeModel = {
      code: toEnglishDigits(otp),
      device_name: 'web',
      mobile_number: toEnglishDigits(phone),
    };
    await mutateCheckCodeAsync(tempData).catch((exp) => {
      const error =
        exp?.result && !Array.isArray(exp?.result)
          ? Object.values(exp?.result)?.[0]
          : exp?.message;
      setOtpErrorText(error);
    });
  };

  const onResend = async () => {
    const tempData: ResendCodeModel = {
      mobile_number: toEnglishDigits(phone),
    };
    await mutateResendCodeAsync(tempData);
  };

  const reFetchCaptcha = () => {
    resetField('captcha', {
      keepError: false,
      keepTouched: false,
      keepDirty: false,
    });
    requestCaptcha();
  };

  useEffect(() => {
    if (!error?.success && error) {
      if (error?.result?.captcha && Object.keys(error?.result).length === 1) {
        return reFetchCaptcha();
      }
      reset({
        mobile_number: undefined,
        password: '',
        captcha: '',
        referral_code: '',
      });
      return reFetchCaptcha();
    }
  }, [error]);

  useEffect(() => {
    if (watch('mobile_number')) {
      setPhone(watch('mobile_number')!);
    }
  }, [watch('mobile_number')]);

  useEffect(() => {
    if (router.query.ref_code) {
      setShowReferral(true);
      setValue('referral_code', router.query.ref_code as string);
    }
  }, [router.query]);

  const setCaptchaError = (message?: string) => {
    if (message) {
      return setError('captcha', { type: 'custom', message });
    }
    return clearErrors('captcha');
  };

  if (showOTP)
    return (
      <OTP
        title={auth.confirmMobile}
        icon={<Icon icon="Mobile-TwoTone" size={24} />}
        subtitle={AUTH_OTP_SUBTITLE.sms(toPersianDigits(maskPhoneNum(phone)))}
        onChange={setOtp}
        isLoading={checkCodeLoading}
        onSubmit={submitOtp}
        onResend={onResend}
        hasError={otp.length === 6 && checkCodeError && !checkCodeLoading}
        errorText={otpErrorText}
        footer={
          <span
            className="block cursor-pointer text-center text-sm text-primary-500"
            onClick={() => {
              setOtp('');
              setOtpErrorText('');
              setShowOTP(false);
              setRules(DEFAULT_RULES);
            }}
          >
            {auth.signupWithAnotherMobile}
          </span>
        }
      />
    );

  return (
    <AuthBox
      header={auth.createAccount}
      icon={<Icon icon="SignUp-TwoTone" size={20} />}
      extra={
        <div className="hidden md:block">
          <GuidButton />
        </div>
      }
    >
      <Alert
        slug={{
          section: 'sign-up',
          feature: 'authentication',
        }}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="w-full">
            <Controller
              control={control}
              name={'mobile_number'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-4">
                  <FormLabel htmlFor="mobile_number">{auth.mobile}</FormLabel>
                  <FormInput
                    {...register('mobile_number')}
                    name="mobile_number"
                    maxLength={11}
                    placeholder={auth.sampleNumber}
                    value={value}
                    onChange={onChange}
                    ltr
                    ltrPlaceholder
                    onlyNumber
                    error={invalid}
                    caption={error?.message}
                    captionIcon={
                      <Icon
                        icon="CloseCircle-OutLined"
                        className="text-danger-600"
                        size={14}
                      />
                    }
                  />
                </FormGroup>
              )}
            />
            <Controller
              name={'password'}
              render={({
                field: { onChange, value },
                fieldState: { invalid },
              }) => (
                <FormGroup className="mb-3">
                  <FormLabel htmlFor="password">{auth.password}</FormLabel>
                  <FormInput
                    {...register('password', {
                      onChange: handlePasswordChange,
                    })}
                    name="password"
                    placeholder={auth.enterPassword}
                    value={value}
                    onChange={onChange}
                    inputType={showPassword ? 'text' : 'password'}
                    leftIcon={renderIcon()}
                    error={invalid}
                    ltr
                    minLength={8}
                    maxLength={20}
                  />
                </FormGroup>
              )}
            />

            {Object.keys(rules).map((i) => (
              <div className="mb-3 flex items-center gap-1">
                {rules[i].value ? (
                  <Icon
                    icon="CheckCircle-OutLined"
                    className="text-primary-600"
                    size={14}
                  />
                ) : (
                  <Icon
                    icon="CloseCircle-OutLined"
                    className="text-danger-600"
                    size={14}
                  />
                )}
                <span
                  className={`${
                    rules[i].value ? 'text-dark-300' : 'text-danger-600'
                  } text-xs`}
                >
                  {rules[i].label}
                </span>
              </div>
            ))}
            <Controller
              name={'referral_code'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <div className="mb-7 mt-6">
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={() => {
                      setShowReferral(!showReferral);
                    }}
                  >
                    <Icon
                      icon="Down-OutLined"
                      size={13}
                      className={clsx(
                        'text-dark-600 transition duration-300',
                        !showReferral && 'rotate-90',
                      )}
                    />
                    <span className="mr-1 text-sm font-medium text-dark-600">
                      {auth.haveIviteCode}
                    </span>
                  </div>
                  {showReferral && (
                    <FormGroup className="mt-4">
                      <FormInput
                        {...register('referral_code')}
                        name="referral_code"
                        placeholder={auth.enterReferral}
                        value={value}
                        ltr
                        onChange={onChange}
                        error={invalid}
                        minLength={7}
                        maxLength={8}
                        caption={error?.message}
                        captionIcon={
                          <Icon
                            icon="CloseCircle-OutLined"
                            className="text-danger-600"
                            size={14}
                          />
                        }
                      />
                    </FormGroup>
                  )}
                </div>
              )}
            />
            <div className="mb-8 flex justify-center">
              <Controller
                name={'captcha'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Recaptcha
                    {...register('captcha')}
                    data={captcha}
                    value={value}
                    retry={reFetchCaptcha}
                    onChange={onChange}
                    error={invalid}
                    caption={error?.message}
                    setError={setCaptchaError}
                    captionIcon={
                      <Icon
                        icon="CloseCircle-OutLined"
                        className="text-danger-600"
                        size={14}
                      />
                    }
                  />
                )}
              />
            </div>
            <Controller
              name={'agreement'}
              defaultValue={false}
              render={({
                field: { onChange, value },
                fieldState: { invalid },
              }) => (
                <div className="mb-8 mr-2">
                  <CheckBox
                    label={
                      <div className="mr-2">
                        <Link
                          href="/terms-and-conditions"
                          target="blank"
                          className="text-primary-600 "
                        >
                          {auth.termsConditions}
                        </Link>{' '}
                        {auth.readAndAccept}
                      </div>
                    }
                    isChecked={value}
                    handleInputChange={onChange}
                    error={invalid}
                  />
                </div>
              )}
            />
          </div>

          <Button
            fullWidth
            size="lg"
            className="mb-4 "
            disabled={!isValid}
            isLoading={registerLoading}
          >
            {auth.signup}
          </Button>
          {!isMobile && (
            <div className="flex items-center justify-center gap-1 text-sm font-normal">
              <span className="text-dark-600">{auth.regiteredAlready}</span>
              <Link href="/auth/login" className="mr-1 text-primary-600">
                {auth.doEnter}
              </Link>
            </div>
          )}
        </form>
      </FormProvider>
    </AuthBox>
  );
};

export default SignupPage;
