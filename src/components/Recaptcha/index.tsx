import { useEffect } from 'react';

import {
  useCaptchaQuery,
  type CaptchaResponseResult,
} from '@/requests/captcha/captchaQuery';

import {
  Button,
  FormGroup,
  FormInput,
  FormLabel,
  Icon,
  InputAlert,
  Spinner,
} from '../Common';
import Image from 'next/image';

import { useLang } from '@/hooks';

interface Props {
  data: CaptchaResponseResult | undefined;
  error: boolean;
  value: string;
  caption: any;
  captionIcon: any;
  onChange: (val: any) => any;
  retry: () => void;
  setError?: (message?: string) => void;
}

const Recaptcha: React.FC<Props> = ({
  data,
  value,
  error = false,
  caption,
  captionIcon,
  onChange,
  retry,
  setError,
}) => {
  const [global] = useLang(['global']);

  const isInValid = value ? value?.length < 5 : false;

  const { isLoading, isError } = useCaptchaQuery();

  useEffect(() => {
    if (isInValid) {
      setError?.(global.invalidCaptchaAmount);
    } else {
      setError?.(undefined);
    }
  }, [isInValid]);

  return (
    <div className="flex w-full flex-col items-end text-xs text-arzinja ">
      <FormGroup className="w-full">
        <FormLabel htmlFor="email">{global.securityCode}</FormLabel>
        <div className="flex w-full items-start gap-2">
          <FormInput
            placeholder={global.importCaptchaCode}
            onChange={(value) => {
              onChange((value as string).trim());
            }}
            containerClassName="flex-1"
            error={isInValid || error}
            value={value}
            caption={isInValid ? global.invalidCaptchaAmount : caption}
            captionIcon={captionIcon}
            maxLength={5}
            minLength={5}
            ltr
          />
          {isLoading ? (
            <div className="h-12 w-40 flex items-center justify-center">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="h-12 w-40 flex items-center justify-center bg-dark-50 rounded-lg">
              <Icon
                icon="Disconnect-OutLined"
                size={24}
                className="text-dark-500"
              />
            </div>
          ) : (
            <Image src={data?.img ?? ''} height={48} width={160} alt="media" />
          )}
          <Button
            variant="primary"
            size="md"
            className="mt-1 bg-primary-500"
            onClick={retry}
            type="button"
          >
            <Icon icon="Reload-OutLined" size={16} />
          </Button>
        </div>
      </FormGroup>
      {isError && (
        <div className="w-full mt-4">
          <InputAlert
            message="مشکلی در نمایش کد امنیتی وجود دارد. دوباره تلاش کنید"
            variant="danger"
            className="items-center"
          />
        </div>
      )}
    </div>
  );
};

export default Recaptcha;
