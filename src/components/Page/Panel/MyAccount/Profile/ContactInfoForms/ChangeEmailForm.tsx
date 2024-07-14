import React, { useState, useEffect, useRef } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useSetNewEmailMutation } from '@/requests/panel/my-account/profile/email/setNewEmail';
import { useCheckNewEmailMutation } from '@/requests/panel/my-account/profile/email/checkNewEmail';
import { useEditEmailMutation } from '@/requests/panel/my-account/profile/email/editEmail';
import { useCheckCurrentEmailMutation } from '@/requests/panel/my-account/profile/email/checkCurrentEmail';
import { useConfirmNewEmailMutation } from '@/requests/panel/my-account/profile/email/confirmNewEmail';
import { useResendNewEmailMutation } from '@/requests/panel/my-account/profile/email/resendNewEmail';
import { getLang, toEnglishDigits } from '@/utils';
import {
  Icon,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Alert,
} from '@/components/Common';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { type IEmail, type ICode } from '@/types/myAccount';

import OTPTemplate from './OTP/OTPTemplate';
import { useResendCurrentEmailMutation } from '@/requests/panel/my-account/profile/email/resendCurrentEmail';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
interface IProps {
  step?: number;
  setStep?: (step: number) => void;
  closeModal?: () => void;
  isEdit?: boolean;
  currentEmail?: string;
}

const [global] = getLang(['global']);

const formSchema = yup.object().shape({
  email: yup
    .string()
    .required(global.emailRequired)
    .email(global.wrongEmail)
    .test('match', global.wrongEmail, (val: any) =>
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
    ),
});

