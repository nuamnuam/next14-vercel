import { useEffect, useState } from 'react';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  Alert,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
} from '@/components/Common';
import RadioGroup from '@/components/RadioGroup';
import { type CheckOtpModel, type ForgotPasswordModel } from '@/types/auth';
import Recaptcha from '@/components/Recaptcha';
import OTP, { AUTH_OTP_SUBTITLE } from '@/components/OTP';
import { useForgotPasswordMutation } from '@/requests/auth/forgotPasswordMutation';
import { useCheckOtpMutation } from '@/requests/auth/checkOtpMutation';
import {
  Request,
  getLang,
  maskPhoneNum,
  toEnglishDigits,
  toPersianDigits,
} from '@/utils';
import { useBreakpoint, useLang } from '@/hooks';
import { useCaptchaQuery } from '@/requests/captcha/captchaQuery';
import useAuthStore from '@/store/authStore';
import { useResendLoginCodeMutation } from '@/requests/auth/resendLoginCodeMutation';

import AuthBox from '../AuthBoxPage';

const [global, auth] = getLang(['global', 'auth']);

const mobileSchema = yup.object().shape({
  mobile_number: yup
    .string()
    .required(global.mobileNumberRequired)
    .test('match', global.wrongMobileNumber, (val: any) =>
      /^(\+98|0)?9\d{9}$/.test(toEnglishDigits(val)),
    ),
  captcha: yup.string().required(global.captchaRequired).length(5),
});

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .required(global.emailRequired)
    .email(auth.wrongEmail)
    .test('match', auth.wrongEmail, (val: any) =>
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
    ),
  captcha: yup.string().required(global.captchaRequired).length(5),
});

