import styles from './style.module.scss';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import classNames from 'classnames';

import { getLang, toEnglishDigits, toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

import { Button, InputAlert } from '../Common';
import AuthBox from '../Page/Auth/AuthBoxPage';

const [global] = getLang(['global']);

export const AUTH_OTP_SUBTITLE = {
  sms: (value: string) => (
    <p>
      {global.a6digitsCodeMobile1}
      <span className="dir-ltr inline-block mx-1">
        {toPersianDigits(value)}
      </span>
      {global.sent1}
    </p>
  ),
  email: (value: string) => (
    <p>
      {global.a6digitsCodeEmail1} {value} {global.sent1}
    </p>
  ),
  google2fa: () => <p>{global.a6digitsCodeGoogle}</p>,
};

interface Props {
  title: string;
  subtitle: React.ReactNode;
  hasError?: boolean;
  isLoading: boolean;
  hasResend?: boolean;
  footer: React.ReactNode;
  icon: React.ReactNode;
  errorText?: string;
  initAction?: () => void;
  onChange?: Dispatch<SetStateAction<string>>;
  onResend?: () => void;
  onSubmit?: (
    value: string | undefined,
    e?: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
}

const OTP: React.FC<Props> = ({
  title = '',
  subtitle = '',
  hasError = false,
  isLoading = false,
  footer = null,
  icon = null,
  hasResend = true,
  errorText,
  initAction = () => {},
  onChange = () => {},
  onSubmit = () => {},
  onResend = () => {},
}) => {
  const [global] = useLang(['global']);

  const [otp, setOtp] = useState<string | undefined>('');
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    initAction();
  }, []);

  useEffect(() => {
    if (!otp || otp.length < 6) return;
    onSubmit(otp);
  }, [otp]);

  const changeOpt = (val: any) => {
    if (!isNaN(Number(toEnglishDigits(val)))) {
      setOtp(val);
      onChange(val);
    }
  };

  const resendOtp = () => {
    setShowResend(false);
    changeOpt('');
    onResend();
  };

  return (
    <AuthBox header={title} icon={icon}>
      <div className={classNames(styles.otp, hasError && styles.otp__hasError)}>
        <span className="mb-6 mt-10 block text-sm text-primary-600">
          {subtitle}
        </span>
        <span className="mb-2 block text-sm font-medium text-dark-600">
          {global.enterOTPCode}
        </span>
        <div className={classNames(styles.otp_boxes)}>
          <OtpInput
            value={toPersianDigits(otp)}
            onChange={changeOpt}
            numInputs={6}
            isInputNum
          />
        </div>
        {errorText && hasError && (
          <div className="mt-2" style={{ direction: 'rtl' }}>
            <InputAlert message={errorText} variant="danger" />
          </div>
        )}
        {hasResend ? (
          !showResend ? (
            <CountDown
              onFinished={() => {
                setShowResend(true);
              }}
            />
          ) : (
            <span className="mt-4 block text-sm font-medium text-dark-600">
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

        <Button
          fullWidth
          size="lg"
          className="mb-10 mt-6"
          isLoading={isLoading}
          disabled={!otp || Number(otp?.length) < 6}
          onClick={async () => {
            await onSubmit(otp);
          }}
        >
          {global.confirm}
        </Button>
        {footer}
      </div>
    </AuthBox>
  );
};

export default OTP;

interface CountDownProps {
  initialTime?: number;
  onFinished: () => void;
}

let timer: any = null;
const CountDown: React.FC<CountDownProps> = ({
  initialTime = 60,
  onFinished,
}) => {
  const [global] = useLang(['global']);
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
    <span className="align-center mb-6 mt-4 flex text-sm font-medium text-dark-600">
      <span className="ml-1">{toPersianDigits(time)}</span>
      <span>{global.waitingSecondsTillResend}</span>
    </span>
  );
};
