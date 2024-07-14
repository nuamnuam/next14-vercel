import React, {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
} from 'react';
import clsx from 'classnames';
import { Button, Icon, VideoFrameOverlay } from '@/components/Common';
import Webcam from 'react-webcam';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useEffectOnce } from 'react-use';
import {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import { showToast } from '@/components/ToastProvider';
import { useLang } from '@/hooks';

const SelfieLiveContent: React.FC<{
  setPage?: Dispatch<SetStateAction<string>>;
}> = ({ setPage }) => {
  const [kyc] = useLang(['kyc']);

  const webcamRef = useRef<Webcam>(null);
  const { setSelfieStep, setPicture } = useUploadValidationProvider();

  useEffectOnce(() => setPicture(null));

  const capture = useCallback(() => {
    if (webcamRef?.current?.getScreenshot != null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) setPicture(imageSrc);
      setSelfieStep(SELFIE_STEPS.PREVIEW);
    }
  }, [webcamRef]);

  return (
    <div>
      <div
        className={clsx(
          'hidden items-center justify-between border-b border-white md:flex md:border-dark-50 pb-[20px]',
        )}
      >
        <div className="hidden cursor-pointer items-center justify-start gap-x-2 md:flex">
          <p className="text-sm font-bold leading-6 text-gray-900">
            {kyc.selfieWithCamera}
          </p>
        </div>
        <div
          className="hidden cursor-pointer items-center justify-end gap-x-2 md:flex"
          onClick={() => {
            setSelfieStep(SELFIE_STEPS.ROOT);
          }}
        >
          <Icon
            icon={'VideoCamera-OutLined'}
            className="[&>*]:fill-primary-500"
            size={16}
          />
          <p
            className="text-sm font-medium leading-6 text-primary-600"
            onClick={() => setPage?.('select-type')}
          >
            {kyc.changeWay}
          </p>
        </div>
      </div>

      <div>
        <VideoFrameOverlay>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={webcamRef}
            className="rounded-lg !bg-white [&>div]:!bg-white"
          />
        </VideoFrameOverlay>
      </div>
      <ModalFooter fullScreen>
        <Button size="lg" fullWidth className="lg:mt-6" onClick={capture}>
          {kyc.takeSelfie}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default SelfieLiveContent;
