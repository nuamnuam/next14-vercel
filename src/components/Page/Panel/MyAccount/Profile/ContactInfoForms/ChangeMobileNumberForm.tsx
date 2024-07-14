import React, { useState, useEffect, useRef } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { useChangeMobileMutation } from '@/requests/panel/my-account/profile/mobile/changeMobile';
import { useCheckCurrentMobileMutation } from '@/requests/panel/my-account/profile/mobile/checkCurrentMobile';
import { useCheckNewMobileMutation } from '@/requests/panel/my-account/profile/mobile/checkNewMobile';
import {
  Icon,
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Alert,
} from '@/components/Common';
import { yupResolver } from '@hookform/resolvers/yup';
import { type IMobileNumber, type ICode } from '@/types/myAccount';
import { getLang, toEnglishDigits } from '@/utils';

import OTPTemplate from './OTP/OTPTemplate';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { useRouter } from 'next/router';

interface IProps {
  step?: number;
  setStep?: (step: number) => void;
  closeModal?: () => void;
  currentMobile?: string;
}

const [myAccount] = getLang(['myAccount']);

const formSchema = yup.object().shape({
  mobile_number: yup
    .string()
    .required(myAccount.mobileNumberRequired)
    .test('match', myAccount.wrongMobileNumber, (val: any) =>
      /^(\+98|0)?9\d{9}$/.test(toEnglishDigits(val)),
    ),
});

