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
import { type ResetPasswordModel } from '@/types/auth';

import AuthBox from '../AuthBoxPage';
import {
  oneLowerCaseRegex,
  oneUpperCaseRegex,
  oneNumberRegex,
} from '../SignUp/SignupPage';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBreakpoint, useLang } from '@/hooks';
import { Request, getLang } from '@/utils';
import { useResetPasswordMutation } from '@/requests/auth/resetPasswordMutation';

const [auth] = getLang(['auth']);

const schema = yup.object().shape({
  password: yup
    .string()
    .required(auth.passwordRequired)
    .min(8, '')
    .max(20, '')
    .matches(oneLowerCaseRegex, { message: ' ' })
    .matches(oneUpperCaseRegex, { message: ' ' })
    .matches(oneNumberRegex, { message: ' ' }),
});

const ResetPasswordPage: React.FC = () => {
  const [global, auth] = useLang(['global', 'auth']);

  const { isMobile } = useBreakpoint();
  const [showPassword, setShowPassword] = useState(false);
  const [rules, setRules] = useState<any>({
    minChars: { value: false, label: auth.min8chars },
    lowerCase: { value: false, label: auth.min1Lower },
    upperCase: { value: false, label: auth.min1Upper },
    number: { value: false, label: auth.min1Number },
  });

  const { isPending: resetPasswordLoading, mutateAsync: resetPasswordAsync } =
    useResetPasswordMutation();

  const methods = useForm<ResetPasswordModel>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    reset();
    return () => {
      Request.setToken('');
      // sessionStorage.removeItem('temp-token');
    };
  }, []);

  const onSubmitHandler = async (data: ResetPasswordModel) => {
    const { password } = data;
    const tempData: ResetPasswordModel = {
      password,
      password_confirmation: password,
    };
    await resetPasswordAsync(tempData);
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

  return (
    <AuthBox
      header={global.newPassword}
      icon={<Icon icon="ForgetPass-TwoTone" size={21} />}
    >
      <Alert
        slug={{
          feature: 'authentication',
          section: 'forgot-password',
          step: 'set-new',
        }}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="mb-6 mt-6 w-full">
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
                    defaultValue=""
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
          </div>
          <Button
            fullWidth
            className="mb-10 "
            size="lg"
            isLoading={resetPasswordLoading}
            disabled={!isValid}
          >
            {global.confirm}
          </Button>
          {!isMobile && (
            <Link
              href="/auth/login"
              className="flex items-center justify-center text-sm font-normal text-primary-600"
            >
              {global.cancelAndReturnToLogin}
            </Link>
          )}
        </form>
      </FormProvider>
    </AuthBox>
  );
};

export default ResetPasswordPage;
