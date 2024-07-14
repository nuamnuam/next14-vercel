import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  Alert,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type IChangePasswordModel } from '@/types/myAccount';
import { Request, getLang } from '@/utils';
import Icon from '@/components/Common/Icon';
import { useBreakpoint, useLang } from '@/hooks';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
interface Props {
  formSubmit: (data: any) => void;
  isLoading: boolean;
}

const [security] = getLang(['security']);

export const oneUpperCaseRegex = /^(?=.*[A-Z])/;
export const oneLowerCaseRegex = /^(?=.*[a-z])/;
export const oneNumberRegex = /^(?=.*[0-9])/;

const formSchema = yup.object().shape({
  current_password: yup.string().required(security.curentPasswordIsRequired),
  new_password: yup
    .string()
    .required(security.passwordRequired)
    .notOneOf([yup.ref('current_password')], security.shoulNotMatch)
    .min(8, ' ')
    .matches(oneLowerCaseRegex, { message: ' ' })
    .matches(oneUpperCaseRegex, { message: ' ' })
    .matches(oneNumberRegex, { message: ' ' }),
});

const CurrentPasswordForm: React.FC<Props> = ({ isLoading, formSubmit }) => {
  const [security] = useLang(['security']);
  const { isDesktop } = useBreakpoint();

  const [type] = useState('mobile_number');
  const [showOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };

  const methods = useForm<IChangePasswordModel>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    reset();
  }, [type]);

  useEffect(() => {
    // @@@ TEMPORARY
    if (showOTP) return;
    Request.removeToken();
  }, [showOTP]);
  const [rules, setRules] = useState<any>({
    minChars: { value: false, label: security.min8Chars },
    lowerCase: { value: false, label: security.min1Lower },
    upperCase: { value: false, label: security.min1Upper },
    number: { value: false, label: security.min1Number },
  });

  const renderIcon = (input: string) => {
    if (input === 'password') {
      return (
        <div className="cursor-pointer" onClick={handleClickShowPassword}>
          <Icon
            icon={showPassword ? 'Eye-OutLined' : 'EyeInvisible-OutLined'}
            size={23}
            className={showPassword ? 'text-primary-500' : 'text-dark-500'}
          />
        </div>
      );
    }
    return (
      <div className="cursor-pointer" onClick={handleClickShowNewPassword}>
        <Icon
          icon={showNewPassword ? 'Eye-OutLined' : 'EyeInvisible-OutLined'}
          size={23}
          className={showNewPassword ? 'text-primary-500' : 'text-dark-500'}
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
  return (
    <div className="max-w-[462px] mx-auto lg:px-4">
      <Alert
        slug={{
          feature: 'user-account',
          section: 'security-change-password',
          step: 'submit',
        }}
        className="!mt-0"
      />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="rounded-lg bg-white px-4 py-6 md:bg-none md:p-0"
        >
          <div className="mt-6 w-full">
            <Controller
              name={'current_password'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-6">
                  <FormLabel htmlFor="current_password">
                    <div className="flex w-full justify-between">
                      {security.currentPassword}
                    </div>
                  </FormLabel>
                  <FormInput
                    {...register('current_password')}
                    name="current_password"
                    placeholder={security.enterCurrentPassword}
                    value={value}
                    onChange={onChange}
                    inputType={showPassword ? 'text' : 'password'}
                    leftIcon={renderIcon('password')}
                    ltr
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
              name={'new_password'}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <FormGroup className="mb-6">
                  <FormLabel htmlFor="new_password">
                    <div className="flex w-full justify-between">
                      {security.newPassword}
                    </div>
                  </FormLabel>

                  <FormInput
                    {...register('new_password', {
                      onChange: handlePasswordChange,
                    })}
                    name="new_password"
                    placeholder={security.enterPassword}
                    value={value}
                    onChange={onChange}
                    ltr
                    inputType={showNewPassword ? 'text' : 'password'}
                    leftIcon={renderIcon('new_password')}
                    error={invalid}
                    caption={
                      error?.message === security.shoulNotMatch
                        ? error?.message
                        : null
                    }
                    captionIcon={
                      <Icon
                        icon="CloseCircle-OutLined"
                        className="text-danger-600"
                        size={14}
                      />
                    }
                  />
                  {Object.keys(rules).map((i) => (
                    <div key={i} className="mt-2 mb-3 flex items-center gap-1">
                      {rules[i].value ? (
                        <Icon
                          icon="InfoCircle-OutLined"
                          className="text-info-500 [&>*]:fill-[#0299F2]"
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
                          rules[i].value ? 'text-dark-600' : 'text-danger-600'
                        } text-xs`}
                      >
                        {rules[i].label}
                      </span>
                    </div>
                  ))}
                  {/* <FormInput
                    {...register('new_password')}
                    name="new_password"
                    placeholder={security.enterCurrentPassword}
                    value={value}
                    onChange={onChange}
                    inputType={showPassword ? 'text' : 'password'}
                    leftIcon={renderIcon()}
                    error={invalid}
                    caption={error?.message}
                    captionIcon={
                      <Icon
                        icon="CloseCircle-OutLined"
                        className="text-danger-600"
                        size={14}
                      />
                    }
                  /> */}
                </FormGroup>
              )}
            />
          </div>
          <ModalFooter fullScreen>
            <Button
              size={isDesktop ? 'lg' : 'md'}
              fullWidth
              isLoading={isLoading}
              disabled={!isValid}
              onClick={handleSubmit(formSubmit)}
            >
              {security.changePassword}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </div>
  );
};

export default CurrentPasswordForm;
