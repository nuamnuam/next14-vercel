import {
  Alert,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
} from '@/components/Common';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthBox from '../AuthBoxPage';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { type LoginModel, type TwoStepModel } from '@/types/auth';
import {
  type ITwo_STEP,
  useLoginMutation,
} from '@/requests/auth/loginMutation';
import RadioGroup from '@/components/RadioGroup';
import Recaptcha from '@/components/Recaptcha';
import OTP, { AUTH_OTP_SUBTITLE } from '@/components/OTP';
import { useCaptchaQuery } from '@/requests/captcha/captchaQuery';
import { Request, getLang, toEnglishDigits } from '@/utils';
import { useResendLoginCodeMutation } from '@/requests/auth/resendLoginCodeMutation';
import Icon from '@/components/Common/Icon';
import { useTwoStepMutation } from '@/requests/auth/twoStepMutation';
import { useBreakpoint, useLang } from '@/hooks';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';

const [auth] = getLang(['auth']);

const mobileSchema = yup.object().shape({
  mobile_number: yup
    .string()
    .required(auth.mobileRequired)
    .test('match', auth.mobileRequired, (val: any) =>
      /^(\+98|0)?9\d{9}$/.test(toEnglishDigits(val)),
    ),
  password: yup.string().required(auth.passwordRequired),
  captcha: yup.string().min(5, '').max(5, '').required(auth.captchaRequired),
});

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .required(auth.emailRequired)
    .email(auth.wrongEmail)
    .test('match', auth.wrongEmail, (val: any) =>
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
    ),
  password: yup.string().required(auth.passwordRequired).min(8, '').max(20, ''),
  captcha: yup.string().required(auth.captchaRequired).length(5),
});

