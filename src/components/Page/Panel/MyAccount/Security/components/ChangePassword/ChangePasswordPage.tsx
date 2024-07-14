import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Icon, Button, Modal } from '@/components/Common';
import Paper from '@/components/Common/Paper';
import { useModal } from '@/hooks/useModal';
import { useBreakpoint, useLang, useProfile } from '@/hooks';
import { useChangePasswordCheckOTPMutation } from '@/requests/panel/my-account/security/changePasswordCheckOtp';
import {
  IChangePasswordModel,
  type IChangePasswordCheckOTPModel,
} from '@/types/myAccount';
import { toEnglishDigits } from '@/utils';
import { useChangePasswordMutation } from '@/requests/panel/my-account/security/changePassword';

import OTPTemplate from '../OTP/OTPTemplate';
import CurrentPasswordForm from './CurrentPasswordForm';

const modalName = 'changePasswordModal';

interface IProps {
  title?: string;
  subTitle?: string;
  className?: string;
  faType?: string;
  noHeader?: boolean;
}

const ChangePasswordPage = ({ faType }: IProps) => {
  const [global, security] = useLang(['global', 'security']);

  const router = useRouter();

  const [page, setPage] = useState('form');
  const [otp, setOtp] = useState('');
  const [otpErrorText, setOtpErrorText] = useState('');

  const {
    showModal,
    showSyncModal,
    closeModal,
    closeSyncModal,
    isModalOpen,
    isSyncModalOpen,
  } = useModal(modalName);

  const { isDesktop } = useBreakpoint();
  const { data: profileResponse } = useProfile();

  const {
    isPending: isLoading,
    isError: changePasswordError,
    mutateAsync: mutateChangePasswordCheckOTPAsync,
  } = useChangePasswordCheckOTPMutation();

  const submitOtp = async () => {
    setOtpErrorText('');

    const tempData: IChangePasswordCheckOTPModel = {
      code: toEnglishDigits(otp),
    };
    mutateChangePasswordCheckOTPAsync(tempData)
      .then(() => {
        isDesktop ? closeSyncModal() : closeModal();
        return router.push('/auth/login');
      })
      .catch((exp) => {
        const error = exp?.result ? Object.values(exp.result)[0] : exp?.message;
        setOtpErrorText(error);
      });
  };

  const {
    isPending: formSubmitIsLoading,
    mutateAsync: mutateChangePasswordAsync,
  } = useChangePasswordMutation();

  const [formPayload, setFormPayload] = useState<IChangePasswordModel>();

  const onFormSubmit = async (data: IChangePasswordModel) => {
    try {
      const body: IChangePasswordModel = {
        current_password: data?.current_password,
        new_password: data?.new_password,
        new_password_confirmation: data?.new_password,
      };

      setFormPayload(body);

      (async () => {
        const { success } = await mutateChangePasswordAsync(body);
        if (success) setPage('otp');
      })();
    } catch (error) {
      console.log('e:', error);
    }
  };

  const getContent = (step: string) => {
    switch (step) {
      case 'otp':
        return (
          <OTPTemplate
            type={'change-password'}
            notif={
              faType === 'email'
                ? security.forMoreSecurityEnterOTPCodeEmail
                : security.forMoreSecurityEnterOTPCode
            }
            icon={<Icon icon="PasswordCheck-TwoTone" size={24} />}
            source={profileResponse?.mobile_number}
            onChange={setOtp}
            isLoading={isLoading}
            onSubmit={submitOtp}
            onResend={() => {
              setOtpErrorText('');
              mutateChangePasswordAsync(formPayload!);
            }}
            hasError={otp?.length > 5 && changePasswordError && !isLoading}
            errorText={otpErrorText}
            hasResend={profileResponse?.two_fa_type_id !== 'google2fa'}
          />
        );

      case 'form':
        return (
          <CurrentPasswordForm
            formSubmit={onFormSubmit}
            isLoading={formSubmitIsLoading}
          />
        );
      default:
        return null;
    }
  };

  if (!isDesktop) {
    return <div className="!bg-dark-50">{getContent(page)}</div>;
  }
  return (
    <>
      {(isModalOpen || isSyncModalOpen) && (
        <Modal
          sync={isDesktop}
          noTransition={!isDesktop}
          name={modalName}
          onClose={() => {
            isDesktop ? closeSyncModal() : closeModal();
            setPage('form');
          }}
          title={
            page === 'otp'
              ? security.twoStepAuthentication
              : global.changePassword
          }
          headerIcon="ForgetPass-TwoTone"
          titleWrapperClassName="!px-10"
          fullScreen={!isDesktop}
        >
          {getContent(page)}
        </Modal>
      )}
      <Paper classNames="p-2 mt-8 py-5 px-10">
        <div>
          <h2 className="text-sm font-medium text-dark-800">
            {global.password}
          </h2>
          <h3 className="mt-1 text-[10px] font-normal text-dark-600">
            {security.noTransPermissionAfterChangePass}
          </h3>
        </div>
        <Button
          size="sm"
          className="rounded"
          onClick={() => {
            isDesktop ? showSyncModal() : showModal();
          }}
        >
          {global.changePassword}
        </Button>
      </Paper>
    </>
  );
};

export default ChangePasswordPage;
