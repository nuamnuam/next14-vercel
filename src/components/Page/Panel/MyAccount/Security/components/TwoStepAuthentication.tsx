import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Paper from '@/components/Common/Paper';
import { Button, Modal, Icon, Radio, BoxDivider } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { useShowTwoStep2FMutation } from '@/requests/panel/my-account/security/showTwoStep2F';
import { useChangePasswordGetOTPMutation } from '@/requests/panel/my-account/security/changeTwoStepOtp';
import { useConfirmOTPMutation } from '@/requests/panel/my-account/security/confirmOtp';
import { type IChangePasswordGetOTPModel, type ICode } from '@/types/myAccount';
import { toEnglishDigits, toPersianDigits } from '@/utils';
import OTPTemplate from './OTP/OTPTemplate';
import App2FA from './App2FA/App2FAPage';
import RespinsiveTwoStepAuthentication from './RespinsiveTwoStepAuthentication';

const modalName = 'TwoStepAuthentication';

interface IProps {
  title?: string;
  subTitle?: string;
  className?: string;
  noHeader?: boolean;
  responsiveMode?: boolean;
}

const TwoStepAuthentication = ({
  title,
  noHeader = false,
  subTitle,
  className,
  responsiveMode = false,
}: IProps) => {
  const [security] = useLang(['security']);

  const [page, setPage] = useState<string | undefined>('');
  const [showApp2FA, setShowApp2FA] = useState('');
  const [googleAuthPage, setGoogleAuthPage] = useState('otp');
  const [otp, setOtp] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');
  const { showSyncModal, closeSyncModal } = useModal(modalName);
  const { isDesktop } = useBreakpoint();
  const router = useRouter();

  const { data: profileResponse, refetch: requestProfile } = useProfile();

  const { mutateAsync: mutateGetShow2FAsync, data: showTwoStep2F } =
    useShowTwoStep2FMutation();

  const { mutateAsync: mutateGetOTPAsync } = useChangePasswordGetOTPMutation();

  const {
    isPending: confirmOtpLoading,
    isError: confirmOtpError,
    mutateAsync: mutateConfirmOtpAsync,
  } = useConfirmOTPMutation();

  useEffect(() => {
    mutateGetShow2FAsync();
    if (!page) setPage(showTwoStep2F?.result?.two_step?.type);
  }, []);

  useEffect(() => {
    if (!page) setPage(showTwoStep2F?.result?.two_step?.type);
  }, [showTwoStep2F?.result?.two_step?.type]);

  useEffect(() => {
    if (showApp2FA) showSyncModal();
  }, [showApp2FA]);

  const handleRadioOnChange = async (e: string) => {
    if (e === 'email' && !profileResponse?.email) return;
    const tempData: IChangePasswordGetOTPModel = {
      two_step: e,
    };

    await mutateGetOTPAsync(tempData);
    setOtpErrorText('');
  };

  const submitConfirmEmailOtp = async () => {
    const tempData: ICode = {
      code: toEnglishDigits(otp),
    };

    await mutateConfirmOtpAsync(tempData)
      .then(() => {
        closeSyncModal();
        setPage('');
        mutateGetShow2FAsync();
        setShowApp2FA('');
        setGoogleAuthPage('otp');
        setOtpErrorText('');
      })
      .catch((exp) => {
        const error = exp?.result ? Object.values(exp.result)[0] : exp.message;
        setOtpErrorText(error);
      });
  };

  const handleRefetchData = () => {
    requestProfile();
    mutateGetShow2FAsync();
  };

  const getContent = (type: string) => {
    switch (type) {
      case 'sms':
        return (
          <OTPTemplate
            type={'sms'}
            notif={security.forMoreSecurityEnterOTPCodeEmail}
            icon={<Icon icon="PasswordCheck-TwoTone" size={24} />}
            source={profileResponse?.email}
            onChange={setOtp}
            isLoading={confirmOtpLoading}
            onSubmit={submitConfirmEmailOtp}
            onResend={() => handleRadioOnChange('sms')}
            hasError={otp?.length > 5 && confirmOtpError && !confirmOtpLoading}
            errorText={otpErrorText}
            hasResend={
              profileResponse && profileResponse?.two_fa_type_id !== 'google2fa'
            }
          />
        );
      case 'email':
        return (
          <OTPTemplate
            type={'email'}
            notif={security.forMoreSecurityEnterOTPCodeEmail}
            icon={<Icon icon="PasswordCheck-TwoTone" size={24} />}
            source={profileResponse?.mobile_number}
            onChange={setOtp}
            isLoading={confirmOtpLoading}
            onSubmit={submitConfirmEmailOtp}
            onResend={() => handleRadioOnChange('email')}
            hasError={otp?.length > 5 && confirmOtpError && !confirmOtpLoading}
            errorText={otpErrorText}
            hasResend={
              profileResponse && profileResponse?.two_fa_type_id !== 'google2fa'
            }
          />
        );
      case 'google2fa':
        return (
          <OTPTemplate
            type={'email'}
            notif={security.forMoreSecurityEnterOTPCodeEmail}
            icon={<Icon icon="PasswordCheck-TwoTone" size={24} />}
            source={profileResponse?.mobile_number}
            onChange={setOtp}
            isLoading={confirmOtpLoading}
            onSubmit={submitConfirmEmailOtp}
            hasResend={false}
            hasError={otp?.length > 5 && confirmOtpError && !confirmOtpLoading}
            errorText={otpErrorText}
          />
        );
      case 'app':
        return (
          <App2FA
            handleRefetchData={handleRefetchData}
            showTwoStep2F={showTwoStep2F}
            closeModal={closeSyncModal}
            page={googleAuthPage}
            setPage={setGoogleAuthPage}
          />
        );
      default:
        return null;
    }
  };

  if (!isDesktop && !responsiveMode) {
    return <RespinsiveTwoStepAuthentication />;
  }

  return (
    <>
      <Modal
        sync
        noTransition={!isDesktop}
        name={modalName}
        onClose={() => {
          closeSyncModal();
          setTimeout(() => {
            setGoogleAuthPage('otp');
            setShowApp2FA('');
          }, 500);
        }}
        title={
          showApp2FA
            ? showApp2FA === 'app'
              ? {
                  otp: security.twoStepAuthentication,
                  download_app: security.downloadApp,
                  scan_barcode: security.scanBarcode,
                  app_2FA_otp: security.twoStepAuthenticatorApp,
                }[googleAuthPage]
              : security.twoStepAuthentication
            : security.twoStepAuthentication
        }
        headerIcon={
          showApp2FA === 'app'
            ? {
                otp: 'PasswordCheck-TwoTone',
                download_app: 'Download-TwoTone',
                scan_barcode: 'ScanBarcode-TwoTone',
                app_2FA_otp: 'PasswordCheck-TwoTone',
              }[googleAuthPage]
            : 'PasswordCheck-TwoTone'
        }
        titleWrapperClassName="!px-10"
        contentAddtionalClassNames="!pt-8"
        headerClassNames="!h-[76px] !px-4 sm:!px-8"
        fullScreen
      >
        {getContent(showApp2FA)}
      </Modal>
      <Paper classNames={classNames('w-full flex flex-col', className)}>
        {!noHeader && (
          <>
            <div className="flex w-full flex-col items-start justify-center p-4 pl-7 pt-7 sm:pb-7 sm:pl-10 sm:pr-6 sm:pt-7 md:pb-[34px]">
              <p className="text-base font-normal text-dark-800	">{title}</p>
              <p className="mt-2 text-[10px] font-normal leading-4 text-dark-600">
                {subTitle}
              </p>
            </div>
            <BoxDivider className="w-full" />
          </>
        )}
        {showTwoStep2F?.result?.two_step != null && (
          <div className="w-full">
            <div className="w-full flex items-center justify-between py-6 px-6 md:px-10">
              <p className="md:w-5/12 w-8/12 text-right text-dark-800 font-medium text-xs md:text-sm leading-6 ">
                {security.twoStepAuthenticationBySMS}
              </p>
              <p
                dir="ltr"
                className="hidden w-5/12  text-center text-sm font-normal text-dark-700 sm:block "
              >
                {toPersianDigits(profileResponse?.mobile_number)}
              </p>
              <div className="w-2/12 flex justify-end items-center">
                <Radio
                  className="[&>*:nth-child(1)]:!bg-[#00DF9A]"
                  checked={showTwoStep2F?.result?.two_step?.type === 'sms'}
                  value="sms"
                  onChange={() => {
                    handleRadioOnChange('sms');
                    setShowApp2FA('sms');
                  }}
                />
              </div>
            </div>
            <div className="border-t-[1px] border-t-dark-50 border-b-[1px] border-b-dark-50 w-full flex items-center justify-between py-6 px-6 md:px-10">
              <p className="md:w-5/12 w-8/12 truncate text-right text-xs md:text-sm leading-6 font-medium text-dark-800 ">
                {security.twoStepAuthenticationByEmail}
              </p>
              <p
                dir="ltr"
                className="hidden w-5/12 truncate  justify-center items-center text-sm font-normal text-dark-700 sm:flex "
              >
                {profileResponse?.email ?? (
                  <p
                    dir="ltr"
                    className="hidden w-5/12  text-center text-sm font-normal text-dark-700 sm:block "
                  >
                    {security.noEmailRegistered}
                  </p>
                )}
              </p>
              <div
                className="w-2/12 flex justify-end items-center"
                onClick={() =>
                  profileResponse?.email ? setShowApp2FA('email') : null
                }
              >
                {!profileResponse?.email ? (
                  <Button
                    size="sm"
                    className="rounded"
                    onClick={() => {
                      router.push('/panel/my-account/profile');
                    }}
                  >
                    {security.addEmail}
                  </Button>
                ) : (
                  <Radio
                    value="email"
                    checked={showTwoStep2F?.result?.two_step?.type === 'email'}
                    onChange={() => {
                      if (!profileResponse?.email)
                        router.push('/panel/my-account/profile');
                      else {
                        setShowApp2FA('email');
                        handleRadioOnChange('email');
                      }
                    }}
                  />
                )}
              </div>
            </div>
            {showTwoStep2F?.result?.two_step?.status ? (
              <div>
                <div className="w-full flex  items-center justify-between py-6 px-6 md:px-10">
                  <p className="w-8/12 md:w-5/12 text-right text-xs md:text-sm leading-6 font-medium text-dark-800 ">
                    {security.twoStepAuthenticationByApp}
                  </p>
                  <p className="hidden w-5/12 text-center text-sm font-normal text-dark-700 sm:block">
                    {showTwoStep2F?.result?.two_step?.type === 'google2fa'
                      ? security.activated
                      : security.notActivated}
                  </p>

                  <div className="w-2/12 flex justify-end items-center">
                    {showTwoStep2F?.result?.two_step?.type === 'google2fa' ? (
                      <Radio
                        value="google2fa"
                        checked={
                          showTwoStep2F?.result?.two_step?.type === 'google2fa'
                        }
                        onChange={() => {
                          setShowApp2FA('google2fa');
                          handleRadioOnChange('google2fa');
                        }}
                      />
                    ) : (
                      <Button
                        variant="primary"
                        className="rounded"
                        onClick={() => {
                          handleRadioOnChange('google2fa');
                          setShowApp2FA('app');
                        }}
                        size="sm"
                      >
                        {security.activate}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Paper>
    </>
  );
};

export default TwoStepAuthentication;
