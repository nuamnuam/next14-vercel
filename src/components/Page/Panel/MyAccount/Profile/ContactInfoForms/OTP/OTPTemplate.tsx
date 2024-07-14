import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import OtpInput from 'react-otp-input';
import classNames from 'classnames';

import { Button, InputAlert } from '@/components/Common';
import { toPersianDigits } from '@/utils';
import { useLang } from '@/hooks';

import styles from './style.module.scss';

export interface OTPTempProps {
  type: string;
  title: string;
  hasError?: boolean;
  source: string | undefined | number;
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
  ) => Promise<void>;
}

const initTime = 60;
const OTPTemplate = forwardRef<{}, OTPTempProps>(
  (
    {
      type = 'currentEmail',
      hasError = false,
      source,
      isLoading = false,
      footer = null,
      hasResend = true,
      errorText,
      initAction = () => {},
      onChange = () => {},
      onSubmit = () => {},
      onResend = () => {},
    },
    ref,
  ) => {
    const [myAccount] = useLang(['myAccount']);

    const [otp, setOtp] = useState<string | undefined>('');
    const [showResend, setShowResend] = useState(false);
    const [counterInitial, setCounterInitial] = useState({ value: initTime });

    const otfRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      resetOtp: () => {
        setOtp('');
        setCounterInitial({ value: initTime });
        setShowResend(false);
      },
    }));

    const otpTitle = useMemo(() => {
      switch (type) {
        case 'currentEmail':
          return (
            <p className="text-right">
              {myAccount.a6digitsCodeEmail}{' '}
              <span className="dir-ltr inline-block"> {source}</span>{' '}
              {myAccount.sent}
            </p>
          );
        case 'new-email':
          return (
            <p className="text-right">
              {myAccount.a6digitsCodeEmail}{' '}
              <span className="dir-ltr inline-block"> {source}</span>{' '}
              {myAccount.sent}
            </p>
          );
        case 'email':
          return (
            <p className="text-right">
              {myAccount.a6digitsCodeEmail}{' '}
              <span className="dir-ltr inline-block"> {source}</span>{' '}
              {myAccount.sent}
            </p>
          );
        case 'change-mobile':
          return (
            <p className="text-right">
              {myAccount.a6digitsCodeMobile}{' '}
              <span className="dir-ltr inline-block">
                {' '}
                {toPersianDigits(source)}
              </span>{' '}
              {myAccount.sent1}
            </p>
          );
        default:
          return '';
      }
    }, [type, source]);

    useEffect(() => {
      initAction();
    }, []);

    const changeOpt = (val: string) => {
      setOtp(val);
      onChange(val);
    };

    useEffect(() => {
      (async () => {
        if (otp?.length === 6) {
          await onSubmit(otp);
          otfRef?.current?.focusInput(0);
        }
      })();
    }, [otp]);

    const resendOtp = () => {
      setShowResend(false);
      changeOpt('');
      onResend();
      otfRef?.current?.focusInput(0);
    };

    return (
      <div className={classNames(styles.otp, hasError && styles.otp__hasError)}>
        <p className="mb-6 block text-right text-sm text-primary-600">
          {otpTitle}
        </p>
        <span className="mb-2 block text-sm font-medium text-dark-600">
          {myAccount.enterOTPCode}
        </span>
        <OtpInput
          ref={otfRef}
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
        {hasResend ? (
          !showResend ? (
            <CountDown
              initialTime={counterInitial}
              onFinished={() => {
                setShowResend(true);
              }}
            />
          ) : (
            <span className="mt-4 block text-sm font-medium text-dark-600">
              {myAccount.didNotGetOTPCode}
              <span
                className="mr-1 cursor-pointer text-sm text-primary-500"
                onClick={() => {
                  resendOtp();
                }}
              >
                {myAccount.resend}
              </span>
            </span>
          )
        ) : null}

        <Button
          fullWidth
          size="lg"
          className=" mt-6 hidden border-none lg:block"
          isLoading={isLoading}
          disabled={!otp || Number(otp?.length) < 6}
          onClick={async () => {
            await onSubmit(otp);
          }}
        >
          {myAccount.confirm}
        </Button>
        {footer}
      </div>
    );
  },
);

export default OTPTemplate;

interface CountDownProps {
  initialTime: { value: number };
  onFinished: () => void;
}

const CountDown: React.FC<CountDownProps> = ({ initialTime, onFinished }) => {
  const [myAccount] = useLang(['myAccount']);

  const [time, setTime] = useState(initialTime?.value);

  useEffect(() => {
    setTime(initialTime?.value);
  }, [initialTime]);

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
    <span className="align-center lg:mb-6 mt-4 flex text-sm font-medium text-dark-600">
      <span className="ml-1">{toPersianDigits(time)}</span>
      <span>{myAccount.waitingSecondsTillResend} </span>
    </span>
  );
};
