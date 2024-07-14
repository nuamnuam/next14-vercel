import styles from './style.module.scss';

import React, { useEffect, useMemo, useState } from 'react';
import OtpInput from 'react-otp-input';
import clsx from 'classnames';

import { useModal } from '@/hooks/useModal';
import { getLang, toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

import { Button, Icon, IconButton, InputAlert, Modal } from '..';
import ModalFooter from '../Modal/ModalFooter';

const TWOFA_TYPES = {
  SMS: 'sms',
  EMAIL: 'email',
  GOOGLE: 'google2fa',
};

interface Props {
  channel?: {
    status: boolean;
    type: 'sms' | 'email' | 'google2fa';
    channel: string;
  };
  title: string;
  subtitle?: React.ReactNode;
  hasError?: boolean;
  isLoading: boolean;
  hasResend?: boolean;
  otp: string;
  errorText?: string;
  onChange: (val: string) => void;
  initAction?: () => void;
  onResend?: () => void;
  onSubmit?: (
    value: string | undefined,
    e?: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
}

const [global] = getLang(['global']);

export const OTP_SUBTITLEـTYPES = {
  sms: (value: string) => (
    <p>
      {global.a6digitsCodeMobile}
      <span className="dir-ltr inline-block mx-1">
        {toPersianDigits(value)}
      </span>
      {global.sent}
    </p>
  ),
  email: (value: string) => (
    <p>
      {global.a6digitsCodeEmail} {value} {global.sent1}.
    </p>
  ),
  google2fa: () => <p>{global.a6digitsCodeGoogle}</p>,
};

export const otpModalName = 'otp-modal';
const OtpModal: React.FC<Props> = ({
  channel,
  title = '',
  subtitle = '',
  hasError = false,
  isLoading = false,
  hasResend = true,
  initAction,
  onSubmit,
  onResend,
  otp = '',
  errorText,
  onChange,
}) => {
  const [global] = useLang(['global']);

  const [showResend, setShowResend] = useState(false);
  const { closeSyncModal, isSyncModalOpen } = useModal(otpModalName);

  useEffect(() => {
    initAction?.();
  }, []);

  useEffect(() => {
    if (otp && otp.length === 6) {
      onSubmit?.(otp);
    }
  }, [otp]);

  useEffect(() => {
    if (!isSyncModalOpen) {
      onChange('');
    }
  }, [isSyncModalOpen]);

  const changeOpt = (val: any) => {
    onChange(val);
  };

  const resendOtp = () => {
    setShowResend(false);
    changeOpt('');
    onResend?.();
  };

  const renderSubtitle = useMemo(() => {
    if (subtitle) return subtitle;
    if (!channel) return null;
    return OTP_SUBTITLEـTYPES[channel.type](channel.channel);
  }, [channel, subtitle]);

  const shouldShowResend = useMemo(() => {
    return hasResend && channel && channel.type !== TWOFA_TYPES.GOOGLE;
  }, [channel, hasResend]);

  return (
    <Modal
      sync
      name={otpModalName}
      onClose={closeSyncModal}
      titleWrapperClassName="!px-10"
      contentAddtionalClassNames="!pt-8 lg:!pt-0 lg:!px-10"
      title={title}
      fullScreen
      headerIcon="PasswordCheck-TwoTone"
      extra={
        <IconButton
          className="border-dark-200 text-dark-600"
          size="lg"
          icon={<Icon icon="History-OutLined" size={16} />}
        />
      }
    >
      <div
        className={clsx(
          'bg-white px-4 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10 lg:p-0 rounded-lg max-w-[462px] lg:max-w-none mx-auto',
          styles.otp,
          hasError && styles.otp__hasError,
        )}
      >
        <span className="mt-0 mb-6 lg:mt-6 lg:mb-6 block text-sm text-primary-600">
          {renderSubtitle}
        </span>
        <span className="mb-2 block text-sm font-medium text-dark-600">
          {global.enterOTPCode}
        </span>
        <OtpInput
          value={toPersianDigits(otp)}
          onChange={changeOpt}
          numInputs={6}
          isInputNum
        />
        {errorText && hasError ? (
          <div
            style={{ direction: 'rtl' }}
            className="mt-1.5 flex items-center text-sm text-danger-600"
          >
            <InputAlert message={errorText} variant="danger" />
          </div>
        ) : null}
        {shouldShowResend ? (
          !showResend ? (
            <CountDown
              onFinished={() => {
                setShowResend(true);
              }}
            />
          ) : (
            <span className="mt-6 block text-sm font-medium text-dark-600">
              {global.didNotGetOTPCode}
              <span
                className="mr-1 cursor-pointer text-sm text-primary-500"
                onClick={() => {
                  resendOtp();
                }}
              >
                {global.resend}
              </span>
            </span>
          )
        ) : null}
        <ModalFooter fullScreen>
          <Button
            fullWidth
            size="lg"
            className="lg:mt-6"
            isLoading={isLoading}
            disabled={!otp || Number(otp?.length) < 6}
            onClick={async () => {
              await onSubmit?.(otp);
            }}
          >
            {global.confirm}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default OtpModal;

interface CountDownProps {
  initialTime?: number;
  onFinished: () => void;
}

let timer: any = null;
const CountDown: React.FC<CountDownProps> = ({
  initialTime = 60,
  onFinished,
}) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (timer) clearTimeout(timer);
    if (time === 0) {
      onFinished();
      return;
    }
    timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  return (
    <span className="align-center lg:mb-6 mt-6 flex text-sm font-medium text-dark-600">
      <span className="ml-1">{toPersianDigits(time)}</span>
      <span>{global.secondsToResend}</span>
    </span>
  );
};