const ChangeMobileNumberForm: React.FC<IProps> = (props: IProps) => {
  const [myAccount] = useLang(['myAccount']);

  const {
    step,
    setStep = () => {},
    closeModal = () => {},
    currentMobile,
  } = props;

  const [shouldRenderOtp, setShouldRenderOtp] = useState(true);
  const { refetch: reFetchProfile } = useProfile();
  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const otpRef = useRef<{ resetOtp: () => void }>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [showConfirmNewMobileOTP, setShowConfirmNewMobileOTP] = useState(false);
  const [checkCurrentMobileError, setCheckCurrentMobileError] = useState(false);
  const [checkNewMobileError, setCheckNewMobileError] = useState(false);
  const [otpErrorText, setOtpErrorText] = useState('');

  const methods = useForm<IMobileNumber>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = methods;
  const { isPending: editMobileLoading, mutateAsync: mutateChangeMobileAsync } =
    useChangeMobileMutation();

  const {
    isPending: checkCurrentMobileLoading,
    isError: checkCurrentMobileApiError,
    mutateAsync: mutateCheckCurrentMobileAsync,
  } = useCheckCurrentMobileMutation();

  const {
    isPending: checkNewMobileLoading,
    isError: checkNewMobileApiError,
    mutateAsync: mutateCheckNewMobileAsync,
  } = useCheckNewMobileMutation();

  useEffect(() => {
    setCheckCurrentMobileError(checkCurrentMobileApiError);
  }, [checkCurrentMobileApiError]);

  useEffect(() => {
    setCheckNewMobileError(checkNewMobileApiError);
  }, [checkNewMobileApiError]);

  const onCloseModal = () => {
    closeModal();
    setTimeout(() => {
      setShowOTP(false);
    }, 100);
  };

  useEffect(() => {
    if (step === 1) {
      setShowOTP(false);
    }
  }, [step]);

  const onSubmitHandler = async (data: IMobileNumber) => {
    try {
      const { mobile_number, ...rest } = data;
      const body: IMobileNumber = {
        mobile_number,
      };

      const { success } = await mutateChangeMobileAsync(body);
      if (success) {
        setShowOTP(true);
        setOtpErrorText('');
        setStep && setStep(2);
      }
    } catch (error) {
      console.log('e:', error);
    }
  };

  const submitOtp = async () => {
    try {
      const tempData: ICode = {
        code: toEnglishDigits(otp),
      };

      if (showConfirmNewMobileOTP) {
        await mutateCheckNewMobileAsync(tempData)
          .then(() => {
            setShouldRenderOtp(false);
            setTimeout(() => setShouldRenderOtp(true), 0);
            reFetchProfile();
            setOtpErrorText('');

            if (isDesktop) {
              closeModal();
              setShowOTP(false);
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
        await mutateCheckCurrentMobileAsync(tempData)
          .then(() => {
            otpRef.current?.resetOtp();
            setTimeout(() => setShouldRenderOtp(true), 0);
            setStep?.(3);
            setShowConfirmNewMobileOTP(true);
            setShouldRenderOtp(false);
            setOtpErrorText('');
          })
          .catch((exp) => {
            const error = exp?.result
              ? Object.values(exp.result)[0]
              : exp?.message;
            setOtpErrorText(error);
          });
      }
    } catch (error) {
      console.log('e:', error);
    }
  };

  const onResend = async () => {
    try {
      setOtpErrorText('');
      otpRef.current?.resetOtp();
      setCheckCurrentMobileError(false);
      setCheckNewMobileError(false);

      const body: IMobileNumber = {
        mobile_number: getValues('mobile_number'),
      };
      await mutateChangeMobileAsync(body);
    } catch (error) {
      console.log('e:', error);
    }
  };
  if (showConfirmNewMobileOTP)
    return (
      <>
        <div className="mt-4 rounded-lg bg-white pt-6 px-4 pb-7 sm:py-10 sm:px-7 lg:mt-0 lg:p-0">
          <div className="mb-7 hidden items-center justify-between lg:flex">
            <div className="flex items-center justify-start gap-x-3">
              <span className="w-10 h-10 flex justify-center items-center rounded-xl bg-primary-50 p-2">
                <Icon icon={'PasswordCheck-TwoTone'} size={18} />
              </span>
              <p className="text-lg font-bold leading-7	text-dark-600">
                {myAccount.confirmNewMobile}
              </p>
            </div>
            <Icon onClick={onCloseModal} icon={'Close-OutLined'} size={18} />
          </div>
          {shouldRenderOtp && (
            <OTPTemplate
              ref={otpRef}
              type="email"
              title={myAccount.confitmEmailMobile}
              icon={<Icon icon="Mobile-TwoTone" size={24} />}
              source={getValues('mobile_number')}
              onChange={setOtp}
              isLoading={checkNewMobileLoading}
              onSubmit={submitOtp}
              onResend={onResend}
              hasError={
                otp?.length > 5 && checkNewMobileError && !checkNewMobileLoading
              }
              errorText={otpErrorText}
            />
          )}
        </div>
        <ModalFooter fullScreen className="lg:hidden">
          <Button
            size="lg"
            fullWidth
            disabled={otp?.length !== 6}
            isLoading={checkNewMobileLoading}
            onClick={handleSubmit(onSubmitHandler)}
          >
            {myAccount.confirm}
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
              <span className="w-10 h-10 flex justify-center items-center rounded-xl bg-primary-50 p-2">
                <Icon icon={'PasswordCheck-TwoTone'} size={18} />
              </span>
              <p className="text-lg font-bold leading-7	text-dark-600">
                {myAccount.confirmCurrentMobile}
              </p>
            </div>
            <Icon onClick={onCloseModal} icon={'Close-OutLined'} size={18} />
          </div>

          <OTPTemplate
            ref={otpRef}
            type="change-mobile"
            title={myAccount.confitmEmailMobile}
            icon={<Icon icon="Mobile-TwoTone" size={24} />}
            source={currentMobile}
            onChange={setOtp}
            isLoading={checkCurrentMobileLoading}
            onSubmit={submitOtp}
            onResend={onResend}
            hasError={
              otp?.length > 5 &&
              checkCurrentMobileError &&
              !checkCurrentMobileLoading
            }
            errorText={otpErrorText}
          />
        </div>
        <ModalFooter fullScreen className="lg:hidden">
          <Button
            size="lg"
            fullWidth
            disabled={otp?.length !== 6}
            isLoading={checkCurrentMobileLoading}
            onClick={handleSubmit(onSubmitHandler)}
          >
            {myAccount.confirm}
          </Button>
        </ModalFooter>
      </>
    );
  return (
    <>
      <div className="mt-4 rounded-lg md:mt-8 lg:bg-white lg:mt-0">
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <div className="flex items-center justify-start gap-x-3">
            <span className=" rounded-xl bg-primary-50 p-2 w-10 h-10 flex justify-center items-center">
              <Icon icon={'Mobile-TwoTone'} size={21} />
            </span>
            <p className="text-lg font-bold leading-7	text-dark-600">
              {myAccount.changeMobileNumber}
            </p>
          </div>
          <Icon icon={'Close-OutLined'} onClick={onCloseModal} size={18} />
        </div>

        <Alert
          slug={{
            feature: 'user-account',
            section: 'profile-change-mobile',
            step: 'submit',
          }}
        />
        {/* <Alert
          slug={{
            feature: 'user-account',
            section: 'profile-change-mobile',
            step: 'submit',
          }}
        /> */}

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="block mt-7 items-center justify-start rounded-lg bg-white py-5 px-4 sm:flex-col lg:p-0"
          >
            <div className="flex w-full flex-wrap gap-x-4">
              <div className="w-full">
                <Controller
                  name={'mobile_number'}
                  render={({
                    field: { onChange, value },
                    fieldState: { error, invalid },
                  }) => (
                    <FormGroup className="mb-4">
                      <FormLabel htmlFor="mobile_number">
                        {myAccount.newMobileNumber}
                      </FormLabel>

                      <FormInput
                        {...register('mobile_number')}
                        name="mobile_number"
                        placeholder={myAccount.sampleMobileNumber}
                        value={value}
                        onChange={onChange}
                        error={value?.length === 11 && invalid}
                        maxLength={11}
                        onlyNumber
                        caption={value?.length === 11 && error?.message}
                        ltr
                      />
                    </FormGroup>
                  )}
                />
              </div>
            </div>

            <Button
              size="lg"
              className="mt-2 hidden lg:block"
              fullWidth
              disabled={!isValid}
              isLoading={editMobileLoading}
            >
              {myAccount.nextStep}
            </Button>
          </form>
        </FormProvider>
      </div>
      <ModalFooter fullScreen className="lg:hidden">
        <Button
          size="lg"
          fullWidth
          disabled={!isValid}
          isLoading={editMobileLoading}
          onClick={handleSubmit(onSubmitHandler)}
        >
          {myAccount.confirm}
        </Button>
      </ModalFooter>
    </>
  );
};
export default ChangeMobileNumberForm;
