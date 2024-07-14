import React from 'react';

import { Alert, Button, Icon } from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useLang } from '@/hooks';

interface IProps {
  setPage: (page: string) => void;
}

const DownloadAppStep: React.FC<IProps> = (props: IProps) => {
  const [global, security] = useLang(['global', 'security']);

  const { setPage } = props;

  return (
    <div className="rounded-md bg-white pt-6 px-4 pb-8 sm:pt-8 sm:px-10 sm:pb-10 lg:py-0 lg:px-4">
      <p className="text-sm font-normal leading-6 text-dark-600	">
        {security.useGoogleAuthenticator}
      </p>
      <div className="mt-6 flex gap-x-4">
        {[
          {
            icon: 'GooglePLay-Filled',
            title: global.goolgePlay,
            href: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
          },
          {
            icon: 'Appstore-Filled',
            title: global.appStore,
            href: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
          },
        ].map((item) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={item.href}
            className="flex w-6/12 flex-col items-center justify-center rounded-md border border-dark-100 pt-12 pb-[18px]"
          >
            <Icon icon={item.icon} size={48} />
            <p className="mt-8 w-full border-t border-dark-50 pt-[18px] text-center text-sm font-medium text-dark-600">
              {item.title}
            </p>
          </a>
        ))}
      </div>
      <Alert
        slug={{
          feature: 'user-account',
          section: 'security-2fa',
          step: 'download',
        }}
      />
      <ModalFooter fullScreen>
        <Button
          size="lg"
          fullWidth
          className="lg:mt-6"
          onClick={() => {
            setPage('scan_barcode');
          }}
        >
          {global.nextStep}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default DownloadAppStep;
