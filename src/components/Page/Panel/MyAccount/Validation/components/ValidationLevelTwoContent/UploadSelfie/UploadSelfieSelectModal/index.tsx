import React, { useCallback, useRef } from 'react';
import { Icon, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import { accessCameraModalName } from '../AccessCameraModal';
import {
  SELFIE_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import { useLang } from '@/hooks';

export const uploadSelfieSelectModalName = 'upload-selfie-select-modal';

const UploadSelfieSelectModal: React.FC = () => {
  const [kyc] = useLang(['kyc']);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setSelfieStep, setPicture } = useUploadValidationProvider();

  const { closeModal: closeUploadSelfieSelectModal } = useModal(
    uploadSelfieSelectModalName,
  );
  const { showSyncModal: showAccessCameraModal } = useModal(
    accessCameraModalName,
  );

  const inputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setPicture(file);
        setSelfieStep(SELFIE_STEPS.PREVIEW);
        closeUploadSelfieSelectModal();
      }
    },
    [setPicture, setSelfieStep, closeUploadSelfieSelectModal],
  );

  const cameraSelect = useCallback(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      for (const device of devices) {
        if (device.kind === 'videoinput') {
          if (device.label) {
            setSelfieStep(SELFIE_STEPS.LIVE);
            closeUploadSelfieSelectModal();
          } else {
            showAccessCameraModal();
          }
          break;
        }
      }
    });
  }, [setSelfieStep, closeUploadSelfieSelectModal, showAccessCameraModal]);

  return (
    <Modal
      name={uploadSelfieSelectModalName}
      onClose={closeUploadSelfieSelectModal}
      title={kyc.selectUploadSeilfieType}
      headerIcon="Camera-TwoTone"
      contentAddtionalClassNames="!px-8 lg:!px-10"
      headerClassNames="!px-8 lg:!px-10"
    >
      <div className="flex items-center justify-center">
        <div className="flex w-full gap-x-6">
          <div
            className="flex w-6/12 p-5 cursor-pointer flex-col items-center justify-center rounded-md border border-dark-100"
            onClick={cameraSelect}
          >
            <Icon
              icon="Camera-OutLined"
              className="[&>*]:fill-primary-500"
              size={24}
            />
            <p className="mt-4 px-2 text-sm font-medium leading-6 text-dark-900 text-center">
              {kyc.takeSelfieWithCamera}
            </p>
          </div>
          <div className="flex w-6/12 px-5 cursor-pointer flex-col items-center justify-center rounded-md border border-dark-100">
            <label
              htmlFor="select-selfie-file"
              className="dark:hover:bg-bray-800 m-0 flex !w-full cursor-pointer flex-col items-center justify-start rounded-lg"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <Icon
                  icon="Upload-OutLined"
                  className="[&>*]:fill-primary-500"
                  size={24}
                />
                <p className="mt-4 text-sm text-center font-medium leading-6 text-dark-900">
                  {kyc.uploadSelfieFromGallery}
                </p>
              </div>
              <input
                onChange={inputOnChange}
                ref={inputRef}
                id="select-selfie-file"
                type="file"
                className="hidden"
                aria-label={kyc.uploadSelfieFromGallery}
              />
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadSelfieSelectModal;
