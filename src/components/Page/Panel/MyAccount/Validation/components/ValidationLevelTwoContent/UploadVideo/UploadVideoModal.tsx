import React, { useCallback, useMemo } from 'react';
import clsx from 'classnames';
import { Card, Icon, Modal, BoxDivider } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import UploadVideoContent from './UploadVideoContent';
import { useRouter } from 'next/router';
import Stepper from '../Stepper';
import {
  VIDEO_STEPS,
  useUploadValidationProvider,
} from '../UploadValidationProvider';
import { accessVideoModalName } from './AccessVideoModal';
import { useLang } from '@/hooks';

export const uploadVideoModalName = 'upload-video-modal';
const UploadVideoModal = () => {
  const [kyc] = useLang(['kyc']);

  const router = useRouter();

  const { closeSyncModal: closeAccessVideoModal } =
    useModal(accessVideoModalName);

  const { closeModal: closeUploadVideoModal } = useModal(uploadVideoModalName);

  const { video, videoStep, capturing, setVideo, setVideoStep } =
    useUploadValidationProvider();

  const tryAgain = () => {
    setVideoStep(VIDEO_STEPS.READY_LIVE);
  };

  const renderExtra = useCallback(() => {
    switch (videoStep) {
      case VIDEO_STEPS.READY_LIVE:
        return (
          <>
            {!capturing && (
              <div className="flex items-center justify-end gap-x-2">
                <Icon
                  icon={'VideoCamera-OutLined'}
                  className="[&>*]:fill-primary-600"
                  size={18}
                />
                <p
                  className="cursor-pointer text-sm font-medium leading-6 text-primary-600"
                  onClick={async () => {
                    setVideoStep('root');
                    closeAccessVideoModal();
                    await router.push({
                      pathname: '/panel/my-account/validation/level-two',
                    });
                  }}
                >
                  {kyc.changeWay}
                </p>
              </div>
            )}
          </>
        );
      case VIDEO_STEPS.PREVIEW:
        return (
          <div
            className="cursor-pointer items-center justify-end gap-x-2 flex"
            onClick={tryAgain}
          >
            <Icon
              icon="Reload-OutLined"
              className="[&>*]:fill-danger-500"
              size={16}
            />
            <p className="text-sm font-medium leading-6 text-danger-500">
              {kyc.recordAgain}‍
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [video, videoStep]);

  const renderTitle = useMemo(() => {
    switch (videoStep) {
      case VIDEO_STEPS.ROOT:
        return kyc.confirmVideoAuthority;
      case VIDEO_STEPS.READY_LIVE:
      case VIDEO_STEPS.PREVIEW:
        return kyc.recordVideo;
      case VIDEO_STEPS.CONGRATS:
        return kyc.upgradeToLevel2;
    }
  }, [videoStep]);

  return (
    <Modal
      name={uploadVideoModalName}
      noTransition
      onClose={closeUploadVideoModal}
      title={renderTitle}
      headerIcon="Camera-TwoTone"
      contentAddtionalClassNames="!px-4 sm:!px-8 lg:!px-10"
      headerClassNames="!p-4 sm:!py-[18px] sm:!px-8"
      fullScreen
      extra={renderExtra()}
      noBackIcon={videoStep !== VIDEO_STEPS.ROOT}
    >
      {videoStep !== VIDEO_STEPS.CONGRATS && (
        <div className="mb-8 lg:flex items-center justify-between gap-6 hidden">
          <span
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.back();
            }}
          >
            <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
            <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
              {kyc.upgradeToLevel2}
            </h1>
          </span>
        </div>
      )}
      <Card
        classNames={clsx(
          videoStep === VIDEO_STEPS.CONGRATS && 'mt-5',
          'w-full lg:w-1/2 flex flex-col mx-auto lg:mx-0 lg:mt-0 max-w-[462px] lg:max-w-full',
        )}
      >
        <div className="flex w-full flex-col items-center justify-between ">
          {videoStep !== VIDEO_STEPS.CONGRATS && (
            <div className="w-full">
              <Stepper />
              <BoxDivider />
            </div>
          )}
          <div
            className={
              'w-full px-4 pt-6 pb-7 sm:pt-8 sm:px-10 lg:px-12 sm:pb-10'
            }
          >
            <UploadVideoContent />
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default UploadVideoModal;
