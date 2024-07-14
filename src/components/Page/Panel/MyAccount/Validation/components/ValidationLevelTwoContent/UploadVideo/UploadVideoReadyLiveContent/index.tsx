import React, { useRef, useCallback, Dispatch, SetStateAction } from 'react';
import clsx from 'classnames';
import moment from 'jalali-moment';
import Webcam from 'react-webcam';
import {
  Button,
  Card,
  CircularProgressBar,
  Icon,
  Spinner,
} from '@/components/Common';
import ModalFooter from '@/components/Common/Modal/ModalFooter';
import { useLang, useProfile } from '@/hooks';
import {
  VIDEO_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import { toPersianDigits } from '@/utils';
import { useEffectOnce } from 'react-use';

const UploadVideoReadyLiveContent: React.FC<{
  setPage?: Dispatch<SetStateAction<string>>;
}> = ({ setPage }) => {
  const [kyc] = useLang(['kyc']);
  const { data: userInfo } = useProfile();
  const { capturing, setCapturing, setVideoStep, setVideo } =
    useUploadValidationProvider();
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffectOnce(() => setCapturing(false));

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setVideo((prev) => prev?.concat(data));
      }
    },
    [setVideo],
  );

  const handleStartCapture = useCallback(() => {
    setVideo([]);
    if (!webcamRef.current?.stream) return;
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable,
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
    setVideoStep(VIDEO_STEPS.PREVIEW);
  }, [mediaRecorderRef, setCapturing, setVideoStep]);

  return (
    <div className="">
      <div className="mb-6 pb-6 hidden items-center justify-between border-b border-dark-50 md:flex">
        <div className="flex items-center justify-between flex-1">
          <p className="text-sm font-bold leading-6 text-gray-900">
            {kyc.recordVideo}
          </p>
          {!capturing && (
            <div className="lg:flex items-center cursor-pointer justify-end gap-x-2 hidden">
              <Icon
                icon={'Camera-OutLined'}
                className="[&>*]:fill-primary-600"
                size={18}
              />
              <p
                className="text-sm font-medium leading-6 text-primary-600"
                onClick={() => setPage?.('select-type')}
              >
                {kyc.changeWay}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="[&>video:rounded-full]">
        <div className="relative w-64 h-64 rounded-full mb-6 mx-auto items-center justify-center overflow-hidden bg-center bg-contain flex">
          <CircularProgressBar
            start={capturing}
            progressTime={60}
            handleStopCaptureClick={handleStopCaptureClick}
          >
            <div className="absolute z-[1]">
              <Spinner />
            </div>
            <Webcam
              audio={true}
              muted={true}
              height={234}
              width={234}
              mirrored={false}
              ref={webcamRef}
              className="mx-auto rounded-full z-10"
              videoConstraints={{ facingMode: 'user', width: 254, height: 254 }}
            />
          </CircularProgressBar>
        </div>
        <p className="mb-6 w-full text-right text-sm font-medium leading-6 text-dark-800">
          {kyc.repeatTheBelowText}
        </p>
        <Card classNames="!bg-dark-50 p-6 border border-dark-200">
          <div>
            <p className="text-sm font-medium text-dark-700 leading-6">
              {kyc.me}{' '}
              {(userInfo?.first_name ?? '') + ' ' + (userInfo?.last_name ?? '')}{' '}
              {kyc.withNationalCode}{' '}
              {toPersianDigits(userInfo?.national_code ?? '-')} {kyc.inDate}{' '}
              {toPersianDigits(moment().locale('fa').format('YYYY/M/D'))}
              {kyc.sampleRepeatVideoRecord}
            </p>
          </div>
        </Card>
        <ModalFooter fullScreen>
          <Button
            size="lg"
            fullWidth
            onClick={capturing ? handleStopCaptureClick : handleStartCapture}
            className={clsx(
              'lg:mt-6',
              capturing && '!border-danger-500 !bg-danger-500',
            )}
          >
            {capturing ? kyc.stopRecording : kyc.startRecording}
          </Button>
        </ModalFooter>
      </div>
    </div>
  );
};

export default UploadVideoReadyLiveContent;