const ForgotPasswordPage: React.FC = () => {
  const [global] = useLang(['global', 'auth']);

  const [type, setType] = useState('mobile_number');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');
  const [info, setInfo] = useState({ phone: '', email: '' });
  const { isMobile } = useBreakpoint();

  const {
    isPending: forgetLoading,
    mutateAsync: mutateForget,
    error,
  } = useForgotPasswordMutation();

  const {
    isPending: checkOtpLoading,
    isError: checkOtpError,
    mutateAsync: mutateCheckOtpAsync,
  } = useCheckOtpMutation();

  const { mutateAsync: mutateResendLoginCodeAsync } =
    useResendLoginCodeMutation();

  const { refetch: requestCaptcha } = useCaptchaQuery();
  const captcha = useAuthStore((state) => state.captcha);

  const methods = useForm<ForgotPasswordModel>({
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
    control,
    formState: { isValid },
    watch,
    setError,
    clearErrors,
  } = methods;

  useEffect(() => {
    reset();
  }, [type]);

  useEffect(() => {
    // @@@ TEMPORARY
    if (showOTP) return;
    Request.removeToken();
  }, [showOTP]);

  const onSubmitHandler = async (data: ForgotPasswordModel) => {
    if (!captcha?.key) return;
    const { mobile_number, email, ...rest } = data;
    const tempData: ForgotPasswordModel = {
      ...rest,
      device_name: 'web',
      captcha_key: captcha.key,
    };
    if (mobile_number) tempData.mobile_number = toEnglishDigits(mobile_number);
    if (email) tempData.email = email;
    const { success } = await mutateForget(tempData);
    if (success) {
      setShowOTP(true);
      reFetchCaptcha();
    }
  };

  const submitOtp = async () => {
    const tempData: CheckOtpModel = {
      code: toEnglishDigits(otp),
    };
    if (type === 'mobile_number')
      tempData.mobile_number = toEnglishDigits(info.phone);
    if (type === 'email') tempData.email = info.email;

    await mutateCheckOtpAsync(tempData).catch((exp) => {
      const error = exp?.result ? Object.values(exp.result)[0] : exp?.message;
      setOtpErrorText(error);
    });
  };

  const reFetchCaptcha = () => {
    resetField('captcha', {
      keepError: false,
      keepTouched: false,
      keepDirty: false,
    });
    requestCaptcha();

    useEffect(() => {
      if (!error?.success && error) {
        if (error?.result?.captcha && Object.keys(error?.result).length === 1) {
          return reFetchCaptcha();
        }
        reset({
          mobile_number: undefined,
          captcha: '',
        });
        return reFetchCaptcha();
      }
    }, [error]);
  };

  const renderOtpSubtitle = () => {
    if (type === 'email') {
      return AUTH_OTP_SUBTITLE.email(info.email ?? '');
    }
    return AUTH_OTP_SUBTITLE.sms(
      toPersianDigits(maskPhoneNum(info.phone) ?? ''),
    );
  };

  useEffect(() => {
    if (watch('email')) {
      setInfo({ email: watch('email') || '', phone: '' });
    } else {
      setInfo({ phone: watch('mobile_number')?.toString() || '', email: '' });
    }
  }, [watch('mobile_number'), watch('email')]);

  const setCaptchaError = (message?: string) => {
    if (message) {
      return setError('captcha', { type: 'custom', message });
    }
    return clearErrors('captcha');
  };

  if (showOTP)
    return (
      <OTP
        title={global.passwordRecovery}
        icon={<Icon icon="ForgetPass-TwoTone" size={22} />}
        subtitle={renderOtpSubtitle()}
        onChange={setOtp}
        isLoading={checkOtpLoading}
        onSubmit={submitOtp}
        hasResend
        onResend={mutateResendLoginCodeAsync}
        hasError={otp.length === 6 && checkOtpError && !checkOtpLoading}
        errorText={otpErrorText}
        footer={
          <span
            className="block cursor-pointer text-center text-sm text-primary-500"
            onClick={() => {
              setOtp('');
              setOtpErrorText('');
              setInfo({ phone: '', email: '' });
              setShowOTP(false);
              reset({
                mobile_number: undefined,
                email: '',
              });
            }}
          >
            {global.selectAnotherPhoneIrEmail}
          </span>
        }
      />
    );

  return (
    <AuthBox
      header={global.passwordRecovery}
      icon={<Icon icon="ForgetPass-TwoTone" size={21} />}
    >
      <div className="mt-10">
        <RadioGroup
          switchTheme
          options={[
            {
              key: 'mobile_number',
              label: global.mobileNumber,
              value: 'mobile_number',
            },
            { key: 'email', label: global.email, value: 'email' },
          ]}
          defaultSelected={type}
          onChange={setType}
        />
      </div>
      <Alert
        slug={{
          feature: 'authentication',
          section: 'forgot-password',
          step: 'submit',
        }}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="mb-6 mt-6 w-full">
            {type === 'mobile_number' ? (
              <Controller
                control={control}
                name={'mobile_number'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup>
                    <FormLabel htmlFor="mobile_number">
                      {global.mobileNumber}
                    </FormLabel>
                    <FormInput
                      {...register('mobile_number')}
                      name="mobile_number"
                      placeholder={global.sampleMobileNumber}
                      value={value}
                      onChange={onChange}
                      maxLength={11}
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
                control={control}
                name={'email'}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <FormGroup className="mb-4">
                    <FormLabel htmlFor="email">{global.email}</FormLabel>
                    <FormInput
                      {...register('email')}
                      name="email"
                      placeholder={global.emailSample}
                      value={value}
                      onChange={onChange}
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
          <Button
            fullWidth
            className="mb-10 "
            size="lg"
            disabled={!isValid}
            isLoading={forgetLoading}
          >
            {global.sendRecoveryCode}
          </Button>
          {!isMobile && (
            <Link
              href="/auth/login"
              className="block text-center text-sm font-normal text-primary-500"
            >
              {global.backToLogin}
            </Link>
          )}
        </form>
      </FormProvider>
    </AuthBox>
  );
};

export default ForgotPasswordPage;
