import OtpInput from 'react-otp-input';
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import classNames from 'classnames';

import { Button, InputAlert } from '@/components/Common';
import { toPersianDigits } from '@/utils';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useLang, useProfile } from '@/hooks';

import styles from './style.module.scss';

interface Props {
  type: string;
  title?: string;
  hasError?: boolean;
  source: any;
  isLoading: boolean;
  hasResend?: boolean;
  footer?: React.ReactNode;
  icon: React.ReactNode;
  errorText?: string;
  initAction?: () => void;
  onChange?: Dispatch<SetStateAction<string>>;
  onResend?: () => void;
  onSubmit?: (
    value: string | undefined,
    e?: React.FormEvent<HTMLFormElement>,
  ) => void;
  notif?: string;
}

const OTPTemplate: React.FC<Props> = ({
  hasError = false,
  isLoading = false,
  footer = null,
  hasResend = true,
  errorText,
  initAction = () => {},
  onChange = () => {},
  onSubmit = () => {},
  onResend = () => {},
  type,
}) => {
  const [security] = useLang(['security']);

  const [otp, setOtp] = useState<string | undefined>('');
  const [showResend, setShowResend] = useState(false);
  const { data: profileData } = useProfile();

  useEffect(() => {
    initAction();
  }, []);

  useEffect(() => {
    if (!otp || otp.length < 6) return;
    onSubmit(otp);
  }, [otp]);

  const changeOpt = (val: string) => {
    setOtp(val);
    onChange(val);
  };

  const resendOtp = () => {
    setShowResend(false);
    changeOpt('');
    onResend();
  };

  const title = useMemo(() => {
    if (!profileData?.two_fa_type_id) return '';
    if (
      type === 'google2fa' &&
      (profileData.two_fa_type_id === 'sms' ||
        profileData.two_fa_type_id === 'email')
    )
      return security.enterAuthenticatorCode;

    switch (profileData.two_fa_type_id) {
      case 'sms':
        return (
          <p className="text-right">
            {security.forMoreSecurity}{' '}
            <span className="dir-ltr inline-block">
              {' '}
              {toPersianDigits(profileData.mobile_number)}
            </span>{' '}
            {security.enterIt}
          </p>
        );
      case 'email':
        return (
          <p className="text-right">
            {security.forMoreSecurity}{' '}
            <span className="dir-ltr inline-block">
              {' '}
              {toPersianDigits(profileData.email)}
            </span>{' '}
            {security.enterIt}
          </p>
        );
      case 'google2fa':
        return security.enterAuthenticatorCode;
      default:
        return '';
    }
  }, [profileData]);

  return (
    <div
      className={classNames(
        'rounded-md bg-white pt-6 pb-[30px] px-4 sm:pt-[30px] sm:pb-[10] sm:px-10 md:bg-none lg:py-0 lg:px-4 max-w-[462px] mx-auto',
        styles.otp,
        hasError && otp?.length === 6 && styles.otp__hasError,
      )}
    >
      <span className="mb-6 block text-sm font-normal text-success-700 leading-7">
        {title}
      </span>
      <span className="block mb-2 text-sm font-medium text-dark-600">
        {security.enterActiveCode}
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
      {hasResend &&
        (!showResend ? (
          <CountDown
            onFinished={() => {
              setShowResend(true);
            }}
          />
        ) : (
          <span className="mt-6 block text-sm font-medium text-dark-600">
            {security.didNotGetOTPCode}
            <span
              className="mr-1 cursor-pointer text-sm text-primary-500"
              onClick={() => {
                resendOtp();
              }}
            >
              {security.resend}
            </span>
          </span>
        ))}
      <ModalFooter fullScreen>
        <Button
          size="lg"
          isLoading={isLoading}
          fullWidth
          className="md:mt-6"
          disabled={!(otp && otp.length === 6)}
          onClick={() => {
            onSubmit(otp);
          }}
        >
          {security.confirm}
        </Button>
      </ModalFooter>
      {footer}
    </div>
  );
};

export default OTPTemplate;

interface CountDownProps {
  initialTime?: number;
  onFinished: () => void;
}

const CountDown: React.FC<CountDownProps> = ({
  initialTime = 60,
  onFinished,
}) => {
  const [security] = useLang(['security']);

  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let timer: NodeJS.Timeout | number = 0;

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
    <span className="align-center md:mb-6 mt-4 flex text-sm font-medium text-dark-600">
      <span className="ml-1">{toPersianDigits(time)}</span>
      <span>{security.waitingSecondsTillResend} </span>
    </span>
  );
};