const LoginPage: React.FC = () => {
  const [auth] = useLang(['auth']);

  const [type, setType] = useState('mobile_number');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [optChannelType, setOtpChannelType] = useState<ITwo_STEP>();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const {
    isPending: loginLoading,
    mutateAsync: mutateLogin,
    error,
  } = useLoginMutation();

  const {
    isPending: twoStepLoading,
    isError: twoStepError,
    mutateAsync: mutateTwoStepAsync,
  } = useTwoStepMutation();

  const { mutateAsync: mutateResendLoginCodeAsync } =
    useResendLoginCodeMutation();

  const { refetch: requestCaptcha } = useCaptchaQuery();
  const captcha = useAuthStore((state) => state.captcha);

  const methods = useForm<LoginModel>({
    mode: 'onBlur',
    resolver: yupResolver(
      type === 'mobile_number' ? mobileSchema : emailSchema,
    ),
  });

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { isValid },
    setError,
    clearErrors,
  } = methods;

  useEffect(() => {
    reset();
  }, [type]);

  useEffect(() => {
    // @@@ TEMPORARY
    if (showOTP) {
      router.query.otp = '1';
      return;
    }
    Request.removeToken();
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

  const onSubmitHandler = async (data: LoginModel) => {
    try {
      if (!captcha?.key) return;
      const { mobile_number, email, ...rest } = data;
      const tempData: LoginModel = {
        ...rest,
        device_name: 'web',
        captcha_key: captcha?.key,
      };
      if (mobile_number)
        tempData.mobile_number = toEnglishDigits(mobile_number);
      if (email) tempData.email = email;
      const { result, success } = await mutateLogin(tempData);
      if (success) {
        setOtpChannelType(result?.two_step);
        setShowOTP(true);
        reset();
        reFetchCaptcha();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!error?.success && error) {
      if (error?.result?.captcha && Object.keys(error?.result).length === 1) {
        return reFetchCaptcha();
      }
      reset({
        mobile_number: undefined,
        email: '',
        password: '',
        captcha: '',
      });
      return reFetchCaptcha();
    }
  }, [error]);

  const submitOtp = async () => {
    const tempData: TwoStepModel = {
      code: toEnglishDigits(otp),
    };
    mutateTwoStepAsync(tempData).catch((exp) => {
      setOtpErrorText(exp?.message);
    });
  };

  const reFetchCaptcha = () => {
    resetField('captcha', {
      keepError: false,
      keepTouched: false,
      keepDirty: false,
    });
    requestCaptcha();
  };

  const renderSubtitle = useCallback(() => {
    if (!optChannelType) return null;
    return AUTH_OTP_SUBTITLE[optChannelType.type](optChannelType.channel);
  }, [optChannelType]);

  const hasResend = useMemo(() => {
    return optChannelType && optChannelType.type !== 'google2fa';
  }, [optChannelType]);

  const setCaptchaError = (message?: string) => {
    if (message) {
      return setError('captcha', { type: 'custom', message });
    }
    return clearErrors('captcha');
  };

  if (showOTP)
    return (
      <OTP
        title={auth.twoAuth}
        icon={<Icon icon="PasswordCheck-TwoTone" size={20} />}
        subtitle={renderSubtitle()}
        onChange={setOtp}
        isLoading={twoStepLoading}
        hasError={otp.length === 6 && twoStepError && !twoStepLoading}
        onSubmit={submitOtp}
        hasResend={hasResend}
        onResend={mutateResendLoginCodeAsync}
        errorText={otpErrorText}
        footer={
          <span
            className="block cursor-pointer text-center text-sm text-primary-500"
            onClick={() => {
              setOtp('');
              setOtpErrorText('');
              setShowOTP(false);
            }}
          >
            {auth.loginAnother}
          </span>
        }
      />
    );

  return (
    <AuthBox
      header={auth.loginToAccount}
      icon={<Icon icon="PasswordCheck-TwoTone" size={20} />}
    >
      <div className="mt-10">
        <Alert
          slug={{
            feature: 'authentication',
            section: 'sign-in',
          }}
        />
        <RadioGroup
          options={[
            {
              key: 'mobile_number',
              label: auth.mobile,
              value: 'mobile_number',
            },
            { key: 'email', label: auth.email, value: 'email' },
          ]}
          defaultSelected={type}
          onChange={setType}
          switchTheme
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} autoComplete="off">
          <div className="mt-6 w-full">
            {type === 'mobile_number' ? (
              <Controller
                name={'mobile_number'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup className="mb-4">
                    <FormLabel htmlFor="mobile">{auth.mobile}</FormLabel>
                    <FormInput
                      {...register('mobile_number')}
                      name="mobile_number"
                      maxLength={11}
                      placeholder={auth.sampleNumber}
                      value={value ?? ''}
                      autoComplete={'false'}
                      onChange={onChange}
                      onlyNumber
                      ltr
                      ltrPlaceholder
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
            ) : (
              <Controller
                name={'email'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup className="mb-4">
                    <FormLabel htmlFor="email">{auth.email}</FormLabel>
                    <FormInput
                      {...register('email')}
                      name="email"
                      placeholder="sample@gmail.com"
                      value={value ?? ''}
                      onChange={onChange}
                      autoComplete={'false'}
                      ltr
                      ltrPlaceholder
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
            )}
            <Controller
              name={'password'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-6">
                  <FormLabel htmlFor="password">
                    <div className="flex w-full justify-between">
                      {auth.password}
                      <Link
                        href={{
                          pathname: '/auth/forgot-password',
                          query: { ...router.query },
                        }}
                        className="text-sm text-primary-600"
                      >
                        {auth.areYouForgetPassword}
                      </Link>
                    </div>
                  </FormLabel>
                  <FormInput
                    {...register('password')}
                    name="password"
                    placeholder={auth.enterPassword}
                    value={value ?? ''}
                    onChange={onChange}
                    inputType={showPassword ? 'text' : 'password'}
                    autoComplete={'false'}
                    leftIcon={renderIcon()}
                    error={invalid}
                    ltr
                    minLength={8}
                    maxLength={20}
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
          </div>
          <div className="mb-7 flex justify-center">
            <Controller
              name={'captcha'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Recaptcha
                  {...register('captcha')}
                  data={captcha}
                  value={value ?? ''}
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
          <Button
            fullWidth
            size="lg"
            className="mb-4 "
            disabled={!isValid}
            isLoading={loginLoading}
          >
            {auth.enter}
          </Button>
          {!isMobile && (
            <div className="flex items-center justify-center gap-1 text-sm font-normal">
              <span className="text-dark-600">{auth.dontHaveAccount}</span>
              <Link
                href={{
                  pathname: '/auth/signup',
                  query: { ...router.query },
                }}
                className="mr-1 text-primary-500"
              >
                {auth.register}
              </Link>
            </div>
          )}
        </form>
      </FormProvider>
    </AuthBox>
  );
};

export default LoginPage;
