import React from 'react';
import { useQRCode } from 'next-qrcode';

import { Button, Icon } from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { showToast } from '@/components/ToastProvider';
import { useLang } from '@/hooks';

interface IProps {
  setPage: (page: string) => void;
  barcodeData?: any;
}

const ScanBarcodeStep: React.FC<IProps> = (props: IProps) => {
  const [security] = useLang(['security']);

  const { setPage, barcodeData } = props;
  const { Canvas } = useQRCode();

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast.success(security.copied);
  };

  return (
    <div className="flex flex-col md:px-4 items-center justify-start rounded-md bg-white p-6 md:bg-none md:p-0">
      <p className="mb-5 text-sm font-normal leading-6 text-dark-600">
        {security.enterBarcodeByHandIfRequired}
      </p>
      <div className="rounded-md border-2 border-dark-100 p-2">
        {barcodeData?.qr_code_url && (
          <Canvas
            text={barcodeData?.qr_code_url}
            options={{
              margin: 3,
              scale: 4,
              width: 152,
              color: {
                dark: '#000',
                light: '#fff',
              },
            }}
          />
        )}
      </div>
      <div className="gap-4 flex items-center mt-3">
        <div
          onClick={async () => await copy(barcodeData?.secret)}
          className="pb-1"
        >
          <Icon
            icon="Copy-OutLined"
            size={18}
            className="text-dark-500 cursor-pointer"
          />
        </div>
        <p className="text-md  font-normal leading-6 text-dark-600">
          {barcodeData?.secret}
        </p>
      </div>

      <div className="hidden w-full gap-x-4 md:flex">
        <Button
          size="lg"
          className="mt-6 border-none bg-dark-500 hover:bg-dark-500 md:block"
          onClick={() => {
            setPage('download_app');
          }}
        >
          {security.prevStep}
        </Button>
        <Button
          size="lg"
          className="mt-6 flex-auto self-stretch md:block"
          onClick={() => {
            setPage('app_2FA_otp');
          }}
        >
          {security.nextStep}
        </Button>
      </div>
      <ModalFooter fullScreen className="md:!hidden">
        <Button
          size="lg"
          fullWidth
          onClick={() => {
            setPage('app_2FA_otp');
          }}
        >
          {security.confirm}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default ScanBarcodeStep;
