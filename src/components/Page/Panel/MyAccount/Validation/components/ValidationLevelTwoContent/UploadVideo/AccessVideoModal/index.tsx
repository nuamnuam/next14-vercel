import React from 'react';
import Link from 'next/link';

import { Button, Modal } from '@/components/Common';
import { useModal } from '@/hooks/useModal';
import {
  VIDEO_STEPS,
  useUploadValidationProvider,
} from '../../UploadValidationProvider';
import { useLang } from '@/hooks';

export const accessVideoModalName = 'access-video-modal';
const AccessVideoModal = () => {
  const [kyc] = useLang(['kyc']);

  const { setVideoStep } = useUploadValidationProvider();

  const { closeSyncModal: closeAccessVideoModal } =
    useModal(accessVideoModalName);

  return (
    <Modal
      sync
      name={accessVideoModalName}
      onClose={closeAccessVideoModal}
      title={kyc.cameraAccess}
      headerIcon="Camera-TwoTone"
      contentAddtionalClassNames="!px-8 lg:!px-10"
      headerClassNames="!px-8 lg:!px-10"
      footer={
        <div className="flex gap-x-4">
          <Button
            size="lg"
            className="w-full border-none bg-dark-500 hover:bg-dark-500"
          >
            <Link href="/help">{kyc.needHelp}</Link>
          </Button>
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              if (
                'mediaDevices' in navigator &&
                'getUserMedia' in navigator.mediaDevices
              ) {
                closeAccessVideoModal();
                setVideoStep(VIDEO_STEPS.READY_LIVE);
              }
            }}
          >
            {kyc.activate}
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-center">
        <p className="font-medium leading-6 text-dark-700">
          {kyc.activeDeviceAccess}
        </p>
      </div>
    </Modal>
  );
};

export default AccessVideoModal;
