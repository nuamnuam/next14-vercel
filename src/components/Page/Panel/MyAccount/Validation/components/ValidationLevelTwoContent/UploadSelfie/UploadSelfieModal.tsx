import React, { type ChangeEvent, useCallback, useRef } from 'react';
import clsx from 'classnames';
import { Button, Card, Icon, Modal, BoxDivider } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import UploadSelfieContent from './UploadSelfieContent';
import { useRouter } from 'next/router';
import Stepper from '../Stepper';
import { sampleSelfieModalName } from './SampleSelfieModal';
import {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from '../UploadValidationProvider';
import { useLang } from '@/hooks';

export const uploadSelfieModalName = 'upload-selfie-modal';

const UploadSelfieModal = () => {
  const [kyc] = useLang(['kyc']);

  const router = useRouter();
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const { closeModal: closeUploadSelfieModal } = useModal(
    uploadSelfieModalName,
  );

  const { showModal: showSampleSelfieModal } = useModal(sampleSelfieModalName);

  const { picture, selfieStep, setPicture, setSelfieStep } =
    useUploadValidationProvider();

  const tryAgain = () => {
    setSelfieStep(SELFIE_STEPS.ROOT);
  };

  const uploadNewPicture = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files?.[0]) return;
    setPicture(e.target?.files?.[0]);
  };

  const renderExtra = useCallback(() => {
    switch (selfieStep) {
      case SELFIE_STEPS.ROOT:
        return (
          <span
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => showSampleSelfieModal()}
          >
            <Icon
              icon="AddPicture-OutLined"
              size={18}
              className="text-warning-600"
            />
            <span className="text-sm text-warning-600 font-medium">
              {kyc.sampleSelfie}
            </span>
          </span>
        );
      case SELFIE_STEPS.LIVE:
        return (
          <Button
            variant="secondary"
            size="md"
            onClick={() => setSelfieStep(SELFIE_STEPS.ROOT)}
          >
            {kyc.cancel}
          </Button>
        );
      case SELFIE_STEPS.PREVIEW:
        return (
          <div
            className="cursor-pointer items-center justify-end gap-x-2 flex"
            onClick={tryAgain}
          >
            <Icon
              icon={picture ? 'Reload-OutLined' : 'VideoCamera-OutLined'}
              className="[&>*]:fill-primary-500"
              size={16}
            />
            <p className="text-sm font-medium leading-6 text-primary-600">
              {kyc.selectAgain}
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [selfieStep, picture]);

  return (
    <Modal
      name={uploadSelfieModalName}
      noTransition
      onClose={closeUploadSelfieModal}
      title={
        selfieStep === SELFIE_STEPS.CONGRATS
          ? kyc.levelTwoAuthentication
          : kyc.uploadSelfie
      }
      headerIcon="Camera-TwoTone"
      contentAddtionalClassNames="!px-4 sm!px-8 lg:!px-10 !pt-8"
      headerClassNames="!p-4 sm:!py-[18px] sm:!px-8"
      fullScreen
      extra={renderExtra()}
      noBackIcon={selfieStep !== SELFIE_STEPS.ROOT}
    >
      {selfieStep !== SELFIE_STEPS.CONGRATS && (
        <div className="mb-8 lg:flex items-center justify-between gap-6 hidden">
          <span
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.back();
            }}
          >
            <Icon icon="Right-OutLined" className="text-dark-200" size={20} />
            <h1 className="my-0 mr-2 text-lg font-medium text-dark-600">
              {kyc.levelTwoAuthentication}
            </h1>
          </span>
        </div>
      )}
      <Card
        classNames={clsx(
          selfieStep === SELFIE_STEPS.CONGRATS && 'mt-5',
          'w-full lg:w-1/2 flex flex-col mx-auto lg:mx-0 lg:mt-0 max-w-[462px] lg:max-w-full',
        )}
      >
        <div className="flex w-full flex-col items-center justify-between ">
          {selfieStep !== SELFIE_STEPS.CONGRATS && (
            <div className="w-full">
              <Stepper />
              <BoxDivider />
            </div>
          )}
          <div
            className={
              'w-full px-4 pt-0 pb-7 md:pt-8 sm:px-10 lg:px-12 sm:pb-10'
            }
          >
            <UploadSelfieContent />
          </div>
        </div>
      </Card>
      <input
        onChange={uploadNewPicture}
        ref={galleryInputRef}
        id="dropzone-file"
        type="file"
        className="hidden"
      />
    </Modal>
  );
};

export default UploadSelfieModal;