const ChangeEmailForm = (props: IProps) => {
  const {
    step,
    currentEmail,
    setStep = () => {},
    closeModal = () => {},
    isEdit,
  } = props;

  const [global, myAccount] = useLang(['global', 'myAccount']);

  const otpRef = useRef<{ resetOtp: () => void }>(null);
  const { refetch: reFetchProfile } = useProfile();
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const [showOTP, setShowOTP] = useState(false);
  const [showConfirmNewEmailOTP, setShowConfirmNewEmailOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [checkNewEmailError, setCheckNewEmailError] = useState(false);
  const [checkCurrentEmailError, setCheckCurrentEmailError] = useState(false);
  const [confirmNewEmailError, setConfirmNewEmailError] = useState(false);
  const [otpErrorText, setOtpErrorText] = useState('');

  const { isPending: newEmailLoading, mutateAsync: mutateSetNewEmailAsync } =
    useSetNewEmailMutation();

  const {
    isPending: checkNewEmailLoading,
    isError: checkNewEmailApiError,
    mutateAsync: mutateCheckNewEmailAsync,
  } = useCheckNewEmailMutation();

  const { isPending: editEmailLoading, mutateAsync: mutateEditEmailAsync } =
    useEditEmailMutation();

  const {
    isPending: checkCurrentEmailLoading,
    mutateAsync: mutateCheckCurrentEmailAsync,
  } = useCheckCurrentEmailMutation();

  const {
    isPending: confirmNewEmailLoading,
    isError: confirmNewEmailApiError,
    mutateAsync: mutateConfirmNewEmailAsync,
  } = useConfirmNewEmailMutation();

  useEffect(() => {
    setCheckNewEmailError(checkNewEmailApiError);
  }, [checkNewEmailApiError]);

  useEffect(() => {
    setConfirmNewEmailError(confirmNewEmailApiError);
  }, [confirmNewEmailApiError]);

  const { mutateAsync: mutateResendNewEmailAsync } =
    useResendNewEmailMutation();

  const { mutateAsync: mutateResendCurrentEmailAsync } =
    useResendCurrentEmailMutation();

  const methods = useForm<IEmail>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const onSubmitNewEmailHandler = async (data: IEmail) => {
    try {
      const { email } = data;
      const body: IEmail = {
        email,
      };
      if (isEdit) {
        const { success } = await mutateEditEmailAsync(body);
        if (success) {
          setShowOTP(true);
          setStep && setStep(2);
          reFetchProfile();
        }
      } else {
        const { success } = await mutateSetNewEmailAsync(body);
        if (success) {
          setShowOTP(true);
          setStep && setStep(2);
          reFetchProfile();
        }
      }
    } catch (error) {
      console.log('e:', error);
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (step === 1) {
      setShowOTP(false);
    }
  }, [step]);

  const onCloseModal = () => {
    closeModal();
    setTimeout(() => {
      setShowOTP(false);
    }, 100);
  };

  const onResend = async () => {
    otpRef.current?.resetOtp();
    setCheckCurrentEmailError(false);
    setCheckNewEmailError(false);
    setConfirmNewEmailError(false);
    setOtpErrorText('');

    const tempData: ICode = {
      code: toEnglishDigits(otp),
    };
    if (isEdit) {
      if (showConfirmNewEmailOTP) {
        await mutateResendNewEmailAsync(tempData);
      } else {
        await mutateResendCurrentEmailAsync(tempData);
      }
    } else {
      await mutateResendNewEmailAsync(tempData);
    }
  };

  const submitOtp = async () => {
    const tempData: ICode = {
      code: toEnglishDigits(otp),
    };
    if (isEdit) {
      if (showConfirmNewEmailOTP) {
        await mutateConfirmNewEmailAsync(tempData)
          .then(() => {
            if (isDesktop) {
              reFetchProfile();
              setShowConfirmNewEmailOTP(false);
              onCloseModal();
              setOtpErrorText('');
            } else {
              router.push('/panel/my-account/profile');
            }
          })
          .catch((exp) => {
            const error = exp?.result
              ? Object.values(exp.result)[0]
              : exp?.message;
            setOtpErrorText(error);
          });
      } else {
        await mutateCheckCurrentEmailAsync(tempData)
          .then(() => {
            setStep(3);
            otpRef.current?.resetOtp();
            setShowConfirmNewEmailOTP(true);
            setOtpErrorText('');
          })
          .catch((exp) => {
            const error = exp?.result
              ? Object.values(exp.result)[0]
              : exp?.message;
            setOtpErrorText(error);
          });
      }
    } else {
      try {
        mutateCheckNewEmailAsync(tempData)
          .then(() => {
            if (!currentEmail) {
              if (isDesktop) {
                reFetchProfile();
                closeModal();
                setOtpErrorText('');
              } else {
                router.push('/panel/my-account/profile');
              }
            }
          })
          .catch((exp) => {
            const error = exp?.result
              ? Object.values(exp.result)[0]
              : exp?.message;

            setOtpErrorText(error);
          });
      } catch (error) {
        setConfirmNewEmailError(true);
      }
    }
  };

  if (showConfirmNewEmailOTP)
    return (
      <>
        <div className="mt-4 rounded-lg bg-white pt-6 px-4 pb-7 sm:py-10 sm:px-7 lg:mt-0 lg:p-0">
          <div className="mb-7 hidden items-center justify-between lg:flex">
            <div className="flex items-center justify-start gap-x-3">
              <span className="block rounded-xl bg-primary-50 p-2">
                <Icon icon={'PasswordCheck-TwoTone'} size={18} />
              </span>
              <p className="text-lg font-bold leading-7	text-dark-600">
                {myAccount.confirmNewEmail}
              </p>
            </div>
            <Icon onClick={onCloseModal} icon={'Close-OutLined'} size={18} />
          </div>
          <OTPTemplate
            ref={otpRef}
            type="new-email"
            title={global.confrimMobileNumber}
            icon={<Icon icon="Mobile-TwoTone" size={24} />}
            source={getValues('email')}
            onChange={setOtp}
            isLoading={
              checkCurrentEmailLoading ||
              confirmNewEmailLoading ||
              checkNewEmailLoading
            }
            onSubmit={submitOtp}
            onResend={onResend}
            hasError={
              !checkCurrentEmailLoading &&
              !confirmNewEmailLoading &&
              !checkNewEmailLoading &&
              !!otpErrorText &&
              otp?.length > 5
            }
            errorText={otpErrorText}
          />
        </div>
        <ModalFooter fullScreen className="lg:hidden">
          <Button
            size="lg"
            fullWidth
            disabled={!isValid}
            isLoading={
              checkCurrentEmailLoading ||
              confirmNewEmailLoading ||
              checkNewEmailLoading
            }
            onClick={submitOtp}
          >
            {global.confirm}
          </Button>
        </ModalFooter>
      </>
    );
  if (showOTP)
    return (
      <>
        <div className="mt-4 rounded-lg bg-white pt-6 px-4 pb-7 sm:py-10 sm:px-7 lg:mt-0 lg:p-0">
          <div className="mb-7 hidden items-center justify-between lg:flex">
            <div className="flex items-center justify-start gap-x-3">
              <span className="block rounded-xl bg-primary-50 p-2">
                <Icon icon={'PasswordCheck-TwoTone'} size={18} />
              </span>
              <p className="text-lg font-bold leading-7	text-dark-600">
                {isEdit
                  ? myAccount.confirmCurentEmail
                  : myAccount.confirmEmailAddress}
              </p>
            </div>
            <Icon onClick={onCloseModal} icon={'Close-OutLined'} size={18} />
          </div>
          <OTPTemplate
            ref={otpRef}
            type="currentEmail"
            title={global.confrimMobileNumber}
            icon={<Icon icon="Mobile-TwoTone" size={24} />}
            source={!currentEmail ? getValues('email') : currentEmail}
            onChange={setOtp}
            isLoading={checkNewEmailLoading || checkCurrentEmailLoading}
            onSubmit={submitOtp}
            onResend={onResend}
            hasError={
              !checkNewEmailLoading &&
              !checkCurrentEmailLoading &&
              !!otpErrorText &&
              otp?.length > 5
            }
            errorText={otpErrorText}
          />
        </div>
        <ModalFooter fullScreen className="lg:hidden">
          <Button
            size="lg"
            fullWidth
            disabled={!(otp && otp?.length === 6)}
            onClick={submitOtp}
            isLoading={
              confirmNewEmailLoading ||
              checkCurrentEmailLoading ||
              checkNewEmailLoading
            }
          >
            {global.confirm}
          </Button>
        </ModalFooter>
      </>
    );

  return (
    <>
      <div className="mt-4 rounded-lg md:mt-8 lg:bg-white lg:mt-0">
        <div className="mb-7 hidden items-center justify-between lg:flex">
          <div className="flex items-center justify-start gap-x-3">
            <span className="w-10 h-10 flex justify-center items-center rounded-xl bg-primary-50 p-2">
              <Icon icon={'Mail-TwoTone'} size={18} />
            </span>
            <p className="text-lg font-bold leading-7	text-dark-600">
              {isEdit ? global.changeEmailNumber : myAccount.addEmailAddress}
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
        {isEdit && (
          <Alert
            slug={{
              feature: 'user-account',
              section: 'profile-change-email',
              step: 'submit',
            }}
          />
        )}

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitNewEmailHandler)}
            className="mt-7 block items-center justify-start rounded-md bg-white p-4 py-6 sm:flex-col sm:p-8 lg:p-0"
          >
            <div className="flex w-full flex-wrap gap-x-4">
              <div className="w-full">
                <Controller
                  name={'email'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="mb-4">
                      <FormLabel htmlFor="email">
                        {isEdit
                          ? myAccount.newEmailAddress
                          : myAccount.emailAddress}
                      </FormLabel>

                      <FormInput
                        {...register('email')}
                        name="email"
                        placeholder={global.newEmailAddressSample}
                        value={value}
                        onChange={onChange}
                        error={invalid}
                        caption={error?.message}
                        ltr
                      />
                    </FormGroup>
                  )}
                />
              </div>
            </div>

            <Button
              size="lg"
              fullWidth
              className="mt-2 hidden lg:block"
              disabled={!isValid}
              onClick={handleSubmit(onSubmitNewEmailHandler)}
              isLoading={newEmailLoading || editEmailLoading}
            >
              {global.nextStep}
            </Button>
          </form>
        </FormProvider>
      </div>
      <ModalFooter fullScreen className="lg:hidden">
        <Button
          size="lg"
          fullWidth
          disabled={!isValid}
          onClick={handleSubmit(onSubmitNewEmailHandler)}
          isLoading={newEmailLoading || editEmailLoading}
        >
          {global.nextStep}
        </Button>
      </ModalFooter>
    </>
  );
};
export default ChangeEmailForm;
