import React, { useState } from 'react';
import { Icon } from '@/components/Common';
import { useGoogle2FAVerifyMutation } from '@/requests/panel/my-account/security/google2FAVerify';
import { IChangePasswordGetOTPModel, type ICode } from '@/types/myAccount';
import { useConfirmOTPMutation } from '@/requests/panel/my-account/security/confirmOtp';
import { toEnglishDigits } from '@/utils';
import OTPTemplate from '../OTP/OTPTemplate';
import { DownloadAppStep, ScanBarcodeStep } from './index';
import { useLang, useProfile } from '@/hooks';
import { useChangePasswordGetOTPMutation } from '@/requests/panel/my-account/security/changeTwoStepOtp';

interface IProps {
  showTwoStep2F: any;
  closeModal: () => void;
  handleRefetchData: () => void;
  page: string;
  setPage: (val: string) => void;
}

const App2FAPage = ({
  showTwoStep2F,
  closeModal,
  handleRefetchData,
  page,
  setPage,
}: IProps) => {
  const [security] = useLang(['security']);

  const [otp, setOtp] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');
  const { data: profile } = useProfile();

  const {
    isPending: confirmOtpLoading,
    isError: confirmOtpError,
    mutateAsync: mutateConfirmOtpAsync,
    data: barcodeData,
  } = useConfirmOTPMutation();

  const {
    isPending: isLoading,
    isError: google2FaError,
    mutateAsync: mutateGoogle2FaVerifyAsync,
  } = useGoogle2FAVerifyMutation();

  const { mutateAsync: mutateGetOTPAsync } = useChangePasswordGetOTPMutation();

  const handleSubmitOtp = async () => {
    setOtpErrorText('');

    const tempData: ICode = {
      code: toEnglishDigits(otp),
    };
    await mutateGoogle2FaVerifyAsync(tempData)
      .then(() => {
        closeModal();
        handleRefetchData();
      })
      .catch((exp) => {
        const error = exp?.result ? Object.values(exp.result)[0] : exp?.message;
        setOtpErrorText(error);
      });
  };

  const submitConfirmEmailOtp = async () => {
    setOtpErrorText('');

    const tempData: ICode = {
      code: toEnglishDigits(otp),
    };
    await mutateConfirmOtpAsync(tempData)
      .then(() => {
        setPage('download_app');
        setOtpErrorText('');
      })
      .catch((exp) => {
        const error = exp?.result ? Object.values(exp.result)[0] : exp?.message;
        setOtpErrorText(error);
      });
  };

  const handleRadioOnChange = async (e: string) => {
    const tempData: IChangePasswordGetOTPModel = {
      two_step: e,
    };

    await mutateGetOTPAsync(tempData);
    setOtpErrorText('');
  };

  const getContent = (step: string) => {
    switch (step) {
      case 'otp':
        return (
          <OTPTemplate
            type={showTwoStep2F?.result?.two_step?.type ?? ''}
            notif={security.enterAuthenticatorAppCode}
            icon={<Icon icon="PasswordCheck-TwoTone" size={24} />}
            source={showTwoStep2F?.result?.two_step?.channel}
            onChange={setOtp}
            isLoading={confirmOtpLoading}
            onSubmit={submitConfirmEmailOtp}
            hasResend={profile?.two_fa_type_id !== 'google2fa'}
            hasError={otp?.length > 5 && confirmOtpError && !isLoading}
            errorText={otpErrorText}
            onResend={() => handleRadioOnChange('google2fa')}
          />
        );
      case 'download_app':
        return <DownloadAppStep setPage={setPage} />;
      case 'scan_barcode':
        return (
          <ScanBarcodeStep
            setPage={setPage}
            barcodeData={barcodeData?.result}
          />
        );
      case 'app_2FA_otp':
        return (
          <OTPTemplate
            type={'google2fa'}
            notif={security.enterAuthenticatorAppCode}
            icon={<Icon icon="PasswordCheck-TwoTone" size={24} />}
            source={1}
            onChange={setOtp}
            isLoading={isLoading}
            onSubmit={handleSubmitOtp}
            hasResend={false}
            hasError={otp?.length > 5 && google2FaError && !isLoading}
            errorText={otpErrorText}
          />
        );
    }
  };

  return <div>{getContent(page)}</div>;
};

export default App2FAPage;
